// SkillSwap Utility Functions and Main App Logic

// Global state
let currentUser = null;
let currentSection = 'learn';
let currentChatId = null;
let chatInterval = null;

// Username Generator
function generateUsername() {
    const adjectives = CONFIG.usernameGenerator.adjectives;
    const nouns = CONFIG.usernameGenerator.nouns;
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const number = Math.floor(Math.random() * 100);
    return `${adjective}${noun}${number}`;
}

// Toast Notifications
function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, CONFIG.app.toastDuration);
}

// Loading Spinner
function showLoading() {
    document.getElementById('loadingSpinner').classList.remove('hidden');
}

function hideLoading() {
    document.getElementById('loadingSpinner').classList.add('hidden');
}

// Time formatting
function formatTimeAgo(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
}

// Initialize the app
async function initApp() {
    try {
        // Generate username for guest
        currentUser = generateUsername();
        
        // Show welcome modal
        showWelcomeModal();
        
        // Initialize EmailJS if configured
        initEmailJS();
        
        // Set up event listeners
        setupEventListeners();
        
    } catch (error) {
        console.error('Error initializing app:', error);
        showToast('Error initializing app. Please refresh the page.', 'error');
    }
}

function showWelcomeModal() {
    const modal = document.getElementById('welcomeModal');
    const welcomeText = document.getElementById('guestWelcome');
    
    welcomeText.textContent = `Welcome, ${currentUser}! Ready to learn or share a skill?`;
    modal.style.display = 'flex';
}

function initEmailJS() {
    if (CONFIG.emailjs.publicKey && CONFIG.emailjs.publicKey !== 'your_public_key') {
        emailjs.init(CONFIG.emailjs.publicKey);
    }
}

function setupEventListeners() {
    // Welcome modal
    document.getElementById('startButton').addEventListener('click', startApp);
    
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const section = e.currentTarget.dataset.section;
            switchSection(section);
        });
    });
    
    // Share skill form
    document.getElementById('shareSkillForm').addEventListener('submit', handleShareSkill);
    
    // Request modal
    document.getElementById('closeRequestModal').addEventListener('click', closeRequestModal);
    document.getElementById('cancelRequest').addEventListener('click', closeRequestModal);
    document.getElementById('sendRequest').addEventListener('click', handleSendRequest);
    
    // Chat modal
    document.getElementById('closeChatModal').addEventListener('click', closeChatModal);
    document.getElementById('sendMessage').addEventListener('click', sendChatMessage);
    document.getElementById('messageInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendChatMessage();
        }
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
}

async function startApp() {
    try {
        showLoading();
        
        // Hide welcome modal
        document.getElementById('welcomeModal').style.display = 'none';
        
        // Show app
        document.getElementById('app').style.display = 'grid';
        
        // Update user display
        document.getElementById('userDisplay').textContent = currentUser;
        
        // Load initial data
        await loadSkills();
        await loadRequests();
        await loadChats();
        
        // Set up real-time listeners if Firebase is available
        if (db.initialized) {
            db.onSkillsChange(updateSkillsDisplay);
        }
        
        hideLoading();
        showToast(`Welcome to SkillSwap, ${currentUser}! 🎉`);
        
    } catch (error) {
        console.error('Error starting app:', error);
        hideLoading();
        showToast('Error starting app. Please try again.', 'error');
    }
}

function switchSection(section) {
    // Update navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-section="${section}"]`).classList.add('active');
    
    // Update content sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(`${section}Section`).classList.add('active');
    
    currentSection = section;
    
    // Load section-specific data
    if (section === 'learn') {
        loadSkills();
    } else if (section === 'requests') {
        loadRequests();
    } else if (section === 'chat') {
        loadChats();
    }
}

// Skills Management
async function loadSkills() {
    try {
        const skills = await db.getSkills();
        updateSkillsDisplay(skills);
    } catch (error) {
        console.error('Error loading skills:', error);
        showToast('Error loading skills', 'error');
    }
}

