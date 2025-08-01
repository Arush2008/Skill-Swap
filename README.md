# SkillSwap 🚀

A modern, Gen-Z styled skill-sharing platform where users can join as guests, share their skills, and connect with others to learn new things!

## ✨ Features

### 🧠 **Skills to Learn**
- Browse all skills shared by the community
- Request to learn from skill owners
- Modern card-based interface with smooth animations

### 💡 **Skills to Share**
- Post your skills with title and description
- Manage your shared skills
- Help others learn something new

### ✉️ **Requests Sent**
- Track all your learning requests
- See request status (pending/accepted)
- Auto-acceptance for MVP experience

### 💬 **Chat**
- Real-time messaging with skill owners
- Clean, modern chat interface
- Message history and notifications

## 🎨 Design Features

- **Gen-Z Aesthetic**: Gradient backgrounds, glassmorphism effects, modern typography
- **Responsive Design**: Works perfectly on desktop and mobile
- **Smooth Animations**: Hover effects, page transitions, and micro-interactions
- **Toast Notifications**: Beautiful feedback for user actions
- **Loading States**: Elegant spinners and progress indicators

## 🛠️ Technical Stack

- **Frontend**: Pure HTML5, CSS3, JavaScript (ES6+)
- **Database**: Firebase Realtime Database (with offline fallback)
- **Email**: EmailJS for request notifications
- **Hosting**: Firebase Hosting ready
- **Fonts**: Google Fonts (Poppins)
- **Icons**: Font Awesome

## 🚀 Quick Start

### 1. **Clone & Setup**
```bash
git clone [your-repo-url]
cd skillswap
```

### 2. **Firebase Setup** (Optional)
1. Create a Firebase project at https://console.firebase.google.com
2. Enable Realtime Database
3. Copy your config to `js/config.js`:

```javascript
firebase: {
    apiKey: "your-api-key",
    authDomain: "your-project.firebaseapp.com",
    databaseURL: "https://your-project-default-rtdb.firebaseio.com",
    projectId: "your-project",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "your-app-id"
}
```

### 3. **EmailJS Setup** (Optional)
1. Create account at https://www.emailjs.com
2. Create email service and template
3. Update `js/config.js`:

```javascript
emailjs: {
    serviceId: "your_service_id",
    templateId: "your_template_id",
    publicKey: "your_public_key"
}
```

### 4. **Deploy to Firebase** (Optional)
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

### 5. **Or Run Locally**
Simply open `index.html` in your browser, or use a local server:

```bash
# Python
python -m http.server 8000

# Node.js
npx serve .

# PHP
php -S localhost:8000
```

## 🔧 Configuration

The app works in three modes:

1. **Full Mode**: With Firebase + EmailJS (complete functionality)
2. **Firebase Only**: Real-time database without email notifications
3. **Offline Mode**: Local storage only (perfect for testing)

## 📱 Features Overview

### Guest Mode
- **Random Usernames**: Generated like `CreativeGuru42`, `BraveTaco17`
- **No Authentication**: Jump right in and start sharing/learning
- **Session Persistence**: Your username stays consistent during your session

### Skill Sharing
- **Rich Text Support**: Emojis and formatted descriptions
- **Real-time Updates**: See new skills appear instantly
- **Ownership Management**: Edit/delete your own skills

### Request System
- **Email Notifications**: Skill owners get notified via email
- **Custom Messages**: Personal touch for each request
- **Auto-acceptance**: MVP feature for immediate chat access

### Chat System
- **Real-time Messaging**: Instant message delivery
- **Message History**: Persistent conversation history
- **User-friendly Interface**: Modern chat bubbles and timestamps

## 🎯 Roadmap

### Phase 1 (Current - MVP)
- ✅ Guest user system
- ✅ Skill sharing and browsing
- ✅ Request system with email notifications
- ✅ Real-time chat functionality

### Phase 2 (Future Enhancements)
- 🔮 Rating system after chat completion
- 🔮 Skill categories and filtering
- 🔮 Save favorite skills
- 🔮 Dark/light mode toggle
- 🔮 QR code sharing for skills
- 🔮 Voice/video call integration
- 🔮 File sharing in chats

### Phase 3 (Advanced Features)
- 🔮 User profiles with avatars
- 🔮 Skill verification badges
- 🔮 Community challenges
- 🔮 Mentorship programs
- 🔮 Integration with calendar apps

## 🎨 Customization

### Colors
Edit CSS variables in `styles/main.css`:
```css
:root {
    --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --secondary-gradient: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    /* ... more variables */
}
```

### Username Generation
Customize wordlists in `js/config.js`:
```javascript
usernameGenerator: {
    adjectives: ['Amazing', 'Brave', 'Creative', /* add more */],
    nouns: ['Coder', 'Artist', 'Builder', /* add more */]
}
```

### Sample Skills
Add your own sample skills in `js/config.js`:
```javascript
sampleSkills: [
    {
        title: "Your Skill Title",
        description: "Your skill description...",
        owner: "SampleUser42"
    }
]
```

## 📋 Browser Support

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+

## 🐛 Troubleshooting

### Common Issues

**Skills not loading?**
- Check browser console for errors
- Verify Firebase configuration
- Try refreshing the page

**Chat not working?**
- Ensure both Firebase and real-time database are set up
- Check network connectivity
- Verify database rules allow read/write

**Email notifications not sending?**
- Verify EmailJS configuration
- Check EmailJS dashboard for delivery status
- Ensure template ID matches

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Design Inspiration**: Modern Gen-Z aesthetic trends
- **Icons**: Font Awesome
- **Fonts**: Google Fonts (Poppins)
- **Backend**: Firebase for real-time functionality
- **Email Service**: EmailJS for seamless notifications

---

**Built with ❤️ for the learning community**

*Ready to share your skills and learn something new? Let's get started! 🚀*
