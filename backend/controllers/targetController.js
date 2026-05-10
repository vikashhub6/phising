const Target = require("../models/Target");

// Get all targets
const getTargets = async (req, res) => {
  try {
    const targets = await Target.find({ createdBy: req.user._id });
    res.json(targets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single target
const getTarget = async (req, res) => {
  try {
    const target = await Target.findOne({ _id: req.params.id, createdBy: req.user._id });
    if (!target) return res.status(404).json({ message: "Target not found" });
    res.json(target);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create target
const createTarget = async (req, res) => {
  try {
    const { name, email, company, jobTitle, linkedinUrl, notes } = req.body;
    const target = await Target.create({
      name, email, company, jobTitle, linkedinUrl, notes,
      createdBy: req.user._id,
    });
    res.status(201).json(target);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update target
const updateTarget = async (req, res) => {
  try {
    const target = await Target.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      req.body,
      { new: true }
    );
    if (!target) return res.status(404).json({ message: "Target not found" });
    res.json(target);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete target
const deleteTarget = async (req, res) => {
  try {
    const target = await Target.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id });
    if (!target) return res.status(404).json({ message: "Target not found" });
    res.json({ message: "Target deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTargets, getTarget, createTarget, updateTarget, deleteTarget };
