const chatHistory = document.getElementById('chat-history');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const docInput = document.getElementById('doc-input');
const imgInput = document.getElementById('img-input');
const docBtn = document.getElementById('doc-btn');
const imgBtn = document.getElementById('img-btn');
const micBtn = document.getElementById('mic-btn');
const filePreview = document.getElementById('file-preview');

let attachedDocs = [];
let attachedImgs = [];

// Dummy bot response function (replace with API call)
function getBotResponse(userMessage) {
  return "I'm a bot! You said: " + userMessage;
}

function appendMessage(message, sender, files = []) {
  const row = document.createElement('div');
  row.className = 'message-row ' + sender;

  // Avatar
  const avatar = document.createElement('div');
  avatar.className = 'message-avatar';
  if (sender === 'user') {
    avatar.textContent = 'You';
  } else {
    const img = document.createElement('img');
    img.src = "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f916.png";
    img.alt = "Bot";
    avatar.appendChild(img);
  }

  // Bubble
  const bubble = document.createElement('div');
  bubble.className = 'message-bubble';
  bubble.innerText = message;

  row.appendChild(avatar);
  row.appendChild(bubble);

  // Add to chat
  chatHistory.appendChild(row);

  // Show attached files (if any)
  if (files.length > 0) {
    const filesRow = document.createElement('div');
    filesRow.className = 'message-row ' + sender;
    filesRow.style.marginTop = '-10px';
    files.forEach(file => {
      const fileDiv = document.createElement('div');
      fileDiv.className = 'file-preview-item';
      if (file.type && file.type.startsWith('image/')) {
        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        img.className = 'file-preview-img';
        fileDiv.appendChild(img);
      } else {
        // Document icon SVG
        const docIcon = document.createElement('span');
        docIcon.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.83a2 2 0 0 0-.59-1.42l-4.83-4.83A2 2 0 0 0 14.17 2H6zm7 1.5V8a1 1 0 0 0 1 1h4.5L13 3.5z" fill="#19c37d"/></svg>`;
        fileDiv.appendChild(docIcon);
      }
      const span = document.createElement('span');
      span.textContent = file.name;
      fileDiv.appendChild(span);
      filesRow.appendChild(fileDiv);
    });
    chatHistory.appendChild(filesRow);
  }

  chatHistory.scrollTop = chatHistory.scrollHeight;
}

// Document upload
docBtn.addEventListener('click', () => docInput.click());
docInput.addEventListener('change', () => {
  attachedDocs = Array.from(docInput.files);
  renderFilePreview();
});

// Image upload
imgBtn.addEventListener('click', () => imgInput.click());
imgInput.addEventListener('change', () => {
  attachedImgs = Array.from(imgInput.files);
  renderFilePreview();
});

// Render file preview
function renderFilePreview() {
  filePreview.innerHTML = '';
  attachedDocs.forEach(file => {
    const previewDiv = document.createElement('div');
    previewDiv.className = 'file-preview-item';
    // Document icon SVG
    previewDiv.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" style="vertical-align:middle;"><path d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.83a2 2 0 0 0-.59-1.42l-4.83-4.83A2 2 0 0 0 14.17 2H6zm7 1.5V8a1 1 0 0 0 1 1h4.5L13 3.5z" fill="#19c37d"/></svg>`;
    const span = document.createElement('span');
    span.textContent = file.name;
    previewDiv.appendChild(span);
    filePreview.appendChild(previewDiv);
  });
  attachedImgs.forEach(file => {
    const previewDiv = document.createElement('div');
    previewDiv.className = 'file-preview-item';
    const img = document.createElement('img');
    img.src = URL.createObjectURL(file);
    img.className = 'file-preview-img';
    previewDiv.appendChild(img);
    const span = document.createElement('span');
    span.textContent = file.name;
    previewDiv.appendChild(span);
    filePreview.appendChild(previewDiv);
  });
}

// Microphone (speech-to-text)
let recognition;
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  micBtn.addEventListener('click', () => {
    recognition.start();
    micBtn.style.background = "#19c37d";
  });

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    chatInput.value = transcript;
    micBtn.style.background = "transparent";
  };

  recognition.onend = () => {
    micBtn.style.background = "transparent";
  };
} else {
  micBtn.disabled = true;
  micBtn.title = "Speech recognition not supported in this browser.";
}

// Handle form submit
chatForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const userMessage = chatInput.value.trim();
  if (userMessage === '' && attachedDocs.length === 0 && attachedImgs.length === 0) return;

  appendMessage(userMessage, 'user', [...attachedDocs, ...attachedImgs]);

  // Clear input and file preview
  chatInput.value = '';
  docInput.value = '';
  imgInput.value = '';
  attachedDocs = [];
  attachedImgs = [];
  renderFilePreview();

  // Simulate bot response (replace with actual API call)
  setTimeout(() => {
    const botResponse = getBotResponse(userMessage);
    appendMessage(botResponse, 'bot');
  }, 700);
});