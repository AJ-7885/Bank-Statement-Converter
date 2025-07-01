import csv
import requests
from datetime import datetime

def fetch_and_analyze_amex_data():
    """Fetch and analyze the American Express CSV data to identify processing issues"""
    
    # Fetch the American Express data
    amex_url = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/activity-REtDnwOPsQMKz1iyyRJhXrrbkwrnvE.csv"
    
    try:
        response = requests.get(amex_url)
        response.raise_for_status()
        
        # Parse CSV content
        csv_content = response.text
        lines = csv_content.strip().split('\n')
        
        print("=== AMERICAN EXPRESS DATA ANALYSIS ===")
        print(f"Total lines in file: {len(lines)}")
        
        # Parse CSV manually to handle potential issues
        rows = []
        for i, line in enumerate(lines):
            # Split by comma, handling quoted fields
            row = []
            current_field = ""
            in_quotes = False
            
            for char in line:
                if char == '"':
                    in_quotes = not in_quotes
                elif char == ',' and not in_quotes:
                    row.append(current_field.strip())
                    current_field = ""
                else:
                    current_field += char
            
            # Add the last field
            row.append(current_field.strip())
            rows.append(row)
        
        print(f"Parsed rows: {len(rows)}")
        
        # Analyze header
        if rows:
            header = rows[0]
            print(f"\nHeader row ({len(header)} columns):")
            for i, col in enumerate(header):
                print(f"  {i}: '{col}'")
        
        # Analyze first few data rows
        print(f"\nFirst 5 data rows analysis:")
        for i in range(1, min(6, len(rows))):
            row = rows[i]
            print(f"\nRow {i} ({len(row)} columns):")
            for j, cell in enumerate(row):
                if j < 10:  # Show first 10 columns
                    print(f"  [{j}] '{cell}'")
        
        # Analyze date column specifically
        print(f"\n=== DATE ANALYSIS ===")
        date_column = 0  # Column A
        date_formats_found = {}
        empty_dates = 0
        valid_dates = 0
        
        for i in range(1, len(rows)):  # Skip header
            if i >= len(rows):
                break
                
            row = rows[i]
            if len(row) > date_column:
                date_str = row[date_column].strip()
                
                if not date_str:
                    empty_dates += 1
                else:
                    # Try to identify date format
                    if '/' in date_str:
                        parts = date_str.split('/')
                        if len(parts) == 3:
                            format_key = f"{len(parts[0])}/{len(parts[1])}/{len(parts[2])}"
                            date_formats_found[format_key] = date_formats_found.get(format_key, 0) + 1
                            valid_dates += 1
                    elif '.' in date_str:
                        parts = date_str.split('.')
                        if len(parts) == 3:
                            format_key = f"{len(parts[0])}.{len(parts[1])}.{len(parts[2])}"
                            date_formats_found[format_key] = date_formats_found.get(format_key, 0) + 1
                            valid_dates += 1
        
        print(f"Empty dates: {empty_dates}")
        print(f"Valid dates: {valid_dates}")
        print(f"Date formats found: {date_formats_found}")
        
        # Analyze amount column
        print(f"\n=== AMOUNT ANALYSIS ===")
        amount_column = 4  # Column E (Betrag)
        empty_amounts = 0
        valid_amounts = 0
        negative_amounts = 0
        positive_amounts = 0
        amount_samples = []
        
        for i in range(1, min(50, len(rows))):  # Check first 50 rows
            row = rows[i]
            if len(row) > amount_column:
                amount_str = row[amount_column].strip()
                
                if not amount_str or amount_str == '0' or amount_str == '0,00':
                    empty_amounts += 1
                else:
                    valid_amounts += 1
                    amount_samples.append(amount_str)
                    
                    if '-' in amount_str or amount_str.startswith('('):
                        negative_amounts += 1
                    else:
                        positive_amounts += 1
        
        print(f"Empty/zero amounts: {empty_amounts}")
        print(f"Valid amounts: {valid_amounts}")
        print(f"Negative amounts: {negative_amounts}")
        print(f"Positive amounts: {positive_amounts}")
        print(f"Amount samples: {amount_samples[:10]}")
        
        # Analyze description columns
        print(f"\n=== DESCRIPTION ANALYSIS ===")
        desc_columns = [1, 6, 7]  # B, G, H
        
        for col_idx in desc_columns:
            non_empty = 0
            samples = []
            
            for i in range(1, min(20, len(rows))):
                row = rows[i]
                if len(row) > col_idx:
                    desc = row[col_idx].strip()
                    if desc:
                        non_empty += 1
                        if len(samples) < 5:
                            samples.append(desc)
            
            print(f"Column {col_idx}: {non_empty} non-empty, samples: {samples}")
        
        # Check for completely empty rows
        print(f"\n=== ROW COMPLETENESS ANALYSIS ===")
        completely_empty = 0
        mostly_empty = 0
        has_data = 0
        
        for i in range(1, len(rows)):
            row = rows[i]
            non_empty_cells = sum(1 for cell in row if cell.strip())
            
            if non_empty_cells == 0:
                completely_empty += 1
            elif non_empty_cells <= 2:
                mostly_empty += 1
            else:
                has_data += 1
        
        print(f"Completely empty rows: {completely_empty}")
        print(f"Mostly empty rows (≤2 cells): {mostly_empty}")
        print(f"Rows with substantial data: {has_data}")
        
        # Simulate current processing logic
        print(f"\n=== SIMULATING CURRENT PROCESSING LOGIC ===")
        processed = 0
        skipped_no_date = 0
        skipped_no_data = 0
        skipped_other = 0
        
        for i in range(1, len(rows)):  # Skip header
            row = rows[i]
            
            if len(row) < 2:
                skipped_other += 1
                continue
            
            # Check date
            date_str = row[0].strip() if len(row) > 0 else ""
            has_valid_date = bool(date_str and ('/' in date_str or '.' in date_str))
            
            # Check description
            desc = ""
            if len(row) > 1:
                desc = row[1].strip()
            if not desc and len(row) > 6:
                desc = row[6].strip()
            
            # Check amount
            amount_str = row[4].strip() if len(row) > 4 else ""
            has_amount = bool(amount_str and amount_str != '0' and amount_str != '0,00')
            
            # Current logic: needs date OR description OR amount
            if has_valid_date or desc or has_amount:
                processed += 1
            elif not has_valid_date:
                skipped_no_date += 1
            else:
                skipped_no_data += 1
        
        print(f"Would process: {processed}")
        print(f"Would skip (no date): {skipped_no_date}")
        print(f"Would skip (no data): {skipped_no_data}")
        print(f"Would skip (other): {skipped_other}")
        
        return {
            'total_rows': len(rows),
            'data_rows': len(rows) - 1,
            'date_formats': date_formats_found,
            'processing_estimate': processed
        }
        
    except Exception as e:
        print(f"Error analyzing Amex data: {e}")
        return None

# Run the analysis
result = fetch_and_analyze_amex_data()
