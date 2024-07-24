import AWS from 'aws-sdk';
import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

// Initialize AWS SQS
const sqs = new AWS.SQS({ region: 'us-east-1' });

// Initialize Twilio
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

// SQS Queue URL
const queueURL = process.env.SQS_QUEUE_URL;

// Twilio Messaging
const twilioFromNumber = process.env.TWILIO_FROM_NUMBER;
const twilioToNumber = process.env.TWILIO_TO_NUMBER;

export const handler = async (event) => {
  try {
    // Receive message from SQS
    const params = {
      QueueUrl: queueURL,
      MaxNumberOfMessages: 1
    };
    const data = await sqs.receiveMessage(params).promise();

    if (data.Messages) {
      const message = data.Messages[0];
      console.log('Received message:', message);

      // Send message using Twilio
      const twilioMessage = await client.messages.create({
        body: message.Body,
        from: twilioFromNumber,
        to: twilioToNumber
      });

      console.log('Twilio message sent:', twilioMessage.sid);

      // Delete message from SQS queue
      const deleteParams = {
        QueueUrl: queueURL,
        ReceiptHandle: message.ReceiptHandle
      };
      await sqs.deleteMessage(deleteParams).promise();

      return {
        statusCode: 200,
        body: JSON.stringify('Message processed successfully')
      };
    } else {
      console.log('No messages to process');
      return {
        statusCode: 200,
        body: JSON.stringify('No messages to process')
      };
    }
  } catch (error) {
    console.error('Error processing message:', error);
    return {
      statusCode: 500,
      body: JSON.stringify('Error processing message')
    };
  }
};
