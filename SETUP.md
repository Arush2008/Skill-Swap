# SkillSwap Setup Guide 🚀

## Quick Start Options

### Option 1: Run Locally (Immediate)
1. Open `index.html` in your browser
2. The app will work in offline mode with sample data
3. Perfect for testing and development!

### Option 2: Full Setup with Firebase (Recommended)

#### Step 1: Firebase Project Setup
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a project"
3. Name it "SkillSwap" (or your preferred name)
4. Enable Google Analytics (optional)
5. Wait for project creation

#### Step 2: Firebase Database Setup
1. In your Firebase project, go to "Realtime Database"
2. Click "Create Database"
3. Choose "Start in test mode" for now
4. Select your preferred location
5. Copy the database URL (you'll need this)

#### Step 3: Get Firebase Configuration
1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click "Web" icon (</>) to add a web app
4. Register your app with a nickname
5. Copy the configuration object

#### Step 4: Update Configuration
1. Open `js/config.js`
2. Replace the Firebase config with your values:

```javascript
firebase: {
    apiKey: "your-actual-api-key",
    authDomain: "your-project.firebaseapp.com", 
    databaseURL: "https://your-project-default-rtdb.firebaseio.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "your-actual-app-id"
}
```

#### Step 5: EmailJS Setup (Optional)
1. Go to [EmailJS](https://www.emailjs.com)
2. Create a free account
3. Add your email service (Gmail, Outlook, etc.)
4. Create an email template with these variables:
   - `{{to_name}}` - Skill owner's name
   - `{{from_name}}` - Requester's name  
   - `{{skill_title}}` - The skill being requested
   - `{{message}}` - The request message
5. Get your Service ID, Template ID, and Public Key
6. Update `js/config.js`:

```javascript
emailjs: {
    serviceId: "your_service_id",
    templateId: "your_template_id",
    publicKey: "your_public_key"
}
```

#### Step 6: Deploy to Firebase Hosting (Optional)
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize hosting
firebase init hosting
# Choose your project
# Set public directory to "." (current directory)
# Configure as single-page app: Yes
# Don't overwrite index.html

# Deploy
firebase deploy
```

## Testing the App

### 1. Open Multiple Browser Windows
- Open the app in 2+ browser windows/tabs
- Each will get a different guest username
- Test the full flow: share skill → request → chat

### 2. Test Features
- **Share a Skill**: Use the "💡 Skills to Share" section
- **Request Learning**: Browse skills and click "📚 Request to Learn"
- **Chat**: If auto-accept is enabled, check the "💬 Chat" section
- **Notifications**: Watch for toast notifications and badges

### 3. Verify Real-time Features
- Share a skill in one window
- Check if it appears in another window immediately
- Send messages in chat and verify they appear instantly

## Troubleshooting

### Firebase Issues
**"Permission denied" errors:**
- Check your database rules in Firebase Console
- For testing, you can use these permissive rules:
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

**App loads but no real-time updates:**
- Verify your database URL is correct
- Check browser console for connection errors
- Make sure database rules allow reading

### EmailJS Issues
**Emails not sending:**
- Verify all EmailJS credentials are correct
- Check EmailJS dashboard for delivery status
- Ensure email template has required variables
- Test with a simple template first

### General Issues
**App not loading:**
- Check browser console for JavaScript errors
- Try running with a local server instead of file://
- Verify all file paths are correct

**Styles look broken:**
- Check if CSS file is loading correctly
- Verify Google Fonts are loading
- Try hard refresh (Ctrl+F5)

## Development Tips

### Local Development Server
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Using PHP  
php -S localhost:8000
```

### Customization
- **Colors**: Edit CSS variables in `styles/main.css`
- **Usernames**: Modify word lists in `js/config.js`
- **Sample Data**: Update `sampleSkills` in `js/config.js`
- **App Settings**: Adjust limits and features in `js/config.js`

### Browser DevTools
- **Console**: Check for JavaScript errors
- **Network**: Verify Firebase connections
- **Application > Local Storage**: View stored data
- **Application > Service Workers**: Check for caching issues

## Production Checklist

Before going live:

- [ ] Update Firebase database rules for security
- [ ] Set up proper EmailJS templates
- [ ] Test on multiple devices/browsers
- [ ] Verify all features work end-to-end
- [ ] Set up monitoring/analytics (optional)
- [ ] Configure custom domain (optional)

## Support

If you encounter issues:

1. Check the browser console for errors
2. Verify your configuration in `js/config.js`
3. Test in incognito/private browsing mode
4. Try with different browsers
5. Check Firebase Console for data and errors

The app is designed to work offline as a fallback, so you can always test locally even without Firebase setup!

---

**Happy skill sharing! 🎉**
