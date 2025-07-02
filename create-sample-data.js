const XLSX = require('xlsx');
const path = require('path');

// Sample fabric roll data
const sampleData = [
    {
        "ROLL NO": "FR001",
        "Fabric type": "Cotton",
        "length": 50.5,
        "whegnt": 12.3,
        "color": "Blue",
        "manufacturer": "TextileCorp"
    },
    {
        "ROLL NO": "FR002", 
        "Fabric type": "Polyester",
        "length": 75.2,
        "whegnt": 18.7,
        "color": "Red",
        "manufacturer": "FabricMax"
    },
    {
        "ROLL NO": "FR003",
        "Fabric type": "Silk",
        "length": 25.8,
        "whegnt": 5.2,
        "color": "White",
        "manufacturer": "LuxuryTextiles"
    },
    {
        "ROLL NO": "FR004",
        "Fabric type": "Wool",
        "length": 45.0,
        "whegnt": 22.1,
        "color": "Green",
        "manufacturer": "WoolWorks"
    },
    {
        "ROLL NO": "FR005",
        "Fabric type": "Linen",
        "length": 60.3,
        "whegnt": 14.5,
        "color": "Yellow",
        "manufacturer": "NaturalFibers"
    },
    {
        "ROLL NO": "FR006",
        "Fabric type": "Cotton",
        "length": 80.1,
        "whegnt": 19.8,
        "color": "Black",
        "manufacturer": "TextileCorp"
    },
    {
        "ROLL NO": "FR007",
        "Fabric type": "Polyester",
        "length": 35.6,
        "whegnt": 8.9,
        "color": "Purple",
        "manufacturer": "SyntheticPlus"
    },
    {
        "ROLL NO": "FR008",
        "Fabric type": "Denim",
        "length": 55.4,
        "whegnt": 26.7,
        "color": "Blue",
        "manufacturer": "DenimCraft"
    },
    {
        "ROLL NO": "FR009",
        "Fabric type": "Velvet",
        "length": 30.2,
        "whegnt": 15.3,
        "color": "Pink",
        "manufacturer": "LuxuryTextiles"
    },
    {
        "ROLL NO": "FR010",
        "Fabric type": "Canvas",
        "length": 90.0,
        "whegnt": 35.2,
        "color": "White",
        "manufacturer": "HeavyDuty"
    }
];

// Create a new workbook and worksheet
const workbook = XLSX.utils.book_new();
const worksheet = XLSX.utils.json_to_sheet(sampleData);

// Add the worksheet to the workbook
XLSX.utils.book_append_sheet(workbook, worksheet, 'Fabric Rolls');

// Write the file
const outputPath = path.join(__dirname, 'sample-fabric-data.xlsx');
XLSX.writeFile(workbook, outputPath);

console.log(`Sample Excel file created at: ${outputPath}`);
console.log('This file contains sample fabric roll data for testing the application.');
