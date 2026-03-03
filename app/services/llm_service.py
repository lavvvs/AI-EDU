import os
import logging
import time
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

# System Prompt
SYSTEM_PROMPT = """You are an AI educational assistant. You must answer ONLY using the provided context.
If the answer is not contained in the context, respond exactly with:
"I don't have enough information in the provided material to answer that question."
Do not make up information. Do not use external knowledge. Be concise and accurate."""

# Initialize Providers
gemini_model = None
gemini_model_fallback = None
hf_client = None

# Try Initialize Gemini (Priority: 2.5/2.0/1.5 Flash)
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    try:
        genai.configure(api_key=GEMINI_API_KEY)
        # Using 2.0-flash as primary and 2.5-flash as fallback
        gemini_model = genai.GenerativeModel('gemini-2.0-flash')
        gemini_model_fallback = genai.GenerativeModel('gemini-2.5-flash')
        logger.info("Gemini models initialized.")
    except Exception as e:
        logger.warning(f"Failed to initialize Gemini models: {e}")

# Try Initialize Hugging Face (Fallback)
HUGGINGFACEHUB_API_TOKEN = os.getenv("HUGGINGFACEHUB_API_TOKEN")
if HUGGINGFACEHUB_API_TOKEN:
    try:
        from huggingface_hub import InferenceClient
        # Using a highly available model with timeout to avoid indefinite hanging
        hf_client = InferenceClient(model="HuggingFaceH4/zephyr-7b-beta", token=HUGGINGFACEHUB_API_TOKEN, timeout=20)
        logger.info("Hugging Face initialized as backup LLM.")
    except Exception as e:
        logger.warning(f"Failed to initialize Hugging Face: {e}")

def generate_answer_with_retry(model, prompt, retries=2):
    """Generate content with backoff specifically for 429 quota errors."""
    for i in range(retries):
        try:
            response = model.generate_content(prompt)
            if response and hasattr(response, 'text'):
                return response.text.strip()
            # Handle empty/blocked response
            return "The AI generated an empty response. Please rephrase your question."
        except Exception as e:
            err_msg = str(e)
            if "429" in err_msg and i < retries - 1:
                wait = (i + 1) * 3
                logger.info(f"Gemini quota hit, waiting {wait}s...")
                time.sleep(wait)
                continue
            raise e
    return None

def generate_answer(context: str, question: str) -> str:
    """Intelligent multi-provider generation with transparent error reporting."""
    prompt = f"{SYSTEM_PROMPT}\n\nContext:\n{context}\n\nQuestion: {question}\n\nAnswer strictly based on the context above."

    # 1. Primary Attempt: Gemini
    if gemini_model:
        try:
            return generate_answer_with_retry(gemini_model, prompt)
        except Exception as e:
            logger.error(f"Gemini (primary) failed: {e}")
            # Try 2.0-flash if 1.5 fails/unavailable
            try:
                if "429" not in str(e): # If it's not quota, maybe model choice error
                    return generate_answer_with_retry(gemini_model_fallback, prompt)
            except: pass

    # 2. Secondary Attempt: Hugging Face (Fallback)
    if hf_client:
        try:
            system_content = f"{SYSTEM_PROMPT}\n\nContext:\n{context}"
            # Attempt with chat completion
            response = hf_client.chat_completion(
                messages=[
                    {"role": "system", "content": system_content},
                    {"role": "user", "content": question}
                ],
                max_tokens=800,
                temperature=0.3,
            )
            return response.choices[0].message.content.strip()
        except Exception as hf_e:
            logger.error(f"Hugging Face fallback failed: {hf_e}")
            # Detect common failure modes to help the user
            hf_msg = str(hf_e).lower()
            if "401" in hf_msg or "403" in hf_msg or "invalid user token" in hf_msg:
                return "Gemini is at its free limit, and your Hugging Face backup token is INVALID. Please update your tokens in .env."
            if "429" in hf_msg:
                return "Both AI services (Gemini & Hugging Face) are currently at their rate limits. Please wait 60 seconds."

    # 3. Final Error Reporting (Everything failed)
    if not os.getenv("GEMINI_API_KEY") and not os.getenv("HUGGINGFACEHUB_API_TOKEN"):
        return "No AI API keys found. Please add GEMINI_API_KEY or HUGGINGFACEHUB_API_TOKEN to your .env file."
    
    return "The AI engines are currently overloaded. Please try again in 1 minute."

def generate_teacher_answer(question: str) -> str:
    """Specialized educational assistant answering general knowledge questions as a teacher."""
    teacher_prompt = (
        "You are an expert, encouraging, and patient teacher. "
        "Your goal is to help students understand complex topics in Physics, Chemistry, Biology, Maths, and English. "
        "Provide clear explanations, use analogies where helpful, and encourage the student. "
        "Keep the tone academic yet accessible. If a question is outside these subjects, "
        "politely guide the student back to their studies.\n\n"
        f"Student Question: {question}\n\n"
        "Teacher Response:"
    )

    # 1. Primary Attempt: Gemini (primary model)
    if gemini_model:
        try:
            return generate_answer_with_retry(gemini_model, teacher_prompt)
        except Exception as e:
            logger.error(f"Gemini teacher (primary) failed: {e}")
            # Try fallback Gemini model if primary hit quota
            if gemini_model_fallback:
                try:
                    return generate_answer_with_retry(gemini_model_fallback, teacher_prompt)
                except Exception as e2:
                    logger.error(f"Gemini teacher (fallback) failed: {e2}")

    # 2. Secondary Attempt: Hugging Face
    if hf_client:
        try:
            response = hf_client.chat_completion(
                messages=[{"role": "user", "content": teacher_prompt}],
                max_tokens=1000,
                temperature=0.7,
            )
            return response.choices[0].message.content.strip()
        except Exception as hf_e:
            logger.error(f"Teacher HF fallback failed: {hf_e}")

    # 3. Log why we're returning the break message
    logger.error(f"Teacher answer: ALL providers failed. gemini_model={gemini_model is not None}, "
                 f"gemini_fallback={gemini_model_fallback is not None}, hf_client={hf_client is not None}, "
                 f"GEMINI_KEY_SET={bool(os.getenv('GEMINI_API_KEY'))}, HF_KEY_SET={bool(os.getenv('HUGGINGFACEHUB_API_TOKEN'))}")

    return "I'm currently taking a short break. Please try asking your question again in a moment!"

def generate_summary(text: str) -> str:
    """Generate a detailed educational summary using various model fallbacks to avoid quota issues."""
    summary_prompt = (
        "Provide a comprehensive summary of the following material. "
        "Highlight key concepts for a student. Use structured paragraphs.\n\n"
        "MATERIAL:\n"
    )
    
    # Try multiple Gemini versions specifically for summaries to leverage different quotas
    for model_name in ['gemini-2.0-flash-lite', 'gemini-2.0-flash', 'gemini-2.5-flash']:
        try:
            m = genai.GenerativeModel(model_name)
            return generate_answer_with_retry(m, f"{summary_prompt}\n{text[:15000]}", retries=1)
        except Exception as e:
            logger.info(f"Summary fallback for {model_name} failed, trying next...")
            continue

    # Try HF Fallback
    if hf_client:
        try:
            response = hf_client.chat_completion(
                messages=[{"role": "user", "content": f"{summary_prompt}\n{text[:6000]}"}],
                max_tokens=800,
            )
            return response.choices[0].message.content.strip()
        except: pass

    # Raw fallback
    return text[:1500] + "..." if text else "Analysis complete (summary generation deferred due to AI quota)."
