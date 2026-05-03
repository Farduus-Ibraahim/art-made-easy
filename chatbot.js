/* =============================================
   Art Made Easy — chatbot.js
   Floating AI chat widget powered by Claude
   Matches the dark gallery aesthetic
   ============================================= */

(function () {

  /* -----------------------------------------------
     SYSTEM PROMPT
     This tells Claude exactly how to behave.
     It will ONLY answer questions about Baroque
     and Impressionism — staying on topic.
  ----------------------------------------------- */
  const SYSTEM_PROMPT = `You are an art guide for "Art Made Easy," a beginner-friendly educational website about art history. You are knowledgeable, warm, and approachable.

Your job is to help visitors understand two art movements:
1. Baroque art (roughly 1600–1750) — known for chiaroscuro (light and dark contrast), dramatic movement, emotional intensity, and its connection to the Catholic Church. Key example: "The Cheat with the Ace of Clubs" by Georges de La Tour.
2. Impressionism (1860s–1880s) — known for loose brushstrokes, capturing light and everyday moments. Key artists: Claude Monet, Edgar Degas, Pierre-Auguste Renoir. Key example: "Weeping Willow" by Monet (1919).

Rules:
- Always use simple, clear, beginner-friendly language. No complicated jargon without explanation.
- If someone asks about something unrelated to Baroque or Impressionism, kindly redirect them. Say something like: "I'm only able to help with Baroque and Impressionism on this platform — but that's a great question! Do you have anything about those two movements I can help with?"
- Keep answers concise — 2 to 4 sentences for most questions. Go longer only if the question truly requires it.
- Be encouraging. Many visitors are complete beginners and may feel intimidated by art.
- Never make up facts. If you are unsure, say so honestly.`;


  /* -----------------------------------------------
     INJECT CSS INTO THE PAGE
     All chatbot styles are self-contained here
     so they don't interfere with the main site.
  ----------------------------------------------- */
  const styles = `
    /* --- Floating button --- */
    #ame-chat-btn {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      z-index: 9000;
      width: 56px;
      height: 56px;
      background: #C8A96E;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s, transform 0.2s;
      box-shadow: 0 4px 24px rgba(0,0,0,0.5);
    }
    #ame-chat-btn:hover { background: #b8994e; transform: translateY(-2px); }
    #ame-chat-btn:focus-visible { outline: 2px solid #C8A96E; outline-offset: 4px; }

    #ame-chat-btn svg {
      width: 24px; height: 24px;
      fill: #0C0C0C;
      transition: opacity 0.15s;
    }

    /* --- Chat window --- */
    #ame-chat-window {
      position: fixed;
      bottom: 5.5rem;
      right: 2rem;
      z-index: 9000;
      width: 360px;
      max-height: 520px;
      background: #141414;
      border: 1px solid #2E2E2E;
      display: flex;
      flex-direction: column;
      box-shadow: 0 16px 48px rgba(0,0,0,0.7);
      font-family: 'Jost', 'Helvetica', sans-serif;
      /* Hidden by default */
      opacity: 0;
      pointer-events: none;
      transform: translateY(12px);
      transition: opacity 0.22s ease, transform 0.22s ease;
    }

    #ame-chat-window.open {
      opacity: 1;
      pointer-events: all;
      transform: translateY(0);
    }

    /* --- Header --- */
    #ame-chat-header {
      padding: 1rem 1.1rem;
      border-bottom: 1px solid #2E2E2E;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #0C0C0C;
      flex-shrink: 0;
    }

    #ame-chat-header-text h3 {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 1rem;
      font-weight: 400;
      font-style: italic;
      color: #F4F1EC;
      margin: 0 0 2px 0;
      line-height: 1;
    }

    #ame-chat-header-text p {
      font-size: 0.72rem;
      color: rgba(244,241,236,0.4);
      margin: 0;
      font-weight: 300;
      letter-spacing: 0.04em;
      max-width: none;
      line-height: 1;
    }

    #ame-chat-close {
      background: none;
      border: none;
      color: rgba(244,241,236,0.45);
      font-size: 1.1rem;
      cursor: pointer;
      padding: 4px;
      line-height: 1;
      transition: color 0.15s;
    }
    #ame-chat-close:hover { color: #F4F1EC; }

    /* --- Messages area --- */
    #ame-chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
      min-height: 0;
    }

    /* Scrollbar styling */
    #ame-chat-messages::-webkit-scrollbar { width: 4px; }
    #ame-chat-messages::-webkit-scrollbar-track { background: transparent; }
    #ame-chat-messages::-webkit-scrollbar-thumb { background: #2E2E2E; }

    /* --- Individual message bubbles --- */
    .ame-msg {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
      max-width: 88%;
      animation: ame-fadein 0.2s ease;
    }

    @keyframes ame-fadein {
      from { opacity: 0; transform: translateY(6px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .ame-msg--user { align-self: flex-end; align-items: flex-end; }
    .ame-msg--bot  { align-self: flex-start; align-items: flex-start; }

    .ame-msg__bubble {
      padding: 0.6rem 0.9rem;
      font-size: 0.88rem;
      font-weight: 300;
      line-height: 1.65;
      letter-spacing: 0.01em;
    }

    .ame-msg--user .ame-msg__bubble {
      background: #C8A96E;
      color: #0C0C0C;
      font-weight: 400;
    }

    .ame-msg--bot .ame-msg__bubble {
      background: #1C1C1C;
      color: rgba(244, 241, 236, 0.82);
      border: 1px solid #2E2E2E;
    }

    /* --- Typing indicator --- */
    .ame-typing {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 0.6rem 0.9rem;
      background: #1C1C1C;
      border: 1px solid #2E2E2E;
      align-self: flex-start;
      animation: ame-fadein 0.2s ease;
    }

    .ame-typing span {
      width: 6px; height: 6px;
      background: rgba(244,241,236,0.35);
      border-radius: 50%;
      display: inline-block;
      animation: ame-bounce 1.2s infinite ease-in-out;
    }
    .ame-typing span:nth-child(2) { animation-delay: 0.2s; }
    .ame-typing span:nth-child(3) { animation-delay: 0.4s; }

    @keyframes ame-bounce {
      0%, 80%, 100% { transform: translateY(0); opacity: 0.35; }
      40%            { transform: translateY(-5px); opacity: 1; }
    }

    /* --- Input area --- */
    #ame-chat-input-row {
      display: flex;
      gap: 0;
      border-top: 1px solid #2E2E2E;
      flex-shrink: 0;
    }

    #ame-chat-input {
      flex: 1;
      background: #0C0C0C;
      border: none;
      outline: none;
      color: #F4F1EC;
      font-family: 'Jost', Helvetica, sans-serif;
      font-size: 0.88rem;
      font-weight: 300;
      padding: 0.85rem 1rem;
      resize: none;
      line-height: 1.5;
      max-height: 100px;
      overflow-y: auto;
    }

    #ame-chat-input::placeholder {
      color: rgba(244,241,236,0.25);
    }

    #ame-chat-input:focus-visible {
      outline: 1px solid #C8A96E;
      outline-offset: -1px;
    }

    #ame-chat-send {
      background: #C8A96E;
      border: none;
      padding: 0 1.1rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
      flex-shrink: 0;
    }
    #ame-chat-send:hover { background: #b8994e; }
    #ame-chat-send:disabled { background: #2E2E2E; cursor: not-allowed; }
    #ame-chat-send:focus-visible { outline: 1px solid #C8A96E; outline-offset: -2px; }

    #ame-chat-send svg {
      width: 18px; height: 18px;
      fill: #0C0C0C;
    }
    #ame-chat-send:disabled svg { fill: rgba(244,241,236,0.2); }

    /* --- Suggested starter questions --- */
    #ame-chat-starters {
      padding: 0 1rem 0.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }

    #ame-chat-starters p {
      font-size: 0.7rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: rgba(244,241,236,0.28);
      margin: 0;
      max-width: none;
    }

    .ame-starter-btn {
      background: transparent;
      border: 1px solid #2E2E2E;
      color: rgba(244,241,236,0.55);
      font-family: 'Jost', Helvetica, sans-serif;
      font-size: 0.82rem;
      font-weight: 300;
      padding: 0.45rem 0.75rem;
      text-align: left;
      cursor: pointer;
      transition: border-color 0.15s, color 0.15s;
      line-height: 1.4;
    }

    .ame-starter-btn:hover {
      border-color: #C8A96E;
      color: #F4F1EC;
    }

    /* --- Mobile --- */
    @media (max-width: 480px) {
      #ame-chat-window {
        right: 1rem;
        left: 1rem;
        width: auto;
        bottom: 5rem;
      }
      #ame-chat-btn {
        bottom: 1.25rem;
        right: 1.25rem;
      }
    }
  `;

  /* Inject styles into <head> */
  const styleTag = document.createElement('style');
  styleTag.textContent = styles;
  document.head.appendChild(styleTag);


  /* -----------------------------------------------
     BUILD THE HTML FOR THE WIDGET
  ----------------------------------------------- */
  const CHAT_ICON_SVG = `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.37 5.07L2 22l4.93-1.37C8.42 21.5 10.15 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.66 0-3.21-.47-4.53-1.28l-.32-.19-3.31.92.92-3.31-.19-.32C3.47 15.21 3 13.66 3 12c0-4.97 4.03-9 9-9s9 4.03 9 9-4.03 9-9 9z"/>
    </svg>`;

  const CLOSE_ICON_SVG = `
    <svg viewBox="0 0 24 24" aria-hidden="true" width="16" height="16" fill="currentColor">
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
    </svg>`;

  const SEND_ICON_SVG = `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
    </svg>`;

  /* Starter questions shown before the user types */
  const STARTERS = [
    "What is chiaroscuro?",
    "Why did Monet paint the Weeping Willow?",
    "How do I recognize a Baroque painting?",
    "What makes Impressionism different from earlier art?",
  ];

  /* Build the widget HTML */
  const widget = document.getElementById('chat-widget');
  if (!widget) return;

  widget.innerHTML = `
    <!-- Floating open button -->
    <button id="ame-chat-btn" aria-label="Open art guide chat" aria-expanded="false" aria-controls="ame-chat-window">
      ${CHAT_ICON_SVG}
    </button>

    <!-- Chat window -->
    <div id="ame-chat-window" role="dialog" aria-label="Art Made Easy — AI Art Guide" aria-modal="true">

      <!-- Header -->
      <div id="ame-chat-header">
        <div id="ame-chat-header-text">
          <h3>Art Guide</h3>
          <p>Ask me anything about Baroque &amp; Impressionism</p>
        </div>
        <button id="ame-chat-close" aria-label="Close chat">
          ${CLOSE_ICON_SVG}
        </button>
      </div>

      <!-- Messages -->
      <div id="ame-chat-messages" aria-live="polite" aria-label="Chat messages" role="log"></div>

      <!-- Starter questions (shown initially) -->
      <div id="ame-chat-starters">
        <p>Try asking</p>
        ${STARTERS.map(q => `<button class="ame-starter-btn" type="button">${q}</button>`).join('')}
      </div>

      <!-- Input row -->
      <div id="ame-chat-input-row">
        <textarea
          id="ame-chat-input"
          placeholder="Ask about Baroque or Impressionism..."
          rows="1"
          aria-label="Your message"
          maxlength="500"
        ></textarea>
        <button id="ame-chat-send" aria-label="Send message" disabled>
          ${SEND_ICON_SVG}
        </button>
      </div>

    </div>
  `;


  /* -----------------------------------------------
     GRAB REFERENCES TO DOM ELEMENTS
  ----------------------------------------------- */
  const openBtn      = document.getElementById('ame-chat-btn');
  const chatWindow   = document.getElementById('ame-chat-window');
  const closeBtn     = document.getElementById('ame-chat-close');
  const messagesEl   = document.getElementById('ame-chat-messages');
  const inputEl      = document.getElementById('ame-chat-input');
  const sendBtn      = document.getElementById('ame-chat-send');
  const startersEl   = document.getElementById('ame-chat-starters');
  const starterBtns  = document.querySelectorAll('.ame-starter-btn');


  /* -----------------------------------------------
     CONVERSATION HISTORY
     We keep the full history so Claude has context
     for multi-turn conversations.
  ----------------------------------------------- */
  let conversationHistory = [];
  let isWaiting = false; /* prevents double-sending */


  /* -----------------------------------------------
     OPEN / CLOSE THE CHAT WINDOW
  ----------------------------------------------- */
  function openChat() {
    chatWindow.classList.add('open');
    openBtn.setAttribute('aria-expanded', 'true');
    inputEl.focus();

    /* Show a welcome message the first time */
    if (conversationHistory.length === 0) {
      appendMessage(
        'bot',
        'Hello! I\'m your Art Made Easy guide. Ask me anything about Baroque or Impressionism — no question is too basic.'
      );
    }
  }

  function closeChat() {
    chatWindow.classList.remove('open');
    openBtn.setAttribute('aria-expanded', 'false');
    openBtn.focus();
  }

  openBtn.addEventListener('click', openChat);
  closeBtn.addEventListener('click', closeChat);

  /* Close on Escape key */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && chatWindow.classList.contains('open')) {
      closeChat();
    }
  });


  /* -----------------------------------------------
     APPEND A MESSAGE BUBBLE TO THE CHAT
  ----------------------------------------------- */
  function appendMessage(role, text) {
    /* Hide starter questions once conversation starts */
    if (startersEl) startersEl.style.display = 'none';

    const msgWrapper = document.createElement('div');
    msgWrapper.classList.add('ame-msg', role === 'user' ? 'ame-msg--user' : 'ame-msg--bot');

    const bubble = document.createElement('div');
    bubble.classList.add('ame-msg__bubble');
    bubble.innerHTML = text
  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  .replace(/^### (.*$)/gm, '<br><strong>$1</strong>')
  .replace(/^## (.*$)/gm, '<br><strong>$1</strong>')
  .replace(/^# (.*$)/gm, '<br><strong>$1</strong>')
  .replace(/^- (.*$)/gm, '• $1')
  .replace(/\n/g, '<br>');

    msgWrapper.appendChild(bubble);
    messagesEl.appendChild(msgWrapper);

    /* Scroll to latest message */
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }


  /* -----------------------------------------------
     TYPING INDICATOR
     Three animated dots while waiting for response
  ----------------------------------------------- */
  function showTyping() {
    const el = document.createElement('div');
    el.classList.add('ame-typing');
    el.id = 'ame-typing-indicator';
    el.setAttribute('aria-label', 'Art guide is typing');
    el.innerHTML = '<span></span><span></span><span></span>';
    messagesEl.appendChild(el);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function hideTyping() {
    const el = document.getElementById('ame-typing-indicator');
    if (el) el.remove();
  }


  /* -----------------------------------------------
     SEND A MESSAGE TO THE ANTHROPIC API
  ----------------------------------------------- */
  async function sendMessage(userText) {
    if (!userText.trim() || isWaiting) return;

    isWaiting = true;
    sendBtn.disabled = true;

    /* Show the user's message in the chat */
    appendMessage('user', userText);

    /* Add to conversation history for multi-turn context */
    conversationHistory.push({ role: 'user', content: userText });

    /* Show typing indicator */
    showTyping();

    try {
      const response = await fetch('https://art-made-easy-api.vercel.app/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
  messages: conversationHistory,
}),
      });

      const data = await response.json();

      hideTyping();

      if (data.content && data.content.length > 0) {
        /* Extract the text reply */
        const replyText = data.content
          .filter(block => block.type === 'text')
          .map(block => block.text)
          .join('');

        /* Add Claude's reply to history */
        conversationHistory.push({ role: 'assistant', content: replyText });

        /* Show in the chat */
        appendMessage('bot', replyText);

      } else {
        /* Handle unexpected response shape */
        appendMessage('bot', 'Something went wrong with my response. Please try asking again.');
        console.error('Unexpected API response:', data);
      }

    } catch (error) {
      hideTyping();
      appendMessage('bot', 'I\'m having trouble connecting right now. Please check your internet connection and try again.');
      console.error('Chat API error:', error);
    }

    isWaiting = false;
    /* Re-enable send button only if there's text in the input */
    sendBtn.disabled = inputEl.value.trim().length === 0;
    inputEl.focus();
  }


  /* -----------------------------------------------
     INPUT FIELD BEHAVIOR
  ----------------------------------------------- */

  /* Enable / disable send button based on input content */
  inputEl.addEventListener('input', function () {
    sendBtn.disabled = inputEl.value.trim().length === 0 || isWaiting;

    /* Auto-resize textarea to fit content (up to max-height in CSS) */
    inputEl.style.height = 'auto';
    inputEl.style.height = inputEl.scrollHeight + 'px';
  });

  /* Send on Enter, new line on Shift+Enter */
  inputEl.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const text = inputEl.value.trim();
      if (text && !isWaiting) {
        inputEl.value = '';
        inputEl.style.height = 'auto';
        sendBtn.disabled = true;
        sendMessage(text);
      }
    }
  });

  /* Send button click */
  sendBtn.addEventListener('click', function () {
    const text = inputEl.value.trim();
    if (text && !isWaiting) {
      inputEl.value = '';
      inputEl.style.height = 'auto';
      sendBtn.disabled = true;
      sendMessage(text);
    }
  });


  /* -----------------------------------------------
     STARTER QUESTION BUTTONS
     Clicking one fills the input and sends it
  ----------------------------------------------- */
  starterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const question = btn.textContent;
      sendMessage(question);
    });
  });

})();