const CONFIG = {
    ROWS: 5,
    COLS: 10,
    TOTAL_SQUARES: 50,
    DAYS: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    TIMES: ['8:00', '9:00', '10:00', '11:00', '12:00', '1:00', '2:00', '3:00', '4:00', '5:00'],
    DICE_ANIMATION_TIME: 800,
    MAX_ENERGY: 20,
    BASE_CARDS: {
        2: { type: 'coffee', label: 'Coffee', color: 'brown', value: 'Morning Roast (Energy +1)', energy: 1, cx: 0, ex: 0, mr: 0 },
        3: { type: 'meeting', label: 'Weekly Standup', color: 'blue', value: 'Team Updates (Random Skill +1)', energy: 0, randomSkill: 1 },
        4: { type: 'meeting', label: 'North All Hands', color: 'blue', value: 'North Team Sync (Energy -2)', energy: -2 },
        5: { type: 'lunch', label: 'Lunch', color: 'green', value: 'Delicious Lunch (Energy +2)', energy: 2, cx: 0, ex: 0, mr: 0 },
        8: { type: 'coffee', label: 'Coffee', color: 'brown', value: 'Afternoon Pick-me-up (Energy +1)', energy: 1, cx: 0, ex: 0, mr: 0 },
        13: { type: 'coffee', label: 'Coffee', color: 'brown', value: 'Morning Brew (Energy +1)', energy: 1, cx: 0, ex: 0, mr: 0 },
        15: { type: 'lunch', label: 'Lunch', color: 'green', value: 'Quick Bite (Energy +2)', energy: 2, cx: 0, ex: 0, mr: 0 },
        19: { type: 'coffee', label: 'Coffee', color: 'brown', value: 'Afternoon Espresso (Energy +1)', energy: 1, cx: 0, ex: 0, mr: 0 },
        22: { type: 'coffee', label: 'Coffee', color: 'brown', value: 'Daily Grind (Energy +1)', energy: 1, cx: 0, ex: 0, mr: 0 },
        25: { type: 'lunch', label: 'Lunch', color: 'green', value: 'Team Lunch (Energy +2)', energy: 2, cx: 0, ex: 0, mr: 0 },
        32: { type: 'coffee', label: 'Coffee', color: 'brown', value: 'Morning Fuel (Energy +1)', energy: 1, cx: 0, ex: 0, mr: 0 },
        35: { type: 'lunch', label: 'Lunch', color: 'green', value: 'Power Lunch (Energy +2)', energy: 2, cx: 0, ex: 0, mr: 0 },
        38: { type: 'coffee', label: 'Coffee', color: 'brown', value: 'Afternoon Latte (Energy +1)', energy: 1, cx: 0, ex: 0, mr: 0 },
        43: { type: 'coffee', label: 'Coffee', color: 'brown', value: 'Final Morning Push (Energy +1)', energy: 1, cx: 0, ex: 0, mr: 0 },
        45: { type: 'lunch', label: 'Lunch', color: 'green', value: 'Healthy Salad (Energy +2)', energy: 2, cx: 0, ex: 0, mr: 0 }
    },
    MEETING_TEMPLATES: [
        { type: 'meeting', label: 'Forecast', color: 'blue', value: 'Pipeline Review (Speed -1)', speed: -1 },
        { type: 'meeting', label: 'EMEA All Hands', color: 'blue', value: 'Regional Sync (Speed -1)', speed: -1 },
        { type: 'meeting', label: 'EMEA SE meeting', color: 'blue', value: 'SE Team Sync (Speed -1)', speed: -1 },
        { type: 'meeting', label: 'Company All Hands', color: 'blue', value: 'Big Strategy (2h) (Speed -2)', speed: -2, duration: 2 },
        { type: 'enablement', label: 'SE Enablement', color: 'enablement', value: 'Upskilling (Energy -3, Random Skill +1)', energy: -3, randomSkill: 1, duration: 2 },
        { type: 'meeting', label: 'First Look', color: 'enablement', value: 'Product News (Speed -1, Random Skill +1)', speed: -1, randomSkill: 1 },
        { type: 'enablement', label: 'New sales play', color: 'enablement', value: 'Strategy Lab (Energy -2)', energy: -2 },
        { type: 'demo', label: 'CX demo', color: 'red', value: 'Live Showcase (Energy -2)', energy: -2 },
        { type: 'demo', label: 'EX demo', color: 'red', value: 'Live Showcase (2h) (Energy -2)', energy: -2, duration: 2 },
        { type: 'demo', label: 'MR demo', color: 'red', value: 'Live Showcase (Energy -2)', energy: -2 },
        { type: 'demo', label: 'CX demo', color: 'red', value: 'Live Showcase (2h) (Energy -2)', energy: -2, duration: 2 },
        { type: 'discovery', label: 'CX discovery', color: 'discovery', value: 'Prep +3 Demo Bonus (Energy -1)', energy: -1, discoveryFor: 'CX' },
        { type: 'discovery', label: 'EX discovery', color: 'discovery', value: 'Prep +3 Demo Bonus (Energy -1)', energy: -1, discoveryFor: 'EX' },
        { type: 'discovery', label: 'MR discovery', color: 'discovery', value: 'Prep +3 Demo Bonus (Energy -1)', energy: -1, discoveryFor: 'MR' }
    ],
    CARDS: {}, // Populated dynamically
    LUNCH_IMAGE: 'art_nouveau_lunch.png',
    COFFEE_IMAGE: 'art_nouveau_coffee.png',
    MEETING_IMAGE: 'art_nouveau_meeting.png',
    ENABLEMENT_IMAGE: 'art_nouveau_meeting.png',
    DEMO_IMAGE: 'art_nouveau_meeting.png',
    DISCOVERY_IMAGE: 'art_nouveau_meeting.png',
    AI_SESSION_IMAGE: 'ai_session_celebration.png'
};

