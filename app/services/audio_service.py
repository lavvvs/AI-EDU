import os
import logging
import yt_dlp
from faster_whisper import WhisperModel

logger = logging.getLogger(__name__)

# Local path for temporary files
TEMP_DIR = "temp_audio"
if not os.path.exists(TEMP_DIR):
    os.makedirs(TEMP_DIR)

# Initialize Whisper model (base is fast and decently accurate)
# Set device to "cpu" or "cuda" depending on hardware
_model = None

def _get_whisper_model():
    global _model
    if _model is None:
        logger.info("Loading Faster-Whisper model (base)...")
        _model = WhisperModel("base", device="cpu", compute_type="int8")
    return _model

def download_audio(url: str) -> str:
    """Download audio from YouTube and return the file path."""
    import uuid
    filename = str(uuid.uuid4())
    output_path = os.path.join(TEMP_DIR, filename)

    # Check for cookies.txt in the project root
    cookies_path = "cookies.txt"
    ydl_cookies = cookies_path if os.path.exists(cookies_path) else None
    if ydl_cookies:
        logger.info(f"Using cookies from: {ydl_cookies}")

    ydl_opts = {
        'format': 'bestaudio/best',
        'cookiefile': ydl_cookies,
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }],
        'outtmpl': output_path,
        'quiet': True,
        'no_warnings': True,
        'nocheckcertificate': True,
        'user_agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'referer': 'https://www.youtube.com/',
        'extractor_args': {
            'youtube': {
                'player_client': ['android', 'ios', 'web'],
                'skip': ['dash', 'hls']
            }
        },
        'http_headers': {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'Accept-Language': 'en-US,en;q=0.9',
            'Sec-Ch-Ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
            'Sec-Ch-Ua-Mobile': '?0',
            'Sec-Ch-Ua-Platform': '"Windows"',
        }
    }

    logger.info(f"Downloading audio from: {url}")
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([url])
    
    # yt-dlp might add .mp3 extension
    final_path = output_path + ".mp3"
    if os.path.exists(final_path):
        return final_path
    return output_path

def transcribe_audio(file_path: str) -> str:
    """Transcribe an audio file using Faster-Whisper."""
    model = _get_whisper_model()
    logger.info(f"Transcribing: {file_path}")
    
    segments, info = model.transcribe(file_path, beam_size=5)
    
    transcript = ""
    for segment in segments:
        transcript += f"{segment.text} "
        
    return transcript.strip()

def process_youtube_audio(url: str) -> str:
    """Download and transcribe YouTube audio."""
    audio_path = None
    try:
        audio_path = download_audio(url)
        transcript = transcribe_audio(audio_path)
        return transcript
    finally:
        if audio_path and os.path.exists(audio_path):
            try:
                os.remove(audio_path)
                logger.info(f"Cleaned up audio file: {audio_path}")
            except Exception as e:
                logger.warning(f"Failed to cleanup {audio_path}: {e}")
