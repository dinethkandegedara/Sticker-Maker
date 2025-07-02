class ExcelViewer {
    constructor() {
        this.data = [];
        this.filteredData = [];
        this.columns = [];
        
        this.initializeElements();
        this.bindEvents();
    }
    
    initializeElements() {
        this.loadFileBtn = document.getElementById('loadFileBtn');
        this.fileInfo = document.getElementById('fileInfo');
        this.fileName = document.getElementById('fileName');
        this.sheetName = document.getElementById('sheetName');
        this.recordCount = document.getElementById('recordCount');
        this.searchInput = document.getElementById('searchInput');
        this.columnFilter = document.getElementById('columnFilter');
        this.loadingSpinner = document.getElementById('loadingSpinner');
        this.errorMessage = document.getElementById('errorMessage');
        this.noDataMessage = document.getElementById('noDataMessage');
        this.tableContainer = document.getElementById('tableContainer');
        this.dataTable = document.getElementById('dataTable');
        this.tableHeader = document.getElementById('tableHeader');
        this.tableBody = document.getElementById('tableBody');
    }
    
    bindEvents() {
        this.loadFileBtn.addEventListener('click', () => this.loadExcelFile());
        this.searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        this.columnFilter.addEventListener('change', (e) => this.handleColumnFilter(e.target.value));
    }
    
    async loadExcelFile() {
        try {
            this.showLoading(true);
            this.hideError();
            
            const result = await window.electronAPI.loadExcel();
            
            this.showLoading(false);
            
            if (result.canceled) {
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
            
            this.data = result.data;
            this.filteredData = [...this.data];
            this.columns = Object.keys(this.data[0] || {});
            
            this.updateFileInfo(result.fileName, result.sheetName, this.data.length);
            this.populateColumnFilter();
            this.renderTable();
            this.enableControls(true);
            
        } catch (error) {
            this.showLoading(false);
            this.showError(`Unexpected error: ${error.message}`);
        }
    }
    
    updateFileInfo(fileName, sheetName, recordCount) {
        this.fileName.textContent = fileName;
        this.sheetName.textContent = sheetName;
        this.recordCount.textContent = recordCount.toLocaleString();
        this.fileInfo.style.display = 'block';
    }
    
    populateColumnFilter() {
        this.columnFilter.innerHTML = '<option value="">Filter by column...</option>';
        this.columns.forEach(column => {
            const option = document.createElement('option');
            option.value = column;
            option.textContent = this.formatColumnName(column);
            this.columnFilter.appendChild(option);
        });
    }
    
    formatColumnName(columnName) {
        // Handle common fabric roll column names
        const columnMappings = {
            'ROLL NO': '🏷️ Roll No',
            'Fabric type': '🧵 Fabric Type',
            'length': '📏 Length',
            'whegnt': '⚖️ Weight',
            'color': '🎨 Color',
            'manufacturer': '🏭 Manufacturer'
        };
        
        return columnMappings[columnName] || columnName;
    }
    
    handleSearch(searchTerm) {
        const term = searchTerm.toLowerCase().trim();
        
        if (!term) {
            this.filteredData = [...this.data];
        } else {
            this.filteredData = this.data.filter(row => {
                return Object.values(row).some(value => {
                    return String(value || '').toLowerCase().includes(term);
                });
            });
        }
        
        this.renderTable();
        this.updateRecordCount();
    }
    
    handleColumnFilter(selectedColumn) {
        if (!selectedColumn) {
            // If no column selected, show unique values from search results
            this.renderTable();
            return;
        }
        
        // Get unique values for the selected column
        const uniqueValues = [...new Set(this.data.map(row => String(row[selectedColumn] || '')))];
        uniqueValues.sort();
        
        // Create a more detailed filter UI (for now, just show all data)
        // In a more advanced version, you could show a dropdown with unique values
        this.renderTable();
    }
    
    renderTable() {
        if (this.filteredData.length === 0) {
            this.showNoData();
            return;
        }
        
        this.hideNoData();
        this.renderTableHeader();
        this.renderTableBody();
        this.tableContainer.style.display = 'block';
    }
    
    renderTableHeader() {
        this.tableHeader.innerHTML = '';
        const headerRow = document.createElement('tr');
        
        this.columns.forEach(column => {
            const th = document.createElement('th');
            th.textContent = this.formatColumnName(column);
            th.style.minWidth = this.getColumnWidth(column);
            headerRow.appendChild(th);
        });
        
        this.tableHeader.appendChild(headerRow);
    }
    
    getColumnWidth(column) {
        const widthMappings = {
            'ROLL NO': '120px',
            'Fabric type': '150px',
            'length': '100px',
            'whegnt': '100px',
            'color': '120px',
            'manufacturer': '150px'
        };
        
        return widthMappings[column] || '120px';
    }
    
    renderTableBody() {
        this.tableBody.innerHTML = '';
        
        this.filteredData.forEach((row, index) => {
            const tr = document.createElement('tr');
            
            this.columns.forEach(column => {
                const td = document.createElement('td');
                const value = row[column];
                
                td.textContent = this.formatCellValue(column, value);
                td.title = String(value || ''); // Tooltip for full value
                
                // Add special styling for certain columns
                if (column === 'color' && value) {
                    td.style.fontWeight = '600';
                    td.style.color = this.getColorForValue(value);
                }
                
                tr.appendChild(td);
            });
            
            this.tableBody.appendChild(tr);
        });
    }
    
    formatCellValue(column, value) {
        if (value === null || value === undefined || value === '') {
            return '-';
        }
        
        // Format specific column types
        switch (column) {
            case 'length':
                return isNaN(value) ? value : `${Number(value).toLocaleString()} m`;
            case 'whegnt':
                return isNaN(value) ? value : `${Number(value).toLocaleString()} kg`;
            case 'ROLL NO':
                return `#${value}`;
            default:
                return String(value);
        }
    }
    
    getColorForValue(colorName) {
        const colorMap = {
            'red': '#e53e3e',
            'blue': '#3182ce',
            'green': '#38a169',
            'yellow': '#d69e2e',
            'black': '#2d3748',
            'white': '#4a5568',
            'pink': '#d53f8c',
            'purple': '#805ad5'
        };
        
        const lowerColor = String(colorName).toLowerCase();
        return colorMap[lowerColor] || '#4a5568';
    }
    
    updateRecordCount() {
        this.recordCount.textContent = this.filteredData.length.toLocaleString();
    }
    
    showLoading(show) {
        this.loadingSpinner.style.display = show ? 'block' : 'none';
        this.loadFileBtn.disabled = show;
    }
    
    showError(message) {
        this.errorMessage.textContent = message;
        this.errorMessage.style.display = 'block';
        this.hideNoData();
        this.tableContainer.style.display = 'none';
    }
    
    hideError() {
        this.errorMessage.style.display = 'none';
    }
    
    showNoData() {
        this.noDataMessage.style.display = 'block';
        this.tableContainer.style.display = 'none';
    }
    
    hideNoData() {
        this.noDataMessage.style.display = 'none';
    }
    
    enableControls(enabled) {
        this.searchInput.disabled = !enabled;
        this.columnFilter.disabled = !enabled;
        
        if (enabled) {
            this.searchInput.placeholder = '🔍 Search fabric rolls...';
        } else {
            this.searchInput.placeholder = '🔍 Load a file first...';
            this.searchInput.value = '';
            this.columnFilter.value = '';
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ExcelViewer();
});
