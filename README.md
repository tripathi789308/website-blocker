# Focus & Goals - Distraction Blocker

Block distracting websites and focus on your goals with this simple Chrome Extension.

## Video

https://github.com/user-attachments/assets/0eb51b23-b647-46ea-a789-75bf57c53eca


## Features

- **Goal Tracking**: Set and track your daily goals to stay motivated.
- **Website Blocking**: Block distracting websites (social media, streaming, or custom domains).
- **Focus Mode**: When you try to visit a blocked site, you'll be redirected to a focus page reminding you of your goals.
- **Onboarding**: Easy setup to define your initial goals and blocked sites.
- **Global Toggle**: Quickly enable or disable the extension.

## Installation

This extension is currently in developer mode and can be installed via "Load unpacked".

1.  **Clone or Download** this repository to your local machine.
2.  Open Google Chrome and navigate to `chrome://extensions/`.
3.  Enable **Developer mode** by toggling the switch in the top-right corner.
4.  Click the **Load unpacked** button in the top-left corner.
5.  Select the **`website-

blocker`** directory (the folder containing `manifest.json`).
6.  The extension should now appear in your list of installed extensions.

## Usage

### Onboarding
When you first install the extension, an onboarding page will open automatically:
1.  **Set Goals**: Enter your main goals for the session. You can add as many as you need.
2.  **Block Distractions**: Choose to block common categories (Social Media, Streaming) or add specific custom domains.
3.  Click **Update & Start Focusing** to save your preferences.

### Managing Focus
- **Popup Menu**: Click the extension icon in your toolbar to:
    - Quickly toggle blocking ON/OFF.
    - View your current goals.
    - Edit your goals and blocked list via the "Edit Goals & Block List" button.
- **Blocked Page**: If you visit a blocked site while the extension is ON, you will see a focused page displaying your goals.

### Options
- Right-click the extension icon and select **Options** (or use the "Edit Goals" button in the popup) to modify your settings at any time.

## Development

- `manifest.json`: Configuration file for the Chrome Extension (Manifest V3).
- `background.js`: Service worker handling background tasks and installation events.
- `popup.html` / `popup.js`: The small window that appears when clicking the extension icon.
- `onboarding.html` / `js/onboarding.js`: The main settings page for goals and blocking.
- `focus.html`: The page shown when a site is blocked.
- `js/utils.js`: Shared utility functions and storage wrappers.

## License

[MIT License](LICENSE) (or whichever license applies)
