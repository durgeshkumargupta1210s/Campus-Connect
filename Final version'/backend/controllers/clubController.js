import Club from '../models/Club.js';
import User from '../models/User.js';

export const createClub = async (req, res) => {
  try {
    const { name, description, category, imageUrl, email, phone, location, website, socialLinks } = req.body;

    const club = await Club.create({
      name,
      description,
      category,
      imageUrl,
      email,
      phone,
      location,
      website,
      socialLinks,
      head: req.user._id
    });

    res.status(201).json({
      message: 'Club created successfully',
      club
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getClubs = async (req, res) => {
  try {
    const { category, status, page = 1, limit = 10 } = req.query;
    
    let filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;

    const clubs = await Club.find(filter)
      .populate('head')
      .populate('members')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Club.countDocuments(filter);

    res.json({
      clubs,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getClubById = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id)
      .populate('head')
      .populate('members')
      .populate('events');

    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }

    res.json(club);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateClub = async (req, res) => {
  try {
    const club = await Club.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }

    res.json({
      message: 'Club updated successfully',
      club
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteClub = async (req, res) => {
  try {
    const club = await Club.findByIdAndDelete(req.params.id);

    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }

    res.json({ message: 'Club deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const joinClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);

    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }

    if (club.members.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already a member' });
    }

    club.members.push(req.user._id);
    club.memberCount = club.members.length;
    await club.save();

    // Add club to user's clubs
    await User.findByIdAndUpdate(req.user._id, {
      $push: { clubsJoined: club._id }
    });

    res.json({
      message: 'Successfully joined club',
      club
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const leaveClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);

    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }

    club.members = club.members.filter(m => m.toString() !== req.user._id.toString());
    club.memberCount = club.members.length;
    await club.save();

    // Remove club from user's clubs
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { clubsJoined: club._id }
    });

    res.json({
      message: 'Successfully left club',
      club
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
