from app.services.deduplication_service import DeduplicationService

def test_generate_content_hash_deterministic():
    hash1 = DeduplicationService.generate_content_hash("reddit", "p123", "Search for photos failed")
    hash2 = DeduplicationService.generate_content_hash("reddit", "p123", "Search for photos failed")
    assert hash1 == hash2
    assert len(hash1) == 64

def test_generate_content_hash_whitespace_normalization():
    hash1 = DeduplicationService.generate_content_hash("reddit", "p123", "Search  for   photos failed ")
    hash2 = DeduplicationService.generate_content_hash("REDDIT", "P123", "search for photos failed")
    assert hash1 == hash2
