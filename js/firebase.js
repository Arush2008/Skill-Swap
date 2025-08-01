// Firebase Database Manager for SkillSwap
class FirebaseManager {
    constructor() {
        this.app = null;
        this.database = null;
        this.initialized = false;
        this.isOnline = true;
        this.localData = {
            skills: [],
            requests: [],
            chats: {}
        };
        
        // Initialize Firebase if config is available
        this.initFirebase();
        
        // Set up offline fallback
        this.setupOfflineMode();
    }

    async initFirebase() {
        try {
            // Check if Firebase is available and config is valid
            if (typeof firebase === 'undefined' && typeof window.firebase === 'undefined') {
                console.warn('Firebase not loaded, using local storage mode');
                this.isOnline = false;
                return;
            }

            // Use either global firebase or imported firebase
            const firebaseApp = window.firebase || firebase;
            
            // Initialize Firebase with config
            if (!this.app && CONFIG.firebase.apiKey && CONFIG.firebase.apiKey !== 'your-api-key-here') {
                this.app = firebaseApp.initializeApp(CONFIG.firebase);
                this.database = firebaseApp.database();
                this.initialized = true;
                console.log('Firebase initialized successfully');
                
                // Load initial data
                await this.loadInitialData();
            } else {
                console.warn('Firebase config not set, using local storage mode');
                this.isOnline = false;
            }
        } catch (error) {
            console.error('Firebase initialization failed:', error);
            this.isOnline = false;
            this.setupOfflineMode();
        }
    }

    setupOfflineMode() {
        // Load data from localStorage if available
        const savedData = localStorage.getItem('skillswap_data');
        if (savedData) {
            try {
                this.localData = JSON.parse(savedData);
            } catch (error) {
                console.error('Error loading local data:', error);
            }
        }
        
        // Add sample skills if no data exists
        if (this.localData.skills.length === 0) {
            this.localData.skills = CONFIG.sampleSkills.map(skill => ({
                id: this.generateId(),
                ...skill,
                timestamp: skill.timestamp || Date.now()
            }));
            this.saveLocalData();
        }
        
        console.log('Running in offline mode with local storage');
    }