function updateSkillsDisplay(skills) {
    const skillsGrid = document.getElementById('skillsGrid');
    const noSkillsMessage = document.getElementById('noSkillsMessage');
    
    if (skills.length === 0) {
        skillsGrid.style.display = 'none';
        noSkillsMessage.style.display = 'block';
        return;
    }
    
    skillsGrid.style.display = 'grid';
    noSkillsMessage.style.display = 'none';
    
    skillsGrid.innerHTML = skills.map(skill => `
        <div class="skill-card" data-skill-id="${skill.id}">
            <div class="skill-header">
                <div>
                    <h3 class="skill-title">${escapeHtml(skill.title)}</h3>
                    <span class="skill-owner">by ${escapeHtml(skill.owner)}</span>
                </div>
                <small style="color: var(--text-muted);">${formatTimeAgo(skill.timestamp)}</small>
            </div>
            <p class="skill-description">${escapeHtml(skill.description)}</p>
            <div class="skill-actions">
                ${skill.owner === currentUser ? 
                    `<button class="btn btn-secondary" onclick="deleteSkill('${skill.id}')">🗑️ Delete</button>` :
                    `<button class="btn btn-primary" onclick="requestSkill('${skill.id}', '${escapeHtml(skill.title)}', '${escapeHtml(skill.owner)}')">
                        📚 Request to Learn
                    </button>`
                }
            </div>
        </div>
    `).join('');
    
    // Update my skills section
    updateMySkills(skills.filter(skill => skill.owner === currentUser));
}

function updateMySkills(mySkills) {
    const mySkillsList = document.getElementById('mySkillsList');
    
    if (mySkills.length === 0) {
        mySkillsList.innerHTML = '<p style="text-align: center; color: var(--text-muted);">You haven\'t shared any skills yet.</p>';
        return;
    }
    
    mySkillsList.innerHTML = mySkills.map(skill => `
        <div class="skill-card">
            <div class="skill-header">
                <h3 class="skill-title">${escapeHtml(skill.title)}</h3>
                <small style="color: var(--text-muted);">${formatTimeAgo(skill.timestamp)}</small>
            </div>
            <p class="skill-description">${escapeHtml(skill.description)}</p>
            <div class="skill-actions">
                <button class="btn btn-secondary" onclick="deleteSkill('${skill.id}')">🗑️ Delete</button>
            </div>
        </div>
    `).join('');
}

async function handleShareSkill(e) {
    e.preventDefault();
    
    const title = document.getElementById('skillTitle').value.trim();
    const description = document.getElementById('skillDescription').value.trim();
    
    if (!title || !description) {
        showToast('Please fill in all fields', 'warning');
        return;
    }
    
    if (title.length > CONFIG.app.maxSkillTitleLength) {
        showToast(`Title must be less than ${CONFIG.app.maxSkillTitleLength} characters`, 'warning');
        return;
    }
    
    if (description.length > CONFIG.app.maxSkillDescriptionLength) {
        showToast(`Description must be less than ${CONFIG.app.maxSkillDescriptionLength} characters`, 'warning');
        return;
    }
    
    try {
        showLoading();
        
        await db.addSkill({
            title: title,
            description: description,
            owner: currentUser
        });
        
        // Clear form
        document.getElementById('shareSkillForm').reset();
        
        // Reload skills
        await loadSkills();
        
        hideLoading();
        showToast('Skill shared successfully! 🎉');
        
    } catch (error) {
        console.error('Error sharing skill:', error);
        hideLoading();
        showToast('Error sharing skill. Please try again.', 'error');
    }
}

async function deleteSkill(skillId) {
    if (!confirm('Are you sure you want to delete this skill?')) {
        return;
    }
    
    try {
        showLoading();
        await db.deleteSkill(skillId, currentUser);
        await loadSkills();
        hideLoading();
        showToast('Skill deleted successfully');
    } catch (error) {
        console.error('Error deleting skill:', error);
        hideLoading();
        showToast('Error deleting skill', 'error');
    }
}

// Request Management
function requestSkill(skillId, skillTitle, skillOwner) {
    if (skillOwner === currentUser) {
        showToast('You cannot request your own skill', 'warning');
        return;
    }
    
    // Show request modal
    document.getElementById('requestSkillInfo').textContent = `Request to learn "${skillTitle}" from ${skillOwner}`;
    document.getElementById('requestModal').style.display = 'flex';
    
    // Store request data for later use
    document.getElementById('sendRequest').dataset.skillId = skillId;
    document.getElementById('sendRequest').dataset.skillTitle = skillTitle;
    document.getElementById('sendRequest').dataset.skillOwner = skillOwner;
}

