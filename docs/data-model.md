# Data Model Specification

## ER Diagram Overview

The relational model separates core metadata from source-specific attributes while strictly preserving raw user text.

```
   +-------------------+          +-------------------+
   |      sources      | 1      * |      reviews      |
   +-------------------+----------+-------------------+
   | id (PK)           |          | id (PK)           |
   | slug (UQ)         |          | source_id (FK)    |
   | name              |          | external_id (IDX) |
   | description       |          | title             |
   | base_url          |          | content (Raw Text)|
   | enabled           |          | author            |
   +-------------------+          | rating            |
                                  | source_url        |
                                  | content_hash(IDX) |
                                  | is_duplicate      |
                                  | is_retrieval_rel  |
                                  | relevance_score   |
                                  | retrieval_topic   |
                                  | relevance_reason  |
                                  | is_demo           |
                                  +---------+---------+
                                            |
         +----------------------------------+----------------------------------+
         | 1                              1 | 1                              1 | 1
+--------v----------+              +--------v----------+              +--------v----------+
|  reddit_metadata  |              | youtube_metadata  |              | community_metadata|
+-------------------+              +-------------------+              +-------------------+
| review_id (FK, UQ)|              | review_id (FK, UQ)|              | review_id (FK, UQ)|
| subreddit         |              | video_id          |              | discussion_id     |
| post_type         |              | video_title       |              | reply_count       |
| post_id           |              | comment_id        |              +-------------------+
| parent_id         |              | like_count        |
| score             |              +-------------------+
+-------------------+
```

## Schema Details

### 1. `sources`
Stores configured feedback channels (Google Play, Apple App Store, Reddit, Google Community, YouTube, Forums).

### 2. `reviews`
Primary entity storing normalized user reviews and AI relevance classification output.

### 3. Source-Specific Metadata Tables
`reddit_metadata`, `youtube_metadata`, `community_metadata` preserve contextual attributes like subreddit names, video titles, vote/like counts, and thread reply metrics.

### 4. `collection_jobs`
Tracks execution logs, query parameters, items found, duplicates skipped, items classified, and error logs for every collector run.
