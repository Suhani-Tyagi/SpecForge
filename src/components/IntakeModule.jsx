import React, { useState } from 'react';
import { FileText, Tag, Image as ImageIcon, Link as LinkIcon, Upload, Play, Sparkles, CheckCircle2 } from 'lucide-react';

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

export default function IntakeModule({ categories = [], onRunPipeline, isLoading }) {
  const [inputType, setInputType] = useState('text'); // 'text', 'name_category', 'image', 'url_doc'
  const [textContent, setTextContent] = useState('');
  const [productName, setProductName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedImage, setSelectedImage] = useState(null); // base64 string
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
      payload.textContent = `Datasheet URL: ${specUrl}\nContent:\n${textContent}`;
    }

    onRunPipeline(payload);
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 font-mono text-xs font-bold border border-amber-500/30">
            1
          </span>
          <h2 className="text-base font-bold text-slate-100 tracking-wide uppercase font-mono">
            Stage 1: Multi-Input Intake & AI Extraction
          </h2>
        </div>
        <span className="text-xs font-mono text-slate-400">
          Module 1 of 4
        </span>
      </div>

      {/* Preset Buttons */}
      <div className="mb-4">
        <label className="block text-xs font-medium text-slate-400 mb-2">
          ⚡ Quick Presets (Click to Auto-fill):
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {PRESETS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handlePresetSelect(preset)}
              className="flex flex-col items-start p-2.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-all text-left group"
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
      <div className="grid grid-cols-4 gap-2 mb-4 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
        <button
          type="button"
          onClick={() => setInputType('text')}
          className={`flex items-center justify-center space-x-1.5 py-2 rounded-lg text-xs font-medium transition-all ${
            inputType === 'text'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Free Text</span>
        </button>

        <button
          type="button"
          onClick={() => setInputType('name_category')}
          className={`flex items-center justify-center space-x-1.5 py-2 rounded-lg text-xs font-medium transition-all ${
            inputType === 'name_category'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Tag className="w-3.5 h-3.5" />
          <span>Name & Category</span>
        </button>

        <button
          type="button"
          onClick={() => setInputType('image')}
          className={`flex items-center justify-center space-x-1.5 py-2 rounded-lg text-xs font-medium transition-all ${
            inputType === 'image'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Product Image</span>
        </button>

        <button
          type="button"
          onClick={() => setInputType('url_doc')}
          className={`flex items-center justify-center space-x-1.5 py-2 rounded-lg text-xs font-medium transition-all ${
            inputType === 'url_doc'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <LinkIcon className="w-3.5 h-3.5" />
          <span>URL / Spec Sheet</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Category Dropdown */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Taxonomy Category (UNSPSC / ETIM):
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
          >
            <option value="">-- Auto-Detect Category with Gemini --</option>
            {categories.map((cat) => (
              <option key={cat.code} value={cat.code}>
                [{cat.code}] {cat.category} → {cat.subcategory}
              </option>
            ))}
          </select>
        </div>

        {/* Input Fields depending on active tab */}
        {inputType === 'text' && (
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Industrial Product Description / Fragment:
            </label>
            <textarea
              rows={4}
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder="e.g. 3-Phase AC motor, 5.5kW, 415V, IE3 efficiency, TEFC enclosure, foot mounted..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-slate-100 placeholder-slate-500 font-mono focus:outline-none focus:border-amber-500"
            />
          </div>
        )}

        {inputType === 'name_category' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Product Name / Part Number:
              </label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g. Deep Groove Ball Bearing 6205-2RS"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Additional Notes / Specs:
              </label>
              <textarea
                rows={2}
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="Optional extra details (material, voltage, dimensions)..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>
          </div>
        )}

        {inputType === 'image' && (
          <div className="space-y-3">
            <div className="border-2 border-dashed border-slate-700 hover:border-amber-500/50 rounded-xl p-4 text-center bg-slate-950/50 transition-all">
              {imagePreview ? (
                <div className="space-y-2">
                  <img src={imagePreview} alt="Preview" className="max-h-40 mx-auto rounded-lg object-contain border border-slate-700" />
                  <p className="text-[11px] text-emerald-400 font-mono flex items-center justify-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Image Ready for Gemini Vision Extraction</span>
                  </p>
                </div>
              ) : (
                <label className="cursor-pointer block py-4">
                  <Upload className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                  <span className="text-xs text-slate-300 font-medium">Click to upload product image or nameplate photo</span>
                  <span className="block text-[10px] text-slate-500 mt-1">Supports PNG, JPG, WEBP (Gemini Vision 2.0 Flash)</span>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              )}
            </div>
            <textarea
              rows={2}
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder="Optional prompt context for Vision model..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
            />
          </div>
        )}

        {inputType === 'url_doc' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Datasheet URL / Manufacturer Link:
              </label>
              <input
                type="url"
                value={specUrl}
                onChange={(e) => setSpecUrl(e.target.value)}
                placeholder="https://example-industrial.com/products/bearing-6205.pdf"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Pasted Spec Sheet Text / PDF Snippet:
              </label>
              <textarea
                rows={3}
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="Paste raw PDF spec sheet text or table content here..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-slate-100 font-mono focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        )}

        {/* Submit Pipeline Trigger Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Processing Through AI Pipeline...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-slate-950" />
              <span>Execute 4-Stage Intelligence Pipeline</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
