const User = require('../models/User');
const Role = require('../models/Role');

// Create new user
exports.createUser = async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const { username, fullName } = req.query;
        let query = { isDelete: false };

        if (username || fullName) {
            query.$or = [];
            if (username) {
                query.$or.push({ username: { $regex: username, $options: 'i' } });
            }
            if (fullName) {
                query.$or.push({ fullName: { $regex: fullName, $options: 'i' } });
            }
        }

        const users = await User.find(query).populate('role');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get user by ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id, isDelete: false })
            .populate('role');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get user by username
exports.getUserByUsername = async (req, res) => {
    try {
        const user = await User.findOne({
            username: req.params.username,
            isDelete: false
        }).populate('role');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Soft delete user
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id,
            { isDelete: true },
            { new: true }
        );
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update user status by email and username
exports.updateUserStatus = async (req, res) => {
    try {
        const { email, username } = req.body;
        const user = await User.findOne({ email, username, isDelete: false });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.status = true;
        await user.save();

        res.json({ message: 'User status updated successfully', user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.updateUserRole = async (req, res) => {
    try {
        const { userId, roleId } = req.body;

        const user = await User.findOne({ _id: userId, isDelete: false });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const role = await Role.findById(roleId);
        if (!role) {
            return res.status(404).json({ message: 'Role not found' });
        }

        user.role = role._id;
        await user.save();

        res.json({ message: 'User role updated successfully', user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};