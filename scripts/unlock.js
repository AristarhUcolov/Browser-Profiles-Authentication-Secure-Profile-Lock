document.addEventListener('DOMContentLoaded', async () => {
  const form = document.getElementById('unlockForm');
  const passwordInput = document.getElementById('password');
  const messageDiv = document.getElementById('message');
  const hintDiv = document.getElementById('hint');

  // Получаем подсказку
  try {
    const hint = await chrome.runtime.sendMessage({ action: 'getHint' });
    if (hint) hintDiv.textContent = `Hints: ${hint}`;
  } catch (e) {
    console.error('Error get hints:', e);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!passwordInput.value) {
      showMessage('Enter the password', 'error');
      return;
    }

    try {
      const verified = await chrome.runtime.sendMessage({
        action: 'verifyPassword',
        password: passwordInput.value
      });
      
      if (verified) {
        showMessage('Unlocked!', 'success');
        
        // Закрываем окно ввода через 1 секунду
        setTimeout(() => {
          window.close();
        }, 1000);
      } else {
        showMessage('Password is wrong!', 'error');
        passwordInput.value = '';
        passwordInput.focus();
      }
    } catch (error) {
      console.error('Error check password:', error);
      showMessage('Error check system', 'error');
    }
  });
  
  function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = type;
    messageDiv.classList.remove('hidden');
    setTimeout(() => messageDiv.classList.add('hidden'), 3000);
  }
});