import AWSMock from 'aws-sdk-mock';
import AWS from 'aws-sdk';
import { handler } from './index.js';
import dotenv from 'dotenv';
import twilio from 'twilio';

dotenv.config();

AWSMock.setSDKInstance(AWS);

// Mock SQS receiveMessage
AWSMock.mock('SQS', 'receiveMessage', (params, callback) => {
  callback(null, {
    Messages: [
      {
        MessageId: '1',
        ReceiptHandle: 'handle1',
        Body: 'Hello from SQS!'
      }
    ]
  });
});

// Mock SQS deleteMessage
AWSMock.mock('SQS', 'deleteMessage', (params, callback) => {
  callback(null, {});
});

// Mock Twilio messages.create
jest.mock('twilio', () => {
  const mockTwilio = {
    messages: {
      create: jest.fn().mockResolvedValue({
        sid: 'SMxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
      })
    }
  };
  return jest.fn(() => mockTwilio);
});

(async () => {
  try {
    const result = await handler({});
    console.log('Lambda function result:', result);
  } catch (error) {
    console.error('Error:', error);
  }
  AWSMock.restore();
})();