// --- Sound Manager ---
const AudioEngine = {
    ctx: null,
    init() {
        if (this.ctx) return;
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    },
    playTone(freq, type, duration, volume = 0.1) {
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(volume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    },
    roll() { this.playTone(150 + Math.random() * 50, 'square', 0.05, 0.03); },
    move() {
        // A "step" sound: Low thud using pitch ramp
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(120, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.1);
    },
    win() {
        if (!this.ctx) this.init();
        [440, 554, 659, 880].forEach((f, i) => {
            setTimeout(() => this.playTone(f, 'triangle', 0.5, 0.05), i * 150);
        });
    },
    fail() {
        if (!this.ctx) this.init();
        [200, 150, 100].forEach((f, i) => {
            setTimeout(() => this.playTone(f, 'sawtooth', 0.4, 0.05), i * 200);
        });
    },
    cardFlip() {
        this.playTone(300, 'triangle', 0.15, 0.05);
        setTimeout(() => this.playTone(450, 'triangle', 0.1, 0.04), 100);
    },
    sketch() {
        this.playTone(600 + Math.random() * 200, 'square', 0.05, 0.02);
    },
    dissolve() {
        // A positive "reward" sound: Bright upward arpeggio
        if (!this.ctx) this.init();
        [523.25, 659.25, 783.99, 1046.50].forEach((f, i) => {
            setTimeout(() => this.playTone(f, 'sine', 0.15, 0.04), i * 50);
        });
    },
    study() {
        // Happy, quick "plink" sound for studying
        this.init();
        this.playTone(800, 'triangle', 0.1, 0.03);
        setTimeout(() => this.playTone(1200, 'triangle', 0.15, 0.03), 100);
    },
    plop() {
        // Short, popping sound with pitch drop
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.05);
    },
    happyChord() {
        // G Major triad (G3, B3, D4) plucking effect
        this.init();
        [196.00, 246.94, 293.66].forEach((f, i) => {
            setTimeout(() => this.playTone(f, 'triangle', 0.8, 0.03), i * 30);
        });
    },
    ominousChord() {
        // Low diminished-ish chord (C3, Eb3, Gb3) for meetings
        this.init();
        [130.81, 155.56, 185.00].forEach((f, i) => {
            setTimeout(() => this.playTone(f, 'sawtooth', 1.2, 0.04), i * 40);
        });
    },
    kickOut() {
        // Discordant "crash" slide
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, this.ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(50, this.ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.3);
    },
    enablementChord() {
        // A structured, rising chord (C4, F4, G4, C5)
        this.init();
        [261.63, 349.23, 392.00, 523.25].forEach((f, i) => {
            setTimeout(() => this.playTone(f, 'sine', 0.6, 0.03), i * 40);
        });
    },
    demoChord() {
        // Deep, ominous low slide (Eb2, A2, D3)
        this.init();
        [77.78, 110.00, 146.83].forEach((f, i) => {
            setTimeout(() => this.playTone(f, 'sawtooth', 1.0, 0.06), i * 60);
        });
    },
    goldenFanfare() {
        // Triumphant rising fanfare for the AI Session
        this.init();
        const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 2093.00];
        notes.forEach((f, i) => {
            setTimeout(() => this.playTone(f, 'triangle', 0.5, 0.07), i * 100);
        });
        // Add shimmering high notes
        setTimeout(() => {
            [1760, 2093, 2637].forEach((f, j) => {
                setTimeout(() => this.playTone(f, 'sine', 0.3, 0.1), j * 80);
            });
        }, 650);
    }
};

let gameState = {
    currentPos: 1,
    energy: 15, // referred to as Vitality in UI
    speed: 0,
    experience: 0,
    prep: 0,
    cx: 0,
    ex: 0,
    mr: 0,
    isRolling: false,
    isStartingUp: false,
    gameOver: false,
    usedCards: [],
    visibleCards: [],
    discoveryState: { 'CX': false, 'EX': false, 'MR': false },
    placementLog: {} // Records { originalIdx: { finalIdx: N, type: 'lunch'|'coffee', icon: 'emoji' } }
};

const boardEl = document.getElementById('planner-board');
const diceEl = document.getElementById('dice');
const rollBtn = document.getElementById('roll-button');
const eventTitleEl = document.getElementById('event-title');
const eventDescEl = document.getElementById('event-desc');
const energyBarEl = document.getElementById('energy-bar');
const valVitalityEl = document.getElementById('val-vitality');
const valSpeedEl = document.getElementById('val-speed');
const valExpEl = document.getElementById('val-exp');
const valPrepEl = document.getElementById('val-prep');
const valCXEl = document.getElementById('val-cx');
const valEXEl = document.getElementById('val-ex');
const valMREl = document.getElementById('val-mr');
const cardOverlay = document.getElementById('card-overlay');
const zoomedCardContainer = document.getElementById('zoomed-card-container');
const debugStepBtn = document.getElementById('debug-step-button');
const startupOverlay = document.getElementById('startup-phase-overlay');
const startupText = document.getElementById('startup-phase-text');

