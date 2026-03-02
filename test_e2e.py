"""End-to-end API test: Login -> Upload PDF -> QA"""
import requests
import json
import os

BASE = "http://localhost:8000"

# 1. Login
print("1. Logging in...")
login_resp = requests.post(f"{BASE}/auth/login", data={
    "username": "final_v3@example.com",
    "password": "Password123!"
})
print(f"   Status: {login_resp.status_code}")
if login_resp.status_code != 200:
    print(f"   Error: {login_resp.text}")
    exit(1)
token = login_resp.json()["access_token"]
print(f"   Token: {token[:20]}...")
headers = {"Authorization": f"Bearer {token}"}

# 2. Create a test PDF with real content
print("\n2. Creating test PDF...")
try:
    import fitz  # pymupdf
    doc = fitz.open()
    page = doc.new_page()
    text = """Machine Learning in Education

Machine learning is a branch of artificial intelligence that focuses on building 
applications that learn from data and improve their accuracy over time without 
being programmed to do so. In the context of education, machine learning can 
personalize learning experiences, predict student performance, and automate 
administrative tasks.

Key Applications:
1. Adaptive Learning Systems: These systems adjust the difficulty and content 
   based on student performance in real-time.
2. Automated Grading: ML algorithms can grade essays and short answers with 
   increasing accuracy.
3. Student Retention: Predictive models can identify students at risk of 
   dropping out and suggest interventions.
4. Content Recommendation: Similar to Netflix recommendations, educational 
   platforms use ML to suggest relevant courses and materials.

Challenges include data privacy concerns, algorithmic bias, and the need for 
large datasets to train effective models. Despite these challenges, the 
integration of machine learning in education continues to grow rapidly."""
    
    page.insert_text((50, 72), text, fontsize=11)
    pdf_path = os.path.join(os.path.dirname(__file__), "test_doc.pdf")
    doc.save(pdf_path)
    doc.close()
    print(f"   Created: {pdf_path}")
except Exception as e:
    print(f"   Error creating PDF: {e}")
    exit(1)

# 3. Upload PDF
print("\n3. Uploading PDF to /pdf/process...")
with open(pdf_path, "rb") as f:
    upload_resp = requests.post(
        f"{BASE}/pdf/process",
        headers=headers,
        files={"file": ("test_doc.pdf", f, "application/pdf")},
        timeout=120
    )
print(f"   Status: {upload_resp.status_code}")
if upload_resp.status_code != 200:
    print(f"   Error: {upload_resp.text}")
    exit(1)

upload_data = upload_resp.json()
print(f"   document_id: {upload_data['document_id']}")
print(f"   chunk_count: {upload_data['chunk_count']}")
print(f"   summary: {upload_data['summary'][:100]}...")

document_id = upload_data["document_id"]

# 4. QA
print("\n4. Asking question via /pdf/qa...")
qa_resp = requests.post(
    f"{BASE}/pdf/qa",
    headers=headers,
    data={"query": "What are the applications of machine learning in education?", "document_id": document_id},
    timeout=120
)
print(f"   Status: {qa_resp.status_code}")
if qa_resp.status_code != 200:
    print(f"   Error: {qa_resp.text}")
    exit(1)

qa_data = qa_resp.json()
print(f"   Answer: {qa_data['answer'][:200]}...")
print(f"   Confidence: {qa_data['confidence']}")
print(f"   Sources: {len(qa_data['sources'])} chunks")
for s in qa_data['sources']:
    print(f"     - score={s['score']} chunk={s['chunk'][:60]}...")

# 5. Cleanup
os.unlink(pdf_path)
print("\n=== ALL TESTS PASSED ===")
