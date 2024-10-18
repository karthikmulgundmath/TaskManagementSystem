export interface Comment {
  id: string; // UUID for comment ID
  task_id: string; // Reference to the associated task
  author_id: string; // Reference to the user who wrote the comment
  content: string; // The comment text
  created_at: Date; // Timestamp for when the comment was created
}
