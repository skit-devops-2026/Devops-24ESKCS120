import { z } from 'zod';
import mongoose from 'mongoose';
import Task, { TASK_STATUSES, TASK_PRIORITIES } from '../models/Task.js';
import Project from '../models/Project.js';
import Activity from '../models/Activity.js';
import Comment from '../models/Comment.js';
import { createError } from '../middleware/errorHandler.js';

const taskSchema = z.object({
  title: z.string().min(1).max(500),
  description: z.string().max(10000).optional(),
  project: z.string(),
  assignee: z.string().optional().nullable(),
  status: z.enum(TASK_STATUSES).optional(),
  priority: z.enum(TASK_PRIORITIES).optional(),
  labels: z.array(z.string()).optional(),
  startDate: z.string().optional().nullable(),
  dueDate: z.string().optional().nullable(),
  estimatedHours: z.number().min(0).optional().nullable(),
  subtasks: z.array(z.object({
    title: z.string(),
    isCompleted: z.boolean().optional(),
    assignee: z.string().optional().nullable(),
  })).optional(),
});

const recordActivity = async (data) => {
  try { await Activity.create(data); } catch (e) { console.error('Activity error:', e.message); }
};

// ── List tasks ─────────────────────────────────────────────────────────────────
export const getTasks = async (req, res, next) => {
  try {
    const { workspaceId } = req.params;
    const { project, status, priority, assignee, label, search, page = 1, limit = 50, myTasks } = req.query;

    const filter = { workspace: workspaceId };
    if (project) filter.project = project;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (assignee) filter.assignee = assignee;
    if (myTasks === 'true') filter.assignee = req.userId;
    if (label) filter.labels = label;
    if (search) filter.title = { $regex: search, $options: 'i' };

    const [tasks, total] = await Promise.all([
      Task.find(filter)
        .populate('assignee', 'name avatar')
        .populate('creator', 'name avatar')
        .populate('project', 'name color emoji')
        .sort({ position: 1, createdAt: -1 })
        .skip((parseInt(page) - 1) * parseInt(limit))
        .limit(parseInt(limit)),
      Task.countDocuments(filter),
    ]);

    res.json({ success: true, data: { tasks, total, page: parseInt(page), limit: parseInt(limit) } });
  } catch (err) {
    next(err);
  }
};

// ── Get single task ────────────────────────────────────────────────────────────
export const getTask = async (req, res, next) => {
  try {
    const { workspaceId, taskId } = req.params;
    const task = await Task.findOne({ _id: taskId, workspace: workspaceId })
      .populate('assignee', 'name avatar email')
      .populate('creator', 'name avatar')
      .populate('project', 'name color emoji')
      .populate('subtasks.assignee', 'name avatar');
    if (!task) throw createError('Task not found', 404);
    res.json({ success: true, data: { task } });
  } catch (err) {
    next(err);
  }
};

// ── Create task ────────────────────────────────────────────────────────────────
export const createTask = async (req, res, next) => {
  try {
    const { workspaceId } = req.params;
    const data = taskSchema.parse(req.body);

    // Verify project belongs to workspace
    const project = await Project.findOne({ _id: data.project, workspace: workspaceId });
    if (!project) throw createError('Project not found', 404);

    // Set position at end of column
    const maxPos = await Task.findOne({ project: data.project, status: data.status || 'backlog' })
      .sort({ position: -1 }).select('position');
    const position = (maxPos?.position ?? -1) + 1;

    const task = await Task.create({ ...data, workspace: workspaceId, creator: req.userId, position });
    await task.populate('assignee', 'name avatar');
    await task.populate('creator', 'name avatar');
    await task.populate('project', 'name color emoji');

    await recordActivity({
      workspace: workspaceId, project: data.project, task: task._id, actor: req.userId,
      type: 'task.created', summary: `Task "${task.title}" created`,
      data: { taskTitle: task.title },
    });

    res.status(201).json({ success: true, data: { task } });
  } catch (err) {
    next(err);
  }
};

