const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Project = require('../models/Project');
const User = require('../models/User');

// @route POST /api/projects
// Create a project (creator = Admin)
router.post('/', auth, async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: 'Project name is required' });

    const newProject = new Project({
      name,
      description,
      admin: req.user._id,
      members: [req.user._id] // admin is also a member
    });

    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route GET /api/projects
// Get all projects for logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [
        { admin: req.user._id },
        { members: req.user._id }
      ]
    }).populate('admin', 'name email').populate('members', 'name email');
    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route POST /api/projects/:id/members
// Admin adds member by email
router.post('/:id/members', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (project.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only admin can add members' });
    }

    const { email } = req.body;
    const userToAdd = await User.findOne({ email });
    if (!userToAdd) return res.status(404).json({ message: 'User not found with this email' });

    if (project.members.includes(userToAdd._id)) {
      return res.status(400).json({ message: 'User is already a member' });
    }

    project.members.push(userToAdd._id);
    await project.save();
    
    const populatedProject = await Project.findById(req.params.id)
      .populate('admin', 'name email')
      .populate('members', 'name email');

    res.json({ message: 'Member added', project: populatedProject });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route DELETE /api/projects/:id/members/:userId
// Admin removes member
router.delete('/:id/members/:userId', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (project.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only admin can remove members' });
    }

    const userIdToRemove = req.params.userId;
    if (project.admin.toString() === userIdToRemove) {
      return res.status(400).json({ message: 'Cannot remove the admin' });
    }

    project.members = project.members.filter(m => m.toString() !== userIdToRemove);
    await project.save();
    res.json({ message: 'Member removed', project });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// UPGRADE: Asana-style - Update project status
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (project.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only admin can update project status' });
    }

    const { statusTracking } = req.body;
    if (statusTracking && ['On track', 'At risk', 'Off track'].includes(statusTracking)) {
      project.statusTracking = statusTracking;
      await project.save();
    }
    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
