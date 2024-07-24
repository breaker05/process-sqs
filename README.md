## process-sqs
This is a lambda function that will pick up items in an SQS queue and send the payload to Twilio. The payload should already have the send from and to numbers alongside the message. Additional delay setting in milliseconds as well.

## Testing
```bash
node test.js
```



