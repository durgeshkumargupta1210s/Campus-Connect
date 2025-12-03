import CampusDrive from '../models/CampusDrive.js';

export const createCampusDrive = async (req, res) => {
  try {
    const { title, company, description, imageUrl, date, location, positions } = req.body;

    const drive = await CampusDrive.create({
      title,
      company,
      description,
      imageUrl,
      date,
      location,
      positions,
      postedBy: req.user._id
    });

    res.status(201).json({
      message: 'Campus drive created successfully',
      drive
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getCampusDrives = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    let filter = {};
    if (status) filter.status = status;

    const drives = await CampusDrive.find(filter)
      .populate('postedBy')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ date: -1 })
      .exec();

    const count = await CampusDrive.countDocuments(filter);

    res.json({
      drives,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getCampusDriveById = async (req, res) => {
  try {
    const drive = await CampusDrive.findById(req.params.id)
      .populate('postedBy')
      .populate('registeredStudents')
      .populate('selectedStudents');

    if (!drive) {
      return res.status(404).json({ message: 'Campus drive not found' });
    }

    res.json(drive);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const registerForDrive = async (req, res) => {
  try {
    const drive = await CampusDrive.findById(req.params.id);

    if (!drive) {
      return res.status(404).json({ message: 'Campus drive not found' });
    }

    if (drive.registeredStudents.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already registered' });
    }

    drive.registeredStudents.push(req.user._id);
    await drive.save();

    res.json({
      message: 'Registered successfully',
      drive
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteCampusDrive = async (req, res) => {
  try {
    const drive = await CampusDrive.findByIdAndDelete(req.params.id);

    if (!drive) {
      return res.status(404).json({ message: 'Campus drive not found' });
    }

    res.json({ message: 'Campus drive deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