function populateBoard() {
    // 1. Initial State: Empty board (except maybe the start)
    CONFIG.CARDS = {};

    // Internal helper to find slots that are TRULY empty (no meeting/enablement/etc)
    const getEmptySlots = () => {
        const arr = [];
        for (let i = 2; i < CONFIG.TOTAL_SQUARES; i++) {
            if (!CONFIG.CARDS[i]) arr.push(i);
        }
        return arr;
    };

    const findAndPlace2h = (meeting, candidates) => {
        const candSet = new Set(candidates);
        let attempts = 0;
        while (attempts < 100) {
            const s1 = candidates[Math.floor(Math.random() * candidates.length)];
            const s2 = s1 + 1;
            const row1 = Math.floor((s1 - 1) / 10);
            const row2 = Math.floor((s2 - 1) / 10);
            // s1 === 48 would place the twin at 49 (protected AI Session slot)
            if (s1 !== 48 && row1 === row2 && candSet.has(s2)) {
                CONFIG.CARDS[s1] = { ...meeting, part: 1, twin: s2 };
                CONFIG.CARDS[s2] = { ...meeting, part: 2, twin: s1 };
                return true;
            }
            attempts++;
        }
        return false;
    };

    // 2. Place Meetings (Fixed & Templates)
    // Fixed Meetings from original BASE_CARDS logic
    CONFIG.CARDS[3] = { type: 'meeting', label: 'Weekly Standup', color: 'blue', value: 'Team Updates (Speed -1, Random Skill +1)', speed: -1, randomSkill: 1 };
    CONFIG.CARDS[4] = { type: 'meeting', label: 'North All Hands', color: 'blue', value: 'North Team Sync (Speed -2)', speed: -2 };

    const demoTemplates = CONFIG.MEETING_TEMPLATES.filter(t => t.type === 'demo');
    const discoveryTemplates = CONFIG.MEETING_TEMPLATES.filter(t => t.type === 'discovery');
    const otherTemplates = CONFIG.MEETING_TEMPLATES.filter(t => t.type !== 'demo' && t.type !== 'discovery');

    // Place Demos & Discovery
    demoTemplates.forEach(demo => {
        const available = getEmptySlots();
        let demoIdx = -1;
        if (demo.duration === 2) {
            const candSet = new Set(available);
            for (let attempts = 0; attempts < 100; attempts++) {
                const s1 = available[Math.floor(Math.random() * available.length)];
                const s2 = s1 + 1;
                // s1 === 48 would take the protected AI Session slot at 49
                if (s1 !== 48 && Math.floor((s1 - 1) / 10) === Math.floor((s2 - 1) / 10) && candSet.has(s2)) {
                    CONFIG.CARDS[s1] = { ...demo, part: 1, twin: s2 };
                    CONFIG.CARDS[s2] = { ...demo, part: 2, twin: s1 };
                    demoIdx = s1;
                    break;
                }
            }
        } else {
            demoIdx = available[Math.floor(Math.random() * available.length)];
            CONFIG.CARDS[demoIdx] = { ...demo };
        }
        if (demoIdx !== -1) {
            const demoType = demo.label.split(' ')[0];
            const discovery = discoveryTemplates.find(d => d.discoveryFor === demoType);
            if (discovery) {
                const slotsBefore = getEmptySlots().filter(s => s < demoIdx);
                if (slotsBefore.length > 0) {
                    CONFIG.CARDS[slotsBefore[Math.floor(Math.random() * slotsBefore.length)]] = { ...discovery };
                }
            }
        }
    });

    // Place others
    otherTemplates.forEach(meeting => {
        const available = getEmptySlots();
        if (available.length === 0) return;
        if (meeting.duration === 2) findAndPlace2h(meeting, available);
        else CONFIG.CARDS[available[Math.floor(Math.random() * available.length)]] = { ...meeting };
    });

    // 3. Record Dramatic Shifting Log and Set Final Break Positions
    const lunchSlots = [5, 15, 25, 35, 45];
    const lunchEmojis = ['🥪', '🥗', '🍲', '🍱', '🥣', '🍛', '🍜', '🥘', '🌭', '🍔', '🍕'];
    const coffeeSlots = [2, 8, 13, 19, 22, 32, 38, 43];

    gameState.placementLog = {};

    lunchSlots.forEach(t => {
        const icon = lunchEmojis[Math.floor(Math.random() * lunchEmojis.length)];
        const lunchBase = { type: 'lunch', label: 'Lunch', color: 'green', value: 'Delicious Lunch (Energy +2)', energy: 2, icon: icon };

        if (!CONFIG.CARDS[t]) {
            CONFIG.CARDS[t] = { ...lunchBase };
            gameState.placementLog[t] = { finalIdx: t, type: 'lunch', icon: icon };
        } else {
            const row = Math.floor((t - 1) / 10);
            const prev = t - 1;
            const next = t + 1;
            let finalPos = -1;

            if (prev > 1 && Math.floor((prev - 1) / 10) === row && !CONFIG.CARDS[prev]) {
                finalPos = prev;
                CONFIG.CARDS[prev] = { ...lunchBase, label: 'Shifted Lunch', value: `Early Lunch (Energy +2)` };
            } else if (next < CONFIG.TOTAL_SQUARES && Math.floor((next - 1) / 10) === row && !CONFIG.CARDS[next]) {
                finalPos = next;
                CONFIG.CARDS[next] = { ...lunchBase, label: 'Late Lunch', value: `Delayed Lunch (Energy +2)` };
            }

            gameState.placementLog[t] = { finalIdx: finalPos, type: 'lunch', icon: icon };
        }
    });

    coffeeSlots.forEach(t => {
        const coffeeBase = { type: 'coffee', label: 'Coffee', color: 'brown', value: 'Speed Boost (+1)', speed: 1, icon: '☕' };
        if (!CONFIG.CARDS[t]) {
            CONFIG.CARDS[t] = { ...coffeeBase };
            gameState.placementLog[t] = { finalIdx: t, type: 'coffee', icon: '☕' };
        } else {
            const row = Math.floor((t - 1) / 10);
            const prev = t - 1;
            const next = t + 1;
            let finalPos = -1;

            if (prev > 1 && Math.floor((prev - 1) / 10) === row && !CONFIG.CARDS[prev]) {
                finalPos = prev;
                CONFIG.CARDS[prev] = { ...coffeeBase, label: 'Shifted Coffee', value: 'Quick Caffeine (+1 Speed)' };
            } else if (next < CONFIG.TOTAL_SQUARES && Math.floor((next - 1) / 10) === row && !CONFIG.CARDS[next]) {
                finalPos = next;
                CONFIG.CARDS[next] = { ...coffeeBase, label: 'Late Coffee', value: 'Afternoon Pick-me-up (+1 Speed)' };
            }
            gameState.placementLog[t] = { finalIdx: finalPos, type: 'coffee', icon: '☕' };
        }
    });

    // Fill all remaining empty slots (except 1, 49, 50) with Demo Prep cards
    // Square 49 = Friday 16:00 — hardcoded as the legendary AI Session card
    CONFIG.CARDS[49] = {
        type: 'ai_session',
        label: 'AI Session',
        color: 'golden',
        value: 'AI & SE Celebration! +5 Vitality, +2 CX, +2 EX, +2 MR',
        energy: 5, cx: 2, ex: 2, mr: 2,
        icon: '🤖'
    };

    for (let i = 2; i <= 48; i++) {
        if (!CONFIG.CARDS[i]) {
            CONFIG.CARDS[i] = { type: 'demoprep', label: 'Demo Prep', color: 'gray', value: 'Studying the product...', icon: '📓' };
        }
    }

    // Assign default icons to remaining cards
    Object.keys(CONFIG.CARDS).forEach(idx => {
        const c = CONFIG.CARDS[idx];
        if (!c.icon) {
            c.icon = c.type === 'meeting' ? '👥' : (c.type === 'enablement' ? '🎓' : (c.type === 'demo' ? '🖥️' : (c.type === 'discovery' ? '🔍' : '🥪')));
        }
    });
}

