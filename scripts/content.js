(async function() {
  try {
    const isLocked = await chrome.runtime.sendMessage({ action: 'checkLockStatus' });
    
    if (isLocked) {
      // Сохраняем оригинальный URL
      sessionStorage.setItem('originalUrl', window.location.href);
      
      // Полностью заменяем содержимое страницы
      document.documentElement.innerHTML = `
        <head>
          <title>Profile Locked</title>
          <link rel="stylesheet" href="${chrome.runtime.getURL('../styles/styles.css')}">
        </head>
        <body>
          <iframe src="${chrome.runtime.getURL('../html/unlock.html')}" 
                  style="position:fixed;top:0;left:0;width:100%;height:100%;border:none;z-index:999999">
          </iframe>
        </body>
      `;
      
      // Защита от удаления iframe
      const iframe = document.querySelector('iframe');
      Object.defineProperty(document.body, 'removeChild', {
        value: function(node) {
          if (node === iframe) {
            console.warn('Blocked attempt to remove lock screen');
            location.reload();
            return node;
          }
          return HTMLElement.prototype.removeChild.apply(this, arguments);
        },
        configurable: false,
        writable: false
      });
    }
  } catch (error) {
    console.error('Lock error:', error);
  }
})();