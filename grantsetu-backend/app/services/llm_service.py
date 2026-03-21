"""Single abstraction layer for ALL LLM calls.

Connects to Mistral-7B-Instruct via vLLM on R470 (L4 GPU).
vLLM exposes an OpenAI-compatible API.

NEVER use LLM for budget math or numerical calculations.
LLM is ONLY for: text summarization, structured extraction from PDFs,
eligibility parsing, and natural language generation.
"""

import json
import logging

import httpx

from app.config import settings

logger = logging.getLogger(__name__)

EXTRACTION_SYSTEM_PROMPT = "You are a data extraction assistant for Indian research funding calls."

EXTRACTION_USER_PROMPT = """Given the text of a grant call document, extract the following as JSON:
{{
  "scheme_name": "name of the scheme/program",
  "title": "full title of the call",
  "summary": "2-3 sentence plain-language summary",
  "deadline": "DD/MM/YYYY or null if rolling/open",
  "budget_min": integer in INR or null,
  "budget_max": integer in INR or null,
  "duration_months": integer or null,
  "subject_areas": ["list", "of", "relevant", "fields"],
  "career_stages": ["Early Career" and/or "Mid Career" and/or "Senior"],
  "institution_types": ["Central University", "State University", "Private", "CSIR Lab", "IIT/NIT"],
  "eligibility_summary": "plain language eligibility in 2-3 sentences",
  "age_limit": integer or null
}}
Only return valid JSON. Do not include any text outside the JSON object.
If information is not available in the text, use null.
Budget values should be in INR (not lakhs/crores — convert to full number).

Document text:
{text}"""


async def llm_completion(
    prompt: str,
    system_prompt: str = "You are a helpful assistant for Indian research funding.",
    max_tokens: int = 1024,
    temperature: float = 0.1,
    timeout: float = 30.0,
) -> str | None:
    """Send a completion request to Mistral-7B via vLLM.

    Returns the response text, or None on failure.
    Logs token usage for monitoring.
    """
    try:
        async with httpx.AsyncClient(timeout=timeout) as client:
            response = await client.post(
                f"{settings.VLLM_BASE_URL}/chat/completions",
                json={
                    "model": "mistralai/Mistral-7B-Instruct-v0.3",
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": prompt},
                    ],
                    "max_tokens": max_tokens,
                    "temperature": temperature,
                },
            )
            response.raise_for_status()
            data = response.json()
            result = data["choices"][0]["message"]["content"]

            usage = data.get("usage", {})
            logger.info(
                f"LLM call: {usage.get('prompt_tokens', '?')} prompt, "
                f"{usage.get('completion_tokens', '?')} completion tokens"
            )
            return result
    except Exception as e:
        logger.error(f"LLM call failed: {e}")
        return None


async def extract_grant_fields(raw_text: str) -> dict | None:
    """Extract structured grant data from raw text using LLM.

    Returns a dict with extracted fields, or None if LLM is unavailable.
    """
    if not raw_text or len(raw_text.strip()) < 50:
        return None

    # Truncate very long texts to fit context window
    truncated = raw_text[:8000] if len(raw_text) > 8000 else raw_text

    prompt = EXTRACTION_USER_PROMPT.format(text=truncated)
    result = await llm_completion(
        prompt=prompt,
        system_prompt=EXTRACTION_SYSTEM_PROMPT,
        max_tokens=1024,
        temperature=0.1,
    )

    if not result:
        return None

    # Parse JSON from response
    try:
        # Try to find JSON in the response
        result = result.strip()
        if result.startswith("```"):
            # Remove markdown code block
            result = result.split("```")[1]
            if result.startswith("json"):
                result = result[4:]
        return json.loads(result)
    except json.JSONDecodeError:
        logger.warning(f"Failed to parse LLM response as JSON: {result[:200]}")
        return None


async def generate_summary(text: str) -> str | None:
    """Generate a 2-3 sentence summary of grant description text."""
    if not text or len(text.strip()) < 50:
        return None

    prompt = (
        "Summarize the following Indian research grant call in 2-3 sentences. "
        "Focus on: what the grant funds, who can apply, and key requirements.\n\n"
        f"{text[:4000]}"
    )
    return await llm_completion(prompt=prompt, max_tokens=256, temperature=0.2)
