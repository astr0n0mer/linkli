#!/bin/bash

# Test webhook with a sample user.created event
curl -X POST http://localhost:3001/webhooks/clerk \
  -H "Content-Type: application/json" \
  -d '{
    "type": "user.created",
    "data": {
      "id": "user_test123",
      "first_name": "Test",
      "last_name": "User",
      "email_addresses": [
        {
          "email_address": "test@example.com"
        }
      ],
      "image_url": "https://img.clerk.com/test.jpg"
    }
  }'

echo ""
echo "Webhook sent! Check your server logs and MongoDB for the new profile."
