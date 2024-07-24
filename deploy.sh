zip -r function.zip .
aws lambda update-function-code --function-name process-sqs --zip-file fileb://function.zip
