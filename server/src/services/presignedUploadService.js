const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const accountId = process.env.R2_ACCOUNT_ID || 'dummy-account-id';

const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || 'dummy-key',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || 'dummy-secret',
  },
});

exports.getPresignedPutUrl = async (req, res) => {
  try {
    const { teamId, filename } = req.body;
    if (!teamId || !filename) {
      return res.status(400).json({ message: 'teamId and filename are required' });
    }

    const key = `submissions/round2/${teamId}-${Date.now()}-${filename}`;
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME || 'hackathon-submissions',
      Key: key,
      ContentType: 'application/zip',
    });

    const uploadUrl = await getSignedUrl(r2, command, { expiresIn: 300 });
    res.json({ uploadUrl, fileKey: key });
  } catch (err) {
    console.error('Presigned PUT Error:', err);
    res.status(500).json({ message: 'Error generating upload URL', error: err.message });
  }
};
