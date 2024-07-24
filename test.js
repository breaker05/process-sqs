import { setSDKInstance, mock, restore } from 'aws-sdk-mock';
import AWS from 'aws-sdk';
import { handler } from './index';
require('dotenv').config();

setSDKInstance(AWS);

// Mock SQS receiveMessage
mock('SQS', 'receiveMessage', (params, callback) => {
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
mock('SQS', 'deleteMessage', (params, callback) => {
  callback(null, {});
});

// Mock Twilio messages.create
import twilio from 'twilio';
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
  restore();
})();
