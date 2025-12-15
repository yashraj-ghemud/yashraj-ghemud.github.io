# 🔑 How to Get Your OpenWeatherMap API Key

## ⚠️ Current Issue
The API key `c03a802ccfed89a203ab57d8f84ad0f1` is returning a **401 Invalid API Key** error.

## ✅ Solution: Get a New API Key

Follow these steps to get a working API key:

### Step 1: Create an Account
1. Go to [OpenWeatherMap.org](https://openweathermap.org/)
2. Click **"Sign Up"** in the top right corner
3. Fill in your details:
   - Username
   - Email address
   - Password
4. Agree to the terms and click **"Create Account"**
5. **Verify your email** (check your inbox and click the verification link)

### Step 2: Get Your API Key
1. **Log in** to your OpenWeatherMap account
2. Click on your **username** in the top right
3. Select **"My API keys"** from the dropdown
4. You'll see a **default API key** already generated
5. **Copy** this API key (it looks like: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`)

### Step 3: Activate Your API Key
⏰ **IMPORTANT**: New API keys take **up to 2 hours** to activate!
- Your key will show as "Active" but may not work immediately
- Wait 10 minutes to 2 hours before testing
- You can check activation status at: https://home.openweathermap.org/api_keys

### Step 4: Update Your Code
1. Open `script.js` in your code editor
2. Find this line near the top (around line 6):
   ```javascript
   const API_KEY = 'c03a802ccfed89a203ab57d8f84ad0f1';
   ```
3. Replace the old key with your new key:
   ```javascript
   const API_KEY = 'YOUR_NEW_API_KEY_HERE';
   ```
4. **Save the file**

### Step 5: Test Your App
1. **Refresh** your browser (or press `Ctrl+Shift+R` to hard refresh)
2. Search for a city (e.g., "London")
3. Weather data should now load! 🎉

## 🔍 Troubleshooting

### Error: "Invalid API key"
- ✅ Make sure you copied the entire API key
- ✅ Check there are no extra spaces before or after the key
- ✅ Verify your email address (check spam folder)
- ✅ Wait 10 minutes if you just created the account

### Error: "City not found"
- ✅ Check the city name spelling
- ✅ Try a major city like "London" or "New York"
- ✅ Make sure you have internet connection

### Still Not Working?
1. Open **Browser Developer Tools** (`F12`)
2. Go to the **Console** tab
3. Look for error messages
4. Check the **Network** tab to see API responses

## 📝 Free Tier Limits

The free OpenWeatherMap plan includes:
- ✅ 1,000 API calls per day
- ✅ Current weather data
- ✅ 5-day forecast
- ✅ Air quality data
- ✅ No credit card required

This is more than enough for testing and personal use!

## 🔒 Security Note

⚠️ **Never commit your API key to public repositories!**

For production:
1. Use environment variables
2. Add API key to `.gitignore`
3. Use a backend proxy to hide your key

## 📧 Need Help?

If you still have issues:
1. Contact OpenWeatherMap support: https://home.openweathermap.org/questions
2. Check their FAQ: https://openweathermap.org/faq
3. Read API documentation: https://openweathermap.org/api

---

**Quick Links:**
- 🏠 [OpenWeatherMap Home](https://openweathermap.org/)
- 🔑 [API Keys Dashboard](https://home.openweathermap.org/api_keys)
- 📚 [API Documentation](https://openweathermap.org/api)
- ❓ [FAQ](https://openweathermap.org/faq)
