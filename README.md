# Bank Statement Converter

A powerful React-based web application that converts bank statements from multiple banks into a standardized CSV format compatible with Google Sheets and other spreadsheet applications.

## 🏦 Supported Banks

- **Postbank** - German bank statements with custom date formats
- **American Express** - Credit card statements with European formatting
- **Revolut** - Digital bank statements with timestamp handling
- **ING Bank** - International bank statements
- **N26** - Digital bank statements

## ✨ Features

### 🔄 Multi-Bank Support
- Bank-specific processing logic for accurate data conversion
- Automatic format detection and validation
- Custom date format handling for each bank

### 📊 Data Processing
- **Date Standardization**: Converts various date formats to YYYY-MM-DD
- **Amount Categorization**: Separates debits and credits correctly
- **Description Merging**: Combines multiple description fields intelligently
- **European Number Formats**: Handles comma decimal separators (1.234,56)

### 🛠️ Advanced Features
- **CSV Structure Analysis**: Preview and analyze your input files
- **Column Mapping Debug**: Visual representation of data extraction
- **Processing Steps Monitor**: Real-time conversion progress
- **Error Handling**: Detailed logging and recovery mechanisms
- **Data Validation**: Ensures data integrity throughout conversion

### 📈 Analytics & Debugging
- **Processing Summary**: Success rates and data loss analysis
- **Row Count Tracking**: Input vs output comparison
- **Bank-Specific Info**: Processing rules for each bank
- **Console Logging**: Detailed debugging information

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Modern web browser with JavaScript enabled

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd bank-statement-converter
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Start the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Open your browser**
   Navigate to \`http://localhost:3000\`

## 📝 Usage Guide

### Basic Conversion

1. **Select Your Bank**
   - Choose from the dropdown menu
   - Each bank has specific processing rules

2. **Upload CSV File**
   - Drag and drop or click to select
   - Supports .csv and .txt files

3. **Convert Statement**
   - Click "Convert Statement" button
   - Monitor real-time processing steps

4. **Download Results**
   - Review the converted data preview
   - Download standardized CSV file

### Bank-Specific Instructions

#### 🔵 Postbank
- **Input Format**: German CSV with semicolon separators
- **Date Format**: D.M.YYYY (e.g., 2.5.2025)
- **Processing**: Skips 8 header rows, removes 1 footer row
- **Columns**: 
  - Date: Column A
  - Description: Columns C-O (merged)
  - D-Unit: Column P
  - C-Unit: Column Q

#### 🔴 American Express
- **Input Format**: German Amex activity export
- **Date Format**: DD/MM/YYYY (e.g., 02/01/2025)
- **Processing**: Handles European number formats
- **Columns**:
  - Date: Column A (Datum)
  - Description: Column B (Beschreibung) + Column G
  - Amount: Column E (Betrag) - Positive→C-Unit, Negative→D-Unit

#### 🟣 Revolut
- **Input Format**: Standard Revolut CSV export
- **Date Format**: YYYY-MM-DD with time (time removed)
- **Processing**: Extracts date portion only
- **Columns**:
  - Date: Column C
  - Description: Column E
  - Amount: Column F - Positive→C-Unit, Negative→D-Unit

## 📋 Output Format

The standardized CSV output contains these columns:

| Column | Description | Example |
|--------|-------------|---------|
| Date | YYYY-MM-DD format | 2025-01-15 |
| Category | Transaction category | (empty) |
| Description | Transaction description | "ROSSMANN BERLIN" |
| Reference No. | Reference number | (empty) |
| QTY | Quantity | (empty) |
| D- Unit | Debit amount (money in) | 1250.00 |
| C- Unit | Credit amount (money out) | 45.67 |

## 🔧 Technical Details

### Architecture
- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Processing**: Client-side CSV parsing and conversion
- **State Management**: React hooks (useState, useEffect)

### Key Components
- **Bank Processors**: Custom logic for each bank format
- **CSV Parser**: Handles various separators and encodings
- **Date Converter**: Multi-format date parsing
- **Number Parser**: European number format support
- **Validation Engine**: Data integrity checks

### Processing Pipeline
1. **File Upload** → CSV parsing with separator detection
2. **Header Removal** → Bank-specific row skipping
3. **Data Processing** → Date conversion, description merging
4. **Amount Mapping** → Debit/Credit categorization
5. **Validation** → Data integrity checks
6. **Output Generation** → Standardized CSV format

## 🐛 Troubleshooting

### Common Issues

#### Low Processing Success Rate
- **Cause**: Date format mismatch or strict validation
- **Solution**: Check Column Mapping Analysis section
- **Debug**: Enable browser console for detailed logs

#### Missing Transactions
- **Cause**: Empty required fields or parsing errors
- **Solution**: Review CSV Structure Preview
- **Fix**: Ensure proper file encoding (UTF-8)

#### Date Conversion Errors
- **Cause**: Unexpected date format in source file
- **Solution**: Verify bank-specific date format requirements
- **Workaround**: Manual date format adjustment

#### Amount Categorization Issues
- **Cause**: Incorrect positive/negative detection
- **Solution**: Check bank-specific amount processing rules
- **Debug**: Review Processing Steps for amount mapping

### Debug Tools

1. **Column Mapping Analysis**: Visual column-to-field mapping
2. **CSV Structure Preview**: Raw data inspection
3. **Processing Steps Monitor**: Real-time conversion tracking
4. **Browser Console**: Detailed processing logs
5. **Processing Summary**: Success rate analysis

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch: \`git checkout -b feature-name\`
3. Make your changes
4. Test thoroughly with different bank formats
5. Submit a pull request

### Adding New Banks
1. Create processor in \`processors/[bank]-processor.ts\`
2. Add configuration to \`config/bank-configs.ts\`
3. Update bank selection dropdown
4. Add bank-specific processing steps
5. Test with real bank data

### Code Style
- TypeScript for type safety
- ESLint + Prettier for formatting
- Functional components with hooks
- Comprehensive error handling

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

### Getting Help
- **Issues**: Create a GitHub issue with detailed description
- **Questions**: Check existing issues or start a discussion
- **Bug Reports**: Include sample data (anonymized) and error logs

### Reporting Bugs
Please include:
- Bank type and file format
- Input/output row counts
- Browser console errors
- Sample data (remove sensitive information)

## 🔄 Version History

### Latest Version
- ✅ Fixed American Express row count mismatch
- ✅ Enhanced date conversion for German formats
- ✅ Improved error handling and recovery
- ✅ Added comprehensive debugging tools
- ✅ Column mapping analysis restoration

### Previous Versions
- Multi-bank support implementation
- Processing steps monitoring
- CSV structure analysis
- European number format support

## 🎯 Roadmap

### Upcoming Features
- [ ] Additional bank support (Deutsche Bank, Commerzbank)
- [ ] Batch file processing
- [ ] Custom column mapping interface
- [ ] Export format options (Excel, JSON)
- [ ] Transaction categorization rules
- [ ] Data validation presets

### Performance Improvements
- [ ] Large file handling optimization
- [ ] Memory usage optimization
- [ ] Processing speed enhancements
- [ ] Background processing support

---

**Made with ❤️ for better financial data management**
