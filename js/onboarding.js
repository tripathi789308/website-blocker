import { getGoals, setGoals, getBlockedSites, setBlockedSites, setInitialized, SOCIAL_MEDIA, STREAMING } from './utils.js';

let currentCustomSites = [];

async function init() {
    // 1. Load Goals
    const goals = await getGoals();
    if (goals[0]) document.getElementById('goal1').value = goals[0];
    if (goals[1]) document.getElementById('goal2').value = goals[1];
    if (goals[2]) document.getElementById('goal3').value = goals[2];

    // 2. Load Blocked Sites
    const blocked = await getBlockedSites();

    // Check main categories
    const isSocialBlocked = SOCIAL_MEDIA.some(s => blocked.includes(s));
    const isStreamingBlocked = STREAMING.some(s => blocked.includes(s));

    const socialCheckbox = document.getElementById('blockSocial');
    const streamingCheckbox = document.getElementById('blockStreaming');

    socialCheckbox.checked = isSocialBlocked;
    streamingCheckbox.checked = isStreamingBlocked;

    // Filter out category sites to find custom ones
    const categorySites = [...SOCIAL_MEDIA, ...STREAMING];
    currentCustomSites = blocked.filter(site => !categorySites.includes(site));

    renderCustomSites();
    updateBlockedPreview(); // Initial render

    // Listeners for live preview update
    socialCheckbox.addEventListener('change', updateBlockedPreview);
    streamingCheckbox.addEventListener('change', updateBlockedPreview);
}

function renderCustomSites() {
    const list = document.getElementById('customSitesList');
    list.innerHTML = '';

    currentCustomSites.forEach((site, index) => {
        const li = document.createElement('li');
        li.className = 'custom-site-item';
        li.innerHTML = `
            <span>${site}</span>
            <button class="remove-site-btn" data-index="${index}">×</button>
        `;
        list.appendChild(li);
    });

    // Add remove listeners
    document.querySelectorAll('.remove-site-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            currentCustomSites.splice(index, 1);
            renderCustomSites();
            updateBlockedPreview();
        });
    });
}

function updateBlockedPreview() {
    let allSites = [];

    if (document.getElementById('blockSocial').checked) {
        allSites = [...allSites, ...SOCIAL_MEDIA];
    }

    if (document.getElementById('blockStreaming').checked) {
        allSites = [...allSites, ...STREAMING];
    }

    allSites = [...allSites, ...currentCustomSites];

    // Deduplicate and sort
    allSites = [...new Set(allSites)].sort();

    const container = document.getElementById('allBlockedPreview');
    if (allSites.length === 0) {
        container.innerHTML = '<span style="color:#94a3b8; font-style:italic;">Nothing blocked yet</span>';
    } else {
        container.innerHTML = allSites.map(site => `<span class="site-tag">${site}</span>`).join('');
    }
}

document.getElementById('saveGoals').addEventListener('click', async () => {
    // 1. Save Goals
    const g1 = document.getElementById('goal1').value.trim();
    const g2 = document.getElementById('goal2').value.trim();
    const g3 = document.getElementById('goal3').value.trim();

    const goals = [g1, g2, g3].filter(g => g.length > 0);

    if (goals.length === 0) {
        alert("Please enter at least one goal to stay motivated.");
        return;
    }

    // 2. Build Blocked List from current UI state (re-using preview logic effectively)
    let finalBlocked = [];

    if (document.getElementById('blockSocial').checked) {
        finalBlocked = [...finalBlocked, ...SOCIAL_MEDIA];
    }

    if (document.getElementById('blockStreaming').checked) {
        finalBlocked = [...finalBlocked, ...STREAMING];
    }

    finalBlocked = [...finalBlocked, ...currentCustomSites];

    // Add new input if any
    const newCustom = document.getElementById('customBlock').value.trim();
    if (newCustom) {
        const domain = newCustom.toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
        if (domain && !finalBlocked.includes(domain)) {
            finalBlocked.push(domain);
        }
    }

    // Deduplicate
    finalBlocked = [...new Set(finalBlocked)];

    // 3. Save
    await setGoals(goals);
    await setBlockedSites(finalBlocked);
    await setInitialized(true);

    alert("Focus session updated!");
    window.close();
});

init();
