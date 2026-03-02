import os
import logging
import tempfile
from typing import Optional

logger = logging.getLogger(__name__)

_model = None


def _get_model():
    global _model
    if _model is None:
        try:
            from faster_whisper import WhisperModel
            logger.info("Loading faster-whisper tiny model...")
            _model = WhisperModel("tiny", compute_type="int8")
            logger.info("Whisper model loaded successfully")
        except ImportError:
            logger.error("faster-whisper not installed. Run: pip install faster-whisper")
            raise
    return _model


def transcribe_audio(file_path: str) -> str:
    """Transcribe an audio file using faster-whisper."""
    model = _get_model()
    segments, info = model.transcribe(file_path, beam_size=5)
    
    transcript_parts = []
    for segment in segments:
        transcript_parts.append(segment.text.strip())

    transcript = " ".join(transcript_parts)
    logger.info(f"Transcribed {info.duration:.1f}s audio, language: {info.language}")
    return transcript


async def transcribe_upload(file_content: bytes, filename: str = "audio.webm") -> str:
    """Transcribe uploaded audio bytes."""
    suffix = os.path.splitext(filename)[1] or ".webm"
    
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp.write(file_content)
        tmp_path = tmp.name

    try:
        return transcribe_audio(tmp_path)
    finally:
        try:
            os.unlink(tmp_path)
        except OSError:
            pass
