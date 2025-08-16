#!/bin/bash

echo "🚀 Deploying Golf Swing AI Service..."

# Check if we're in the right directory
if [ ! -f "main.py" ]; then
    echo "❌ Error: main.py not found. Make sure you're in the ai-microservice directory."
    exit 1
fi

echo "✅ Service files ready for deployment"
echo ""
echo "📋 Next steps:"
echo "1. Go to https://railway.app/ (or your chosen platform)"
echo "2. Connect your GitHub repository"
echo "3. Deploy the ai-microservice folder"
echo "4. Copy the deployment URL"
echo "5. Update your frontend configuration"
echo ""
echo "🎯 Your service will be available at: https://your-service-name.railway.app"
echo ""
echo "💡 Don't forget to set environment variables if needed!"
