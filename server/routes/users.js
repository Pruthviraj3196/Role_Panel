const express = require('express');
const User = require('../models/User');
const { authenticate, authorizeRoles } = require('../middleware/authMiddleware');
const router = express.Router();

// Get all users (Admin only)
router.get('/', authenticate, authorizeRoles('Admin'), async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// Assign role (Admin only)
router.put('/:id/role', authenticate, authorizeRoles('Admin'), async (req, res) => {
  const { role } = req.body;
  if (!role) return res.status(400).json({ message: 'Role is required' });

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Assign team member (Admin only) — add an employee to a manager's team
router.put('/:managerId/team', authenticate, authorizeRoles('Admin'), async (req, res) => {
  const { employeeId } = req.body;

  if (!employeeId) return res.status(400).json({ message: 'Employee ID is required' });

  try {
    const manager = await User.findById(req.params.managerId);
    if (!manager || manager.role !== 'Manager') {
      return res.status(400).json({ message: 'Target user is not a manager' });
    }

    const employee = await User.findById(employeeId);
    if (!employee || employee.role !== 'Employee') {
      return res.status(400).json({ message: 'Target team member must be an employee' });
    }

    if (manager.team.includes(employeeId)) {
      return res.status(400).json({ message: 'Employee already in team' });
    }

    manager.team.push(employeeId);
    await manager.save();

    res.json({ message: 'Employee added to team', manager });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET manager's team
router.get('/team', authenticate, authorizeRoles('Manager'), async (req, res) => {
  try {
    const manager = await User.findById(req.user.id).populate('team', 'name email role');
    if (!manager || manager.role !== 'Manager') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(manager.team);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
