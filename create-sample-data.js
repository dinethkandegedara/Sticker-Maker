const XLSX = require('xlsx');
const path = require('path');

// Sample textile roll data with all required fields
const sampleData = [
    {
        "Style": "TLWMAXX",
        "Material": "Cotton",
        "Item Description": "Cotton Fabric Roll",
        "Composition": "100% Cotton",
        "PO Number": "EXP/2025-26/7",
        "Supplier": "TextileCorp",
        "Sales Order": "SO1001",
        "Invoice No.": "INV3001",
        "Vendor Batch": "VB241852",
        "Shade": "Blue",
        "Roll No.": "A603",
        "Bin No.": "BIN001",
        "Quantity": "56.30M",
        "Received Date": "22/05/2026",
        "Brand": "TLWMAXX",
        "LOT": "LOT001",
        "LOT TKM": "TKM001",
        "QR Code": "1100000000001955638"
    },
    {
        "Style": "TLWMAXX",
        "Material": "Polyester",
        "Item Description": "Polyester Blend Fabric",
        "Composition": "65% Polyester 35% Cotton",
        "PO Number": "EXP/2025-27/8",
        "Supplier": "FabricMax",
        "Sales Order": "SO1002",
        "Invoice No.": "INV3002",
        "Vendor Batch": "VB241853",
        "Shade": "Red",
        "Roll No.": "B604",
        "Bin No.": "BIN002",
        "Quantity": "75.20M",
        "Received Date": "23/05/2026",
        "Brand": "TLWMAXX",
        "LOT": "LOT002",
        "LOT TKM": "TKM002",
        "QR Code": "1100000000001955639"
    },
    {
        "Style": "TLWMAXX",
        "Material": "Silk",
        "Item Description": "Premium Silk Fabric",
        "Composition": "100% Silk",
        "PO Number": "EXP/2025-28/9",
        "Supplier": "LuxuryTextiles",
        "Sales Order": "SO1003",
        "Invoice No.": "INV3003",
        "Vendor Batch": "VB241854",
        "Shade": "White",
        "Roll No.": "C605",
        "Bin No.": "BIN003",
        "Quantity": "25.80M",
        "Received Date": "24/05/2026",
        "Brand": "TLWMAXX",
        "LOT": "LOT003",
        "LOT TKM": "TKM003",
        "QR Code": "1100000000001955640"
    },
    {
        "Style": "TLWMAXX",
        "Material": "Wool",
        "Item Description": "Merino Wool Blend",
        "Composition": "80% Wool 20% Polyester",
        "PO Number": "EXP/2025-29/10",
        "Supplier": "WoolWorks",
        "Sales Order": "SO1004",
        "Invoice No.": "INV3004",
        "Vendor Batch": "VB241855",
        "Shade": "Green",
        "Roll No.": "D606",
        "Bin No.": "BIN004",
        "Quantity": "45.00M",
        "Received Date": "25/05/2026",
        "Brand": "TLWMAXX",
        "LOT": "LOT004",
        "LOT TKM": "TKM004",
        "QR Code": "1100000000001955641"
    },
    {
        "Style": "TLWMAXX",
        "Material": "Linen",
        "Item Description": "Natural Linen Fabric",
        "Composition": "100% Linen",
        "PO Number": "EXP/2025-30/11",
        "Supplier": "NaturalFibers",
        "Sales Order": "SO1005",
        "Invoice No.": "INV3005",
        "Vendor Batch": "VB241856",
        "Shade": "Yellow",
        "Roll No.": "E607",
        "Bin No.": "BIN005",
        "Quantity": "60.30M",
        "Received Date": "26/05/2026",
        "Brand": "TLWMAXX",
        "LOT": "LOT005",
        "LOT TKM": "TKM005",
        "QR Code": "1100000000001955642"
    }
];

// Create a new workbook and worksheet
const workbook = XLSX.utils.book_new();
const worksheet = XLSX.utils.json_to_sheet(sampleData);

// Add the worksheet to the workbook
XLSX.utils.book_append_sheet(workbook, worksheet, 'Textile Rolls');

// Write the file
const outputPath = path.join(__dirname, 'sample-textile-data.xlsx');
XLSX.writeFile(workbook, outputPath);

console.log(`Sample textile roll Excel file created at: ${outputPath}`);
console.log('This file contains sample textile roll data with all required sticker fields.');