    async loadInitialData() {
        try {
            // Load skills
            const skillsSnapshot = await this.database.ref('skills').once('value');
            const skills = skillsSnapshot.val() || {};
            
            // Convert to array format
            this.localData.skills = Object.keys(skills).map(key => ({
                id: key,
                ...skills[key]
            }));
            
            // If no skills exist, add sample skills
            if (this.localData.skills.length === 0) {
                for (const skill of CONFIG.sampleSkills) {
                    await this.addSkill(skill);
                }
            }
            
        } catch (error) {
            console.error('Error loading initial data:', error);
        }
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    saveLocalData() {
        localStorage.setItem('skillswap_data', JSON.stringify(this.localData));
    }

    // Skills Management
    async addSkill(skillData) {
        const skill = {
            id: this.generateId(),
            title: skillData.title,
            description: skillData.description,
            owner: skillData.owner,
            timestamp: Date.now()
        };

        try {
            if (this.initialized && this.isOnline) {
                await this.database.ref(`skills/${skill.id}`).set(skill);
            }
            
            // Always update local data
            this.localData.skills.unshift(skill);
            this.saveLocalData();
            
            return skill;
        } catch (error) {
            console.error('Error adding skill:', error);
            // Still add to local data even if Firebase fails
            this.localData.skills.unshift(skill);
            this.saveLocalData();
            return skill;
        }
    }

    async getSkills() {
        try {
            if (this.initialized && this.isOnline) {
                const snapshot = await this.database.ref('skills').once('value');
                const skills = snapshot.val() || {};
                return Object.keys(skills).map(key => ({
                    id: key,
                    ...skills[key]
                })).sort((a, b) => b.timestamp - a.timestamp);
            }
            
            return this.localData.skills.sort((a, b) => b.timestamp - a.timestamp);
        } catch (error) {
            console.error('Error getting skills:', error);
            return this.localData.skills.sort((a, b) => b.timestamp - a.timestamp);
        }
    }

    async deleteSkill(skillId, currentUser) {
        try {
            // Find skill and check ownership
            const skill = this.localData.skills.find(s => s.id === skillId);
            if (!skill || skill.owner !== currentUser) {
                throw new Error('Unauthorized or skill not found');
            }

            if (this.initialized && this.isOnline) {
                await this.database.ref(`skills/${skillId}`).remove();
            }
            
            // Remove from local data
            this.localData.skills = this.localData.skills.filter(s => s.id !== skillId);
            this.saveLocalData();
            
            return true;
        } catch (error) {
            console.error('Error deleting skill:', error);
            throw error;
        }
    }

    // Requests Management
    async sendRequest(requestData) {
        const request = {
            id: this.generateId(),
            skillId: requestData.skillId,
            skillTitle: requestData.skillTitle,
            skillOwner: requestData.skillOwner,
            requester: requestData.requester,
            message: requestData.message,
            status: CONFIG.app.autoAcceptRequests ? 'accepted' : 'pending',
            timestamp: Date.now()
        };

        try {
            if (this.initialized && this.isOnline) {
                await this.database.ref(`requests/${request.id}`).set(request);
            }
            
            // Add to local data
            this.localData.requests.push(request);
            this.saveLocalData();
            
            // If auto-accept is enabled, create chat room
            if (CONFIG.app.autoAcceptRequests) {
                await this.createChatRoom(request.skillOwner, request.requester, request.skillTitle);
            }
            
            return request;
        } catch (error) {
            console.error('Error sending request:', error);
            this.localData.requests.push(request);
            this.saveLocalData();
            return request;
        }
    }

    async getRequests(username) {
        try {
            if (this.initialized && this.isOnline) {
                const snapshot = await this.database.ref('requests').once('value');
                const requests = snapshot.val() || {};
                return Object.keys(requests)
                    .map(key => ({ id: key, ...requests[key] }))
                    .filter(req => req.requester === username)
                    .sort((a, b) => b.timestamp - a.timestamp);
            }
            
            return this.localData.requests
                .filter(req => req.requester === username)
                .sort((a, b) => b.timestamp - a.timestamp);
        } catch (error) {
            console.error('Error getting requests:', error);
            return this.localData.requests
                .filter(req => req.requester === username)
                .sort((a, b) => b.timestamp - a.timestamp);
        }
    }

    // Chat Management
    async createChatRoom(user1, user2, skillTitle) {
        const chatId = [user1, user2].sort().join('_');
        const chatRoom = {
            id: chatId,
            participants: [user1, user2],
            skillTitle: skillTitle,
            messages: [],
            lastActivity: Date.now(),
            created: Date.now()
        };

        try {
            if (this.initialized && this.isOnline) {
                await this.database.ref(`chats/${chatId}`).set(chatRoom);
            }
            
            this.localData.chats[chatId] = chatRoom;
            this.saveLocalData();
            
            return chatRoom;
        } catch (error) {
            console.error('Error creating chat room:', error);
            this.localData.chats[chatId] = chatRoom;
            this.saveLocalData();
            return chatRoom;
        }
    }

    async sendMessage(chatId, sender, message) {
        const messageData = {
            id: this.generateId(),
            sender: sender,
            message: message,
            timestamp: Date.now()
        };

        try {
            if (this.initialized && this.isOnline) {
                await this.database.ref(`chats/${chatId}/messages`).push(messageData);
                await this.database.ref(`chats/${chatId}/lastActivity`).set(Date.now());
            }
            
            // Update local data
            if (!this.localData.chats[chatId]) {
                this.localData.chats[chatId] = { messages: [] };
            }
            if (!this.localData.chats[chatId].messages) {
                this.localData.chats[chatId].messages = [];
            }
            
            this.localData.chats[chatId].messages.push(messageData);
            this.localData.chats[chatId].lastActivity = Date.now();
            this.saveLocalData();
            
            return messageData;
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    }

    async getChatRooms(username) {
        try {
            if (this.initialized && this.isOnline) {
                const snapshot = await this.database.ref('chats').once('value');
                const chats = snapshot.val() || {};
                return Object.keys(chats)
                    .map(key => ({ id: key, ...chats[key] }))
                    .filter(chat => chat.participants && chat.participants.includes(username))
                    .sort((a, b) => b.lastActivity - a.lastActivity);
            }
            
            return Object.keys(this.localData.chats)
                .map(key => ({ id: key, ...this.localData.chats[key] }))
                .filter(chat => chat.participants && chat.participants.includes(username))
                .sort((a, b) => b.lastActivity - a.lastActivity);
        } catch (error) {
            console.error('Error getting chat rooms:', error);
            return Object.keys(this.localData.chats)
                .map(key => ({ id: key, ...this.localData.chats[key] }))
                .filter(chat => chat.participants && chat.participants.includes(username))
                .sort((a, b) => b.lastActivity - a.lastActivity);
        }
    }

    async getChatMessages(chatId) {
        try {
            if (this.initialized && this.isOnline) {
                const snapshot = await this.database.ref(`chats/${chatId}/messages`).once('value');
                const messages = snapshot.val() || {};
                return Object.keys(messages)
                    .map(key => ({ id: key, ...messages[key] }))
                    .sort((a, b) => a.timestamp - b.timestamp);
            }
            
            const chat = this.localData.chats[chatId];
            return chat ? (chat.messages || []).sort((a, b) => a.timestamp - b.timestamp) : [];
        } catch (error) {
            console.error('Error getting chat messages:', error);
            const chat = this.localData.chats[chatId];
            return chat ? (chat.messages || []).sort((a, b) => a.timestamp - b.timestamp) : [];
        }
    }

    // Listen for real-time updates (if Firebase is available)
    onSkillsChange(callback) {
        if (this.initialized && this.isOnline) {
            this.database.ref('skills').on('value', (snapshot) => {
                const skills = snapshot.val() || {};
                const skillsArray = Object.keys(skills).map(key => ({
                    id: key,
                    ...skills[key]
                })).sort((a, b) => b.timestamp - a.timestamp);
                callback(skillsArray);
            });
        }
    }

    onChatMessages(chatId, callback) {
        if (this.initialized && this.isOnline) {
            this.database.ref(`chats/${chatId}/messages`).on('value', (snapshot) => {
                const messages = snapshot.val() || {};
                const messagesArray = Object.keys(messages)
                    .map(key => ({ id: key, ...messages[key] }))
                    .sort((a, b) => a.timestamp - b.timestamp);
                callback(messagesArray);
            });
        }
    }
}

// Create global instance
const db = new FirebaseManager();
