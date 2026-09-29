import pytest
from app.ai.gemini import GeminiProvider

@pytest.mark.asyncio
async def test_heuristic_fallback_classification():
    provider = GeminiProvider(api_key="")  # Unconfigured API key triggers heuristic
    
    # Retrieval related content
    res_related = await provider.classify_relevance("I cannot find old photos from my vacation in Hawaii using search.")
    assert res_related is not None
    assert res_related["is_retrieval_related"] is True
    assert res_related["relevance_score"] > 0.4
    assert res_related["retrieval_topic"] in ["old_photo_retrieval", "event_search", "search_query_problem"]

    # Non retrieval related content
    res_non_related = await provider.classify_relevance("App crashes every time I open settings.")
    assert res_non_related is not None
    assert res_non_related["is_retrieval_related"] is False
    assert res_non_related["retrieval_topic"] == "not_retrieval_related"

def test_parse_json_response():
    provider = GeminiProvider(api_key="mock_key")
    raw_json = """```json
    {
        "is_retrieval_related": true,
        "relevance_score": 0.95,
        "retrieval_topic": "finding_specific_photo",
        "reason": "User describes inability to locate passport photo"
    }
    ```"""
    parsed = provider._parse_json_response(raw_json)
    assert parsed["is_retrieval_related"] is True
    assert parsed["relevance_score"] == 0.95
    assert parsed["retrieval_topic"] == "finding_specific_photo"
