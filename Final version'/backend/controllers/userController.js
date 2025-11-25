import User from '../models/User.js';

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('clubsJoined')
      .populate('registeredEvents')
      .populate('tickets');
    
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, phone, college, branch, semester, bio, profileImage, skills, interests } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        name,
        phone,
        college,
        branch,
        semester,
        bio,
        profileImage,
        skills,
        interests,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );

    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { resume: req.file.path },
      { new: true }
    );

    res.json({
      message: 'Resume uploaded successfully',
      user
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const { role, status, page = 1, limit = 10 } = req.query;
    
    let filter = {};
    if (role) filter.role = role;
    if (status) filter.status = status;

    const users = await User.find(filter)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await User.countDocuments(filter);

    res.json({
      users,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('clubsJoined')
      .populate('registeredEvents');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
