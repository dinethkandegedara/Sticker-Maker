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
        this.stickersContainer.innerHTML = '';
        for (let i = 0; i < this.data.length; i++) {
            const stickerPage = document.createElement('div');
            stickerPage.className = 'sticker-page';
            const sticker = this.createStickerElement(this.data[i]);
            stickerPage.appendChild(sticker);
            this.stickersContainer.appendChild(stickerPage);
        }
        this.printBtn.disabled = false;
        this.previewBtn.disabled = false;
        this.updateStatusBar();
    }
    
    createStickerElement(rowData) {
        const sticker = document.createElement('div');
        sticker.className = 'sticker';
        // Header
        const header = document.createElement('div');
        header.className = 'sticker-header';
        const headerTitle = document.createElement('div');
        headerTitle.className = 'header-title';
        headerTitle.textContent = 'TEXTILE ROLL DATA';
        const headerSerial = document.createElement('div');
        headerSerial.className = 'header-serial';
        headerSerial.textContent = rowData['Serial #'] || '-';
        header.appendChild(headerTitle);
        header.appendChild(headerSerial);
        // Content
        const content = document.createElement('div');
        content.className = 'sticker-content';
        const dataTable = document.createElement('div');
        dataTable.className = 'sticker-data';
        const fields = [
            { label: 'Serial #', field: 'Serial #' },
            { label: 'Batch', field: 'Batch' },
            { label: 'Roll Number', field: 'Roll Number' },
            { label: 'Vendor Name', field: 'Vendor Name' },
            { label: 'Inhouse date', field: 'Inhouse date' },
            { label: 'Invoice Number', field: 'Invoice Number' },
            { label: 'PO Number', field: 'PO Number' },
            { label: 'GRN QTY(M/YD)', field: 'GRN QTY(M/YD)' },
            { label: 'Material', field: 'Material' },
            { label: 'Material Description', field: 'Material Description' },
            { label: 'Fabric Type', field: 'Fabric Type' },
            { label: 'LOT No', field: 'LOT No' },
            { label: 'Brand', field: 'Brand' },
            { label: 'UOM', field: 'UOM' },
            { label: 'Item', field: 'Item' },
            { label: 'Actual Width', field: 'Actual Width' },
            { label: 'Roll Weight', field: 'Roll Weight' },
            { label: 'Shade Group', field: 'Shade Group' },
            { label: 'Storage Bin', field: 'Storage Bin' }
        ];
        fields.forEach(field => {
            const cell = document.createElement('div');
            cell.className = 'data-cell';
            const label = document.createElement('div');
            label.className = 'data-label';
            label.textContent = field.label;
            const value = document.createElement('div');
            value.className = 'data-value';
            value.textContent = rowData[field.field] || '-';
            cell.appendChild(label);
            cell.appendChild(value);
            dataTable.appendChild(cell);
        });
        content.appendChild(dataTable);
        // Footer
        const footer = document.createElement('div');
        footer.className = 'sticker-footer';
        // Assemble
        sticker.appendChild(header);
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
        
        // Add a subtle shake animation to indicate error
        this.stickersContainer.classList.add('shake');
        setTimeout(() => {
            this.stickersContainer.classList.remove('shake');
        }, 500);
    }
    
    printStickers() {
        // Check if there are stickers to print
        if (!this.data || this.data.length === 0) {
            this.showTemporaryStatus('No stickers to print. Please load an Excel file first.');
            return;
        }
        
        console.log(`Printing ${this.data.length} stickers...`);
        
        // Show print preparation animation
        const overlay = document.createElement('div');
        overlay.className = 'print-overlay';
        overlay.innerHTML = `
            <div class="print-animation">
                <i class="fas fa-print"></i>
                <p>Preparing to print...</p>
            </div>
        `;
        document.body.appendChild(overlay);
        
        // Add a delay to ensure CSS is applied before printing
        setTimeout(() => {
            console.log(`Printing ${this.data.length} stickers on 4×4 inch paper (1 per page)...`);
            
            // Show print tips
            this.showTemporaryStatus('For best results, use 4×4 inch paper with no scaling');
            
            // Prepare page for printing
            document.body.classList.add('printing');
            document.documentElement.classList.add('printing');
            
            // Set up page for printing
            const style = document.createElement('style');
            style.id = 'print-style';
            style.innerHTML = `
                @page {
                    size: 4in 4in;
                    margin: 0.1in;
                }
                
                @media print {
                    .sticker-page {
                        page-break-after: always !important;
                        page-break-before: auto !important;
                    }
                }
            `;
            document.head.appendChild(style);
            
            setTimeout(() => {
                // Remove overlay
                overlay.remove();
                
                // Print
                window.print();
                
                // Clean up
                setTimeout(() => {
                    document.body.classList.remove('printing');
                    document.documentElement.classList.remove('printing');
                    document.getElementById('print-style')?.remove();
                }, 500);
            }, 200);
        }, 800);
    }
    
    togglePrintPreview() {
        this.isPreviewMode = !this.isPreviewMode;
        
        if (this.isPreviewMode) {
            // Enter print preview mode
            document.body.classList.add('print-preview');
            this.previewBtn.innerHTML = '<i class="fas fa-times"></i> Exit Preview';
            
            // Add page indicators
            this.addPageIndicators();
            
            // Scroll to top with smooth animation
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            // Notify with a status update
            this.showTemporaryStatus('Preview mode enabled - this is how your stickers will print');
        } else {
            // Exit print preview mode
            document.body.classList.remove('print-preview');
            this.previewBtn.innerHTML = '<i class="fas fa-eye"></i> Print Preview';
            
            // Remove page indicators
            this.removePageIndicators();
            
            // Notify with status update
            this.showTemporaryStatus('Regular view restored');
        }
    }
    
    showTemporaryStatus(message) {
        const tempStatus = document.createElement('div');
        tempStatus.className = 'temp-status';
        tempStatus.innerHTML = `<i class="fas fa-info-circle"></i> ${message}`;
        document.body.appendChild(tempStatus);
        
        setTimeout(() => {
            tempStatus.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            tempStatus.classList.remove('show');
            setTimeout(() => {
                tempStatus.remove();
            }, 300);
        }, 2000);
    }
    
    addPageIndicators() {
        // Remove existing indicators
        this.removePageIndicators();
        
        const pageWrappers = document.querySelectorAll('.sticker-page-wrapper');
        
        pageWrappers.forEach((wrapper, index) => {
            const pageNumber = index + 1;
            const stickersInPage = wrapper.querySelectorAll('.sticker');
            const firstStickerIndex = Array.from(document.querySelectorAll('.sticker')).indexOf(stickersInPage[0]) + 1;
            const lastStickerIndex = firstStickerIndex + stickersInPage.length - 1;
            
            const indicator = document.createElement('div');
            indicator.className = 'page-indicator';
            indicator.textContent = `Page ${pageNumber} (Stickers ${firstStickerIndex}-${lastStickerIndex})`;
            
            // Insert after each page wrapper
            wrapper.parentNode.insertBefore(indicator, wrapper.nextSibling);
        });
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
        const stickersPerPage = 1; // 1 sticker per page for 4×4 inch paper
        const pageCount = Math.ceil(stickerCount / stickersPerPage);
        
        this.statusText.innerHTML = `<i class="fas fa-check-circle"></i> ${stickerCount} sticker${stickerCount !== 1 ? 's' : ''} loaded and ready to print`;
        this.stickerCount.innerHTML = `<i class="fas fa-file-alt"></i> ${pageCount} page${pageCount !== 1 ? 's' : ''} (4×4 inch pages)`;
        
        // Add an animation when showing the status bar
        this.statusBar.style.transform = 'translateY(100%)';
        this.statusBar.classList.remove('hidden');
        
        setTimeout(() => {
            this.statusBar.style.transform = 'translateY(0)';
        }, 50);
        
        // We no longer need to add spacers here since we're using page wrappers
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
