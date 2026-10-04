import mongoose from 'mongoose';

// Status values are the kanban column identifiers
// Kept as a schema constant so the Blueprint Engine can override them later
export const TASK_STATUSES = ['backlog', 'todo', 'in_progress', 'in_review', 'done'];
export const TASK_PRIORITIES = ['none', 'low', 'medium', 'high', 'urgent'];

const subtaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    isCompleted: { type: Boolean, default: false },
    assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 500 },
    description: { type: String, maxlength: 10000, default: '' },

    workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true, index: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true, index: true },

    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },

    status: { type: String, enum: TASK_STATUSES, default: 'backlog' },
    priority: { type: String, enum: TASK_PRIORITIES, default: 'none' },

    labels: [{ type: String, trim: true }],

    startDate: { type: Date, default: null },
    dueDate: { type: Date, default: null },
    estimatedHours: { type: Number, min: 0, default: null },

    subtasks: [subtaskSchema],

    // Position within the kanban column — for manual ordering
    position: { type: Number, default: 0 },

    // Extension points for future features
    // - dependencies: [{ type: ObjectId, ref: 'Task' }]
    // - workflowStepId: String (Blueprint Engine)
    // - githubPrUrl: String
    // - automationTriggers: Mixed
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

taskSchema.index({ workspace: 1, status: 1 });
taskSchema.index({ workspace: 1, assignee: 1 });
taskSchema.index({ project: 1, status: 1 });
taskSchema.index({ project: 1, position: 1 });
taskSchema.index({ dueDate: 1, status: 1 });

const Task = mongoose.model('Task', taskSchema);
export default Task;