function initBoard(newlyPlacedIdx = null) {
    boardEl.innerHTML = '';
    for (let r = 0; r < CONFIG.ROWS; r++) {
        const day = CONFIG.DAYS[r];
        const dayBlock = document.createElement('div');
        dayBlock.className = 'day-block';

        const header = document.createElement('div');
        header.className = 'day-header';
        header.textContent = day;
        dayBlock.appendChild(header);

        const grid = document.createElement('div');
        grid.className = 'day-grid';

        for (let c = 0; c < CONFIG.COLS; c++) {
            const squareNum = (r * CONFIG.COLS) + (c + 1);
            const timeIdx = (squareNum - 1) % 10;
            const timeLabel = CONFIG.TIMES[timeIdx];

            const square = document.createElement('div');
            square.className = `square day-${day.toLowerCase().substring(0, 3)}`;
            square.id = `square-${squareNum}`;

            let content = `<span class="square-num">${timeLabel}</span>`;

            // Only show card if it exists, is NOT used, AND is whitelisted for visibility
            if (gameState.visibleCards.includes(squareNum) && !gameState.usedCards.includes(squareNum)) {
                const cardData = CONFIG.CARDS[squareNum];
                if (!cardData) continue;

                // During startup, we simplified the phases.
                // If it's earlier phases, we might want to hide some cards, but for now let's show what is in gameState.visibleCards
                if (gameState.isStartingUp && !gameState.visibleCards.includes(squareNum)) {
                    continue;
                }

                const shouldAnimate = squareNum === newlyPlacedIdx;

                content += `
                    <div class="card-container">
                        <div class="card ${cardData.color} ${shouldAnimate ? 'pop-in' : ''}" 
                             id="card-${squareNum}" 
                             ${cardData.part ? `part="${cardData.part}"` : ''}>
                            <div class="card-face card-front">
                                <div class="card-header">${cardData.label}</div>
                                <div class="card-label">${cardData.icon || '🥪'}</div>
                            </div>
                            <div class="card-face card-back">
                                <div class="card-header">${cardData.label}</div>
                                <div class="card-value">${cardData.value}</div>
                            </div>
                        </div>
                    </div>
                `;
            } else if (squareNum === CONFIG.TOTAL_SQUARES) {
                content += `
                    <div class="special-label goal-label">
                        <span class="martini">🍸</span>
                        <div class="goal-text">End of week</div>
                    </div>
                `;
            }

            square.innerHTML = content;
            grid.appendChild(square);
        }
        dayBlock.appendChild(grid);
        boardEl.appendChild(dayBlock);
    }
    updateUI();
}

function updateUI() {
    // Character marker
    const oldMarker = document.querySelector('.player-token');
    if (oldMarker) oldMarker.remove();

    const currentSquare = document.getElementById(`square-${gameState.currentPos}`);
    if (currentSquare) {
        const marker = document.createElement('div');
        marker.className = 'player-token';
        marker.innerHTML = '<div class="player-token-hair"></div>';
        currentSquare.appendChild(marker);
        document.querySelectorAll('.square').forEach(s => s.classList.remove('active'));
        currentSquare.classList.add('active');
    }

    // Status box: day and square
    const dayIndex = Math.floor((gameState.currentPos - 1) / CONFIG.COLS);
    const dayName = CONFIG.DAYS[Math.min(dayIndex, CONFIG.DAYS.length - 1)];
    const timeIndex = (gameState.currentPos - 1) % CONFIG.COLS;
    const timeLabel = CONFIG.TIMES[timeIndex];
    const currentDayEl = document.getElementById('current-day');
    const currentPosEl = document.getElementById('current-pos');
    if (currentDayEl) currentDayEl.textContent = dayName;
    if (currentPosEl) currentPosEl.textContent = `${timeLabel} (sq. ${gameState.currentPos})`;

    // Energy Bar
    const energyPct = (gameState.energy / CONFIG.MAX_ENERGY) * 100;
    if (energyBarEl) {
        energyBarEl.style.width = `${Math.min(energyPct, 100)}%`;

        // Update energy UI
        document.querySelectorAll('.energy-tick').forEach((tick, idx) => {
            if (idx < gameState.energy) {
                tick.classList.add('active');
            } else {
                tick.classList.remove('active');
            }
        });

        if (gameState.energy <= 0 && !gameState.gameOver) {
            rollBtn.disabled = true;
            checkGameState(); // Force a check to trigger burnout
        }
        // Hyper Pumped state
        if (gameState.energy > 15) {
            energyBarEl.classList.add('hyper-pumped');
        } else {
            energyBarEl.classList.remove('hyper-pumped');
        }
    }

    if (valVitalityEl) {
        valVitalityEl.textContent = `${gameState.energy}/${CONFIG.MAX_ENERGY}`;
    }

    if (valSpeedEl) {
        valSpeedEl.textContent = (gameState.speed >= 0 ? '+' : '') + gameState.speed;
        valSpeedEl.className = `stat-value ${gameState.speed !== 0 ? 'highlight' : ''}`;
    }

    if (valExpEl) {
        valExpEl.textContent = gameState.experience;
        valExpEl.className = `stat-value ${gameState.experience > 0 ? 'highlight' : ''}`;
    }

    if (valPrepEl) {
        valPrepEl.textContent = gameState.prep;
        valPrepEl.className = `stat-value ${gameState.prep > 0 ? 'highlight' : ''}`;
    }

    // Skills Values
    if (valCXEl) {
        valCXEl.textContent = (gameState.cx > 0 ? '+' : '') + gameState.cx;
    }
    if (valEXEl) {
        valEXEl.textContent = (gameState.ex > 0 ? '+' : '') + gameState.ex;
    }
    if (valMREl) {
        valMREl.textContent = (gameState.mr > 0 ? '+' : '') + gameState.mr;
    }
}

