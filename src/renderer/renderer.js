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
        
        // Generate QR codes after DOM insertion
        this.generateQRCodes();
        
        // Enable the print and preview buttons since we now have stickers
        this.printBtn.disabled = false;
        this.previewBtn.disabled = false;
        console.log('Print and preview buttons enabled');
        
        // Show status bar with sticker count
        this.updateStatusBar();
    }
    
    async generateQRCodes() {
        // Import QRCode dynamically (since it's a CommonJS module)
        const QRCode = window.require('qrcode');
        
        const qrElements = document.querySelectorAll('.qr-code[data-qr-data]');
        
        for (const qrElement of qrElements) {
            try {
                const qrData = qrElement.dataset.qrData;
                const qrCodeDataURL = await QRCode.toDataURL(qrData, {
                    width: 60,
                    height: 60,
                    margin: 1,
                    color: {
                        dark: '#000000',
                        light: '#FFFFFF'
                    }
                });
                
                qrElement.innerHTML = `<img src="${qrCodeDataURL}" style="width: 100%; height: 100%; object-fit: contain;" alt="QR Code">`;
            } catch (error) {
                console.error('Error generating QR code:', error);
                qrElement.innerHTML = '⚠️';
            }
        }
    }
    
    createStickerElement(rowData, index) {
        // Create main sticker div
        const sticker = document.createElement('div');
        sticker.className = 'sticker';
        
        // Create sticker content
        const content = document.createElement('div');
        content.className = 'sticker-content';
        
        // Create header
        const header = document.createElement('div');
        header.className = 'sticker-header';
        
        const companyName = document.createElement('div');
        companyName.className = 'company-name';
        companyName.textContent = 'TLWMAXX';
        
        const plantInfo = document.createElement('div');
        plantInfo.className = 'plant-info';
        plantInfo.textContent = 'Plant\n3029';
        plantInfo.style.whiteSpace = 'pre-line';
        
        header.appendChild(companyName);
        header.appendChild(plantInfo);
        
        // Create main data table
        const table = document.createElement('div');
        table.className = 'sticker-table';
        
        // Table headers and data in the order shown in image
        const tableData = [
            { header: 'Style', value: rowData['Style'] || rowData['ROLL NO'] || `ST${index + 1}` },
            { header: 'Material', value: rowData['Material'] || rowData['Fabric type'] || 'Cotton' },
            { header: 'Item Description', value: rowData['Item Description'] || rowData['Fabric type'] || 'Fabric Roll' },
            { header: 'Composition', value: rowData['Composition'] || '100% Cotton' },
            { header: 'PO Number', value: rowData['PO Number'] || `PO${1000 + index}` },
            { header: 'Supplier', value: rowData['Supplier'] || rowData['manufacturer'] || 'Supplier' },
            { header: 'Sales Order', value: rowData['Sales Order'] || `SO${2000 + index}` },
            { header: 'Invoice No.', value: rowData['Invoice No.'] || `INV${3000 + index}` },
            { header: 'Vendor Batch', value: rowData['Vendor Batch'] || `VB${index + 1}` },
            { header: 'Shade', value: rowData['Shade'] || rowData['color'] || 'Blue' },
            { header: 'Roll No.', value: rowData['Roll No.'] || rowData['ROLL NO'] || `R${index + 1}` },
            { header: 'Bin No.', value: rowData['Bin No.'] || `BIN${index + 1}` },
            { header: 'Qty', value: this.formatQuantity(rowData['Quantity'] || rowData['length'] || '50') },
            { header: 'Received Date', value: rowData['Received Date'] || new Date().toLocaleDateString('en-GB') },
            { header: 'Brand', value: rowData['Brand'] || 'TLWMAXX' },
            { header: 'LOT', value: rowData['LOT'] || `L${index + 1}` }
        ];
        
        // Add header row
        tableData.forEach(item => {
            const headerCell = document.createElement('div');
            headerCell.className = 'table-cell header';
            headerCell.textContent = item.header;
            table.appendChild(headerCell);
        });
        
        // Add data row
        tableData.forEach(item => {
            const dataCell = document.createElement('div');
            dataCell.className = 'table-cell data';
            dataCell.textContent = item.value;
            table.appendChild(dataCell);
        });
        
        // Create bottom section
        const bottom = document.createElement('div');
        bottom.className = 'sticker-bottom';
        
        // QR Code section
        const qrSection = document.createElement('div');
        qrSection.className = 'qr-section';
        
        const qrCode = document.createElement('div');
        qrCode.className = 'qr-code';
        
        // Generate QR code data
        const qrData = rowData['QR Code'] || `11000000000019556${38 + index}`;
        
        // Create QR code placeholder (we'll generate the actual QR code after DOM insertion)
        qrCode.innerHTML = '📱'; // Placeholder until QR code is generated
        qrCode.dataset.qrData = qrData;
        
        const qrNumber = document.createElement('div');
        qrNumber.className = 'qr-number';
        qrNumber.textContent = qrData;
        
        qrSection.appendChild(qrCode);
        qrSection.appendChild(qrNumber);
        
        // LOT section
        const lotSection = document.createElement('div');
        lotSection.className = 'lot-section';
        
        const lotItems = [
            { label: 'LOT', value: rowData['LOT'] || `L${index + 1}` },
            { label: 'ELESSE', value: 'ELESSE' },
            { label: 'LOT TKM', value: rowData['LOT TKM'] || `TKM${index + 1}` },
            { label: '', value: '' }
        ];
        
        lotItems.forEach(item => {
            const lotCell = document.createElement('div');
            lotCell.className = 'lot-cell';
            
            if (item.label) {
                const label = document.createElement('div');
                label.className = 'lot-label';
                label.textContent = item.label;
                lotCell.appendChild(label);
            }
            
            if (item.value) {
                const value = document.createElement('div');
                value.className = 'lot-value';
                value.textContent = item.value;
                lotCell.appendChild(value);
            }
            
            lotSection.appendChild(lotCell);
        });
        
        // Date section
        const dateSection = document.createElement('div');
        dateSection.className = 'date-section';
        dateSection.textContent = rowData['Received Date'] || new Date().toLocaleDateString('en-GB');
        
        bottom.appendChild(qrSection);
        bottom.appendChild(lotSection);
        bottom.appendChild(dateSection);
        
        // Create red footer
        const footer = document.createElement('div');
        footer.className = 'sticker-footer';
        
        // Assemble the sticker
        content.appendChild(header);
        content.appendChild(table);
        content.appendChild(bottom);
        
        sticker.appendChild(content);
        sticker.appendChild(footer);
        
        return sticker;
    }
    
    formatQuantity(value) {
        if (!value) return '0';
        const num = parseFloat(value);
        return isNaN(num) ? value : `${num}M`;
    }
    
    createFieldElement(label, value, isColor = false) {
        const field = document.createElement('div');
        field.className = 'sticker-field';
        
        const fieldLabel = document.createElement('div');
        fieldLabel.className = 'field-label';
        fieldLabel.textContent = label;
        
        const fieldValue = document.createElement('div');
        fieldValue.className = 'field-value';
        fieldValue.textContent = value;
        
        // Add color indicator for color fields
        if (isColor && value && value !== 'N/A') {
            const colorIndicator = document.createElement('span');
            colorIndicator.className = 'color-indicator';
            colorIndicator.style.backgroundColor = this.getColorValue(value);
            fieldValue.appendChild(colorIndicator);
        }
        
        field.appendChild(fieldLabel);
        field.appendChild(fieldValue);
        
        return field;
    }
    
    createAdditionalField(rowData) {
        // Find any additional columns that aren't the main ones
        const mainColumns = ['ROLL NO', 'Fabric type', 'length', 'whegnt', 'color', 'manufacturer'];
        const additionalColumns = Object.keys(rowData).filter(key => !mainColumns.includes(key));
        
        if (additionalColumns.length > 0) {
            const key = additionalColumns[0];
            return this.createFieldElement(key, rowData[key] || 'N/A');
        }
        
        return null;
    }
    
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
    
    getColorValue(colorName) {
        const colorMap = {
            'red': '#e53e3e',
            'blue': '#3182ce',
            'green': '#38a169',
            'yellow': '#d69e2e',
            'black': '#2d3748',
            'white': '#f7fafc',
            'pink': '#d53f8c',
            'purple': '#805ad5',
            'orange': '#dd6b20',
            'brown': '#8b4513',
            'gray': '#718096',
            'grey': '#718096'
        };
        
        const lowerColor = String(colorName).toLowerCase();
        return colorMap[lowerColor] || '#4a5568';
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
        
        // Call the browser's print function
        window.print();
    }
    
    togglePrintPreview() {
        this.isPreviewMode = !this.isPreviewMode;
        
        if (this.isPreviewMode) {
            // Enter print preview mode
            document.body.classList.add('print-preview');
            this.previewBtn.innerHTML = '👁️ Exit Preview';
            this.previewBtn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
            
            // Add page indicators
            this.addPageIndicators();
            
            // Scroll to top
            window.scrollTo(0, 0);
        } else {
            // Exit print preview mode
            document.body.classList.remove('print-preview');
            this.previewBtn.innerHTML = '👁️ Print Preview';
            this.previewBtn.style.background = 'linear-gradient(135deg, #8b5cf6, #7c3aed)';
            
            // Remove page indicators
            this.removePageIndicators();
        }
    }
    
    addPageIndicators() {
        // Remove existing indicators
        this.removePageIndicators();
        
        const stickers = document.querySelectorAll('.sticker');
        const stickersPerPage = 4; // 2x2 grid
        
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
        const pageCount = Math.ceil(stickerCount / 4); // 4 stickers per page
        
        this.statusText.textContent = `✅ ${stickerCount} sticker${stickerCount !== 1 ? 's' : ''} loaded and ready to print`;
        this.stickerCount.textContent = `📄 ${pageCount} page${pageCount !== 1 ? 's' : ''} (4 stickers per page)`;
        
        this.statusBar.classList.remove('hidden');
    }
    
    hideStatusBar() {
        this.statusBar.classList.add('hidden');
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new StickerMaker();
});
