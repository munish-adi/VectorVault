import requests
import faiss
import numpy as np
import time

# Put your actual token here, idiot. Keep the "Bearer " part.
HF_TOKEN = "Bearer YOUR_HUGGING_FACE_TOKEN_HERE" 
API_URL = "https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-mpnet-base-v2"
headers = {"Authorization": HF_TOKEN}

vector_index = None
stored_data = None

def get_embeddings_from_api(texts):
    print(f"Sending {len(texts)} rows to the Hugging Face cloud...")
    
    # We have to chunk this into batches. 
    # If you throw 10,000 rows at the free API all at once, it will block you and laugh.
    batch_size = 100 
    all_embeddings = []
    
    for i in range(0, len(texts), batch_size):
        batch = texts[i:i+batch_size]
        
        # We tell the API to wait and load the model if it's currently asleep
        response = requests.post(API_URL, headers=headers, json={"inputs": batch, "options": {"wait_for_model": True}})
        
        if response.status_code != 200:
            raise Exception(f"Hugging Face threw a fit: {response.text}")
            
        all_embeddings.extend(response.json())
        
        # Don't spam the free tier too fast, or you'll get rate-limited
        print(f"Processed batch {i} to {i+len(batch)}...")
        time.sleep(1) 
        
    return all_embeddings

def build_faiss_index(df):
    global vector_index, stored_data
    texts = df['search_text'].tolist()
    
    # Call the cloud API instead of your crying CPU
    embeddings = get_embeddings_from_api(texts)
    
    # FAISS still requires float32 numpy arrays
    embeddings = np.array(embeddings).astype("float32")
    
    # Build the local vector index with the cloud-generated embeddings
    dimension = embeddings.shape[1]
    vector_index = faiss.IndexFlatL2(dimension)
    vector_index.add(embeddings)
    
    stored_data = df.to_dict('records')
    
    return len(texts)