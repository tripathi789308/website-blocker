import { getBlockedSites, setBlockedSites, isExtensionEnabled, setExtensionEnabled } from './utils.js';

async function init() {
    const globalToggle = document.getElementById('globalToggle');
    const statusText = document.getElementById('statusText');
    const addSiteBtn = document.getElementById('addSiteBtn');
    const openOnboardingBtn = document.getElementById('openOnboarding');

    // Initialize Toggle State
    const enabled = await isExtensionEnabled();
    updateToggleUI(enabled);

    globalToggle.addEventListener('change', async (e) => {
        const isEnabled = e.target.checked;
        if (isEnabled) {
            // Turning ON
            await setExtensionEnabled(true);
            updateToggleUI(true);
            chrome.tabs.create({ url: 'onboarding.html' });
        } else {
            // Turning OFF - Redirect to Challenge
            // Note: We can't easily prevent the checkbox visual change if the event already fired,
            // so we force it back to checked visually first.
            globalToggle.checked = true;
            chrome.tabs.create({ url: 'unlock.html' });
            // We do NOT set extensionEnabled to false here.
        }
    });

    // Keep existing Add Site logic
    addSiteBtn.addEventListener('click', async () => {
        const input = document.getElementById('customSite');
        const site = input.value.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];

        if (site) {
            const blocked = await getBlockedSites();
            if (!blocked.includes(site)) {
                blocked.push(site);
                await setBlockedSites(blocked);
                alert(`Blocked ${site}`);
                input.value = '';
            } else {
                alert(`${site} is already blocked.`);
            }
        }
    });

    openOnboardingBtn.addEventListener('click', () => {
        chrome.tabs.create({ url: 'onboarding.html' });
    });
}

function updateToggleUI(enabled) {
    const globalToggle = document.getElementById('globalToggle');
    const statusText = document.getElementById('statusText');

    globalToggle.checked = enabled;
    statusText.textContent = enabled ? "Focus Mode is ON" : "Focus Mode is OFF";
    statusText.style.color = enabled ? "var(--primary-color)" : "#64748b";
}

init();
