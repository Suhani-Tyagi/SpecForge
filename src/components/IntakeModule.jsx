import React, { useState } from 'react';
import { FileText, Tag, Image as ImageIcon, Link as LinkIcon, Upload, Play, Sparkles, CheckCircle2, X } from 'lucide-react';

const PRESETS = [
  {
    name: "Sparse Ball Bearing 6205",
    type: "text",
    categoryCode: "23-15-16",
    content: "Deep groove ball bearing 6205-2RS, rubber sealed, 25mm bore. High speed industrial application.",
    badge: "Bearings"
  },
  {
    name: "3-Phase AC Motor Datasheet",
    type: "text",
    categoryCode: "26-10-15",
    content: "Industrial 3-Phase AC Induction Motor. Rated power 5.5 kW, 415V, 1440 RPM, efficiency IE3, TEFC enclosure.",
    badge: "Motors"
  },
  {
    name: "Sparse Cast Iron Pump",
    type: "text",
    categoryCode: "40-10-15",
    content: "Centrifugal pump flow 10 m3/h, 50mm inlet size, 40mm outlet, cast iron body.",
    badge: "Pumps"
  },
  {
    name: "Hex Bolt Spec Sheet",
    type: "text",
    categoryCode: "31-16-15",
    content: "M10 x 50mm Hex Head Bolt, Grade 8.8 Steel, Zinc Plated coating.",
    badge: "Fasteners"
  }
];

