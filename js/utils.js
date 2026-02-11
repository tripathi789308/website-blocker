// Utils for storage and defaults

export const DEFAULT_BLOCKED_SITES = [
    "facebook.com",
    "twitter.com",
    "instagram.com",
    "reddit.com",
    "tiktok.com",
    "youtube.com",
    "netflix.com",
    "hulu.com",
    "disneyplus.com"
];

export const SOCIAL_MEDIA = ["facebook.com", "twitter.com", "instagram.com", "reddit.com", "tiktok.com", "linkedin.com"];
export const STREAMING = ["youtube.com", "netflix.com", "hulu.com", "disneyplus.com", "twitch.tv"];

export const DEFAULT_GOALS = [
    "Finish my project",
    "Learn a new skill",
    "Read a book"
];

/**
 * Get goals from storage
 * @returns {Promise<string[]>}
 */
export async function getGoals() {
    const result = await chrome.storage.sync.get(['goals']);
    return result.goals || [];
}

/**
 * Set goals to storage
 * @param {string[]} goals 
 */
export async function setGoals(goals) {
    await chrome.storage.sync.set({ goals });
}

/**
 * Get blocked sites from storage
 * @returns {Promise<string[]>}
 */
export async function getBlockedSites() {
    const result = await chrome.storage.sync.get(['blockedSites']);
    return result.blockedSites || DEFAULT_BLOCKED_SITES;
}

/**
 * Set blocked sites to storage
 * @param {string[]} sites 
 */
export async function setBlockedSites(sites) {
    await chrome.storage.sync.set({ blockedSites: sites });
}

/**
 * Check if the extension is initialized (onboarding completed)
 * @returns {Promise<boolean>}
 */
export async function isInitialized() {
    const result = await chrome.storage.sync.get(['initialized']);
    return !!result.initialized;
}

/**
 * Set initialization status
 * @param {boolean} status 
 */
export async function setInitialized(status) {
    await chrome.storage.sync.set({ initialized: status });
}

/**
 * Check if extension acts as enabled (global toggle)
 * @returns {Promise<boolean>}
 */
export async function isExtensionEnabled() {
    const result = await chrome.storage.sync.get(['extensionEnabled']);
    // Default to true if not set
    return result.extensionEnabled !== false;
}

/**
 * Set extension enabled state
 * @param {boolean} enabled 
 */
export async function setExtensionEnabled(enabled) {
    await chrome.storage.sync.set({ extensionEnabled: enabled });
}