function rollDice() {
    if (gameState.isRolling || gameState.gameOver || gameState.energy <= 0 || gameState.isStartingUp) return;

    gameState.isRolling = true;
    rollBtn.disabled = true;
    AudioEngine.roll();

    // Reset previous rotations
    diceEl.style.transition = 'none';
    diceEl.style.transform = 'translateZ(-15px) rotateX(0deg) rotateY(0deg)';

    // Consume energy
    gameState.energy--;
    updateUI();

    // Force reflow
    void diceEl.offsetWidth;

    const result = Math.floor(Math.random() * 6) + 1;

    // Randomize final rotation (minimum 2 full spins)
    const spins = 2;
    const xRot = (Math.floor(Math.random() * 4) * 90) + (spins * 360);
    const yRot = (Math.floor(Math.random() * 4) * 90) + (spins * 360);

    let finalX = xRot;
    let finalY = yRot;

    // Map result correctly to Face
    switch (result) {
        case 1: finalX = 0 + (spins * 360); finalY = 0 + (spins * 360); break; // Front
        case 2: finalX = 0 + (spins * 360); finalY = -90 + (spins * 360); break; // Right
        case 3: finalX = 90 + (spins * 360); finalY = 0 + (spins * 360); break; // Bottom
        case 4: finalX = -90 + (spins * 360); finalY = 0 + (spins * 360); break; // Top
        case 5: finalX = 0 + (spins * 360); finalY = 90 + (spins * 360); break; // Left
        case 6: finalX = 0 + (spins * 360); finalY = 180 + (spins * 360); break; // Back
    }

    diceEl.style.transition = 'transform 1.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    diceEl.style.transform = `translateZ(-15px) rotateX(${finalX}deg) rotateY(${finalY}deg)`;

    setTimeout(() => {
        gameState.isRolling = false;
        if (gameState.energy > 0) rollBtn.disabled = false;

        const modifiedResult = Math.max(1, result + gameState.speed);
        if (gameState.speed !== 0) {
            updateEvent(`Rolled ${result} ${gameState.speed > 0 ? '+' : ''}${gameState.speed} Speed = ${modifiedResult}`, "Moving forward...");
        } else {
            updateEvent("Rolled a " + result, "Moving forward...");
        }

        movePlayer(modifiedResult);
    }, 1500);
}

async function movePlayer(steps) {
    const startPos = gameState.currentPos;
    let target = startPos + steps;
    if (target > CONFIG.TOTAL_SQUARES) target = CONFIG.TOTAL_SQUARES;

    updateEvent(`Rolled a ${steps}!`, `Moving to the next meeting...`);

    for (let i = startPos + 1; i <= target; i++) {
        gameState.currentPos = i;
        updateUI();
        AudioEngine.move();
        await new Promise(r => setTimeout(r, 150));
    }

    checkGameState();
}

function checkGameState() {
    const pos = gameState.currentPos;

    // Check for cinematic card reveal on landing
    const cardData = CONFIG.CARDS[pos];
    if (cardData && !gameState.usedCards.includes(pos)) {
        if (cardData.type === 'demoprep') {
            gameState.prep++;
            updateEvent("Demo Prep", "Studying the product... +1 Prep");
            AudioEngine.study();

            gameState.usedCards.push(pos);
            initBoard();

            // Allow rolling again immediately if energy allows
            if (gameState.energy > 0) rollBtn.disabled = false;
        } else {
            showCinematicCard(pos);
        }
    } else {
        // Re-enable roll button if landing on blank space and energy > 0
        if (gameState.energy > 0 && !gameState.gameOver) {
            rollBtn.disabled = false;
        }
    }

    if (pos === CONFIG.TOTAL_SQUARES) {
        gameState.gameOver = true;
        AudioEngine.win();
        updateEvent("Weekend at Last!", "You survived the week with energy to spare!");
        setTimeout(resetGamePrompt, 1000);
    } else if (gameState.energy <= 0) {
        gameState.gameOver = true;
        AudioEngine.fail();
        updateEvent("Major Burnout!", "You ran out of juice before Friday happy hour.");
        setTimeout(resetGamePrompt, 1000);
    } else if (!CONFIG.CARDS[pos]) {
        updateEvent("On Track", `You have ${gameState.energy} energy points remaining.`);
    }
}

