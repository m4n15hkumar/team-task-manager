const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Task = require('../models/Task');
const Project = require('../models/Project');

// Helper to check project access
const checkProjectAccess = async (projectId, userId) => {
  if (!projectId) return { project: null, isAdmin: true, isMember: true };
  const project = await Project.findById(projectId);
  if (!project) return { error: 'Project not found' };
  
  const isAdmin = project.admin.toString() === userId.toString();
  const isMember = project.members.some(m => m.toString() === userId.toString());
  
  if (!isAdmin && !isMember) return { error: 'Not authorized for this project' };
  
  return { project, isAdmin, isMember };
};

// Helper to check task access (handles both project tasks and personal tasks)
const checkTaskAccess = async (task, userId) => {
  if (task.project) {
    return await checkProjectAccess(task.project, userId);
  } else {
    // Personal task
    const isCreator = task.createdBy.toString() === userId.toString();
    const isAssignee = task.assignedTo && task.assignedTo.toString() === userId.toString();
    if (!isCreator && !isAssignee) return { error: 'Not authorized for this personal task' };
    return { project: null, isAdmin: isCreator || isAssignee, isMember: true };
  }
};

// @route POST /api/tasks
// Create task
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, dueDate, priority, effort, category, status, assignedTo, projectId } = req.body;
    
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const access = await checkProjectAccess(projectId, req.user._id);
    if (access.error) return res.status(403).json({ message: access.error });
    if (projectId && !access.isAdmin) return res.status(403).json({ message: 'Only admin can create tasks in this project' });

    const newTask = new Task({
      title, description, dueDate, priority, effort, category, status,
      project: projectId || undefined,
      assignedTo: assignedTo || req.user._id, // Default personal tasks to self
      createdBy: req.user._id
    });

    const savedTask = await newTask.save();
    
    // Populate before sending response
    await savedTask.populate('assignedTo', 'name email');
    res.status(201).json(savedTask);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route GET /api/tasks?projectId=xxx
// Get tasks for a project
router.get('/', auth, async (req, res) => {
  try {
    const { projectId } = req.query;
    if (!projectId) return res.status(400).json({ message: 'projectId is required' });

    const access = await checkProjectAccess(projectId, req.user._id);
    if (access.error) return res.status(403).json({ message: access.error });

    const tasks = await Task.find({ project: projectId })
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');
      
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route PATCH /api/tasks/:id
// Update task status or details
router.patch('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const access = await checkTaskAccess(task, req.user._id);
    if (access.error) return res.status(403).json({ message: access.error });

    const isAssignedToMe = task.assignedTo && task.assignedTo.toString() === req.user._id.toString();

    // Members can only update status of their assigned tasks
    if (!access.isAdmin && !isAssignedToMe) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    const { title, description, dueDate, priority, effort, category, status, assignedTo } = req.body;

    if (!access.isAdmin) {
      // Member logic: can only update status
      if (status) task.status = status;
    } else {
      // Admin logic: can update anything
      if (title !== undefined) task.title = title;
      if (description !== undefined) task.description = description;
      if (dueDate !== undefined) task.dueDate = dueDate;
      if (priority !== undefined) task.priority = priority;
      if (effort !== undefined) task.effort = effort;
      if (category !== undefined) task.category = category;
      if (status !== undefined) task.status = status;
      if (assignedTo !== undefined) task.assignedTo = assignedTo;
    }

    const updatedTask = await task.save();
    // Re-populate for response
    await updatedTask.populate('assignedTo', 'name email');
    res.json(updatedTask);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route DELETE /api/tasks/:id
// Admin only delete
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const access = await checkTaskAccess(task, req.user._id);
    if (access.error) return res.status(403).json({ message: access.error });
    if (!access.isAdmin) return res.status(403).json({ message: 'Only admin can delete tasks' });

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// UPGRADE: Asana-style - Get My Tasks across all projects
router.get('/my', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user._id })
      .populate('project', 'name')
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// UPGRADE: Asana-style - Add Comment
router.post('/:id/comments', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const access = await checkProjectAccess(task.project, req.user._id);
    if (access.error) return res.status(403).json({ message: access.error });

    task.comments.push({
      text: req.body.text,
      user: req.user._id
    });
    
    await task.save();
    await task.populate('comments.user', 'name email');
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// UPGRADE: Asana-style - Add Subtask
router.post('/:id/subtasks', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const access = await checkProjectAccess(task.project, req.user._id);
    if (access.error) return res.status(403).json({ message: access.error });

    task.subtasks.push({
      title: req.body.title,
      completed: false
    });
    
    await task.save();
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// UPGRADE: Asana-style - Toggle Subtask
router.patch('/:id/subtasks/:subtaskId', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const access = await checkProjectAccess(task.project, req.user._id);
    if (access.error) return res.status(403).json({ message: access.error });

    const subtask = task.subtasks.id(req.params.subtaskId);
    if (!subtask) return res.status(404).json({ message: 'Subtask not found' });

    subtask.completed = !subtask.completed;
    await task.save();
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
