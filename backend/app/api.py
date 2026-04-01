from fastapi import APIRouter, UploadFile, File, HTTPException
import shutil
import os
from app.data_utils import process_uploaded_file
from app.ml_pipeline import build_faiss_index

router = APIRouter()

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")

@router.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    if not file.filename.endswith(('.xlsx', '.xls', '.csv')):
        raise HTTPException(status_code=400, detail="Only Excel or CSV files are allowed.")
    
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    
    try:
        # 1. Save the file temporarily
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # 2. Process the data (Pandas)
        df = process_uploaded_file(file_path)
        
        # 3. Build the AI Vector Index (FAISS)
        num_records = build_faiss_index(df)
        
        # 4. Delete the temporary file so your Fedora drive doesn't fill up with garbage
        os.remove(file_path)
        
    except Exception as e:
        # If something breaks, clean up the file anyway and throw the error
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=500, detail=f"Pipeline failed: {str(e)}")
    
    return {
        "filename": file.filename,
        "message": f"Successfully embedded and indexed {num_records} rows. The brain is ready."
    }