function showCinematicCard(squareIdx) {
    const cardData = CONFIG.CARDS[squareIdx];
    if (!cardData) return;

    let cardImg = CONFIG.LUNCH_IMAGE;
    if (cardData.type === 'coffee') cardImg = CONFIG.COFFEE_IMAGE;
    if (cardData.type === 'meeting') cardImg = CONFIG.MEETING_IMAGE;
    if (cardData.type === 'enablement') cardImg = CONFIG.ENABLEMENT_IMAGE;
    if (cardData.type === 'demo') cardImg = CONFIG.DEMO_IMAGE;
    if (cardData.type === 'discovery') cardImg = CONFIG.DISCOVERY_IMAGE;
    if (cardData.type === 'ai_session') cardImg = CONFIG.AI_SESSION_IMAGE;

    let promptText = 'Ready for Lunch?';
    if (cardData.type === 'coffee') promptText = 'Need a caffeine boost?';
    if (cardData.type === 'meeting') {
        promptText = `Join the ${cardData.label}?`;
        if (cardData.label === 'Weekly Standup') promptText = 'Time for the Weekly Standup!';
    }
    if (cardData.type === 'enablement') promptText = `Start the ${cardData.label}?`;
    if (cardData.type === 'demo') promptText = `Ready to present the ${cardData.label}?`;
    if (cardData.type === 'discovery') promptText = `Dig into the ${cardData.label}?`;
    if (cardData.type === 'ai_session') promptText = '🤖✨ It\'s AI Session time! ✨🤖';

    let displayValue = cardData.value;
    if (cardData.randomSkill) {
        const skills = ['cx', 'ex', 'mr'];
        cardData.chosenSkill = skills[Math.floor(Math.random() * skills.length)];
        displayValue = `Team Updates (+1 ${cardData.chosenSkill.toUpperCase()})`;
    }

    // AI Session cards get a golden overlay
    if (cardData.type === 'ai_session') {
        cardOverlay.classList.add('golden-overlay');
        AudioEngine.goldenFanfare();
    } else {
        cardOverlay.classList.remove('golden-overlay');
    }
    cardOverlay.classList.remove('hidden');
    zoomedCardContainer.innerHTML = `
        <div class="card ${cardData.color}" id="zoomed-card">
            <div class="card-face card-front">
                <div class="card-header">${cardData.label}</div>
                <div class="card-label">${promptText}</div>
            </div>
            <div class="card-face card-back">
                <div class="card-header">${cardData.label}</div>
                <div class="card-visual ${cardData.type}-visual" style="background-image: url('${cardImg}')"></div>
                <div id="zoomed-card-value" class="card-value">${displayValue}</div>
            </div>
        </div>
    `;

    // Switch to back side
    setTimeout(() => {
        const card = document.getElementById('zoomed-card');
        if (card) {
            card.classList.add('flipped');
            AudioEngine.cardFlip();
        }
    }, 500);

    // Event listener for closing and applying rewards
    cardOverlay.onclick = () => {
        const card = document.getElementById('zoomed-card');
        if (card && card.classList.contains('flipped')) {
            card.classList.add('dissolve');
            AudioEngine.dissolve();

            setTimeout(() => {
                cardOverlay.classList.add('hidden');

                // Award or consume energy/speed
                if (cardData.energy) {
                    gameState.energy = Math.min(CONFIG.MAX_ENERGY, gameState.energy + cardData.energy);
                    if (cardData.energy < 0) {
                        updateEvent("Energy Drain", `Task was intense! Lost ${Math.abs(cardData.energy)} Vitality.`);
                    }
                }
                if (cardData.speed) {
                    gameState.speed += cardData.speed;
                    if (cardData.speed > 0) {
                        updateEvent("Speed Up!", `Caffeinated! Gained ${cardData.speed} Speed.`);
                    } else {
                        updateEvent("Slowed Down!", `Meeting drained you! Lost ${Math.abs(cardData.speed)} Speed.`);
                    }
                }

                // AI Session special celebration
                if (cardData.type === 'ai_session') {
                    gameState.energy = Math.min(CONFIG.MAX_ENERGY, gameState.energy + cardData.energy);
                    gameState.cx = Math.min(5, gameState.cx + cardData.cx);
                    gameState.ex = Math.min(5, gameState.ex + cardData.ex);
                    gameState.mr = Math.min(5, gameState.mr + cardData.mr);
                    updateEvent("✨ AI Session! ✨", "Robots and humans unite! +5 Vitality, +2 CX, +2 EX, +2 MR 🎉");
                    AudioEngine.goldenFanfare();
                    cardOverlay.classList.remove('golden-overlay');

                    gameState.usedCards.push(squareIdx);
                    if (cardData.twin) gameState.usedCards.push(cardData.twin);
                    initBoard();
                    checkGameState();
                    return;
                }

                // Random skill reward
                if (cardData.randomSkill && cardData.chosenSkill) {
                    const chosen = cardData.chosenSkill;
                    gameState[chosen] = Math.max(-5, Math.min(5, gameState[chosen] + cardData.randomSkill));
                    updateEvent("Meeting Insight", `Gained +${cardData.randomSkill} in ${chosen.toUpperCase()}!`);
                }

                if (cardData.cx) gameState.cx = Math.max(-5, Math.min(5, gameState.cx + cardData.cx));
                if (cardData.ex) gameState.ex = Math.max(-5, Math.min(5, gameState.ex + cardData.ex));
                if (cardData.mr) gameState.mr = Math.max(-5, Math.min(5, gameState.mr + cardData.mr));

                // Discovery resolution
                if (cardData.type === 'discovery') {
                    gameState.discoveryState[cardData.discoveryFor] = true;
                    updateEvent("Discovery Phase", `${cardData.discoveryFor} demo success chance significantly increased!`);
                }

                // Demo resolution
                if (cardData.type === 'demo') {
                    const demoType = cardData.label.split(' ')[0]; // CX, EX, MR
                    const hasDiscovery = gameState.discoveryState[demoType];
                    const roll = Math.floor(Math.random() * 6) + 1;
                    const total = roll + (hasDiscovery ? 3 : 0) + gameState.prep;
                    const success = total >= 5;

                    if (success) {
                        gameState[demoType.toLowerCase()] = Math.max(-5, Math.min(5, gameState[demoType.toLowerCase()] + 2));
                        gameState.experience += 10;
                        updateEvent("Demo SUCCESS!", `Roll: ${roll}${hasDiscovery ? ' (+3 Discovery)' : ''} (+${gameState.prep} Prep). +10 EXP, +2 ${demoType}`);
                        AudioEngine.happyChord();
                    } else {
                        updateEvent("Demo Failure...", `Roll: ${roll} (+${gameState.prep} Prep). Technical issues or lack of prep. No skill gain.`);
                        AudioEngine.fail();
                    }

                    // Reset discovery state and consumed prep
                    gameState.discoveryState[demoType] = false;
                    gameState.prep = 0;
                    updateUI();
                }

                gameState.usedCards.push(squareIdx);
                // If it's a multi-hour meeting, mark the other half as used too
                if (cardData.twin) {
                    gameState.usedCards.push(cardData.twin);
                }

                initBoard();

                checkGameState();
            }, 600);
        }
    };
}