export default function IntakeModule({ categories = [], onRunPipeline, isLoading, onRunDemo }) {
  const [inputType, setInputType] = useState('text'); // 'text', 'name_category', 'image', 'url_doc'
  const [textContent, setTextContent] = useState('');
  const [productName, setProductName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [specUrl, setSpecUrl] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handlePresetSelect = (preset) => {
    setInputType(preset.type);
    setSelectedCategory(preset.categoryCode);
    setTextContent(preset.content);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoading) return;

    let payload = {
      inputType,
      categoryCode: selectedCategory
    };

    if (inputType === 'text') {
      payload.textContent = textContent;
    } else if (inputType === 'name_category') {
      payload.textContent = `Product Name: ${productName}. Category: ${selectedCategory}`;
    } else if (inputType === 'image') {
      payload.imageBase64 = selectedImage;
      payload.textContent = textContent || 'Extract product specifications from this uploaded image.';
    } else if (inputType === 'url_doc') {
      payload.specUrl = specUrl;
      payload.textContent = `Datasheet URL: ${specUrl}\nPasted Spec Content:\n${textContent}`;
    }

    onRunPipeline(payload);
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-5">
      
      {/* Hero Narrative Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-cyan-500/10 p-4 rounded-xl border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-sm sm:text-base font-extrabold text-amber-300 font-sans tracking-tight">
            Transform Fragmented Industrial Data into Validated, Commerce-Ready Intelligence
          </h1>
          <p className="text-xs text-slate-300 font-mono mt-0.5">
            3-Stage AI Processing (Extraction → RAG Enrichment → Engineering Validation) + Stage 4 Human Approval & Catalog Export
          </p>
        </div>
        {onRunDemo && (
          <button
            type="button"
            onClick={onRunDemo}
            className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-xs font-mono rounded-lg shadow-md shrink-0 flex items-center space-x-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Instant Demo Mode</span>
          </button>
        )}
      </div>

      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 font-mono text-xs font-bold border border-amber-500/30">
            1
          </span>
          <h2 className="text-base font-bold text-slate-100 tracking-wide uppercase font-mono">
            Stage 1 Intake: Multi-Modal Data Ingestion
          </h2>
        </div>
        <span className="text-xs font-mono text-slate-400">
          AI Stage 1 of 3
        </span>
      </div>

      {/* Preset Buttons */}
      <div>
        <label className="block text-xs font-medium text-slate-400 mb-2">
          ⚡ Quick Supplier Presets (Click to Auto-fill):
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {PRESETS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handlePresetSelect(preset)}
              className="flex flex-col items-start p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-all text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              <span className="text-[10px] font-mono text-amber-400 font-semibold px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 mb-1">
                {preset.badge}
              </span>
              <span className="text-xs font-medium text-slate-200 group-hover:text-amber-300 line-clamp-1">
                {preset.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Input Type Selector */}
      <div className="grid grid-cols-4 gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
        <button
          type="button"
          onClick={() => setInputType('text')}
          className={`flex items-center justify-center space-x-1.5 py-2 rounded-lg text-xs font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
            inputType === 'text'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Free Text</span>
        </button>

        <button
          type="button"
          onClick={() => setInputType('name_category')}
          className={`flex items-center justify-center space-x-1.5 py-2 rounded-lg text-xs font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
            inputType === 'name_category'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Tag className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Name & Category</span>
        </button>

        <button
          type="button"
          onClick={() => setInputType('image')}
          className={`flex items-center justify-center space-x-1.5 py-2 rounded-lg text-xs font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
            inputType === 'image'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Product Image</span>
        </button>

        <button
          type="button"
          onClick={() => setInputType('url_doc')}
          className={`flex items-center justify-center space-x-1.5 py-2 rounded-lg text-xs font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
            inputType === 'url_doc'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <LinkIcon className="w-3.5 h-3.5" aria-hidden="true" />
          <span>URL + Pasted Content</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Category Dropdown */}
        <div>
          <label htmlFor="taxonomy-category-select" className="block text-xs font-medium text-slate-300 mb-1">
            Taxonomy Category (UNSPSC / ETIM):
          </label>
          <select
            id="taxonomy-category-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500 focus-visible:ring-2 focus-visible:ring-amber-400 font-mono"
          >
            <option value="">-- Auto-Detect Category with Gemini --</option>
            {categories.map((cat) => (
              <option key={cat.code} value={cat.code}>
                [{cat.code}] {cat.category} → {cat.subcategory}
              </option>
            ))}
          </select>
        </div>

        {/* Dynamic Fields */}
        {inputType === 'text' && (
          <div>
            <label htmlFor="free-text-input" className="block text-xs font-medium text-slate-300 mb-1">
              Industrial Product Description / Fragment:
            </label>
            <textarea
              id="free-text-input"
              rows={4}
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder="e.g. 3-Phase AC motor, 5.5kW, 415V, IE3 efficiency, TEFC enclosure, foot mounted..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-slate-100 placeholder-slate-500 font-mono focus:outline-none focus:border-amber-500 focus-visible:ring-2 focus-visible:ring-amber-400"
            />
          </div>
        )}

        {inputType === 'name_category' && (
          <div className="space-y-3">
            <div>
              <label htmlFor="product-name-input" className="block text-xs font-medium text-slate-300 mb-1">
                Product Name / Part Number:
              </label>
              <input
                id="product-name-input"
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g. Deep Groove Ball Bearing 6205-2RS"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-amber-500 focus-visible:ring-2 focus-visible:ring-amber-400"
              />
            </div>
            <div>
              <label htmlFor="name-cat-notes" className="block text-xs font-medium text-slate-300 mb-1">
                Additional Notes / Specs:
              </label>
              <textarea
                id="name-cat-notes"
                rows={2}
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="Optional extra details (material, voltage, dimensions)..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500 focus-visible:ring-2 focus-visible:ring-amber-400 font-mono"
              />
            </div>
          </div>
        )}

        {inputType === 'image' && (
          <div className="space-y-3">
            <div className="border-2 border-dashed border-slate-700 hover:border-amber-500 rounded-xl p-4 text-center bg-slate-950/50 transition-all">
              {imagePreview ? (
                <div className="space-y-2">
                  <div className="relative inline-block">
                    <img src={imagePreview} alt="Uploaded product nameplate preview" className="max-h-40 mx-auto rounded-lg object-contain border border-slate-700" />
                    <button
                      type="button"
                      onClick={handleClearImage}
                      aria-label="Remove image"
                      className="absolute -top-2 -right-2 p-1 bg-rose-500 text-slate-950 rounded-full hover:bg-rose-400 shadow-md"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-[11px] text-emerald-400 font-mono flex items-center justify-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Image Ready for Gemini Vision Extraction</span>
                  </p>
                </div>
              ) : (
                <label htmlFor="product-image-file-input" className="cursor-pointer block py-4">
                  <Upload className="w-8 h-8 text-amber-400 mx-auto mb-2" aria-hidden="true" />
                  <span className="text-xs text-slate-300 font-medium block">Click or drag product image / nameplate photo here</span>
                  <span className="block text-[10px] text-slate-500 mt-1 font-mono">Allowed formats: PNG, JPEG, WEBP (Max 10MB)</span>
                  <input id="product-image-file-input" type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} className="hidden" />
                </label>
              )}
            </div>
            <textarea
              id="image-prompt-context"
              rows={2}
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder="Optional prompt context for Vision model..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>
        )}

        {inputType === 'url_doc' && (
          <div className="space-y-3">
            <div>
              <label htmlFor="datasheet-url-input" className="block text-xs font-medium text-slate-300 mb-1">
                Datasheet URL / Manufacturer Link:
              </label>
              <input
                id="datasheet-url-input"
                type="url"
                value={specUrl}
                onChange={(e) => setSpecUrl(e.target.value)}
                placeholder="https://example-industrial.com/products/bearing-6205.pdf"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-amber-500 focus-visible:ring-2 focus-visible:ring-amber-400"
              />
            </div>
            <div>
              <label htmlFor="pasted-spec-content" className="block text-xs font-medium text-slate-300 mb-1">
                Pasted Spec Sheet Text / Document Content:
              </label>
              <textarea
                id="pasted-spec-content"
                rows={3}
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="Paste raw PDF spec sheet text or table content here..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-slate-100 font-mono focus:outline-none focus:border-amber-500 focus-visible:ring-2 focus-visible:ring-amber-400"
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
        >
          {isLoading ? (
            <>
              <Sparkles className="w-4 h-4 animate-spin" aria-hidden="true" />
              <span>Executing 3-Stage AI Processing Pipeline...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-slate-950" aria-hidden="true" />
              <span>Execute 3-Stage AI Pipeline → Stage 4 Human Approval</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
