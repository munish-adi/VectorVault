# VectorVault 🧠⚡

VectorVault is a decoupled, full-stack semantic search application. It allows users to upload raw product datasets (Excel/CSV), dynamically embeds the text using Hugging Face's transformer models, and provides a blazing-fast, visually intuitive search interface to find semantically related products.

## 🏗️ Architecture & Tech Stack

* **Frontend:** React, Vite, Tailwind CSS. (Features drag-and-drop file upload, live background task polling, and responsive UI).
* **Backend:** FastAPI (Python). Handles asynchronous background processing to prevent browser timeouts during heavy ML workloads.
* **Machine Learning:** `sentence-transformers` (`all-mpnet-base-v2`) via Hugging Face Inference API for dense vector generation.
* **Vector Storage:** FAISS (Facebook AI Similarity Search) running an in-memory `IndexFlatL2` index for sub-millisecond similarity matching.
* **Data Processing:** Pandas (for automated text normalization and unit standardization, e.g., converting "1/4 inch" variations).

## 🚀 Quick Start (Local Development)

### 1. The Brain (Backend)
Navigate to the `backend` directory, set up your virtual environment, and start the FastAPI server:
\`\`\`bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
\`\`\`
*Note: Ensure you add your Hugging Face API token in `ml_pipeline.py` before running.*

### 2. The Face (Frontend)
Open a new terminal, navigate to the `frontend` directory, and start the Vite development server:
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

Open `http://localhost:5173` in your browser. Drag in a CSV, let the backend chew through the embeddings, and start searching.