async function runStartupSequence() {
    gameState.isStartingUp = true;
    gameState.visibleCards = [];
    rollBtn.disabled = true;
    initBoard();

    // Create a backup of the final board state BEFORE setting any temp breaks
    const finalBoard = JSON.parse(JSON.stringify(CONFIG.CARDS));

    // Separate indices for animation phases
    const breakEntries = Object.keys(gameState.placementLog).map(idx => ({
        originalIdx: parseInt(idx),
        ...gameState.placementLog[idx]
    }));
    const lunchLog = breakEntries.filter(e => e.type === 'lunch');
    const coffeeLog = breakEntries.filter(e => e.type === 'coffee');

    const meetingIndices = Object.keys(finalBoard).filter(idx => {
        const card = finalBoard[idx];
        return card.type === 'meeting' && card.color !== 'enablement';
    });
    const enablementIndices = Object.keys(finalBoard).filter(idx => {
        const card = finalBoard[idx];
        return (card.type === 'enablement' || card.color === 'enablement') && card.type !== 'meeting';
    });
    const discoveryIndices = Object.keys(finalBoard).filter(idx => finalBoard[idx].type === 'discovery');
    const demoIndices = Object.keys(finalBoard).filter(idx => finalBoard[idx].type === 'demo');

    // Helper to pull a break back to its original position temporarily
    const setTempBreak = (logEntry) => {
        const { originalIdx, finalIdx, type, icon } = logEntry;
        // If it moved, pull it back from the finalIdx or create fresh temp data
        const baseData = finalIdx !== -1 ? finalBoard[finalIdx] : {
            type,
            label: type.charAt(0).toUpperCase() + type.slice(1),
            color: type === 'lunch' ? 'green' : 'brown',
            value: type === 'lunch' ? 'Delicious Lunch (Energy +2)' : 'Speed Boost (+1)',
            energy: type === 'lunch' ? 2 : undefined,
            speed: type === 'coffee' ? 1 : undefined,
            icon
        };

        if (finalIdx !== originalIdx && finalIdx !== -1) {
            delete CONFIG.CARDS[finalIdx];
        }
        CONFIG.CARDS[originalIdx] = { ...baseData };
    };

    // Helper for reactive overwrite animation (pushes breaks to new slots)
    const handleOverwrite = async (meetingIdx) => {
        if (gameState.visibleCards.includes(meetingIdx)) {
            const logEntry = gameState.placementLog[meetingIdx];
            const existingCard = document.querySelector(`.square[id="square-${meetingIdx}"] .card`);

            if (logEntry && existingCard) {
                const { finalIdx, originalIdx } = logEntry;

                if (finalIdx === -1) {
                    // Kicked off completely
                    existingCard.classList.add('kickout');
                    AudioEngine.kickOut();
                    await new Promise(r => setTimeout(r, 400));
                    // Restore the meeting!
                    CONFIG.CARDS[meetingIdx] = finalBoard[meetingIdx];
                } else if (finalIdx !== meetingIdx) {
                    // Shifted to new position
                    const tempBreakData = CONFIG.CARDS[meetingIdx];
                    CONFIG.CARDS[finalIdx] = tempBreakData;
                    // Restore the meeting!
                    CONFIG.CARDS[meetingIdx] = finalBoard[meetingIdx];

                    existingCard.classList.add('kickout'); // Visual placeholder kickout or could do jump animation
                    AudioEngine.kickOut();
                    await new Promise(r => setTimeout(r, 300));

                    // Show it at the new slot
                    gameState.visibleCards.push(finalIdx);
                    initBoard(finalIdx);
                    const newCard = document.querySelector(`.square[id="square-${finalIdx}"] .card`);
                    if (newCard) newCard.classList.add('jump-shift');
                    AudioEngine.sketch();
                } else {
                    // This case shouldn't happen with our logic, but just in case
                    gameState.visibleCards.push(meetingIdx);
                    CONFIG.CARDS[meetingIdx] = finalBoard[meetingIdx];
                }
            }
        } else {
            gameState.visibleCards.push(meetingIdx);
            CONFIG.CARDS[meetingIdx] = finalBoard[meetingIdx];
        }
    };

    // Phase 1: Lunch (Placed at NOON regardless of conflicts)
    startupText.textContent = "Booking lunch...";
    startupOverlay.classList.remove('hidden');
    AudioEngine.happyChord();
    await new Promise(r => setTimeout(r, 1500));
    startupOverlay.classList.add('hidden');
    await new Promise(r => setTimeout(r, 500));

    updateEvent("Booking lunch...", "Noon slots secured.");
    for (const entry of lunchLog) {
        await new Promise(r => setTimeout(r, 150));
        setTempBreak(entry);
        gameState.visibleCards.push(entry.originalIdx);
        AudioEngine.sketch();
        initBoard(entry.originalIdx);
    }

    await new Promise(r => setTimeout(r, 800));

    // Phase 2: Coffee (Placed at default slots)
    startupText.textContent = "Planning coffee...";
    startupOverlay.classList.remove('hidden');
    AudioEngine.happyChord();
    await new Promise(r => setTimeout(r, 1500));
    startupOverlay.classList.add('hidden');
    await new Promise(r => setTimeout(r, 500));

    updateEvent("Planning coffee...", "Caffeine breaks booked.");
    for (const entry of coffeeLog) {
        await new Promise(r => setTimeout(r, 100));
        setTempBreak(entry);
        if (!gameState.visibleCards.includes(entry.originalIdx)) {
            gameState.visibleCards.push(entry.originalIdx);
            AudioEngine.sketch();
            initBoard(entry.originalIdx);
        }
    }

    await new Promise(r => setTimeout(r, 800));

    // Phase 3: Meetings (Triggers SHIFTS)
    startupText.textContent = "Scheduling meetings...";
    startupOverlay.classList.remove('hidden');
    AudioEngine.ominousChord();
    await new Promise(r => setTimeout(r, 1500));
    startupOverlay.classList.add('hidden');
    await new Promise(r => setTimeout(r, 500));

    updateEvent("Scheduling meetings...", "Calendar crunch!");
    for (const idx of meetingIndices) {
        await new Promise(r => setTimeout(r, 200));
        const numIdx = parseInt(idx);
        await handleOverwrite(numIdx);
        AudioEngine.plop();
        initBoard(numIdx);
    }

    await new Promise(r => setTimeout(r, 800));

    // Phase 4: Enablement
    startupText.textContent = "Joining enablement...";
    startupOverlay.classList.remove('hidden');
    AudioEngine.enablementChord();
    await new Promise(r => setTimeout(r, 1500));
    startupOverlay.classList.add('hidden');
    await new Promise(r => setTimeout(r, 500));

    updateEvent("Joining enablement...", "Upskilling.");
    for (const idx of enablementIndices) {
        await new Promise(r => setTimeout(r, 200));
        const numIdx = parseInt(idx);
        await handleOverwrite(numIdx);
        AudioEngine.plop();
        initBoard(numIdx);
    }

    await new Promise(r => setTimeout(r, 800));

    // Phase 5: Demos
    startupText.textContent = "Preparing demos...";
    startupOverlay.classList.remove('hidden');
    AudioEngine.demoChord();
    await new Promise(r => setTimeout(r, 1500));
    startupOverlay.classList.add('hidden');
    await new Promise(r => setTimeout(r, 500));

    updateEvent("Preparing demos...", "Showtime.");
    for (const idx of demoIndices) {
        await new Promise(r => setTimeout(r, 200));
        const numIdx = parseInt(idx);
        await handleOverwrite(numIdx);
        AudioEngine.plop();
        initBoard(numIdx);
    }

    await new Promise(r => setTimeout(r, 800));

    // Phase 6: Discovery
    startupText.textContent = "Synchronizing discovery...";
    startupOverlay.classList.remove('hidden');
    AudioEngine.happyChord();
    await new Promise(r => setTimeout(r, 1500));
    startupOverlay.classList.add('hidden');
    await new Promise(r => setTimeout(r, 500));

    updateEvent("Synchronizing discovery...", "Prep syncs.");
    for (const idx of discoveryIndices) {
        await new Promise(r => setTimeout(r, 150));
        const numIdx = parseInt(idx);
        await handleOverwrite(numIdx);
        AudioEngine.plop();
        initBoard(numIdx);
    }

    await new Promise(r => setTimeout(r, 800));

    // Phase 7: Demo Prep (Fillers)
    startupText.textContent = "Fleshing out calendar...";
    startupOverlay.classList.remove('hidden');
    AudioEngine.sketch();
    await new Promise(r => setTimeout(r, 1000));
    startupOverlay.classList.add('hidden');
    await new Promise(r => setTimeout(r, 500));

    updateEvent("Fleshing out calendar...", "Demo prep time.");
    const prepIndices = Object.keys(finalBoard).filter(idx => finalBoard[idx].type === 'demoprep');
    for (const idx of prepIndices) {
        await new Promise(r => setTimeout(r, 30));
        const numIdx = parseInt(idx);
        gameState.visibleCards.push(numIdx);
        initBoard(numIdx);
        // Add a very quiet tick sound so it's not overwhelming
        AudioEngine.playTone(300, 'square', 0.02, 0.01);
    }

    await new Promise(r => setTimeout(r, 800));

    // Phase 8: EMEA AI Session (The Golden Card)
    startupText.textContent = "✨ EMEA AI Session ✨";
    startupOverlay.classList.remove('hidden');
    startupOverlay.style.background = 'radial-gradient(ellipse at center, rgba(255,215,0,0.3) 0%, rgba(180,100,0,0.5) 50%, rgba(0,0,0,0.95) 100%)';
    AudioEngine.goldenFanfare();
    await new Promise(r => setTimeout(r, 2000));
    startupOverlay.classList.add('hidden');
    startupOverlay.style.background = '';
    await new Promise(r => setTimeout(r, 400));

    updateEvent("✨ EMEA AI Session incoming!", "The golden card has arrived.");
    gameState.visibleCards.push(49);
    initBoard(49);

    await new Promise(r => setTimeout(r, 1000));


    gameState.isStartingUp = false;
    rollBtn.disabled = false;
    updateEvent("Planner Ready", "Your week is scheduled. Time to work!");
}

