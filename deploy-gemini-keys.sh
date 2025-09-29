#!/bin/bash

echo "🚀 Deploying Gemini API Keys to VPS..."

# Copy files to VPS
echo "📤 Uploading update script to VPS..."
scp update-gemini-keys.sh root@srv828623:~/theme-editor/

echo "📤 Uploading updated API route to VPS..."
scp src/app/api/generate-theme/route.ts root@srv828623:~/theme-editor/src/app/api/generate-theme/route.ts

# SSH and run the update script
echo "🔑 Running API key update on VPS..."
ssh root@srv828623 << 'EOF'
cd ~/theme-editor

# Make script executable
chmod +x update-gemini-keys.sh

# Run the update script
./update-gemini-keys.sh

# Restart PM2 with new environment variables
echo "🔄 Restarting PM2 with updated API keys..."
pm2 restart onghoangdohieu-theme-editor --update-env

# Show final status
echo "📊 PM2 Status:"
pm2 status

echo "✅ Deployment complete!"
EOF

echo ""
echo "🎉 Gemini API keys deployed successfully!"
echo "📝 Check logs with: ssh root@srv828623 'pm2 logs onghoangdohieu-theme-editor -f'"
