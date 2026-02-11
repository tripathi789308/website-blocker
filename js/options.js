import { getGoals, setGoals, getBlockedSites, setBlockedSites } from './utils.js';

async function init() {
    await renderGoals();
    await renderBlockedSites();

    document.getElementById('addGoalBtn').addEventListener('click', addGoal);
    document.getElementById('addSiteBtn').addEventListener('click', addSite);
}

async function renderGoals() {
    const goals = await getGoals();
    const list = document.getElementById('goalsList');
    list.innerHTML = '';

    goals.forEach((goal, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
        <span>${goal}</span>
        <button class="remove-btn" data-index="${index}">Remove</button>
    `;
        list.appendChild(li);
    });

    // Event delegation
    document.querySelectorAll('#goalsList .remove-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const index = parseInt(e.target.dataset.index);
            const currentGoals = await getGoals();
            currentGoals.splice(index, 1);
            await setGoals(currentGoals);
            renderGoals();
        });
    });
}

async function renderBlockedSites() {
    const sites = await getBlockedSites();
    const list = document.getElementById('blockedList');
    list.innerHTML = '';

    sites.forEach((site, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
        <span>${site}</span>
        <button class="remove-btn" data-index="${index}">Remove</button>
    `;
        list.appendChild(li);
    });

    document.querySelectorAll('#blockedList .remove-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const index = parseInt(e.target.dataset.index);
            const currentSites = await getBlockedSites();
            currentSites.splice(index, 1);
            await setBlockedSites(currentSites);
            renderBlockedSites();
        });
    });
}

async function addGoal() {
    const input = document.getElementById('newGoal');
    const goal = input.value.trim();
    if (goal) {
        const goals = await getGoals();
        goals.push(goal);
        await setGoals(goals);
        input.value = '';
        renderGoals();
    }
}

async function addSite() {
    const input = document.getElementById('newSite');
    const site = input.value.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
    if (site) {
        const sites = await getBlockedSites();
        if (!sites.includes(site)) {
            sites.push(site);
            await setBlockedSites(sites);
            input.value = '';
            renderBlockedSites();
        }
    }
}

init();
