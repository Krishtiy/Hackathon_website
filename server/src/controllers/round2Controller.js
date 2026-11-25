const Team = require('../models/Team');
const fs = require('fs');
const path = require('path');

// Safe, zero-cost Cloudinary loader
let cloudinary = null;
try {
  cloudinary = require('../config/cloudinaryConfig');
} catch (e) {
  cloudinary = null;
}

// Upload round 2 ZIP and save URL on Team
const uploadRound2Zip = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No zip file uploaded' });

    const team = await Team.findById(req.user.teamId);
    if (!team) return res.status(404).json({ message: 'Team not found' });

    // Only leader can submit
    if (team.leader.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Only the team leader can submit the round 2 zip' });
    }

    let fileUrl = '';

    // Check if Cloudinary is configured with valid credentials
    const hasCloudinary = cloudinary && process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY;

    if (hasCloudinary) {
      try {
        const uploaded = await cloudinary.uploader.upload(req.file.path, {
          folder: 'round2_zips',
          resource_type: 'raw'
        });
        fileUrl = uploaded.secure_url;

        // remove temp local file after successful cloud upload
        fs.unlink(req.file.path, (err) => {
          if (err) console.warn('Failed to remove temp upload:', err);
        });
      } catch (cloudErr) {
        console.warn('Cloudinary upload failed or quota exceeded, falling back to local static serving:', cloudErr.message);
        // Fallback to local uploads URL (zero-cost, no billing risk)
        fileUrl = `/uploads/${path.basename(req.file.path)}`;
      }
    } else {
      // Free Local Disk Fallback: Served automatically by Express static at /uploads
      fileUrl = `/uploads/${path.basename(req.file.path)}`;
    }

    // Save URL to team
    team.round2Zip = fileUrl;
    team.round2Status = 'submitted';
    await team.save();

    return res.status(200).json({ message: 'Round 2 zip uploaded successfully', url: fileUrl });
  } catch (error) {
    console.error('uploadRound2Zip error', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { uploadRound2Zip };
