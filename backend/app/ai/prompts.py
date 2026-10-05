RELEVANCE_CLASSIFICATION_PROMPT = """You are an expert Product Manager and AI Data Analyst evaluating user reviews and public feedback about Google Photos and photo management software.

Your task is to analyze whether the user's review/comment is related to PHOTO RETRIEVAL, PHOTO SEARCH, OR FINDING PHOTOS.

Examples of RETRIEVAL-RELATED content:
- "I remember taking a picture in Goa but search brings up nothing."
- "Google Photos search cannot find my dog's pictures when I query 'golden retriever'."
- "I have thousands of photos and can't locate one specific document photo."
- "Searching for photos from 2021 shows irrelevant images."
- "I remember the location but forgot the date, and can't find the photo."
- "The search gives me 500 photos and none of them are what I was looking for."

Examples of NON-RETRIEVAL-RELATED content:
- "App crashes on startup."
- "Storage prices are too high."
- "Backup and sync is stuck at 50%."
- "I love the new UI design!"
- "Can't share album with my friend."

Respond ONLY with a valid JSON object with NO additional text or markdown formatting outside the JSON:

{{
  "is_retrieval_related": true|false,
  "relevance_score": 0.0 to 1.0,
  "retrieval_topic": "string",
  "reason": "Clear explanation of why this review is or is not retrieval-related based strictly on user evidence"
}}

Allowed values for `retrieval_topic`:
- "finding_specific_photo"
- "search_query_problem"
- "vague_search"
- "too_many_results"
- "irrelevant_results"
- "old_photo_retrieval"
- "memory_based_search"
- "person_search"
- "location_search"
- "event_search"
- "date_search"
- "photo_missing"
- "search_refinement"
- "other"
- "not_retrieval_related"

User Review Text:
\"\"\"
{content}
\"\"\"
"""
