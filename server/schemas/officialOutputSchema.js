/**
 * SpecForge Official Expected Output Contract
 * Immutable 252-column CSV schema definition, mapping functions, and RFC 4180 serializer.
 */

export const OFFICIAL_EXPECTED_OUTPUT_HEADERS = [
  "MFR URL", "Ref URL 1", "Ref URL 2", "Ref URL 3", "Ref URL 4", "Ref URL 5",
  "PART_NUMBER", "Dept", "Class", "Fine", "SKU - MY_PART_NUMBER", "Mfg_Part_Num",
  "Part_Desc", "E1_Brand", "Unilog_Brand", "DIB_Brand", "Part_Manuf",
  "MANUFACTURER_NAME", "BRAND_NAME", "TRADE_NAME", "MANUFACTURER_PART_NUMBER",
  "ALTERNATE_PART_NUMBER", "Classpath", "MOBILE_DESC", "INVOICE_DESC",
  "SHORT_DESC", "LONG_DESC1", "RETAIL_DESC", "MARKETING_DESCRIPTION",
  ...Array.from({ length: 20 }, (_, i) => `ITEM_FEATURES_${i + 1}`),
  "With", "Standard/Approvals", "Prop 65", "Application", "Includes", "Product Name",
  ...Array.from({ length: 50 }, (_, i) => [
    `ATTRIBUTE_LABEL ${i + 1}`,
    `ATTRIBUTE_VALUE ${i + 1}`,
    `ATTRIBUTE_UOM ${i + 1}`
  ]).flat(),
  "UPC", "EAN", "GTIN", "UNSPSC", "Warranty", "List Price", "Selling Qty", "Selling UOM",
  "Standard Packaging Information", "LENGTH", "LENGTH_UOM", "HEIGHT", "HEIGHT_UOM",
  "WIDTH", "WIDTH_UOM", "WEIGHT", "WEIGHT_UOM", "VOLUME", "VOLUME_UOM",
  "Product Image", "Alternate Image 1", "Alternate Image 2", "Alternate Image 3", "Alternate Image 4",
  "SDS", "SDS_1", "Warranty Information", "Catalog", "Specification Sheet",
  "Instruction/Installation Manual", "Service Manual", "Owners/User Manual", "Line Drawing",
  "MTR", "RoHS", "Full Engineering Drawing", "Energy Star Guide", "Technical Bulletin",
  "Submittal", "Compatibility Chart", "Size Chart", "Product Label/Insert", "Video Link",
  "Video Link 1", "Country Of Origin", "Discontinued", "Actual Image (Yes/No)"
];

/**
 * Validate that an array of headers matches OFFICIAL_EXPECTED_OUTPUT_HEADERS exactly.
 */
export function validateOutputHeaders(headers) {
  if (!Array.isArray(headers) || headers.length !== OFFICIAL_EXPECTED_OUTPUT_HEADERS.length) {
    return {
      valid: false,
      reason: `Header count mismatch: Expected ${OFFICIAL_EXPECTED_OUTPUT_HEADERS.length}, got ${headers?.length || 0}`
    };
  }

  for (let i = 0; i < OFFICIAL_EXPECTED_OUTPUT_HEADERS.length; i++) {
    if (headers[i] !== OFFICIAL_EXPECTED_OUTPUT_HEADERS[i]) {
      return {
        valid: false,
        reason: `Header mismatch at column ${i + 1}: Expected "${OFFICIAL_EXPECTED_OUTPUT_HEADERS[i]}", got "${headers[i]}"`
      };
    }
  }

  return { valid: true };
}

/**
 * Map a canonical internal product record to an object matching the exact 252 official headers.
 */
