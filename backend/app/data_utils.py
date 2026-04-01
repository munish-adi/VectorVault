import pandas as pd
import re

def normalize_text(text):
    if not isinstance(text, str):
        return ""
    
    text = text.lower()
    
    # Fix the classic "inch" formatting nightmare so the AI doesn't get confused
    text = re.sub(r'(\d+)\s*inch', r'\1-inch', text)
    text = re.sub(r'(\d+)/(\d+)\s*inch', r'\1/\2-inch', text)
    
    # Strip out weird extra whitespace
    text = " ".join(text.split())
    
    return text

def process_uploaded_file(file_path):
    # Read the file based on what you uploaded
    if file_path.endswith('.csv'):
        df = pd.read_csv(file_path)
    else:
        df = pd.read_excel(file_path)
    
    # Idiot-proofing: We need a column to search. 
    # If you have a column literally named 'description', we use it. 
    # Otherwise, we just mash every single column together into a giant string.
    cols_lower = df.columns.str.lower()
    if 'description' in cols_lower:
        text_col = df.columns[cols_lower == 'description'][0]
        df['search_text'] = df[text_col].apply(normalize_text)
    else:
        df['search_text'] = df.apply(lambda row: ' '.join(row.dropna().astype(str)), axis=1).apply(normalize_text)
    
    # Ensure every row has a unique ID
    if 'id' not in cols_lower:
        df['id'] = range(1, len(df) + 1)
        
    return df