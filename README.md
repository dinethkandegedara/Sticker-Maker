# Sticker Maker

A desktop application built with Node.js and Electron to generate print-ready, text-only stickers for fabric rolls from Excel data. Features an elegant, modern UI with a professional print output.

## Features

- **Modern Elegant UI**: Colorful, intuitive interface with smooth animations
- **Professional Print Output**: Clean, text-only stickers optimized for readability
- **Excel Integration**: Load data from .xlsx, .xls, or .csv files
- **Complete Data Display**: All 19 textile data fields clearly visible
- **Print Layout**: 1 sticker per 4×4 inch paper
- **High Contrast**: Black text on white background for maximum readability
- **Live Preview**: See exactly how your stickers will print
- **Status Notifications**: Clear feedback on application state

## Supported Excel Columns

The application is optimized for textile roll sticker data with these columns:

### Required Columns:
- **Serial #** - Serial number (e.g., "TJ 01.07.2025-Roll 19")
- **Inhouse date** - Date in DD.MM.YYYY format (e.g., "07.01.2025")
- **PO Number** - Purchase order number (e.g., "FOC")
- **Vendor Name** - Supplier name (e.g., "teejay")
- **Invoice Number** - Invoice number (e.g., "90102255")
- **Batch** - Batch number (used for QR code - e.g., "8125888")
- **Roll Number** - Roll number (e.g., "1", "4", "30")
- **GRN QTY(M/YD)** - Quantity in meters/yards (e.g., "20", "100.701")

### Optional Columns:
- **Brand** - Brand name (defaults to "ELESSE")
- **LOT No** - LOT number
- **Material** - Material code
- **Material Description** - Description of material
- **UOM** - Unit of measure
- **Item** - Item code
- **Fabric Type** - Type of fabric
- **Shade Group** - Color/shade
- **Actual Width** - Width specification
- **Roll Weight** - Weight of roll
- **Storage Bin** - Storage location

*Sample file: `teejay-sample-data.xlsx` included with correct format.*

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

### Creating Installable Package
```bash
npm run package
```

## How to Use

1. **Launch the application**
   - Run `npm start` or `npm run dev`

2. **Load an Excel file**
   - Click the "Load Excel File" button
   - Select your Excel file (.xlsx, .xls, or .csv)
   - Stickers will be generated for each row in the Excel file

3. **Preview and Print**
   - Click "Print Preview" to see how stickers will look when printed
   - Click "Print Stickers" to open your system's print dialog
   - Use 4×4 inch paper and print at actual size (100% scale)
   - Each page will fit exactly 1 sticker, perfectly sized for the paper

## File Structure

```
sticker-maker/
├── src/
│   ├── main.js              # Electron main process
│   ├── preload.js           # Preload script for security
│   └── renderer/
│       ├── index.html       # Main UI
│       ├── new-styles.css   # Current print and UI styling
│       ├── modern-styles.css # Modern UI styling components
│       └── new-renderer.js  # Current frontend logic
├── teejay-sample-data.xlsx  # Sample Excel data
├── package.json             # Dependencies and scripts
└── README.md                # This file
```

## UI and Design

### Application Interface
- **Modern Design**: Gradient backgrounds, elegant cards, and smooth animations
- **Responsive Layout**: Works well on different screen sizes
- **Interactive Elements**: Buttons with hover effects and visual feedback
- **Status Notifications**: Toast messages and status bar indicators

### Sticker Design
- **Layout**: Clean 2-column grid showing all 19 fields
- **Print Output**: Black text on white background (no colors in print)
- **Fonts**: Standardized sizes (11px for labels, 13-15px for values)
- **Header**: Simple black bar with title and serial number
- **Print Layout**: 1 sticker per 4×4 inch paper
- **Fields**: All fields from Excel clearly labeled and visible

## Technologies Used

- **Electron** - Cross-platform desktop app framework
- **Node.js** - JavaScript runtime environment
- **XLSX** - Excel file parsing library
- **HTML/CSS/JavaScript** - Frontend technologies
- **Font Awesome** - Icon library for improved UI

## Troubleshooting

### Common Issues

1. **File won't load**
   - Ensure the Excel file isn't corrupted
   - Try saving the file in a different format (.xlsx recommended)
   - Check that the file isn't password protected

2. **Application won't start**
   - Run `npm install` to ensure all dependencies are installed
   - Check that Node.js is properly installed

3. **Print layout issues**
   - Ensure you're using 4×4 inch paper
   - Set print scale to 100% (actual size)
   - Disable headers and footers in your browser's print dialog
   - Make sure your printer is configured for 4×4 inch paper size

4. **Performance with large files**
   - The application can handle thousands of rows
   - For very large files (>10,000 rows), consider splitting the data

### Getting Help

If you encounter any issues:
1. Check the console for error messages (Ctrl+Shift+I in development mode)
2. Ensure your Excel file has proper headers in the first row
3. Try with a smaller test file first

## License

MIT License - feel free to modify and distribute as needed.

## Recent Updates

### Version 1.1.0 - Latest
- Completely redesigned sticker layout with professional 2-column format
- Enhanced header with clear title and serial number display
- Field labels now clearly separated from values for better readability
- Perfect 4×4 inch print sizing (one sticker per page)
- Black and white print output optimized for textile labels
- All fields from Excel are displayed in a consistent, organized format
- Improved print CSS to ensure proper page breaks and sizing
- Header and footer elements stay in the right position

### Version 1.0.0 - July 3, 2025
- Optimized print layout for 4×4 inch paper (1 sticker per page)
- Improved text visibility and alignment in stickers
- Enhanced field organization with most important data at the top
- Fixed font size issues for better readability
- Added proper field formatting for numbers, dates, and units
- Implemented perfect page breaks between stickers
- Updated installer configuration for easier distribution
