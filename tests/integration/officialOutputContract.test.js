import { describe, it, expect } from 'vitest';
import { 
  OFFICIAL_EXPECTED_OUTPUT_HEADERS, 
  validateOutputHeaders, 
  mapProductToOfficialRow, 
  serializeToOfficialCSV 
} from '../../server/schemas/officialOutputSchema.js';

describe('Official Expected Output Contract Suite', () => {
  it('should contain exactly 252 immutable output headers', () => {
    expect(OFFICIAL_EXPECTED_OUTPUT_HEADERS.length).toBe(252);
  });

  it('should validate exact header list and order', () => {
    const res = validateOutputHeaders(OFFICIAL_EXPECTED_OUTPUT_HEADERS);
    expect(res.valid).toBe(true);
  });

  it('should detect extra, missing, or misordered headers', () => {
    const missingOne = OFFICIAL_EXPECTED_OUTPUT_HEADERS.slice(0, 251);
    expect(validateOutputHeaders(missingOne).valid).toBe(false);

    const reordered = [...OFFICIAL_EXPECTED_OUTPUT_HEADERS];
    const temp = reordered[0];
    reordered[0] = reordered[1];
    reordered[1] = temp;
    expect(validateOutputHeaders(reordered).valid).toBe(false);
  });

  it('should map a canonical product record to all 252 official headers', () => {
    const sampleRecord = {
      sku: 'PDSH4816AF',
      name: 'FRIGIDAIRE® Professional Series PDSH4816AF Dishwasher',
      mfgPartNum: 'PDSH4816AF',
      supplier: 'Appliance Dealers Cooperative (APPDE)',
      categoryPath: 'Appliances & Consumer Electronics>Kitchen Appliances>Built-In Dishwashers',
      categoryCode: '1515863',
      mobileDesc: 'Rheem Manufacturing FRIGIDAIRE, Dishwasher, Professional Series, PDSH4816AF',
      invoiceDesc: 'DISHWASHER LEG 5 SST 120V 15A 50-1/4IN',
      shortDesc: 'FRIGIDAIRE® Professional Series PDSH4816AF Dishwasher',
      longDesc: 'FRIGIDAIRE® Dishwasher With CleanBoost™, Professional Series, 5 Wash Cycles',
      attributes: {
        Series: { value: 'Professional Series', confidence: 'high', source: 'extracted' },
        Mounting: { value: 'Leg', confidence: 'high', source: 'extracted' },
        'Wash Cycles': { value: '5', confidence: 'high', source: 'extracted' },
        'Sound Level': { value: '47', normalized_unit: 'dBA', confidence: 'high', source: 'extracted' }
      }
    };

    const row = mapProductToOfficialRow(sampleRecord);

    expect(row['SKU - MY_PART_NUMBER']).toBe('PDSH4816AF');
    expect(row['Mfg_Part_Num']).toBe('PDSH4816AF');
    expect(row['Classpath']).toBe('Appliances & Consumer Electronics>Kitchen Appliances>Built-In Dishwashers');
    expect(row['INVOICE_DESC']).toBe('DISHWASHER LEG 5 SST 120V 15A 50-1/4IN');
    expect(row['ATTRIBUTE_LABEL 1']).toBe('Series');
    expect(row['ATTRIBUTE_VALUE 1']).toBe('Professional Series');
    expect(row['ATTRIBUTE_LABEL 4']).toBe('Sound Level');
    expect(row['ATTRIBUTE_VALUE 4']).toBe('47');
    expect(row['ATTRIBUTE_UOM 4']).toBe('dBA');
    expect(row['Actual Image (Yes/No)']).toBe('Yes');
  });

  it('should serialize records into valid RFC 4180 CSV with header row', () => {
    const records = [
      {
        sku: 'TEST-SKU-001',
        name: 'Standard Hex Bolt 10mm x 50mm',
        mfgPartNum: 'HB-10-50',
        supplier: 'FastenerCorp'
      }
    ];

    const csv = serializeToOfficialCSV(records);
    const lines = csv.split('\n');

    expect(lines.length).toBe(2);
    expect(lines[0]).toContain('MFR URL,Ref URL 1');
    expect(lines[1]).toContain('TEST-SKU-001');
    expect(csv).not.toContain('sf_live_ext_');
    expect(csv).not.toContain('[object Object]');
    expect(csv).not.toContain('undefined');
  });

  it('should escape CSV values and neutralize spreadsheet formula injections', () => {
    const maliciousRecord = {
      sku: 'MALICIOUS-01',
      name: '=CMD("calc.exe")',
      longDesc: 'Description with "quotes", commas, and\nnewlines'
    };

    const csv = serializeToOfficialCSV([maliciousRecord]);
    
    // Formula prefix '=' should be neutralized to "'="
    expect(csv).toContain("'=CMD(");
    // Double quotes should be escaped as ""
    expect(csv).toContain('""quotes""');
  });
});
