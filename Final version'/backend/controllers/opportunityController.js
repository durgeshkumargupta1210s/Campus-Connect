import Opportunity from '../models/Opportunity.js';

export const createOpportunity = async (req, res) => {
  try {
    const { title, description, type, company, position, salary, deadline, date, location, requirements, benefits } = req.body;

    const opportunity = await Opportunity.create({
      title,
      description,
      type,
      company,
      position,
      salary,
      deadline,
      date,
      location,
      requirements,
      benefits,
      postedBy: req.user._id
    });

    res.status(201).json({
      message: 'Opportunity created successfully',
      opportunity
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getOpportunities = async (req, res) => {
  try {
    const { type, status, page = 1, limit = 10 } = req.query;
    
    let filter = { status: 'active' };
    if (type) filter.type = type;

    const opportunities = await Opportunity.find(filter)
      .populate('postedBy')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })
      .exec();

    const count = await Opportunity.countDocuments(filter);

    res.json({
      opportunities,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getOpportunityById = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id)
      .populate('postedBy');

    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }

    res.json(opportunity);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const applyOpportunity = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }

    // Check if already applied
    const existing = opportunity.applications.find(app => app.userId.toString() === req.user._id.toString());
    if (existing) {
      return res.status(400).json({ message: 'Already applied' });
    }

    opportunity.applications.push({ userId: req.user._id });
    opportunity.applicantCount = opportunity.applications.length;
    await opportunity.save();

    res.json({
      message: 'Applied successfully',
      opportunity
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteOpportunity = async (req, res) => {
  try {
    const opportunity = await Opportunity.findByIdAndDelete(req.params.id);

    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }

    res.json({ message: 'Opportunity deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
