# Excel Fabric Roll Viewer

A desktop application built with Node.js and Electron to view and search through Excel files containing fabric roll data.

## Features

- 📁 Load Excel files (.xlsx, .xls, .csv)
- 📊 Display data in a clean, responsive table
- 🔍 Real-time search across all columns
- 🏷️ Column-specific filtering
- 📱 Responsive design for different screen sizes
- 🎨 Modern, beautiful UI with gradient themes
- ⚡ Fast performance with large datasets

## Supported Excel Columns

The application is optimized for fabric roll data with these columns:
- **ROLL NO** - Roll number/identifier
- **Fabric type** - Type of fabric
- **length** - Length in meters
- **whegnt** - Weight in kilograms  
- **color** - Fabric color
- **manufacturer** - Manufacturer name

*Note: The application will work with any Excel file structure, but these columns get special formatting.*

## Installation

1. **Install Node.js** (if not already installed)
   - Download from [nodejs.org](https://nodejs.org/)
   - Choose the LTS version

2. **Install dependencies**
   ```bash
   npm install
   ```

## Usage

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

### Building for Distribution
```bash
npm run build
```

## How to Use

1. **Launch the application**
   - Run `npm start` or `npm run dev`

2. **Load an Excel file**
   - Click the "📁 Load Excel File" button
   - Select your Excel file (.xlsx, .xls, or .csv)
   - The data will be displayed in a table

3. **Search and Filter**
   - Use the search box to find specific records
   - Use the column filter dropdown for more specific filtering
   - All searches are case-insensitive and work in real-time

## File Structure

```
excel-fabric-viewer/
├── src/
│   ├── main.js              # Electron main process
│   ├── preload.js           # Preload script for security
│   └── renderer/
│       ├── index.html       # Main UI
│       ├── styles.css       # Styling
│       └── renderer.js      # Frontend logic
├── package.json             # Dependencies and scripts
└── README.md               # This file
```

## Technologies Used

- **Electron** - Desktop app framework
- **Node.js** - Runtime environment
- **XLSX** - Excel file parsing library
- **HTML/CSS/JavaScript** - Frontend technologies

## Troubleshooting

### Common Issues

1. **File won't load**
   - Ensure the Excel file isn't corrupted
   - Try saving the file in a different format (.xlsx recommended)
   - Check that the file isn't password protected

2. **Application won't start**
   - Run `npm install` to ensure all dependencies are installed
   - Check that Node.js is properly installed

3. **Performance issues with large files**
   - The application can handle thousands of rows
   - For very large files (>10,000 rows), consider splitting the data

### Getting Help

If you encounter any issues:
1. Check the console for error messages (Ctrl+Shift+I in development mode)
2. Ensure your Excel file has proper headers in the first row
3. Try with a smaller test file first

## License

MIT License - feel free to modify and distribute as needed.
