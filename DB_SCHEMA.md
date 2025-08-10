# SealTalk Database Schema

This document provides metadata and explanations for the database tables used in the SealTalk application.

---

## `messages` Table

Stores all chat messages sent by users.

### Columns

| Column Name     | Type                        | Default Value         | Constraints                                   | Description                                                                                                |
|-----------------|-----------------------------|-----------------------|-----------------------------------------------|------------------------------------------------------------------------------------------------------------|
| `id`            | `UUID`                      | `gen_random_uuid()`   | `PRIMARY KEY`                                 | The unique identifier for each message.                                                                    |
| `content`       | `TEXT`                      |                       | `NOT NULL`                                    | The text content of the message.                                                                           |
| `sender_id`     | `UUID`                      |                       | `REFERENCES auth.users(id) ON DELETE CASCADE` | The ID of the user who sent the message, linked to the `auth.users` table. Messages are deleted if the user is. |
| `sender_name`   | `TEXT`                      |                       | `NOT NULL`                                    | The display name of the sender at the time the message was sent.                                           |
| `sender_avatar` | `TEXT`                      |                       | `NOT NULL`                                    | A URL to the sender's avatar image at the time the message was sent.                                       |
| `created_at`    | `TIMESTAMP WITH TIME ZONE`  | `NOW()`               |                                               | The exact timestamp of when the message was created.                                                       |

### Row Level Security (RLS)

RLS is enabled for the `messages` table to control data access on a per-user basis.

-   **`Anyone can read messages` (SELECT Policy)**: Allows any authenticated user (including anonymous users) to read all messages in the table.
-   **`Users can insert messages` (INSERT Policy)**: Restricts users to only insert messages where the `sender_id` matches their own authenticated user ID (`auth.uid()`). This prevents users from sending messages on behalf of others.

### Real-time & Performance

-   **Real-time**: The table is added to the `supabase_realtime` publication, allowing clients to subscribe to new messages instantly.
-   **Indexes**:
    -   `messages_created_at_idx`: Improves performance for fetching messages sorted by creation time (e.g., loading the chat history).
    -   `messages_sender_id_idx`: Speeds up queries that filter messages by a specific sender.

---

## `daily_quotes` Table

Stores daily quotes that can be displayed in the application.

### Columns

| Column Name  | Type                        | Default Value         | Constraints           | Description                                                                 |
|--------------|-----------------------------|-----------------------|-----------------------|-----------------------------------------------------------------------------|
| `id`         | `UUID`                      | `gen_random_uuid()`   | `PRIMARY KEY`         | The unique identifier for each daily quote entry.                           |
| `date`       | `DATE`                      |                       | `NOT NULL`, `UNIQUE`  | The specific date for the quote. Ensures only one quote per day is stored.  |
| `quote`      | `TEXT`                      |                       | `NOT NULL`            | The full text of the quote.                                                 |
| `author`     | `TEXT`                      |                       |                       | The author of the quote. This field is optional.                            |
| `created_at` | `TIMESTAMP WITH TIME ZONE`  | `NOW()`               |                       | The timestamp of when the quote record was added to the database.           |
