const XLSX = require('xlsx');
const path = require('path');

// Create sample data matching the user's Excel format
const sampleData = [
    {
        'Serial #': 'TJ 01.07.2025-Roll 19',
        'Inhouse date': '07.01.2025',
        'PO Number': 'FOC',
        'Vendor Name': 'teejay',
        'Invoice Number': '90102255',
        'Brand': '',
        'LOT No': '',
        'Material': '',
        'Batch': '8125888',
        'Roll Number': '1',
        'GRN QTY(M/YD)': '20',
        'Material Description': '',
        'UOM': '',
        'Item': '',
        'Fabric Type': '',
        'Shade Group': '',
        'Actual Width': '',
        'Roll Weight': '',
        'Storage Bin': ''
    },
    {
        'Serial #': 'TJ 01.07.2025-Roll 19',
        'Inhouse date': '07.01.2025',
        'PO Number': 'FOC',
        'Vendor Name': 'teejay',
        'Invoice Number': '90102256',
        'Brand': '',
        'LOT No': '',
        'Material': '',
        'Batch': '8121377',
        'Roll Number': '4',
        'GRN QTY(M/YD)': '3',
        'Material Description': '',
        'UOM': '',
        'Item': '',
        'Fabric Type': '',
        'Shade Group': '',
        'Actual Width': '',
        'Roll Weight': '',
        'Storage Bin': ''
    },
    {
        'Serial #': 'TJ 01.07.2025-Roll 19',
        'Inhouse date': '07.01.2025',
        'PO Number': 'FOC',
        'Vendor Name': 'teejay',
        'Invoice Number': '90102256',
        'Brand': '',
        'LOT No': '',
        'Material': '',
        'Batch': '8121626',
        'Roll Number': '30',
        'GRN QTY(M/YD)': '100.701',
        'Material Description': '',
        'UOM': '',
        'Item': '',
        'Fabric Type': '',
        'Shade Group': '',
        'Actual Width': '',
        'Roll Weight': '',
        'Storage Bin': ''
    },
    {
        'Serial #': 'TJ 01.07.2025-Roll 19',
        'Inhouse date': '07.01.2025',
        'PO Number': 'FOC',
        'Vendor Name': 'teejay',
        'Invoice Number': '90102257',
        'Brand': '',
        'LOT No': '',
        'Material': '',
        'Batch': '81096858',
        'Roll Number': '1',
        'GRN QTY(M/YD)': '27',
        'Material Description': '',
        'UOM': '',
        'Item': '',
        'Fabric Type': '',
        'Shade Group': '',
        'Actual Width': '',
        'Roll Weight': '',
        'Storage Bin': ''
    },
    {
        'Serial #': 'TJ 01.07.2025-Roll 19',
        'Inhouse date': '07.01.2025',
        'PO Number': 'FOC',
        'Vendor Name': 'teejay',
        'Invoice Number': '90102258',
        'Brand': '',
        'LOT No': '',
        'Material': '',
        'Batch': '8122127',
        'Roll Number': '1',
        'GRN QTY(M/YD)': '100.6',
        'Material Description': '',
        'UOM': '',
        'Item': '',
        'Fabric Type': '',
        'Shade Group': '',
        'Actual Width': '',
        'Roll Weight': '',
        'Storage Bin': ''
    }
];

// Create workbook and worksheet
const workbook = XLSX.utils.book_new();
const worksheet = XLSX.utils.json_to_sheet(sampleData);

// Add the worksheet to the workbook
XLSX.utils.book_append_sheet(workbook, worksheet, 'Textile Rolls');

// Write the file
const outputPath = path.join(__dirname, 'teejay-sample-data.xlsx');
XLSX.writeFile(workbook, outputPath);

console.log(`Sample Teejay Excel file created: ${outputPath}`);
console.log(`Contains ${sampleData.length} sample textile roll entries`);
console.log('Columns included:');
console.log('- Serial #, Inhouse date, PO Number, Vendor Name');
console.log('- Invoice Number, Batch, Roll Number, GRN QTY(M/YD)');
console.log('- And other required fields for sticker generation');
