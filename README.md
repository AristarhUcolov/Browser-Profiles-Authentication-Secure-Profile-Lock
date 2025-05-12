# 🔒 Secure Profile Lock - Chrome Extension

![Extension Screenshot](/images/screenshot.png)  
*Password protection for browser profiles*

[![Chrome Web Store Version](https://img.shields.io/chrome-web-store/v/your-extension-id?color=blue)](https://chrome.google.com/webstore/detail/secure-profile-lock/your-extension-id)
[![GitHub license](https://img.shields.io/badge/license-MIT-green)](https://github.com/yourusername/secure-profile-lock/blob/main/LICENSE)
![Manifest Version](https://img.shields.io/badge/manifest-v3-important)

## 🌟 Features

- **Password-protect** individual Chrome profiles
- **Auto-lock** on browser restart
- **Universal coverage** (works on all websites)
- **Zero data collection** (everything stays local)
- **Tamper-proof** design
- **Customizable** password requirements

## 🚀 Installation

### From Chrome Web Store
1. Visit [extension page](https://chrome.google.com/webstore/detail/secure-profile-lock/your-extension-id)
2. Click "Add to Chrome"

### 🛠️ How It Works

!<img src="https://github.com/user-attachments/assets/ca3446d7-0586-4570-b5bb-3a382422a362" width="500">


### Structures

secure-profile-lock/
├── base_script/
│   └── background.js       # Core logic
├── scripts/
│   └── content.js          # Page injection
├── styles/
│   └── styles.css          # UI styling
├── html/
│   ├── unlock.html         # Password prompt
│   └── password-setup.html # Initial setup
├── images/                 # Assets
│   ├── icon.png
│   └── screenshot.png
├── manifest.json           # Extension config
└── README.md

