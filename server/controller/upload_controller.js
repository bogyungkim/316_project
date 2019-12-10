import AWS from 'aws-sdk';
import uuid from 'uuid/v4';

const upload = async (request, response) => {
  const { data } = request.body;
  const s3 = new AWS.S3();
  const name = uuid();
  const params = {
    Bucket: process.env.S3_bucket,
    Key: `${name}.jpg`,
    ACL: 'public-read',
    Body: Buffer.from(data, 'base64'),
  };
  try {
    await s3.upload(params, (err, data) => {
      if (err) return response.status(400).json({ statusCode: 400, triggeredAt: 's3.upload()', error: err });
      return response.status(200).json({ statusCode: 200, result: data.Location });
    })
  } catch (error) {
    return response.status(500).json({ statusCode: 500, triggeredAt: 's3.upload()', error: error });
  }
};

export default upload;
