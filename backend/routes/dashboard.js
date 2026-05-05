const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Task = require('../models/Task');
const Project = require('../models/Project');

// @route GET /api/dashboard
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Get all projects where user is admin or member
    const projects = await Project.find({
      $or: [{ admin: userId }, { members: userId }]
    });
    const projectIds = projects.map(p => p._id);

    // 2. Fetch tasks for these projects
    const tasks = await Task.find({ project: { $in: projectIds } }).populate('assignedTo', 'name');

    // 3. Calculate statistics
    const totalTasks = tasks.length;
    
    const tasksByStatus = {
      'To Do': 0,
      'In Progress': 0,
      'Done': 0
    };
    
    const tasksPerUser = {}; // { "userName": count }
    
    const now = new Date();
    // Overdue tasks (due date < today and status != Done)
    // Need to reset time for proper 'today' comparison
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    let overdueTasks = 0;

    tasks.forEach(task => {
      // By Status
      if (tasksByStatus[task.status] !== undefined) {
        tasksByStatus[task.status]++;
      }

      // By User
      if (task.assignedTo) {
        const userName = task.assignedTo.name;
        tasksPerUser[userName] = (tasksPerUser[userName] || 0) + 1;
      } else {
        tasksPerUser['Unassigned'] = (tasksPerUser['Unassigned'] || 0) + 1;
      }

      // Overdue
      if (task.dueDate && task.status !== 'Done') {
        const taskDate = new Date(task.dueDate);
        if (taskDate < today) {
          overdueTasks++;
        }
      }
    });

    res.json({
      totalTasks,
      tasksByStatus,
      tasksPerUser,
      overdueTasks
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
