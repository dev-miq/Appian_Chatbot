// your code goes here
// Elements
const chatbotIcon = document.getElementById('chatbotIcon');
const chatbotWindow = document.getElementById('chatbotWindow');
const chatbotHeader = document.getElementById('chatbotHeader');
const chatbotMessages = document.getElementById('chatbotMessages');
const chatbotForm = document.getElementById('chatbotForm');
const chatbotInput = document.getElementById('chatbotInput');

// Show chat window
chatbotIcon.addEventListener('click', () => {
  chatbotWindow.classList.add('active');
  chatbotIcon.style.display = 'none';
  setTimeout(() => chatbotInput.focus(), 350);
});

// Minimize chat window
chatbotHeader.addEventListener('click', () => {
  chatbotWindow.classList.remove('active');
  setTimeout(() => {
    chatbotIcon.style.display = 'flex';
  }, 300);
});

// Helper to create message
function createMessage(content, isUser = false, isLoading = false) {
  const msg = document.createElement('div');
  msg.className = 'chatbot-message' + (isUser ? ' user' : '');
  const avatar = document.createElement('div');
  avatar.className = 'chatbot-avatar';
  avatar.innerHTML = isUser
    ? `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#ececec"/><circle cx="12" cy="10" r="4" fill="#bbb"/><ellipse cx="12" cy="17" rx="6" ry="3" fill="#bbb"/></svg>`
    : `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 7v5l4 2" stroke="#fff" stroke-width="2" fill="none"/></svg>`;
  const bubble = document.createElement('div');
  bubble.className = 'chatbot-bubble';
  if (isLoading) {
    bubble.innerHTML = `<span class="loading-dots">
      <span></span><span></span><span></span>
    </span>`;
  } else {
    bubble.textContent = content;
  }
  msg.appendChild(avatar);
  msg.appendChild(bubble);
  return msg;
}

// Scroll to bottom
function scrollToBottom() {
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

// Typewriter effect (word by word)
function typeWriter(element, text, delay = 70) {
  element.textContent = '';
  const words = text.split(' ');
  let i = 0;
  function typeNext() {
    if (i < words.length) {
      element.textContent += (i > 0 ? ' ' : '') + words[i];
      i++;
      scrollToBottom();
      setTimeout(typeNext, delay + Math.random() * 40);
    }
  }
  typeNext();
}

// Simulate bot response (replace with real API call as needed)
function getBotReply(userMsg) {
  // For demonstration, echo and add a canned reply
  const responses = [
    "Hello! How can I assist you today?",
    "I'm here to help. Ask me anything!",
    "That's interesting. Tell me more.",
    "Let me think about that...",
    "Here's what I found regarding your query."
  ];
  // Pick a random response
  return responses[Math.floor(Math.random() * responses.length)];
}

// Handle form submit
chatbotForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const userMsg = chatbotInput.value.trim();
  if (!userMsg) return;
  // Add user message
  const userMessageElem = createMessage(userMsg, true);
  chatbotMessages.appendChild(userMessageElem);
  scrollToBottom();
  chatbotInput.value = '';
  chatbotInput.focus();

  // Add bot loading message
  const botLoadingElem = createMessage('', false, true);
  chatbotMessages.appendChild(botLoadingElem);
  scrollToBottom();

  // Simulate bot "thinking" for 1s, then type out reply
  setTimeout(() => {
    // Remove loading
    botLoadingElem.querySelector('.chatbot-bubble').innerHTML = '';
    // Get bot reply (simulate API call)
    const reply = getBotReply(userMsg);
    // Typewriter effect
    typeWriter(botLoadingElem.querySelector('.chatbot-bubble'), reply, 90);
  }, 1000);
});

// Optional: Pressing "Enter" submits, but Shift+Enter makes newline
chatbotInput.addEventListener('keydown', function(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    chatbotForm.dispatchEvent(new Event('submit'));
  }
});

// Focus input when window is shown
chatbotWindow.addEventListener('transitionend', () => {
  if (chatbotWindow.classList.contains('active')) {
    chatbotInput.focus();
  }
});