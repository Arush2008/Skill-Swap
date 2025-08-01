// SkillSwap Configuration
const CONFIG = {
    // Firebase Configuration (Replace with your Firebase config)
    firebase: {
        apiKey: "your-api-key-here",
        authDomain: "skillswap-app.firebaseapp.com",
        databaseURL: "https://skillswap-app-default-rtdb.firebaseio.com",
        projectId: "skillswap-app",
        storageBucket: "skillswap-app.appspot.com",
        messagingSenderId: "123456789",
        appId: "1:123456789:web:abcdef123456"
    },
    
    // EmailJS Configuration (Replace with your EmailJS credentials)
    emailjs: {
        serviceId: "your_service_id",
        templateId: "your_template_id", 
        publicKey: "your_public_key"
    },
    
    // App Settings
    app: {
        maxSkillTitleLength: 100,
        maxSkillDescriptionLength: 500,
        maxMessageLength: 1000,
        autoAcceptRequests: true, // For MVP, auto-accept requests to enable chat
        toastDuration: 3000
    },
    
    // Guest Username Generation
    usernameGenerator: {
        adjectives: [
            'Amazing', 'Brave', 'Creative', 'Dynamic', 'Epic', 'Fantastic', 
            'Genius', 'Happy', 'Incredible', 'Joyful', 'Kind', 'Legendary',
            'Magical', 'Noble', 'Outstanding', 'Powerful', 'Quirky', 'Radiant',
            'Stellar', 'Talented', 'Ultimate', 'Vibrant', 'Wise', 'Xenial',
            'Young', 'Zealous', 'Cosmic', 'Digital', 'Electric', 'Future',
            'Neon', 'Pixel', 'Retro', 'Cyber', 'Mint', 'Pastel', 'Vibes',
            'Cool', 'Fresh', 'Smooth', 'Swift', 'Bright', 'Sharp', 'Smart'
        ],
        nouns: [
            'Coder', 'Artist', 'Builder', 'Creator', 'Designer', 'Explorer',
            'Guru', 'Hero', 'Inventor', 'Jedi', 'Knight', 'Leader',
            'Maker', 'Ninja', 'Oracle', 'Pioneer', 'Queen', 'Rebel',
            'Star', 'Titan', 'User', 'Visionary', 'Wizard', 'Expert',
            'Yogi', 'Zen', 'Taco', 'Pizza', 'Cookie', 'Donut', 'Muffin',
            'Burrito', 'Waffle', 'Pancake', 'Unicorn', 'Dragon', 'Phoenix',
            'Tiger', 'Lion', 'Eagle', 'Wolf', 'Bear', 'Shark', 'Dolphin'
        ]
    },
    
    // Sample Skills (for demonstration)
    sampleSkills: [
        {
            title: "Video Editing with DaVinci Resolve",
            description: "I can teach you professional video editing techniques using DaVinci Resolve. From basic cuts to advanced color grading and effects.",
            owner: "CreativeGuru42",
            timestamp: Date.now() - 3600000 // 1 hour ago
        },
        {
            title: "Guitar for Beginners",
            description: "Learn to play your favorite songs on guitar! I'll teach you chords, strumming patterns, and basic music theory.",
            owner: "MusicalWizard23",
            timestamp: Date.now() - 7200000 // 2 hours ago
        },
        {
            title: "Web Development Fundamentals",
            description: "Master HTML, CSS, and JavaScript to build your own websites. Perfect for complete beginners!",
            owner: "CodeNinja99",
            timestamp: Date.now() - 10800000 // 3 hours ago
        }
    ]
};

// Export configuration for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
