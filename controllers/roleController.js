const Role = require('../models/Role');

// Create new role
exports.createRole = async (req, res) => {
    try {
        const role = new Role(req.body);
        await role.save();
        res.status(201).json(role);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all roles
exports.getAllRoles = async (req, res) => {
    try {
        const roles = await Role.find({ isDelete: false });
        res.json(roles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get role by ID
exports.getRoleById = async (req, res) => {
    try {
        const role = await Role.findOne({ _id: req.params.id, isDelete: false });
        if (!role) return res.status(404).json({ message: 'Role not found' });
        res.json(role);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Soft delete role
exports.deleteRole = async (req, res) => {
    try {
        const role = await Role.findByIdAndUpdate(req.params.id, 
            { isDelete: true }, 
            { new: true }
        );
        if (!role) return res.status(404).json({ message: 'Role not found' });
        res.json({ message: 'Role deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};