// ── Update task ────────────────────────────────────────────────────────────────
export const updateTask = async (req, res, next) => {
  try {
    const { workspaceId, taskId } = req.params;
    const updates = taskSchema.partial().parse(req.body);

    const before = await Task.findOne({ _id: taskId, workspace: workspaceId });
    if (!before) throw createError('Task not found', 404);

    const task = await Task.findByIdAndUpdate(taskId, updates, { new: true, runValidators: true })
      .populate('assignee', 'name avatar')
      .populate('creator', 'name avatar')
      .populate('project', 'name color emoji');

    // Record meaningful changes as activities
    if (updates.status && updates.status !== before.status) {
      await recordActivity({
        workspace: workspaceId, project: task.project._id, task: taskId, actor: req.userId,
        type: 'task.status_changed',
        summary: `Status changed from "${before.status}" to "${updates.status}"`,
        data: { from: before.status, to: updates.status, taskTitle: task.title },
      });
    }
    if (updates.assignee !== undefined && String(updates.assignee) !== String(before.assignee)) {
      await recordActivity({
        workspace: workspaceId, project: task.project._id, task: taskId, actor: req.userId,
        type: 'task.assigned', summary: `Task reassigned`,
        data: { taskTitle: task.title },
      });
    }

    res.json({ success: true, data: { task } });
  } catch (err) {
    next(err);
  }
};

// ── Move task (Kanban status + position) ───────────────────────────────────────
export const moveTask = async (req, res, next) => {
  try {
    const { workspaceId, taskId } = req.params;
    const { status, position } = z.object({
      status: z.enum(TASK_STATUSES),
      position: z.number().int().min(0).optional(),
    }).parse(req.body);

    const task = await Task.findOne({ _id: taskId, workspace: workspaceId });
    if (!task) throw createError('Task not found', 404);

    const oldStatus = task.status;
    task.status = status;
    if (position !== undefined) task.position = position;
    await task.save();

    if (oldStatus !== status) {
      await recordActivity({
        workspace: workspaceId, project: task.project, task: taskId, actor: req.userId,
        type: 'task.status_changed',
        summary: `Status changed from "${oldStatus}" to "${status}"`,
        data: { from: oldStatus, to: status, taskTitle: task.title },
      });
    }

    await task.populate('assignee', 'name avatar');
    await task.populate('project', 'name color emoji');
    res.json({ success: true, data: { task } });
  } catch (err) {
    next(err);
  }
};

// ── Delete task ────────────────────────────────────────────────────────────────
export const deleteTask = async (req, res, next) => {
  try {
    const { workspaceId, taskId } = req.params;
    const task = await Task.findOneAndDelete({ _id: taskId, workspace: workspaceId });
    if (!task) throw createError('Task not found', 404);
    await Comment.deleteMany({ task: taskId });
    res.json({ success: true, message: 'Task deleted' });
  } catch (err) {
    next(err);
  }
};

// ── Get task activity ──────────────────────────────────────────────────────────
export const getTaskActivity = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const activities = await Activity.find({ task: taskId })
      .populate('actor', 'name avatar')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: { activities } });
  } catch (err) {
    next(err);
  }
};

// ── Add subtask ────────────────────────────────────────────────────────────────
export const addSubtask = async (req, res, next) => {
  try {
    const { workspaceId, taskId } = req.params;
    const { title, assignee } = z.object({ title: z.string().min(1), assignee: z.string().optional() }).parse(req.body);
    const task = await Task.findOne({ _id: taskId, workspace: workspaceId });
    if (!task) throw createError('Task not found', 404);
    task.subtasks.push({ title, assignee: assignee || null });
    await task.save();
    await task.populate('subtasks.assignee', 'name avatar');
    res.json({ success: true, data: { task } });
  } catch (err) {
    next(err);
  }
};

