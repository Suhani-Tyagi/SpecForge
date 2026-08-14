import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SRC_DIR = path.resolve(__dirname, '../src');

// Secret Key Patterns to detect in client source code
const SECRET_PATTERNS = [
  /AIzaSy[A-Za-z0-9_-]{33}/g,            // Gemini / Google Cloud API Key
  /sk-[A-Za-z0-9]{32,}/g,                // OpenAI / Generic Secret Key
  /AKIA[0-9A-Z]{16}/g,                   // AWS Access Key
  /ghp_[A-Za-z0-9]{36}/g,                // GitHub Personal Access Token
  /["'](?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])[A-Za-z0-9_-]{30,}["']/g // High-entropy key string
];

function scanDirectory(dir) {
  const files = fs.readdirSync(dir);
  let violations = [];

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      violations = violations.concat(scanDirectory(fullPath));
    } else if (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.css') || file.endsWith('.html')) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      
      SECRET_PATTERNS.forEach((pattern, index) => {
        const matches = content.match(pattern);
        if (matches) {
          matches.forEach(match => {
            // Ignore benign placeholder strings or env var references
            if (!match.includes('import.meta.env') && !match.includes('your_gemini_api_key')) {
              violations.push({
                file: path.relative(path.resolve(__dirname, '..'), fullPath),
                patternIndex: index,
                matchSnippet: match.slice(0, 10) + '...'
              });
            }
          });
        }
      });
    }
  }

  return violations;
}

console.log('[Audit Secrets] Scanning client source code in src/ for exposed API keys...');
const violations = scanDirectory(SRC_DIR);

if (violations.length > 0) {
  console.error('❌ SECRET AUDIT FAILED! Potential hardcoded API keys detected in client code:');
  violations.forEach(v => {
    console.error(`  - File: ${v.file} (Match: ${v.matchSnippet})`);
  });
  process.exit(1);
} else {
  console.log('✅ SECRET AUDIT PASSED! No hardcoded secret keys detected in src/.');
  process.exit(0);
}
