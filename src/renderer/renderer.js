class StickerMaker {
    constructor() {
        this.data = [];
        this.initializeElements();
        this.bindEvents();
    }
    
    initializeElements() {
        console.log('Initializing elements...');
        this.loadFileBtn = document.getElementById('loadFileBtn');
        this.stickersContainer = document.getElementById('stickersContainer');
        
        console.log('Load button found:', !!this.loadFileBtn);
        console.log('Stickers container found:', !!this.stickersContainer);
        
        if (!this.loadFileBtn) {
            console.error('loadFileBtn element not found!');
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
    }
    
    createStickerElement(rowData, index) {
        // Create main sticker div
        const sticker = document.createElement('div');
        sticker.className = 'sticker';
        sticker.setAttribute('data-fabric', rowData['Fabric type'] || '');
        
        // Create sticker header
        const header = document.createElement('div');
        header.className = 'sticker-header';
        
        const rollNumber = document.createElement('div');
        rollNumber.className = 'roll-number';
        rollNumber.textContent = rowData['ROLL NO'] || `#${index + 1}`;
        
        const fabricType = document.createElement('div');
        fabricType.className = 'fabric-type';
        fabricType.textContent = rowData['Fabric type'] || 'Unknown';
        
        header.appendChild(rollNumber);
        header.appendChild(fabricType);
        
        // Create sticker body with grid layout
        const body = document.createElement('div');
        body.className = 'sticker-body';
        
        // Length field
        const lengthField = this.createFieldElement('Length', 
            this.formatValue(rowData['length'], 'm'));
        body.appendChild(lengthField);
        
        // Weight field
        const weightField = this.createFieldElement('Weight', 
            this.formatValue(rowData['whegnt'], 'kg'));
        body.appendChild(weightField);
        
        // Color field with color indicator
        const colorField = this.createFieldElement('Color', 
            rowData['color'] || 'N/A', true);
        body.appendChild(colorField);
        
        // Additional field (could be any other column)
        const additionalField = this.createAdditionalField(rowData);
        if (additionalField) {
            body.appendChild(additionalField);
        }
        
        // Create sticker footer
        const footer = document.createElement('div');
        footer.className = 'sticker-footer';
        
        const manufacturer = document.createElement('div');
        manufacturer.className = 'manufacturer';
        manufacturer.textContent = rowData['manufacturer'] || 'Unknown Manufacturer';
        
        footer.appendChild(manufacturer);
        
        // Assemble the sticker
        sticker.appendChild(header);
        sticker.appendChild(body);
        sticker.appendChild(footer);
        
        return sticker;
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
        } else {
            this.loadFileBtn.disabled = false;
        }
    }
    
    showError(message) {
        this.stickersContainer.innerHTML = `
            <div class="error-message">
                <strong>Error:</strong> ${message}
            </div>
        `;
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new StickerMaker();
});
