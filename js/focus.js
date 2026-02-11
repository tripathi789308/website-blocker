import { getGoals } from './utils.js';

async function init() {
    const goals = await getGoals();
    const goalsContainer = document.getElementById('goalsDisplay');

    if (goals.length === 0) {
        goalsContainer.innerHTML = '<div class="goal-item">No goals set yet...</div>';
    } else {
        goalsContainer.innerHTML = goals.map(goal => `<div class="goal-item">${goal}</div>`).join('');
    }

    const urlParams = new URLSearchParams(window.location.search);
    const fromSite = urlParams.get('from');
    if (fromSite) {
        document.getElementById('blockedSite').textContent = fromSite;
    }
}

document.getElementById('closeTab').addEventListener('click', () => {
    // Try to go back, if strictly blocked maybe close tab
    // Ideally, close the tab as "Get Back to Work" implies stopping the distraction
    chrome.tabs.getCurrent(tab => {
        if (tab) {
            chrome.tabs.remove(tab.id);
        } else {
            // If not a popup/tab context where we can get ID easily, generic window close
            window.close();
        }
    });
});

init();
