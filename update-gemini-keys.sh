#!/bin/bash

echo "🔑 Updating Gemini API Keys in .env file..."

# Backup current .env file
cp .env .env.backup
echo "📁 Backed up .env to .env.backup"

# Define all Gemini API keys
declare -a keys=(
    "AIzaSyDbpfFeSQZmgoeXE3y5hc5fC3DefC8nyuQ"
    "AIzaSyBH6UGRQ5Z9Hj2JpIH1D9zS3z7bBiDPp7w"
    "AIzaSyAZfdYYlNMZ0ry13l10PzWzBtIHW15663U"
    "AIzaSyC80XEfgqHQRGE-thondqzCHh9kVpjWJjg"
    "AIzaSyBt4uIiVxIWtRWHp1GrPVCTXphpO76hHQ4"
    "AIzaSyCBRWWY1AKfrrZsOi0NXMV0_57TS7kI-co"
    "AIzaSyArq8yyEQLiUgd5fIgDl5Rhir_8UYpG86I"
    "AIzaSyBYThQDzA3T73ulf_jqDkegEcDO9H1q5fE"
    "AIzaSyBYHhhZfGKmXdgdvFmJSHskKnQRL98RtAw"
    "AIzaSyD0QORk3jUfCxkxIfNRrITMWmjepbGr5T4"
    "AIzaSyDS_RUsqnC5KZ0KMLu1gvuPebkS5Rxn-Cc"
    "AIzaSyAWB8Zb_FeRVY56KkztpCD5TvQ-3VIwRTM"
    "AIzaSyA3mwX0R8QVWb6u9R8S0220raqB9my-E-M"
    "AIzaSyBq1qqCH0EC8763w1DCoUhb21cH_NHkhnw"
    "AIzaSyARbQjC5Lx1d6TbqjnNNiMZWBTtA8N9brw"
    "AIzaSyDDfZctg2rxG8lyBWwM3ETSZ-KebZeK0EQ"
    "AIzaSyDVo4TkkP141OGDY5LNOQWSWkihWf0sMtM"
)

# Remove existing GOOGLE_GEMINI_API_KEY entries from .env
echo "🧹 Removing old Gemini API keys from .env..."
sed -i '/^GOOGLE_GEMINI_API_KEY/d' .env

# Add all new API keys
echo "➕ Adding ${#keys[@]} Gemini API keys to .env..."

echo "" >> .env
echo "# Gemini AI API Keys - Multiple keys for load balancing and failover" >> .env

for i in "${!keys[@]}"; do
    if [ $i -eq 0 ]; then
        echo "GOOGLE_GEMINI_API_KEY=\"${keys[$i]}\"" >> .env
    else
        echo "GOOGLE_GEMINI_API_KEY_$((i+1))=\"${keys[$i]}\"" >> .env
    fi
done

echo "" >> .env

echo "✅ Successfully added ${#keys[@]} Gemini API keys to .env"
echo "📋 Keys added:"
for i in "${!keys[@]}"; do
    if [ $i -eq 0 ]; then
        echo "  GOOGLE_GEMINI_API_KEY=\"${keys[$i]}\""
    else
        echo "  GOOGLE_GEMINI_API_KEY_$((i+1))=\"${keys[$i]}\""
    fi
done

echo ""
echo "🚀 Next steps:"
echo "   1. Restart PM2: pm2 restart onghoangdohieu-theme-editor --update-env"
echo "   2. Check logs: pm2 logs onghoangdohieu-theme-editor -f"
echo "   3. Test AI generation in the app"