function updateEvent(title, desc) {
    if (eventTitleEl) eventTitleEl.textContent = title;
    if (eventDescEl) eventDescEl.textContent = desc;
}

rollBtn.addEventListener('click', () => {
    AudioEngine.init();
    rollDice();
});
diceEl.addEventListener('click', () => {
    AudioEngine.init();
    rollDice();
});
if (debugStepBtn) {
    debugStepBtn.addEventListener('click', () => {
        if (gameState.isRolling || gameState.gameOver || gameState.isStartingUp || !cardOverlay.classList.contains('hidden')) return;
        movePlayer(1);
    });
}

function resetGamePrompt() {
    if (confirm("Reset the planner for a new week?")) {
        gameState = {
            currentPos: 1,
            energy: 15,
            cx: 0,
            ex: 0,
            mr: 0,
            isRolling: false,
            isStartingUp: false,
            gameOver: false,
            usedCards: [],
            visibleCards: []
        };
        populateBoard();
        runStartupSequence();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    populateBoard();
    initBoard();

    const startOverlay = document.getElementById('start-overlay');
    const startBtn = document.getElementById('start-button');

    startBtn.addEventListener('click', () => {
        AudioEngine.init();
        startOverlay.classList.add('hidden');
        runStartupSequence();
    });
});
