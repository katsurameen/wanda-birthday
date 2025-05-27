// DOM Elements
const modalOverlay = document.getElementById("modalOverlay");
const btnYes = document.getElementById("btnYes");
const btnNo = document.getElementById("btnNo");
const introPage = document.getElementById("introPage");
const startChatBtn = document.getElementById("startChatBtn");
const app = document.getElementById("app");
const chatContainer = document.getElementById("chatContainer");
const finalPage = document.getElementById("finalPage");
const birthdayFinalPage = document.getElementById("birthdayFinalPage");
const replayBtn = document.getElementById("replayBtn");
const chat = document.getElementById("chat");
const confettiContainer = document.getElementById("confetti");
const msgSentSound = document.getElementById("msgSentSound");
const happyMusic = document.getElementById("happyBirthdayMusic");
const animatedText = document.getElementById("animatedText");
const finalLines = [
  document.getElementById("line1"),
  document.getElementById("line2"),
  document.getElementById("line3"),
  document.getElementById("line4"),
];

// Messages
const sheMessage = "Hari ini aku ulang tahun.";
const meMessage = "Selamat ulang tahun sayang semoga panjang umur, sehat selalu, diperbesar rezeki nya dan tetap menjadi pribadi yang lebih baik :)";
const typedPhrases = ["Happy birthday Ndaa!", "from zul"];

// Animation Settings
const typingSpeed = 150;
const pauseBetween = 1000;

// Typing Loop Controller
let typingLoop;
let typingController = { cancelled: false };

// Functions
async function typeText(text) {
  animatedText.textContent = "";
  for (let i = 0; i < text.length; i++) {
    animatedText.textContent += text[i];
    await new Promise(r => setTimeout(r, typingSpeed));
  }
}

async function loopTyping() {
  let index = 0;
  typingController.cancelled = false;
  while (!typingController.cancelled) {
    await typeText(typedPhrases[index]);
    await new Promise(r => setTimeout(r, pauseBetween));
    index = (index + 1) % typedPhrases.length;
  }
}

async function startTextAnimation() {
  if (typingLoop) {
    typingController.cancelled = true;
    await new Promise(r => setTimeout(r, 50));
  }
  typingLoop = loopTyping();
}

function createBubble(text, senderClass) {
  const bubble = document.createElement("div");
  bubble.classList.add("bubble", senderClass);
  bubble.textContent = text;
  return bubble;
}

function createTypingIndicator(senderClass = 'me') {
  const typing = document.createElement("div");
  typing.id = "typingBubble";
  typing.classList.add(senderClass);
  typing.setAttribute("aria-label", "Typing indicator");

  for (let i = 0; i < 3; i++) {
    const dot = document.createElement("div");
    dot.classList.add("dot");
    typing.appendChild(dot);
  }
  return typing;
}

function scrollToBottom() {
  chat.scrollTop = chat.scrollHeight;
}

async function runChatSimulation() {
  chat.innerHTML = "";
  const sheTyping = createTypingIndicator('she');
  chat.appendChild(sheTyping);
  scrollToBottom();
  await new Promise(r => setTimeout(r, 2000));
  chat.removeChild(sheTyping);

  const sheBubble = createBubble(sheMessage, "she");
  chat.appendChild(sheBubble);
  scrollToBottom();
  await msgSentSound.play().catch(() => {});

  const meTyping = createTypingIndicator('me');
  chat.appendChild(meTyping);
  scrollToBottom();
  await new Promise(r => setTimeout(r, 5000));
  chat.removeChild(meTyping);

  const meBubble = createBubble(meMessage, "me");
  chat.appendChild(meBubble);
  scrollToBottom();
  await msgSentSound.play().catch(() => {});

  await new Promise(r => setTimeout(r, 4000));
  chatContainer.classList.add('blurred');
  await new Promise(r => setTimeout(r, 3000));
}

