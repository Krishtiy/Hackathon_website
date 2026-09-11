const path = require('path');
const fs = require('fs');

// @desc    Download a file from the uploads folder
// @route   GET /api/download
exports.downloadFile = (req, res) => {
  try {
    const { filepath } = req.query;

    if (!filepath) {
      return res.status(400).json({ message: 'Filepath is required.' });
    }

    // --- Security Check ---
    // This is critical. It prevents users from trying to download
    // sensitive files like '../../.env'
    const safeBaseDir = path.resolve(process.cwd());
    const safeFilepath = path.resolve(safeBaseDir, filepath);

    if (!safeFilepath.startsWith(safeBaseDir)) {
      return res.status(403).json({ message: 'Forbidden: Access denied.' });
    }
    // --- End Security Check ---

    // Check if the file actually exists
    if (fs.existsSync(safeFilepath)) {
      // Get the file's name to use for the download
      const filename = path.basename(safeFilepath);

      // --- THIS IS THE MAGIC ---
      // 'Content-Disposition: attachment' is a direct command
      // to the browser to "Save As..." instead of "View".
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      
      // Send the file
      res.sendFile(safeFilepath);
    } else {
      res.status(404).json({ message: 'File not found.' });
    }
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};