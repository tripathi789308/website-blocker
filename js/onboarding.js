import { getGoals, setGoals, getBlockedSites, setBlockedSites, setInitialized, SOCIAL_MEDIA, STREAMING } from './utils.js';

let currentCustomSites = [];

async function init() {
    // 1. Load Goals
    const goals = await getGoals();
    const container = document.getElementById('goalsContainer');
    container.innerHTML = '';

    if (goals.length === 0) {
        // Add one empty goal by default if none exist
        renderGoalInput('');
    } else {
        goals.forEach(goal => renderGoalInput(goal));
    }

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

    // Add Goal Button Listener
    document.getElementById('addGoalBtn').addEventListener('click', () => {
        renderGoalInput('');
    });

    // Add Custom Site Button Listener
    document.getElementById('addCustomSiteBtn').addEventListener('click', () => {
        addCustomSite();
    });

    // Allow Enter key to add custom site
    document.getElementById('customBlock').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addCustomSite();
        }
    });
}

function addCustomSite() {
    const input = document.getElementById('customBlock');
    const value = input.value.trim();

    if (!value) return;

    const domain = value.toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];

    if (domain && !currentCustomSites.includes(domain)) {
        currentCustomSites.push(domain);
        renderCustomSites();
        updateBlockedPreview();
        input.value = '';
    } else if (currentCustomSites.includes(domain)) {
        alert('Site already in the list!');
        input.value = '';
    }
}

function renderGoalInput(value = '') {
    const container = document.getElementById('goalsContainer');
    const div = document.createElement('div');
    div.className = 'input-group';
    div.style.display = 'flex';
    div.style.alignItems = 'center';
    div.style.gap = '10px';

    div.innerHTML = `
        <input type="text" class="goal-input" placeholder="Enter your goal..." value="${value}" style="flex:1;">
        <button class="remove-goal-btn" style="background:none; border:none; color:#ef4444; cursor:pointer; font-size:1.2rem;">&times;</button>
    `;

    // Add delete listener
    div.querySelector('.remove-goal-btn').addEventListener('click', () => {
        container.removeChild(div);
    });

    container.appendChild(div);
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
    const goalInputs = document.querySelectorAll('.goal-input');
    const goals = Array.from(goalInputs)
        .map(input => input.value.trim())
        .filter(g => g.length > 0);

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
