
class StickerMaker {
    constructor() {
        this.data = [];
        this.initializeElements();
        this.bindEvents();
    }
    
    initializeElements() {
        console.log('Initializing elements...');
        this.loadFileBtn = document.getElementById('loadFileBtn');
        this.previewBtn = document.getElementById('previewBtn');
        this.altPrintBtn = document.getElementById('altPrintBtn'); // Main print button
        this.stickersContainer = document.getElementById('stickersContainer');
        this.statusBar = document.getElementById('statusBar');
        this.statusText = document.getElementById('statusText');
        this.stickerCount = document.getElementById('stickerCount');
        this.isPreviewMode = false;
        
        console.log('Buttons found:', {
            load: !!this.loadFileBtn,
            preview: !!this.previewBtn,
            altPrint: !!this.altPrintBtn
        });
    }
    
    bindEvents() {
        this.loadFileBtn.addEventListener('click', () => {
            console.log('Load Excel button clicked');
            this.loadExcelFile();
        });
        
        this.previewBtn.addEventListener('click', () => {
            console.log('Preview button clicked');
            this.togglePrintPreview();
        });
        
        // Set up alt print button as main print button
        if (this.altPrintBtn) {
            this.altPrintBtn.addEventListener('click', () => {
                console.log('Print button clicked');
                this.setupPrintFriendlyStickers();
            });
        }
    }
    
    async loadExcelFile() {
        try {
            console.log('Loading Excel file...');
            
            // Show loading state
            this.showLoading(true);
            
            if (!window.electronAPI) {
                throw new Error('electronAPI is not available. Check preload script.');
            }
            
            if (!window.electronAPI.loadExcel) {
                throw new Error('loadExcel function is not available in electronAPI. Check preload script.');
            }
            
            const result = await window.electronAPI.loadExcel();
            
            this.showLoading(false);
            
            if (result.canceled) {
                console.log('File selection was canceled');
                return;
            }
            
            if (!result.success) {
                this.showError(`Error loading file: ${result.error}`);
                return;
            }
            
            if (!result.data || result.data.length === 0) {
                this.showError('The Excel file appears to be empty or has no data.');
                return;
            }
            
            console.log(`Loaded ${result.data.length} rows of data`);
            
            // Store the data and create stickers
            this.data = result.data;
            this.createStickers();
            
        } catch (error) {
            console.error('Error in loadExcelFile:', error);
            this.showLoading(false);
            this.showError(`Unexpected error: ${error.message}`);
            this.loadFileBtn.disabled = false; // Ensure button is re-enabled
        }
    }
    
    createStickers() {
        // Clear existing stickers
        this.stickersContainer.innerHTML = '';
        
        // Create stickers individually, one per page
        for (let i = 0; i < this.data.length; i++) {
            // Create a page for each sticker
            const stickerPage = document.createElement('div');
            stickerPage.className = 'sticker-page';
            stickerPage.setAttribute('data-page', i+1);
            
            // Set explicit page styles for print
            stickerPage.style.width = '4in';
            stickerPage.style.height = '4in';
            stickerPage.style.pageBreakAfter = 'always';
            stickerPage.style.pageBreakBefore = 'auto';
            stickerPage.style.breakAfter = 'page';
            stickerPage.style.margin = '0';
            stickerPage.style.padding = '0';
            
            // Create the sticker
            const sticker = this.createStickerElement(this.data[i]);
            stickerPage.appendChild(sticker);
            
            // Add page to container
            this.stickersContainer.appendChild(stickerPage);
        }
        
        // Add debug info
        console.log(`Created ${this.data.length} stickers`);
        
        // Enable buttons
        this.previewBtn.disabled = false;
        if (this.altPrintBtn) {
            this.altPrintBtn.disabled = false;
        }
        
        // Show status
        this.updateStatusBar();
    }
    