function closeRequestModal() {
    document.getElementById('requestModal').style.display = 'none';
    document.getElementById('requestMessage').value = '';
}

async function handleSendRequest() {
    const message = document.getElementById('requestMessage').value.trim();
    const sendButton = document.getElementById('sendRequest');
    
    if (!message) {
        showToast('Please write a message', 'warning');
        return;
    }
    
    if (message.length > CONFIG.app.maxMessageLength) {
        showToast(`Message must be less than ${CONFIG.app.maxMessageLength} characters`, 'warning');
        return;
    }
    
    try {
        showLoading();
        
        const requestData = {
            skillId: sendButton.dataset.skillId,
            skillTitle: sendButton.dataset.skillTitle,
            skillOwner: sendButton.dataset.skillOwner,
            requester: currentUser,
            message: message
        };
        
        const request = await db.sendRequest(requestData);
        
        // Send email notification if EmailJS is configured
        await sendEmailNotification(requestData);
        
        closeRequestModal();
        hideLoading();
        
        if (CONFIG.app.autoAcceptRequests) {
            showToast('Request sent and auto-accepted! You can now chat. 💬');
            // Update requests and chats
            await loadRequests();
            await loadChats();
        } else {
            showToast('Request sent successfully! 📤');
            await loadRequests();
        }
        
    } catch (error) {
        console.error('Error sending request:', error);
        hideLoading();
        showToast('Error sending request. Please try again.', 'error');
    }
}

async function sendEmailNotification(requestData) {
    if (!CONFIG.emailjs.serviceId || CONFIG.emailjs.serviceId === 'your_service_id') {
        console.log('EmailJS not configured, skipping email notification');
        return;
    }
    
    try {
        const templateParams = {
            to_name: requestData.skillOwner,
            from_name: requestData.requester,
            skill_title: requestData.skillTitle,
            message: requestData.message,
            reply_to: 'noreply@skillswap.com'
        };
        
        await emailjs.send(CONFIG.emailjs.serviceId, CONFIG.emailjs.templateId, templateParams);
        console.log('Email notification sent successfully');
    } catch (error) {
        console.error('Error sending email notification:', error);
        // Don't show error to user since request was still successful
    }
}

async function loadRequests() {
    try {
        const requests = await db.getRequests(currentUser);
        updateRequestsDisplay(requests);
        
        // Update badge count
        document.getElementById('requestsCount').textContent = requests.length;
    } catch (error) {
        console.error('Error loading requests:', error);
        showToast('Error loading requests', 'error');
    }
}

function updateRequestsDisplay(requests) {
    const requestsList = document.getElementById('requestsList');
    const noRequestsMessage = document.getElementById('noRequestsMessage');
    
    if (requests.length === 0) {
        requestsList.style.display = 'none';
        noRequestsMessage.style.display = 'block';
        return;
    }
    
    requestsList.style.display = 'block';
    noRequestsMessage.style.display = 'none';
    
    requestsList.innerHTML = requests.map(request => `
        <div class="request-item">
            <div class="request-header">
                <span class="request-skill">${escapeHtml(request.skillTitle)}</span>
                <span class="request-status status-${request.status}">${request.status}</span>
            </div>
            <div class="request-message">"${escapeHtml(request.message)}"</div>
            <small style="color: var(--text-muted);">To: ${escapeHtml(request.skillOwner)} • ${formatTimeAgo(request.timestamp)}</small>
            ${request.status === 'accepted' ? 
                `<button class="btn btn-primary mt-lg" onclick="openChat('${request.skillOwner}', '${escapeHtml(request.skillTitle)}')">
                    💬 Start Chat
                </button>` : ''
            }
        </div>
    `).join('');
}