async function animateFinalLines() {
  for (const lineEl of finalLines) {
    lineEl.classList.add("visible");
    await new Promise(r => setTimeout(r, 2000));
  }
}

function createConfettiPiece() {
  const colors = ['#FFC107', '#4CAF50', '#2196F3', '#E91E63', '#FF5722', '#9C27B0'];
  const confetti = document.createElement('div');
  confetti.classList.add('confetti-piece');
  confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
  confetti.style.left = Math.random() * 100 + '%';
  confetti.style.top = '-10px';
  confetti.style.opacity = Math.random() * 0.8 + 0.2;
  confetti.style.width = (Math.random() * 8 + 4) + 'px';
  confetti.style.height = (Math.random() * 14 + 7) + 'px';
  confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
  confetti.style.animationDuration = (3 + Math.random() * 3) + 's';
  confetti.style.animationDelay = (Math.random() * 5) + 's';
  return confetti;
}

function animateConfettiPiece(piece) {
  const fallDistance = 600 + Math.random() * 200;
  const duration = parseFloat(piece.style.animationDuration) * 1000;
  const rotation = (Math.random() * 360) + 360;

  let start = null;
  function animate(time) {
    if (!start) start = time;
    const elapsed = time - start;
    const progress = Math.min(elapsed / duration, 1);

    piece.style.top = (progress * fallDistance - 10) + 'px';
    piece.style.transform = `rotate(${rotation * progress}deg)`;

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      piece.style.top = '-10px'; // Restart from the top
      start = null;
      requestAnimationFrame(animate); // Loop the animation
    }
  }
  requestAnimationFrame(animate);
}

function startConfetti() {
  const piecesCount = 30;
  stopConfetti(); // Clear old pieces before starting new ones
  for (let i = 0; i < piecesCount; i++) {
    const piece = createConfettiPiece();
    confettiContainer.appendChild(piece);
    animateConfettiPiece(piece);
  }
}

function stopConfetti() {
  while (confettiContainer.firstChild) {
    confettiContainer.removeChild(confettiContainer.firstChild);
  }
}


function stopMusic() {
  if (!happyMusic.paused) {
    happyMusic.pause();
    happyMusic.currentTime = 0;
  }
}

function resetAll() {
  chat.innerHTML = "";
  chatContainer.classList.remove('blurred');
  finalLines.forEach(line => line.classList.remove('visible'));
}

// Main Flow
function runFullFlow() {
  app.style.display = 'none';
  modalOverlay.classList.remove('hidden');
  introPage.style.opacity = '1';

  btnYes.onclick = () => {
    modalOverlay.classList.add('hidden');
    happyMusic.play().catch(() => {});
    startIntro();
  };
  
  btnNo.onclick = () => {
    modalOverlay.classList.add('hidden');
    startIntro();
  };

  function startIntro() {
    startChatBtn.addEventListener("click", async () => {
      introPage.classList.add('fadeout');
      await new Promise(r => setTimeout(r, 800));
      introPage.style.display = 'none';
      app.style.display = 'flex';

      chatContainer.classList.add("active");
      await runChatSimulation();

      chatContainer.classList.remove("active");
      finalPage.classList.add("active");

      await animateFinalLines();

      finalPage.classList.remove("active");
      birthdayFinalPage.classList.add("active");

      startConfetti();
      startTextAnimation();
      birthdayFinalPage.focus();
    });
  }

  replayBtn.addEventListener("click", async () => {
    stopConfetti();
    stopMusic();
    typingController.cancelled = true;

    birthdayFinalPage.classList.remove("active");
    finalPage.classList.remove("active");
    chatContainer.classList.remove("active");

    resetAll();
    modalOverlay.classList.remove('hidden');
    introPage.style.display = 'flex';
    introPage.classList.remove('fadeout');
    introPage.style.opacity = '1';
    app.style.display = 'none';
  });
}

window.addEventListener("load", runFullFlow);
