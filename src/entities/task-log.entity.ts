export interface TaskLog {
  id: string; // UUID for task log ID
  task_id: string; // Reference to the associated task
  updated_at: Date; // Timestamp for when the log was created
  previous_status: string; // Previous status of the task
  new_status: string; // New status of the task
  changed_by: string; // ID of the user who made the change
}
