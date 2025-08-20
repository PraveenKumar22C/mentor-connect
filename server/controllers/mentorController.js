import Mentor from '../models/Mentor.js';

export const getMentors = async (req, res) => {
  try {
    const {
      specialization,
      location,
      experience,
      available,
      search,
      page = 1,
      limit = 10,
      sortBy = 'rating',
      sortOrder = 'desc'
    } = req.query;

    const filter = { isActive: true };

    if (specialization) {
      const specializations = Array.isArray(specialization) ? specialization : [specialization];
      filter.specialization = { $in: specializations.map(s => new RegExp(s, 'i')) };
    }

    if (location) {
      const locations = Array.isArray(location) ? location : [location];
      filter.location = { $in: locations.map(l => new RegExp(l, 'i')) };
    }

    if (experience) {
      filter.experience = { $gte: parseInt(experience) };
    }

    if (available !== undefined) {
      filter.available = available === 'true';
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { specialization: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } }
      ];
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [mentors, totalCount] = await Promise.all([
      Mentor.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit)),
      Mentor.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: mentors,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / parseInt(limit)),
        totalCount,
        hasNextPage: skip + mentors.length < totalCount,
        hasPrevPage: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Error fetching mentors:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching mentors',
      error: error.message
    });
  }
};

export const getMentorById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const mentor = await Mentor.findById(id);
    
    if (!mentor || !mentor.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Mentor not found'
      });
    }

    res.json({
      success: true,
      data: mentor
    });
  } catch (error) {
    console.error('Error fetching mentor:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching mentor',
      error: error.message
    });
  }
};

export const createMentor = async (req, res) => {
  try {
    let mentorData = req.body;

    if (mentorData.timeSlots && typeof mentorData.timeSlots === 'string') {
      mentorData.timeSlots = JSON.parse(mentorData.timeSlots).map(slot => ({
        name: `${slot.day} ${slot.startTime} - ${slot.endTime}`,
        day: slot.day,
        startTime: slot.startTime,
        endTime: slot.endTime,
        available: true
      }));
    }

    if (mentorData.pricing && typeof mentorData.pricing === 'string') {
      mentorData.pricing = JSON.parse(mentorData.pricing);
    }

    if (mentorData.packages && typeof mentorData.packages === 'string') {
      mentorData.packages = JSON.parse(mentorData.packages);
      if (!mentorData.pricing || mentorData.pricing.length === 0) {
        mentorData.pricing = mentorData.packages.map(pkg => ({
          duration: pkg.duration,
          price: pkg.price
        }));
      }
    }

    if (mentorData.languages && typeof mentorData.languages === 'string') {
      mentorData.languages = mentorData.languages.split(',').map(l => l.trim());
    }

    if (mentorData.experience) {
      mentorData.experience = parseInt(mentorData.experience);
    }

    if (req.file) {
      mentorData.profileImage = req.file.path;
    }

    const mentor = new Mentor(mentorData);
    await mentor.save();

    res.status(201).json({
      success: true,
      message: 'Mentor created successfully',
      data: mentor
    });
  } catch (error) {
    console.error('Error creating mentor:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating mentor',
      error: error.message
    });
  }
};

export const updateMentor = async (req, res) => {
  try {
    const { id } = req.params;
    let updateData = req.body;

    if (updateData.timeSlots && typeof updateData.timeSlots === 'string') {
      updateData.timeSlots = JSON.parse(updateData.timeSlots).map(slot => ({
        name: `${slot.day} ${slot.startTime} - ${slot.endTime}`,
        day: slot.day,
        startTime: slot.startTime,
        endTime: slot.endTime,
        available: true
      }));
    }

    if (updateData.pricing && typeof updateData.pricing === 'string') {
      updateData.pricing = JSON.parse(updateData.pricing);
    }

    if (updateData.packages && typeof updateData.packages === 'string') {
      updateData.packages = JSON.parse(updateData.packages);
      if (!updateData.pricing || updateData.pricing.length === 0) {
        updateData.pricing = updateData.packages.map(pkg => ({
          duration: pkg.duration,
          price: pkg.price
        }));
      }
    }

    if (updateData.languages && typeof updateData.languages === 'string') {
      updateData.languages = updateData.languages.split(',').map(l => l.trim());
    }

    if (updateData.experience) {
      updateData.experience = parseInt(updateData.experience);
    }

    if (req.file) {
      updateData.profileImage = req.file.path;
    }

    const mentor = await Mentor.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: 'Mentor not found'
      });
    }

    res.json({
      success: true,
      message: 'Mentor updated successfully',
      data: mentor
    });
  } catch (error) {
    console.error('Error updating mentor:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating mentor',
      error: error.message
    });
  }
};

export const deleteMentor = async (req, res) => {
  try {
    const { id } = req.params;

    const mentor = await Mentor.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: 'Mentor not found'
      });
    }

    res.json({
      success: true,
      message: 'Mentor deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting mentor:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting mentor',
      error: error.message
    });
  }
};

export const getFilterOptions = async (req, res) => {
  try {
    const [specializations, locations] = await Promise.all([
      Mentor.distinct('specialization', { isActive: true }),
      Mentor.distinct('location', { isActive: true })
    ]);

    res.json({
      success: true,
      data: {
        specializations: specializations.filter(s => s).sort(),
        locations: locations.filter(l => l).sort(),
        experienceRanges: [
          { label: '0-2 years', value: 0 },
          { label: '3-5 years', value: 3 },
          { label: '6-10 years', value: 6 },
          { label: '10+ years', value: 10 }
        ]
      }
    });
  } catch (error) {
    console.error('Error fetching filter options:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching filter options',
      error: error.message
    });
  }
};