    createStickerElement(rowData) {
        // Main sticker container - updated to 3.8×3.8 inches with optimized spacing
        const sticker = document.createElement('div');
        sticker.className = 'sticker';
        sticker.style.width = '3.8in';
        sticker.style.height = '3.8in';
        sticker.style.overflow = 'hidden';
        
        // Create header with reduced size
        const header = document.createElement('div');
        header.className = 'sticker-header';
        header.style.height = '0.35in';
        header.style.padding = '0.08in 0.12in';
        
        const headerTitle = document.createElement('div');
        headerTitle.className = 'header-title';
        headerTitle.textContent = 'TEXTILE ROLL DATA';
        headerTitle.style.fontSize = '12px';
        
        const headerSerial = document.createElement('div');
        headerSerial.className = 'header-serial';
        headerSerial.textContent = rowData['Serial #'] || 'N/A';
        headerSerial.style.fontSize = '11px';
        headerSerial.style.padding = '1px 6px';
        
        header.appendChild(headerTitle);
        header.appendChild(headerSerial);
        
        // Create sticker content with optimized padding
        const content = document.createElement('div');
        content.className = 'sticker-content';
        content.style.padding = '0.05in 0.08in';
        content.style.height = 'calc(100% - 0.43in)'; // Account for header and footer
        content.style.overflow = 'hidden';
        content.style.display = 'flex';
        content.style.flexDirection = 'column';
        
        // Create data table
        const dataTable = document.createElement('div');
        dataTable.className = 'sticker-data';
        dataTable.style.height = '100%';
        dataTable.style.overflow = 'hidden';
        
        // Define fields in the order they should appear - prioritizing most important info
        const fields = [
            { label: 'Serial #', field: 'Serial #' },
            { label: 'Batch', field: 'Batch' },
            { label: 'Roll Number', field: 'Roll Number' },
            { label: 'Material', field: 'Material' },
            { label: 'Material Description', field: 'Material Description' },
            { label: 'Fabric Type', field: 'Fabric Type' },
            { label: 'Vendor Name', field: 'Vendor Name' },
            { label: 'Inhouse date', field: 'Inhouse date' },
            { label: 'LOT No', field: 'LOT No' },
            { label: 'Brand', field: 'Brand' },
            { label: 'UOM', field: 'UOM' },
            { label: 'Item', field: 'Item' },
            { label: 'Actual Width', field: 'Actual Width' },
            { label: 'Roll Weight', field: 'Roll Weight' },
            { label: 'Shade Group', field: 'Shade Group' },
            { label: 'Storage Bin', field: 'Storage Bin' },
            { label: 'Invoice Number', field: 'Invoice Number' },
            { label: 'PO Number', field: 'PO Number' },
            { label: 'GRN QTY(M/YD)', field: 'GRN QTY(M/YD)' }
        ];
        
        // Create data cells with optimized sizing - ensure they're all visible
        fields.forEach(field => {
            const cell = document.createElement('div');
            cell.className = 'data-cell';
            cell.style.minHeight = '0.18in';
            cell.style.maxHeight = '0.18in';
            cell.style.padding = '0.02in 0.04in';
            cell.style.overflow = 'hidden';
            cell.style.display = 'flex';
            cell.style.flexDirection = 'row'; // Changed to row for side-by-side layout
            cell.style.alignItems = 'center';
            cell.style.gap = '0.05in';
            
            const label = document.createElement('div');
            label.className = 'data-label';
            label.textContent = field.label + ':';
            label.style.fontSize = '7px';
            label.style.lineHeight = '1';
            label.style.fontWeight = 'bold';
            label.style.textTransform = 'uppercase';
            label.style.flexShrink = '0';
            label.style.width = '0.8in'; // Fixed width for labels
            label.style.overflow = 'hidden';
            label.style.textOverflow = 'ellipsis';
            label.style.whiteSpace = 'nowrap';
            
            const value = document.createElement('div');
            value.className = 'data-value';
            // Ensure values are trimmed and properly displayed
            let fieldValue = rowData[field.field];
            if (fieldValue === undefined || fieldValue === null || fieldValue === '') {
                fieldValue = '-';
            } else if (typeof fieldValue === 'string') {
                fieldValue = fieldValue.trim();
            }
            value.textContent = fieldValue;
            value.style.fontSize = '8px';
            value.style.lineHeight = '1.1';
            value.style.fontWeight = 'normal';
            value.style.overflow = 'hidden';
            value.style.textOverflow = 'ellipsis';
            value.style.whiteSpace = 'nowrap';
            value.style.flex = '1'; // Take remaining space
            
            cell.appendChild(label);
            cell.appendChild(value);
            dataTable.appendChild(cell);
        });
        
        // Create footer with reduced size
        const footer = document.createElement('div');
        footer.className = 'sticker-footer';
        footer.style.height = '0.08in';
        
        // Assemble the sticker
        content.appendChild(dataTable);
        sticker.appendChild(header);
        sticker.appendChild(content);
        sticker.appendChild(footer);
        
        return sticker;
    }
    
