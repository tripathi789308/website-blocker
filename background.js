import { getBlockedSites, isInitialized, isExtensionEnabled } from './js/utils.js';

// Open onboarding on install
chrome.runtime.onInstalled.addListener(async ({ reason }) => {
  if (reason === 'install') {
    chrome.tabs.create({ url: 'onboarding.html' });
  }
});

// Listen for tab updates to handle blocking
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'loading' && tab.url) {
    const initialized = await isInitialized();
    if (!initialized) return;

    const enabled = await isExtensionEnabled();
    if (!enabled) return; // Do nothing if main toggle is off

    const blockedSites = await getBlockedSites();
    const url = new URL(tab.url);
    const domain = url.hostname.replace('www.', '');

    // Check if the domain is in the blocked list
    // Simple check: blocked site is suffix of current domain (to catch subdomains)
    // or exact match
    const isBlocked = blockedSites.some(site => domain === site || domain.endsWith('.' + site));

    if (isBlocked) {
      // Check if we are already on the focus page to avoid loops
      if (tab.url.includes(chrome.runtime.getURL('focus.html'))) return;

      chrome.tabs.update(tabId, { url: `focus.html?from=${encodeURIComponent(url.hostname)}` });
    }
  }
});