// Chat Management
async function loadChats() {
    try {
        const chatRooms = await db.getChatRooms(currentUser);
        updateChatsDisplay(chatRooms);
        
        // Update notification badge if there are new messages
        const hasNewMessages = chatRooms.some(chat => 
            chat.lastActivity > (localStorage.getItem(`lastSeen_${chat.id}`) || 0)
        );
        
        const badge = document.getElementById('chatNotifications');
        if (hasNewMessages) {
            badge.textContent = chatRooms.length;
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
        
    } catch (error) {
        console.error('Error loading chats:', error);
        showToast('Error loading chats', 'error');
    }
}

function updateChatsDisplay(chatRooms) {
    const chatList = document.getElementById('chatList');
    const noChatMessage = document.getElementById('noChatMessage');
    
    if (chatRooms.length === 0) {
        chatList.style.display = 'none';
        noChatMessage.style.display = 'block';
        return;
    }
    
    chatList.style.display = 'block';
    noChatMessage.style.display = 'none';
    
    chatList.innerHTML = chatRooms.map(chat => {
        const otherUser = chat.participants.find(p => p !== currentUser);
        const lastSeen = localStorage.getItem(`lastSeen_${chat.id}`) || 0;
        const hasNewMessages = chat.lastActivity > lastSeen;
        
        return `
            <div class="chat-item ${hasNewMessages ? 'has-new' : ''}" onclick="openChatRoom('${chat.id}', '${escapeHtml(otherUser)}', '${escapeHtml(chat.skillTitle)}')">
                <h4>💬 Chat with ${escapeHtml(otherUser)}</h4>
                <p>About: ${escapeHtml(chat.skillTitle)}</p>
                <small style="color: var(--text-muted);">Last activity: ${formatTimeAgo(chat.lastActivity)}</small>
                ${hasNewMessages ? '<span class="new-indicator">•</span>' : ''}
            </div>
        `;
    }).join('');
}

async function openChat(otherUser, skillTitle) {
    // Create chat room if it doesn't exist
    await db.createChatRoom(currentUser, otherUser, skillTitle);
    
    // Open chat modal
    const chatId = [currentUser, otherUser].sort().join('_');
    await openChatRoom(chatId, otherUser, skillTitle);
}

async function openChatRoom(chatId, otherUser, skillTitle) {
    currentChatId = chatId;
    
    // Update modal title
    document.getElementById('chatTitle').textContent = `💬 Chat with ${otherUser}`;
    
    // Show modal
    document.getElementById('chatModal').style.display = 'flex';
    
    // Load messages
    await loadChatMessages();
    
    // Mark as seen
    localStorage.setItem(`lastSeen_${chatId}`, Date.now().toString());
    
    // Set up real-time message updates
    if (db.initialized) {
        db.onChatMessages(chatId, updateChatMessages);
    } else {
        // Fallback: poll for new messages
        chatInterval = setInterval(loadChatMessages, 3000);
    }
}

function closeChatModal() {
    document.getElementById('chatModal').style.display = 'none';
    currentChatId = null;
    
    if (chatInterval) {
        clearInterval(chatInterval);
        chatInterval = null;
    }
    
    // Reload chats to update notifications
    loadChats();
}

async function loadChatMessages() {
    if (!currentChatId) return;
    
    try {
        const messages = await db.getChatMessages(currentChatId);
        updateChatMessages(messages);
    } catch (error) {
        console.error('Error loading chat messages:', error);
    }
}

function updateChatMessages(messages) {
    const chatMessages = document.getElementById('chatMessages');
    
    chatMessages.innerHTML = messages.map(message => `
        <div class="message ${message.sender === currentUser ? 'message-sent' : 'message-received'}">
            <div class="message-content">${escapeHtml(message.message)}</div>
            <small style="opacity: 0.7; font-size: 0.8rem;">${formatTimeAgo(message.timestamp)}</small>
        </div>
    `).join('');
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function sendChatMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();
    
    if (!message || !currentChatId) return;
    
    if (message.length > CONFIG.app.maxMessageLength) {
        showToast(`Message must be less than ${CONFIG.app.maxMessageLength} characters`, 'warning');
        return;
    }
    
    try {
        await db.sendMessage(currentChatId, currentUser, message);
        messageInput.value = '';
        
        // If not using real-time updates, reload messages manually
        if (!db.initialized) {
            await loadChatMessages();
        }
        
    } catch (error) {
        console.error('Error sending message:', error);
        showToast('Error sending message', 'error');
    }
}

// Utility Functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Add some CSS for new message indicator
const additionalStyles = `
    .chat-item.has-new {
        border-left: 4px solid var(--green);
        position: relative;
    }
    
    .new-indicator {
        position: absolute;
        top: 10px;
        right: 10px;
        width: 10px;
        height: 10px;
        background: var(--green);
        border-radius: 50%;
        animation: pulse 2s infinite;
    }
    
    .message-content {
        margin-bottom: 4px;
    }
`;

// Add styles to head
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);