    printStickers() {
        // Use the alternative print method as it works better
        this.setupPrintFriendlyStickers();
    }
    
    togglePrintPreview() {
        this.isPreviewMode = !this.isPreviewMode;
        
        if (this.isPreviewMode) {
            document.body.classList.add('print-preview');
            this.previewBtn.textContent = 'Exit Preview';
            this.showTemporaryStatus('Preview mode enabled - this is how your stickers will print');
        } else {
            document.body.classList.remove('print-preview');
            this.previewBtn.textContent = 'Print Preview';
            this.showTemporaryStatus('Regular view restored');
        }
    }
    
    showLoading(show) {
        if (show) {
            this.stickersContainer.innerHTML = `
                <div class="loading">
                    <div class="spinner"></div>
                    <p>Loading Excel file...</p>
                </div>
            `;
            this.loadFileBtn.disabled = true;
            this.previewBtn.disabled = true;
            if (this.altPrintBtn) {
                this.altPrintBtn.disabled = true;
            }
        } else {
            this.loadFileBtn.disabled = false;
            // Note: Other buttons (preview and print) are only enabled 
            // after stickers are successfully created in the createStickers method
        }
    }
    
    showError(message) {
        this.stickersContainer.innerHTML = `
            <div class="error-message">
                <strong>Error:</strong> ${message}
            </div>
        `;
        this.loadFileBtn.disabled = false; // Make sure Load File button is always enabled after an error
        this.previewBtn.disabled = true;
        if (this.altPrintBtn) {
            this.altPrintBtn.disabled = true;
        }
    }
    
    showTemporaryStatus(message) {
        const tempStatus = document.createElement('div');
        tempStatus.className = 'temp-status';
        tempStatus.textContent = message;
        document.body.appendChild(tempStatus);
        
        setTimeout(() => {
            tempStatus.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            tempStatus.classList.remove('show');
            setTimeout(() => tempStatus.remove(), 300);
        }, 2000);
    }
    
    updateStatusBar() {
        if (!this.data || this.data.length === 0) {
            this.statusBar.classList.add('hidden');
            return;
        }
        
        this.statusText.textContent = `${this.data.length} sticker(s) loaded and ready to print`;
        this.stickerCount.textContent = `${this.data.length} page(s) (4×4 inch)`;
        
        this.statusBar.classList.remove('hidden');
    }
    
