// AmbuQuick - Single Page Application Logic
// State management and navigation

let currentScreen = 'homeScreen';
let sosCountdownTimer = null;
let sosCountdown = 10;

// Navigation function
function navigateTo(screenId) {
    // Hide current screen
    const currentEl = document.getElementById(currentScreen);
    if (currentEl) {
        currentEl.classList.remove('active');
    }

    // Show new screen
    const newEl = document.getElementById(screenId);
    if (newEl) {
        newEl.classList.add('active');
        currentScreen = screenId;

        // Special handling for SOS screen
        if (screenId === 'sosScreen') {
            startSOSCountdown();
        } else if (sosCountdownTimer) {
            clearInterval(sosCountdownTimer);
        }
    }

    // Scroll to top
    window.scrollTo(0, 0);
}

// SOS Countdown Logic
function startSOSCountdown() {
    sosCountdown = 10;
    const countdownEl = document.getElementById('sosCountdown');
    const progressRing = document.getElementById('sosProgressRing');
    const circumference = 2 * Math.PI * 100;

    // Update progress ring
    const updateProgress = (timeLeft) => {
        const offset = circumference - (timeLeft / 10) * circumference;
        progressRing.style.strokeDashoffset = offset;
    };

    // Initialize
    updateProgress(10);

    // Start countdown
    sosCountdownTimer = setInterval(() => {
        sosCountdown--;
        countdownEl.textContent = sosCountdown;
        updateProgress(sosCountdown);

        if (sosCountdown <= 0) {
            clearInterval(sosCountdownTimer);
            navigateTo('sosConfirmScreen');
        }
    }, 1000);
}

// Cancel SOS
document.addEventListener('DOMContentLoaded', () => {
    const cancelBtn = document.getElementById('cancelSOS');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to cancel the SOS alert?')) {
                clearInterval(sosCountdownTimer);
                navigateTo('homeScreen');
            }
        });
    }
});

// Chatbot Logic
let isChatOpen = false;
const chatToggle = document.getElementById('chatToggle');
const chatWindow = document.getElementById('chatWindow');
const closeChat = document.getElementById('closeChat');
const chatForm = document.getElementById('chatForm');
const messageInput = document.getElementById('messageInput');
const chatMessages = document.getElementById('chatMessages');
const chatBadge = document.getElementById('chatBadge');

function toggleChat() {
    isChatOpen = !isChatOpen;
    if (isChatOpen) {
        chatWindow.classList.remove('chat-hidden');
        chatWindow.classList.add('chat-visible');
        chatBadge.style.display = 'none';
        messageInput.focus();
    } else {
        chatWindow.classList.remove('chat-visible');
        chatWindow.classList.add('chat-hidden');
    }
}

chatToggle.addEventListener('click', toggleChat);
closeChat.addEventListener('click', toggleChat);

// Add user message to chat
function addUserMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'flex items-end gap-2 justify-end';
    messageDiv.innerHTML = `
        <div class="flex flex-col gap-1 items-end">
            <div class="max-w-[260px] rounded-2xl rounded-br-sm px-4 py-3 bg-primary-blue text-white shadow-sm">
                <p class="text-sm">${escapeHtml(text)}</p>
            </div>
            <p class="text-xs text-text-gray px-2">Just now</p>
        </div>
    `;
    chatMessages.appendChild(messageDiv);
    scrollChatToBottom();
}

// Add bot message to chat
function addBotMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'flex items-end gap-2';
    messageDiv.innerHTML = `
        <div class="w-8 h-8 rounded-full bg-primary-blue flex items-center justify-center flex-shrink-0 shadow">
            <span class="material-symbols-outlined text-white text-lg">smart_toy</span>
        </div>
        <div class="flex flex-col gap-1">
            <div class="max-w-[260px] rounded-2xl rounded-bl-sm px-4 py-3 bg-white dark:bg-gray-700 shadow-sm">
                <p class="text-sm text-text-dark dark:text-white">${text}</p>
            </div>
            <p class="text-xs text-text-gray px-2">Just now</p>
        </div>
    `;
    chatMessages.appendChild(messageDiv);
    scrollChatToBottom();
}

// Chatbot response logic
function getBotResponse(userMessage) {
    const msg = userMessage.toLowerCase().trim();
    
    if (msg.includes('book') || msg.includes('ambulance')) {
        setTimeout(() => navigateTo('bookingScreen'), 1000);
        return '🚑 Great! I\'ll take you to the booking form where you can provide your details.';
    } else if (msg.includes('emergency') || msg.includes('sos')) {
        return '🚨 For immediate emergency:<br><br>• Click the <b class="text-emergency-red">SOS button</b> on the home page<br>• Or call emergency: <b>102</b>';
    } else if (msg.includes('status') || msg.includes('track')) {
        return '📍 Your ambulance is en route! ETA: 8 minutes. Driver: Rajesh Kumar.';
    } else if (msg.includes('help') || msg.includes('assist')) {
        return 'ℹ️ I can help you with:<br><br>• <b>Booking an ambulance</b><br>• <b>Emergency assistance</b><br>• <b>Tracking your booking</b><br><br>What would you like to do?';
    } else if (msg.includes('hi') || msg.includes('hello') || msg.includes('hey')) {
        return '👋 Hello! How can I assist you with AmbuQuick today?';
    } else if (msg.includes('thank')) {
        return '😊 You\'re welcome! Stay safe. Anything else I can help with?';
    } else if (msg.includes('cancel')) {
        return 'To cancel a booking, please contact our support team at <b>1-800-AMBUQUICK</b>.';
    } else if (msg.includes('cost') || msg.includes('price') || msg.includes('fee')) {
        return '💰 Pricing varies by distance and urgency. Standard bookings start at $50. Emergency services are prioritized.';
    } else {
        return 'I understand you need assistance. Try asking about:<br><br>• <b>Booking an ambulance</b><br>• <b>Emergency help</b><br>• <b>Booking status</b><br>• <b>Pricing</b>';
    }
}

// Handle chat form submission
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value.trim();
    if (message) {
        addUserMessage(message);
        messageInput.value = '';
        
        // Simulate bot typing delay
        setTimeout(() => {
            const response = getBotResponse(message);
            addBotMessage(response);
        }, 500);
    }
});

// Utility functions
function scrollChatToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Prevent accidental page leave during SOS
window.addEventListener('beforeunload', (e) => {
    if (currentScreen === 'sosScreen' && sosCountdown > 0) {
        e.preventDefault();
        e.returnValue = 'SOS is active. Are you sure you want to leave?';
    }
});

// Initialize app
console.log('AmbuQuick SPA loaded successfully');
console.log('Current screen:', currentScreen);
