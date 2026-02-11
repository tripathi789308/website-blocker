import { setExtensionEnabled } from './utils.js';

const REFERENCE_TEXT = `Dreams are not merely the fleeting images that visit us in our sleep, but the deep-seated aspirations that define our waking purpose. They are the blueprints of our potential, sketching out the skylines of what we might one day become. However, a dream without a plan is just a wish. This is where goals come into play. Goals are the stepping stones that bridge the gap between where we are and where we want to be. They transform the abstract nature of a dream into concrete, actionable reality. To achieve greatness, one must possess the discipline to pursue these goals relentlessly, even when the path becomes difficult. Distractions are the enemy of progress, distinct obstacles designed to test our resolve. By mastering our focus, we honor our dreams and give them the respect they deserve. Every moment spent in concentrated effort is a deposit into the bank of our future. We must refuse to settle for mediocrity and instead strive for the excellence that lies within our reach. Let us commit today to staying true to our vision, for in the pursuit of our goals, we do not just achieve success; we evolve into the person we were always meant to be. The journey is long, but the reward is a life lived without regret.`;

// Normalize logic to ignore extra spaces? Ideally exact match
// But let's allow single spaces vs newlines to be lenient if html rendering handles it differently
// For now, strict string start match
const CLEAN_REF = REFERENCE_TEXT.replace(/\s+/g, ' ').trim();

const input = document.getElementById('inputEssay');
const unlockBtn = document.getElementById('unlockBtn');
const progressText = document.getElementById('progressText');
const charCount = document.getElementById('charCount');
const errorMsg = document.getElementById('errorMsg');

input.addEventListener('input', () => {
    const val = input.value.replace(/\s+/g, ' ').trim(); // Normalize user input too
    const rawVal = input.value;

    charCount.textContent = `${rawVal.length} characters`;

    // Check progress
    // We check if the input so far matches the beginning of the reference
    const isMatchingSoFar = CLEAN_REF.startsWith(val);

    if (val.length > 0 && !isMatchingSoFar) {
        input.style.borderColor = '#ef4444';
        errorMsg.style.display = 'block';
    } else {
        input.style.borderColor = val.length > 0 ? '#10b981' : '#e2e8f0';
        errorMsg.style.display = 'none';
    }

    const percentage = Math.min(100, Math.floor((val.length / CLEAN_REF.length) * 100));
    progressText.textContent = `${percentage}% Match`;

    // Completion check
    if (val === CLEAN_REF) {
        unlockBtn.disabled = false;
        unlockBtn.style.opacity = '1';
        unlockBtn.style.cursor = 'pointer';
        unlockBtn.style.backgroundColor = '#10b981'; // Green for success
        unlockBtn.textContent = "Unlock Now";
    } else {
        unlockBtn.disabled = true;
        unlockBtn.style.opacity = '0.5';
        unlockBtn.style.cursor = 'not-allowed';
    }
});

// Prevent copy paste
input.addEventListener('paste', (e) => {
    e.preventDefault();
    alert("Cheating won't help you achieve your dreams! Type it out.");
});

unlockBtn.addEventListener('click', async () => {
    await setExtensionEnabled(false);
    alert("Focus Mode turned off. Stay mindful!");
    window.close();
});