    // Troubleshooting method to diagnose and fix printing issues
    troubleshootPrinting() {
        console.log('Running print troubleshooting...');
        
        // Check if stickers exist
        const stickers = document.querySelectorAll('.sticker');
        if (stickers.length === 0) {
            this.showError('No stickers found. Please load an Excel file first.');
            return;
        }
        
        console.log(`Found ${stickers.length} stickers`);
        
        // Force stickers to be visible and properly formatted with optimized dimensions
        stickers.forEach((sticker, index) => {
            sticker.style.display = 'flex';
            sticker.style.flexDirection = 'column';
            sticker.style.visibility = 'visible';
            sticker.style.width = '3.8in';
            sticker.style.height = '3.8in';
            sticker.style.border = '1.5px solid black';
            sticker.style.overflow = 'hidden';
            
            // Force header to be visible with reduced size
            const header = sticker.querySelector('.sticker-header');
            if (header) {
                header.style.display = 'flex';
                header.style.backgroundColor = 'black';
                header.style.color = 'white';
                header.style.height = '0.35in';
                header.style.padding = '0.08in 0.12in';
            }
            
            // Force data cells to be visible with optimized side-by-side layout
            const cells = sticker.querySelectorAll('.data-cell');
            cells.forEach(cell => {
                cell.style.border = '1px solid black';
                cell.style.minHeight = '0.18in';
                cell.style.maxHeight = '0.18in';
                cell.style.padding = '0.02in 0.04in';
                cell.style.overflow = 'hidden';
                cell.style.display = 'flex';
                cell.style.flexDirection = 'row';
                cell.style.alignItems = 'center';
                cell.style.gap = '0.05in';
                
                // Optimize label and value sizes for side-by-side layout
                const label = cell.querySelector('.data-label');
                if (label) {
                    label.style.fontSize = '7px';
                    label.style.lineHeight = '1';
                    label.style.fontWeight = 'bold';
                    label.style.textTransform = 'uppercase';
                    label.style.flexShrink = '0';
                    label.style.width = '0.8in';
                    label.style.overflow = 'hidden';
                    label.style.textOverflow = 'ellipsis';
                    label.style.whiteSpace = 'nowrap';
                    if (!label.textContent.endsWith(':')) {
                        label.textContent += ':';
                    }
                }
                
                const value = cell.querySelector('.data-value');
                if (value) {
                    value.style.fontSize = '8px';
                    value.style.lineHeight = '1.1';
                    value.style.fontWeight = 'normal';
                    value.style.overflow = 'hidden';
                    value.style.textOverflow = 'ellipsis';
                    value.style.whiteSpace = 'nowrap';
                    value.style.flex = '1';
                }
            });
            
            // Force footer to be smaller
            const footer = sticker.querySelector('.sticker-footer');
            if (footer) {
                footer.style.height = '0.08in';
            }
            
            console.log(`Fixed sticker ${index + 1}`);
        });
        
        // Force sticker pages to have proper page breaks
        const stickerPages = document.querySelectorAll('.sticker-page');
        stickerPages.forEach((page, index) => {
            page.style.width = '4in';
            page.style.height = '4in';
            page.style.pageBreakAfter = 'always';
            page.style.breakAfter = 'page';
            page.style.margin = '0';
            page.style.padding = '0';
            
            console.log(`Fixed sticker page ${index + 1}`);
        });
        
        // Try using the print-friendly setup directly
        this.setupPrintFriendlyStickers();
        
        this.showTemporaryStatus('Print troubleshooting complete. Try printing now.');
    }
    