export function mapProductToOfficialRow(product = {}) {
  const row = {};
  
  // Direct explicit mappings
  row["MFR URL"] = product.mfrUrl || product["MFR URL"] || "";
  row["Ref URL 1"] = product.refUrl1 || product["Ref URL 1"] || "";
  row["Ref URL 2"] = product.refUrl2 || product["Ref URL 2"] || "";
  row["Ref URL 3"] = product.refUrl3 || product["Ref URL 3"] || "";
  row["Ref URL 4"] = product.refUrl4 || product["Ref URL 4"] || "";
  row["Ref URL 5"] = product.refUrl5 || product["Ref URL 5"] || "";

  row["PART_NUMBER"] = product.partNumber || product["PART_NUMBER"] || product.sku || "";
  row["Dept"] = product.dept || product["Dept"] || "";
  row["Class"] = product.class || product["Class"] || "";
  row["Fine"] = product.fine || product["Fine"] || "";
  row["SKU - MY_PART_NUMBER"] = product.sku || product["SKU - MY_PART_NUMBER"] || "";
  row["Mfg_Part_Num"] = product.mfgPartNum || product["Mfg_Part_Num"] || product.mpn || "";
  row["Part_Desc"] = product.partDesc || product["Part_Desc"] || product.rawInput || product.name || "";
  row["E1_Brand"] = product.e1Brand || product["E1_Brand"] || "";
  row["Unilog_Brand"] = product.unilogBrand || product["Unilog_Brand"] || "";
  row["DIB_Brand"] = product.dibBrand || product["DIB_Brand"] || "";
  row["Part_Manuf"] = product.partManuf || product["Part_Manuf"] || product.supplier || "";

  row["MANUFACTURER_NAME"] = product.manufacturerName || product["MANUFACTURER_NAME"] || product.supplier || "";
  row["BRAND_NAME"] = product.brandName || product["BRAND_NAME"] || "";
  row["TRADE_NAME"] = product.tradeName || product["TRADE_NAME"] || "";
  row["MANUFACTURER_PART_NUMBER"] = product.mfgPartNum || product["MANUFACTURER_PART_NUMBER"] || product.mpn || "";
  row["ALTERNATE_PART_NUMBER"] = product.altPartNum || product["ALTERNATE_PART_NUMBER"] || "";

  row["Classpath"] = product.categoryPath || product["Classpath"] || product.category || "";
  row["MOBILE_DESC"] = product.mobileDesc || product["MOBILE_DESC"] || "";
  row["INVOICE_DESC"] = product.invoiceDesc || product["INVOICE_DESC"] || "";
  row["SHORT_DESC"] = product.shortDesc || product["SHORT_DESC"] || product.name || "";
  row["LONG_DESC1"] = product.longDesc || product["LONG_DESC1"] || "";
  row["RETAIL_DESC"] = product.retailDesc || product["RETAIL_DESC"] || "";
  row["MARKETING_DESCRIPTION"] = product.marketingDesc || product["MARKETING_DESCRIPTION"] || "";

  // ITEM_FEATURES_1 to 20
  const features = Array.isArray(product.features) ? product.features : [];
  for (let i = 1; i <= 20; i++) {
    const key = `ITEM_FEATURES_${i}`;
    row[key] = features[i - 1] || product[key] || "";
  }

  row["With"] = product.withText || product["With"] || "";
  row["Standard/Approvals"] = product.standards || product["Standard/Approvals"] || "";
  row["Prop 65"] = product.prop65 || product["Prop 65"] || "";
  row["Application"] = product.application || product["Application"] || "";
  row["Includes"] = product.includes || product["Includes"] || "";
  row["Product Name"] = product.productName || product["Product Name"] || product.name || "";

  // Map dynamic attributes to ATTRIBUTE_LABEL/VALUE/UOM 1..50 triples
  const attrs = product.attributes || product.enriched_attributes || {};
  let attrIndex = 1;

  if (attrs && typeof attrs === 'object') {
    Object.entries(attrs).forEach(([key, valObj]) => {
      if (attrIndex > 50) return;
      const labelKey = `ATTRIBUTE_LABEL ${attrIndex}`;
      const valueKey = `ATTRIBUTE_VALUE ${attrIndex}`;
      const uomKey = `ATTRIBUTE_UOM ${attrIndex}`;

      let label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      let val = "";
      let uom = "";

      if (valObj && typeof valObj === 'object') {
        val = valObj.value !== undefined ? String(valObj.value) : "";
        uom = valObj.normalized_unit || valObj.unit || "";
      } else if (valObj !== undefined && valObj !== null) {
        val = String(valObj);
      }

      if (val === "unknown") val = "";

      row[labelKey] = label;
      row[valueKey] = val;
      row[uomKey] = uom;

      attrIndex++;
    });
  }

  // Fill remaining attribute triples with empty strings
  while (attrIndex <= 50) {
    row[`ATTRIBUTE_LABEL ${attrIndex}`] = "";
    row[`ATTRIBUTE_VALUE ${attrIndex}`] = "";
    row[`ATTRIBUTE_UOM ${attrIndex}`] = "";
    attrIndex++;
  }

  row["UPC"] = product.upc || product["UPC"] || "";
  row["EAN"] = product.ean || product["EAN"] || "";
  row["GTIN"] = product.gtin || product["GTIN"] || "";
  row["UNSPSC"] = product.categoryCode || product["UNSPSC"] || "";
  row["Warranty"] = product.warranty || product["Warranty"] || "";
  row["List Price"] = product.listPrice || product["List Price"] || "";
  row["Selling Qty"] = product.sellingQty || product["Selling Qty"] || "";
  row["Selling UOM"] = product.sellingUom || product["Selling UOM"] || "";
  row["Standard Packaging Information"] = product.stdPkg || product["Standard Packaging Information"] || "";
  row["LENGTH"] = product.length || product["LENGTH"] || "";
  row["LENGTH_UOM"] = product.lengthUom || product["LENGTH_UOM"] || "";
  row["HEIGHT"] = product.height || product["HEIGHT"] || "";
  row["HEIGHT_UOM"] = product.heightUom || product["HEIGHT_UOM"] || "";
  row["WIDTH"] = product.width || product["WIDTH"] || "";
  row["WIDTH_UOM"] = product.widthUom || product["WIDTH_UOM"] || "";
  row["WEIGHT"] = product.weight || product["WEIGHT"] || "";
  row["WEIGHT_UOM"] = product.weightUom || product["WEIGHT_UOM"] || "";
  row["VOLUME"] = product.volume || product["VOLUME"] || "";
  row["VOLUME_UOM"] = product.volumeUom || product["VOLUME_UOM"] || "";

  row["Product Image"] = product.productImage || product["Product Image"] || "";
  row["Alternate Image 1"] = product.altImage1 || product["Alternate Image 1"] || "";
  row["Alternate Image 2"] = product.altImage2 || product["Alternate Image 2"] || "";
  row["Alternate Image 3"] = product.altImage3 || product["Alternate Image 3"] || "";
  row["Alternate Image 4"] = product.altImage4 || product["Alternate Image 4"] || "";
  row["SDS"] = product.sds || product["SDS"] || "";
  row["SDS_1"] = product.sds1 || product["SDS_1"] || "";
  row["Warranty Information"] = product.warrantyInfo || product["Warranty Information"] || "";
  row["Catalog"] = product.catalog || product["Catalog"] || "";
  row["Specification Sheet"] = product.specSheet || product["Specification Sheet"] || "";
  row["Instruction/Installation Manual"] = product.instManual || product["Instruction/Installation Manual"] || "";
  row["Service Manual"] = product.serviceManual || product["Service Manual"] || "";
  row["Owners/User Manual"] = product.userManual || product["Owners/User Manual"] || "";
  row["Line Drawing"] = product.lineDrawing || product["Line Drawing"] || "";
  row["MTR"] = product.mtr || product["MTR"] || "";
  row["RoHS"] = product.rohs || product["RoHS"] || "";
  row["Full Engineering Drawing"] = product.engDrawing || product["Full Engineering Drawing"] || "";
  row["Energy Star Guide"] = product.energyStar || product["Energy Star Guide"] || "";
  row["Technical Bulletin"] = product.techBulletin || product["Technical Bulletin"] || "";
  row["Submittal"] = product.submittal || product["Submittal"] || "";
  row["Compatibility Chart"] = product.compatChart || product["Compatibility Chart"] || "";
  row["Size Chart"] = product.sizeChart || product["Size Chart"] || "";
  row["Product Label/Insert"] = product.labelInsert || product["Product Label/Insert"] || "";
  row["Video Link"] = product.videoLink || product["Video Link"] || "";
  row["Video Link 1"] = product.videoLink1 || product["Video Link 1"] || "";
  row["Country Of Origin"] = product.countryOfOrigin || product["Country Of Origin"] || "";
  row["Discontinued"] = product.discontinued || product["Discontinued"] || "";
  row["Actual Image (Yes/No)"] = product.actualImage || product["Actual Image (Yes/No)"] || "Yes";

  return row;
}

/**
 * Escape a CSV field per RFC 4180 standards and protect against spreadsheet formula injection.
 */
export function escapeCsvCell(value) {
  if (value === null || value === undefined) return '""';
  let str = String(value);

  // Prevent Spreadsheet Formula Injection (=, +, -, @ prefix neutralization)
  if (/^[=+\-@]/.test(str)) {
    str = `'${str}`;
  }

  // Quote escaping if contains comma, double quote, newline, or leading/trailing whitespace
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }

  return str;
}

/**
 * Serialize an array of product records to an RFC 4180 compliant CSV string using the official 252 headers.
 */
export function serializeToOfficialCSV(records = []) {
  const headerLine = OFFICIAL_EXPECTED_OUTPUT_HEADERS.map(escapeCsvCell).join(',');
  const rowLines = records.map(record => {
    const rowObj = mapProductToOfficialRow(record);
    return OFFICIAL_EXPECTED_OUTPUT_HEADERS.map(h => escapeCsvCell(rowObj[h])).join(',');
  });

  return [headerLine, ...rowLines].join('\n');
}
