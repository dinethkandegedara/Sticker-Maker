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
        this.printBtn = document.getElementById('printBtn');
        this.stickersContainer = document.getElementById('stickersContainer');
        this.statusBar = document.getElementById('statusBar');
        this.statusText = document.getElementById('statusText');
        this.stickerCount = document.getElementById('stickerCount');
        this.isPreviewMode = false;
        
        console.log('Load button found:', !!this.loadFileBtn);
        console.log('Preview button found:', !!this.previewBtn);
        console.log('Print button found:', !!this.printBtn);
        console.log('Stickers container found:', !!this.stickersContainer);
        console.log('Status bar found:', !!this.statusBar);
        
        if (!this.loadFileBtn) {
            console.error('loadFileBtn element not found!');
        }
        if (!this.previewBtn) {
            console.error('previewBtn element not found!');
        }
        if (!this.printBtn) {
            console.error('printBtn element not found!');
        }
        if (!this.stickersContainer) {
            console.error('stickersContainer element not found!');
        }
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
        
        this.printBtn.addEventListener('click', () => {
            console.log('Print button clicked');
            this.printStickers();
        });
    }
    
    async loadExcelFile() {
        try {
            console.log('Loading Excel file...');
            
            // Show loading state
            this.showLoading(true);
            
            // Check if electronAPI is available
            if (!window.electronAPI) {
                throw new Error('electronAPI is not available. Check preload script.');
            }
            
            console.log('Calling window.electronAPI.loadExcel()');
            
            // Call the loadExcel function from the main process
            const result = await window.electronAPI.loadExcel();
            
            console.log('Received result:', result);
            
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
        }
    }
    
    createStickers() {
        // Clear existing stickers
        this.stickersContainer.innerHTML = '';
        
        // Iterate over each row from Excel data
        this.data.forEach((row, index) => {
            const stickerDiv = this.createStickerElement(row, index);
            this.stickersContainer.appendChild(stickerDiv);
        });
        
        // Enable the print and preview buttons since we now have stickers
        this.printBtn.disabled = false;
        this.previewBtn.disabled = false;
        console.log('Print and preview buttons enabled');
        
        // Show status bar with sticker count
        this.updateStatusBar();
    }
    
    // QR code generation removed as per requirements for text-only stickers
    
    createStickerElement(rowData, index) {
        // Create main sticker div
        const sticker = document.createElement('div');
        sticker.className = 'sticker';
        
        // Create sticker content
        const content = document.createElement('div');
        content.className = 'sticker-content';
        
        // Create header with title - text only, no icons
        const header = document.createElement('div');
        header.className = 'sticker-header-title';
        header.innerHTML = `
            <div class="header-text">TEXTILE ROLL DATA</div>
            <div class="header-serial">${rowData['Serial #'] || 'N/A'}</div>
        `;
        
        // Create clean 3-column data grid for landscape sticker layout
        const table = document.createElement('div');
        table.className = 'sticker-data-table';
        
        // All Excel columns in a more logical order - text only for maximum readability
        const allColumns = [
            { field: 'Serial #' },
            { field: 'Vendor Name' },
            { field: 'Batch' },
            { field: 'Roll Number' },
            { field: 'GRN QTY(M/YD)' },
            { field: 'Fabric Type' },
            { field: 'Material' },
            { field: 'Material Description' },
            { field: 'Inhouse date' },
            { field: 'PO Number' },
            { field: 'Invoice Number' },
            { field: 'Brand' },
            { field: 'LOT No' },
            { field: 'UOM' },
            { field: 'Item' },
            { field: 'Shade Group' },
            { field: 'Actual Width' },
            { field: 'Roll Weight' },
            { field: 'Storage Bin' }
        ];
        
        // Important fields that should be highlighted with larger fonts - focused on key identifiers
        const importantFields = ['Serial #', 'Roll Number', 'Batch', 'Vendor Name'];
        
        // Create cells for each field (3 columns layout)
        allColumns.forEach(column => {
            const cell = document.createElement('div');
            cell.className = 'data-cell';
            
            // Highlight important fields with bolder text
            if (importantFields.includes(column.field)) {
                cell.classList.add('important');
            }
            
            const label = document.createElement('div');
            label.className = 'data-label';
            label.textContent = column.field;
            
            const value = document.createElement('div');
            value.className = 'data-value';
            value.textContent = rowData[column.field] || '-';
            
            cell.appendChild(label);
            cell.appendChild(value);
            table.appendChild(cell);
        });
        
        // Create black footer
        const footer = document.createElement('div');
        footer.className = 'sticker-footer';
        
        // Assemble the sticker
        content.appendChild(header);
        content.appendChild(table);
        
        sticker.appendChild(content);
        sticker.appendChild(footer);
        
        return sticker;
    }
    
    formatQuantity(value) {
        if (!value) return '0';
        
        // Handle your quantity format (already includes decimals)
        const num = parseFloat(value);
        if (isNaN(num)) return value;
        
        // Format with proper decimal places and add YD unit
        if (num >= 100) {
            return `${num.toFixed(0)}YD`;
        } else {
            return `${num.toFixed(1)}YD`;
        }
    }
    
    // Field element creation moved to the sticker data table approach
    // This legacy method is removed as per the new text-only sticker design
    
    // Legacy method for handling additional fields - no longer needed with the 
    // comprehensive approach that shows all 19 fields
    
    formatValue(value, unit) {
        if (value === null || value === undefined || value === '') {
            return 'N/A';
        }
        
        // If it's a number, format it nicely
        if (!isNaN(value)) {
            return `${Number(value).toLocaleString()} ${unit}`;
        }
        
        return `${value} ${unit}`;
    }
    
    // Color handling removed as per requirements for black & white stickers
    
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
            this.printBtn.disabled = true;
        } else {
            this.loadFileBtn.disabled = false;
            // Don't enable preview and print buttons here - they will be enabled in createStickers
        }
    }
    
    showError(message) {
        this.stickersContainer.innerHTML = `
            <div class="error-message">
                <strong>Error:</strong> ${message}
            </div>
        `;
        this.previewBtn.disabled = true;
        this.printBtn.disabled = true;
        this.hideStatusBar();
    }
    
    printStickers() {
        // Check if there are stickers to print
        if (!this.data || this.data.length === 0) {
            alert('No stickers to print. Please load an Excel file first.');
            return;
        }
        
        console.log(`Printing ${this.data.length} stickers...`);
        
        // Add a small delay to ensure CSS is applied before printing
        setTimeout(() => {
            // Ensure page breaks are properly set up
            const stickersPerPage = 6; // Updated to 6 stickers per page
            const pageCount = Math.ceil(this.data.length / stickersPerPage);
            console.log(`Printing ${pageCount} pages of stickers (${stickersPerPage} per page)...`);
            
            // Force a reflow before printing
            document.body.style.display = 'none';
            document.body.offsetHeight; // Force reflow
            document.body.style.display = '';
            
            // Call the browser's print function
            window.print();
        }, 300);
    }
    
    togglePrintPreview() {
        this.isPreviewMode = !this.isPreviewMode;
        
        if (this.isPreviewMode) {
            // Enter print preview mode
            document.body.classList.add('print-preview');
            this.previewBtn.innerHTML = 'Exit Preview';
            this.previewBtn.style.background = '#000000';
            
            // Add page indicators
            this.addPageIndicators();
            
            // Scroll to top
            window.scrollTo(0, 0);
        } else {
            // Exit print preview mode
            document.body.classList.remove('print-preview');
            this.previewBtn.innerHTML = 'Print Preview';
            this.previewBtn.style.background = '#000000';
            
            // Remove page indicators
            this.removePageIndicators();
        }
    }
    
    addPageIndicators() {
        // Remove existing indicators
        this.removePageIndicators();
        
        const stickers = document.querySelectorAll('.sticker');
        const stickersPerPage = 6; // Updated to 6 stickers per page (3x2 grid)
        
        for (let i = 0; i < stickers.length; i += stickersPerPage) {
            const pageNumber = Math.floor(i / stickersPerPage) + 1;
            const lastStickerOnPage = Math.min(i + stickersPerPage - 1, stickers.length - 1);
            
            if (lastStickerOnPage < stickers.length - 1) {
                const indicator = document.createElement('div');
                indicator.className = 'page-indicator';
                indicator.textContent = `Page ${pageNumber} (Stickers ${i + 1}-${lastStickerOnPage + 1})`;
                
                // Insert after the last sticker of this page
                stickers[lastStickerOnPage].parentNode.insertBefore(indicator, stickers[lastStickerOnPage].nextSibling);
            }
        }
    }
    
    removePageIndicators() {
        const indicators = document.querySelectorAll('.page-indicator');
        indicators.forEach(indicator => indicator.remove());
    }
    
    updateStatusBar() {
        if (!this.data || this.data.length === 0) {
            this.statusBar.classList.add('hidden');
            return;
        }
        
        const stickerCount = this.data.length;
        const stickersPerPage = 6; // Changed from 4 to 6 stickers per page
        const pageCount = Math.ceil(stickerCount / stickersPerPage);
        
        this.statusText.textContent = `${stickerCount} sticker${stickerCount !== 1 ? 's' : ''} loaded and ready to print`;
        this.stickerCount.textContent = `${pageCount} page${pageCount !== 1 ? 's' : ''} (${stickersPerPage} stickers per page)`;
        
        this.statusBar.classList.remove('hidden');
        
        // Add spacers after every 6th sticker to ensure proper page breaks when printing
        if (stickerCount > stickersPerPage) {
            const stickers = document.querySelectorAll('.sticker');
            for (let i = stickersPerPage - 1; i < stickers.length; i += stickersPerPage) {
                if (stickers[i]) {
                    const spacer = document.createElement('div');
                    spacer.className = 'page-break-spacer';
                    stickers[i].after(spacer);
                }
            }
        }
    }
    
    hideStatusBar() {
        this.statusBar.classList.add('hidden');
    }
    
    // No longer needed to extract style information
    // We're showing the raw data without transformation as per requirements
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new StickerMaker();
});
