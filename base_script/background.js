const PASSWORD_KEY = 'secure_profile_password';
const LOCKED_KEY = 'secure_profile_locked';
const HINT_KEY = 'secure_profile_hint';

class PasswordManager {
  constructor() {
    this.password = null;
    this.hint = null;
    this.loadPassword();
  }

  async loadPassword() {
    const data = await chrome.storage.local.get([PASSWORD_KEY, HINT_KEY]);
    this.password = data[PASSWORD_KEY];
    this.hint = data[HINT_KEY];
  }

  async setPassword(password, hint) {
    this.password = password;
    this.hint = hint;
    await chrome.storage.local.set({
      [PASSWORD_KEY]: password,
      [HINT_KEY]: hint,
      [LOCKED_KEY]: true
    });
  }

  async verify(input) {
    await this.loadPassword();
    return input === this.password;
  }
}

const passwordManager = new PasswordManager();

// Блокировка всех вкладок
async function lockAllTabs() {
  const tabs = await chrome.tabs.query({});
  for (const tab of tabs) {
    if (!tab.url.startsWith('chrome://') && 
        !tab.url.startsWith('chrome-extension://')) {
      try {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['../scripts/content.js']
        });
      } catch (e) {
        console.error('Lock error:', e);
      }
    }
  }
}

// Перехват навигации
function setupNavigationBlock() {
  chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
    const isLocked = await chrome.storage.local.get([LOCKED_KEY]);
    if (isLocked[LOCKED_KEY] && 
        !details.url.startsWith('chrome-extension://') &&
        !details.url.includes('../html/unlock.html')) {
      await chrome.tabs.update(details.tabId, {
        url: chrome.runtime.getURL('../html/unlock.html')
      });
    }
  });
}

// Инициализация
chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install') {
    await chrome.tabs.create({ url: '../html/password-setup.html' });
  }
  setupNavigationBlock();
});

// При запуске браузера
chrome.runtime.onStartup.addListener(async () => {
  await passwordManager.loadPassword();
  if (passwordManager.password) {
    await chrome.storage.local.set({ [LOCKED_KEY]: true });
    await lockAllTabs();
  }
});

// Обработчик сообщений
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const handlers = {
    'checkLockStatus': async () => {
      const result = await chrome.storage.local.get([LOCKED_KEY]);
      return result[LOCKED_KEY] === true;
    },
    'verifyPassword': async () => {
      const valid = await passwordManager.verify(request.password);
      if (valid) {
        await chrome.storage.local.set({ [LOCKED_KEY]: false });
        await unlockAllTabs();
      }
      return valid;
    },
    'setPassword': async () => {
      await passwordManager.setPassword(request.password, request.hint);
      return true;
    },
    'getHint': async () => passwordManager.hint
  };

  if (handlers[request.action]) {
    handlers[request.action]().then(sendResponse);
    return true;
  }
});

// Разблокировка всех вкладок
async function unlockAllTabs() {
  const tabs = await chrome.tabs.query({});
  for (const tab of tabs) {
    if (tab.url.startsWith('chrome-extension://') && tab.url.includes('../html/unlock.html')) {
      await chrome.tabs.remove(tab.id);
    } else if (!tab.url.startsWith('chrome://')) {
      await chrome.tabs.reload(tab.id);
    }
  }
}