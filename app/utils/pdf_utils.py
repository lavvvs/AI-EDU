from langchain.text_splitter import CharacterTextSplitter
from PyPDF2 import PdfReader

def extract_and_chunk_pdf(file_path: str):
    pdf_reader = PdfReader(file_path)
    text = ""
    for page in pdf_reader.pages:
        page_text = page.extract_text() or ""
        text += page_text + "\n"
    splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
    return splitter.split_text(text)