    // Alternative print method that creates a new print-only window
    setupPrintFriendlyStickers() {
        if (!this.data || this.data.length === 0) {
            this.showTemporaryStatus('No stickers to print. Please load an Excel file first.');
            return;
        }
        
        console.log('Setting up print-friendly stickers...');
        
        // Create a clean slate for printing
        const stickersHtml = [];
        
        // Create stickers individually
        for (let i = 0; i < this.data.length; i++) {
            const rowData = this.data[i];
            
            // Define fields in the order they should appear
            const fields = [
                { label: 'Serial #', field: 'Serial #' },
                { label: 'Batch', field: 'Batch' },
                { label: 'Roll Number', field: 'Roll Number' },
                { label: 'Material', field: 'Material' },
                { label: 'Material Description', field: 'Material Description' },
                { label: 'Fabric Type', field: 'Fabric Type' },
                { label: 'Vendor Name', field: 'Vendor Name' },
                { label: 'Inhouse date', field: 'Inhouse date' },
                { label: 'LOT No', field: 'LOT No' },
                { label: 'Brand', field: 'Brand' },
                { label: 'UOM', field: 'UOM' },
                { label: 'Item', field: 'Item' },
                { label: 'Actual Width', field: 'Actual Width' },
                { label: 'Roll Weight', field: 'Roll Weight' },
                { label: 'Shade Group', field: 'Shade Group' },
                { label: 'Storage Bin', field: 'Storage Bin' },
                { label: 'Invoice Number', field: 'Invoice Number' },
                { label: 'PO Number', field: 'PO Number' },
                { label: 'GRN QTY(M/YD)', field: 'GRN QTY(M/YD)' }
            ];
            
            // Create cell HTML
            let cellsHtml = '';
            fields.forEach(field => {
                let fieldValue = rowData[field.field];
                if (fieldValue === undefined || fieldValue === null || fieldValue === '') {
                    fieldValue = '-';
                } else if (typeof fieldValue === 'string') {
                    fieldValue = fieldValue.trim();
                }
                
                cellsHtml += `
                    <div class="data-cell" style="border-right:1px solid black;border-bottom:1px solid black;padding:0.02in 0.04in;min-height:0.18in;max-height:0.18in;display:flex;flex-direction:row;align-items:center;gap:0.05in;overflow:hidden;">
                        <div class="data-label" style="font-size:7px;font-weight:bold;color:black;text-transform:uppercase;letter-spacing:0.3px;line-height:1;flex-shrink:0;width:0.8in;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${field.label}:</div>
                        <div class="data-value" style="font-size:8px;font-weight:normal;color:black;line-height:1.1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1;">${fieldValue}</div>
                    </div>
                `;
            });
            
            // Create sticker HTML with inline styles for maximum compatibility
            // Updated to 3.8in x 3.8in with optimized spacing to fit all data
            const stickerHtml = `
                <div class="sticker-page" style="width:4in;height:4in;display:flex;align-items:center;justify-content:center;page-break-after:always;page-break-inside:avoid;break-after:page;background:white;margin:0;padding:0;">
                    <div class="sticker" style="width:3.8in;height:3.8in;border:1.5px solid black;background:white;display:flex;flex-direction:column;justify-content:flex-start;align-items:stretch;position:relative;margin:0 auto;overflow:hidden;">
                        <div class="sticker-header" style="background:black;color:white;display:flex;justify-content:space-between;align-items:center;padding:0.08in 0.12in;font-size:12px;font-weight:bold;height:0.35in;border-bottom:1.5px solid black;flex-shrink:0;">
                            <div class="header-title" style="text-transform:uppercase;font-size:12px;font-weight:bold;color:white;">TEXTILE ROLL DATA</div>
                            <div class="header-serial" style="font-size:11px;border:1px solid white;padding:1px 6px;color:white;">${rowData['Serial #'] || 'N/A'}</div>
                        </div>
                        <div class="sticker-content" style="flex:1;display:flex;flex-direction:column;padding:0.05in 0.08in;overflow:hidden;">
                            <div class="sticker-data" style="display:grid;grid-template-columns:1fr 1fr;width:100%;border-left:1px solid black;border-top:1px solid black;height:100%;">
                                ${cellsHtml}
                            </div>
                        </div>
                        <div class="sticker-footer" style="height:0.08in;background:black;width:100%;flex-shrink:0;"></div>
                    </div>
                </div>
            `;
            
            stickersHtml.push(stickerHtml);
        }
        
        // Create a printable HTML document
        const printHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Print Stickers</title>
                <style>
                    @page {
                        size: 4in 4in;
                        margin: 0;
                    }
                    body, html {
                        margin: 0;
                        padding: 0;
                        background: white;
                    }
                    * {
                        box-sizing: border-box;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    .sticker-page {
                        width: 4in;
                        height: 4in;
                        page-break-after: always;
                        break-after: page;
                    }
                </style>
            </head>
            <body>
                ${stickersHtml.join('')}
                <script>
                    window.onload = function() {
                        window.print();
                        setTimeout(function() {
                            window.close();
                        }, 1000);
                    };
                </script>
            </body>
            </html>
        `;
        
        // Create the print window
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(printHtml);
            printWindow.document.close();
        } else {
            this.showTemporaryStatus('Could not open print window. Please check your pop-up blocker settings.');
        }
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new StickerMaker();
});