// ── Toggle subtask ─────────────────────────────────────────────────────────────
export const toggleSubtask = async (req, res, next) => {
  try {
    const { workspaceId, taskId, subtaskId } = req.params;
    const task = await Task.findOne({ _id: taskId, workspace: workspaceId });
    if (!task) throw createError('Task not found', 404);
    const sub = task.subtasks.id(subtaskId);
    if (!sub) throw createError('Subtask not found', 404);
    sub.isCompleted = !sub.isCompleted;
    await task.save();
    res.json({ success: true, data: { task } });
  } catch (err) {
    next(err);
  }
};

// ── Comments ───────────────────────────────────────────────────────────────────
export const getComments = async (req, res, next) => {
  try {
    const { workspaceId, taskId } = req.params;
    const comments = await Comment.find({ task: taskId, workspace: workspaceId })
      .populate('author', 'name avatar')
      .sort({ createdAt: 1 });
    res.json({ success: true, data: { comments } });
  } catch (err) {
    next(err);
  }
};

export const addComment = async (req, res, next) => {
  try {
    const { workspaceId, taskId } = req.params;
    const { content } = z.object({ content: z.string().min(1).max(5000) }).parse(req.body);
    const task = await Task.findOne({ _id: taskId, workspace: workspaceId });
    if (!task) throw createError('Task not found', 404);
    const comment = await Comment.create({ task: taskId, workspace: workspaceId, author: req.userId, content });
    await comment.populate('author', 'name avatar');

    await recordActivity({
      workspace: workspaceId, project: task.project, task: taskId, actor: req.userId,
      type: 'task.commented', summary: `Comment added`, data: { taskTitle: task.title },
    });

    res.status(201).json({ success: true, data: { comment } });
  } catch (err) {
    next(err);
  }
};

export const updateComment = async (req, res, next) => {
  try {
    const { workspaceId, commentId } = req.params;
    const { content } = z.object({ content: z.string().min(1).max(5000) }).parse(req.body);
    const comment = await Comment.findOne({ _id: commentId, workspace: workspaceId, author: req.userId });
    if (!comment) throw createError('Comment not found or not yours', 404);
    comment.content = content;
    comment.isEdited = true;
    await comment.save();
    await comment.populate('author', 'name avatar');
    res.json({ success: true, data: { comment } });
  } catch (err) {
    next(err);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const { workspaceId, commentId } = req.params;
    const comment = await Comment.findOneAndDelete({ _id: commentId, workspace: workspaceId, author: req.userId });
    if (!comment) throw createError('Comment not found or not yours', 404);
    res.json({ success: true, message: 'Comment deleted' });
  } catch (err) {
    next(err);
  }
};

// ── Dashboard data ─────────────────────────────────────────────────────────────
export const getDashboard = async (req, res, next) => {
  try {
    const { workspaceId } = req.params;
    const now = new Date();
    const soon = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const [myTasks, dueSoon, statusSummary] = await Promise.all([
      Task.find({ workspace: workspaceId, assignee: req.userId, status: { $ne: 'done' } })
        .populate('project', 'name color emoji')
        .sort({ dueDate: 1 })
        .limit(10),
      Task.find({ workspace: workspaceId, dueDate: { $gte: now, $lte: soon }, status: { $ne: 'done' } })
        .populate('assignee', 'name avatar')
        .populate('project', 'name color')
        .sort({ dueDate: 1 })
        .limit(10),
      Task.aggregate([
        { $match: { workspace: new mongoose.Types.ObjectId(workspaceId) } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
    ]);

    res.json({ success: true, data: { myTasks, dueSoon, statusSummary } });
  } catch (err) {
    next(err);
  }
};

export default {
  getTasks, getTask, createTask, updateTask, moveTask, deleteTask,
  getTaskActivity, addSubtask, toggleSubtask,
  getComments, addComment, updateComment, deleteComment,
  getDashboard,
};
