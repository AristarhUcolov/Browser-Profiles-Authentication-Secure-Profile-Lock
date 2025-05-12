document.addEventListener('DOMContentLoaded', async () => {
  const form = document.getElementById('passwordForm');
  const passwordInput = document.getElementById('password');
  const confirmInput = document.getElementById('confirmPassword');
  const hintInput = document.getElementById('hint');
  const messageDiv = document.getElementById('message');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const password = passwordInput.value;
    const confirm = confirmInput.value;
    
    if (password !== confirm) {
      showMessage('Password is not same.', 'error');
      return;
    }
    
    if (password.length < 8) {
      showMessage('Password will need to be min 8 symbols.', 'error');
      return;
    }
    
    try {
      await chrome.runtime.sendMessage({ 
        action: 'setPassword', 
        password: password,
        hint: hintInput.value
      });
      
      showMessage('Password is created. You just will be transfered to demo-login.', 'success');
      
      // Перенаправляем на страницу входа
      setTimeout(() => {
        window.location.href = chrome.runtime.getURL('../html/unlock.html');
      }, 1500);
    } catch (error) {
      showMessage('Ошибка: ' + error.message, 'error');
    }
  });
  
  function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = type;
    messageDiv.classList.remove('hidden');
    setTimeout(() => messageDiv.classList.add('hidden'), 5000);
  }
});