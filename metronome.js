// Este módulo maneja la lógica del Metrónomo.

let audioContextMetronome;
let isMetronomeRunning = false;
let metronomeInterval;
let tempo = 120;
let beatsPerMeasure = 4;
let currentBeat = 0;

export function toggleMetronome() {
    if (isMetronomeRunning) {
        stopMetronome();
    } else {
        startMetronome();
    }
}

function startMetronome() {
    if (!audioContextMetronome) {
        audioContextMetronome = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (isMetronomeRunning) {
        stopMetronome();
    }
    isMetronomeRunning = true;
    const intervalTime = 60000 / tempo;
    
    updateBeatIndicators(0);

    metronomeInterval = setInterval(() => {
        currentBeat = (currentBeat % beatsPerMeasure) + 1;
        
        let pitch = (currentBeat === 1) ? 880 : 440;
        let volume = (currentBeat === 1) ? 1 : 0.8;
        playMetronomeSound(pitch, volume);
        
        updateBeatIndicators(currentBeat);
    }, intervalTime);
    
    document.getElementById("metronome-button").textContent = "Detener";
    document.getElementById("metronome-button").classList.remove('bg-green-600');
    document.getElementById("metronome-button").classList.add('bg-red-600');
}

function stopMetronome() {
    clearInterval(metronomeInterval);
    isMetronomeRunning = false;
    currentBeat = 0;
    updateBeatIndicators(0);
    document.getElementById("metronome-button").textContent = "Iniciar";
    document.getElementById("metronome-button").classList.remove('bg-red-600');
    document.getElementById("metronome-button").classList.add('bg-green-600');
}

function playMetronomeSound(pitch, volume) {
    if (!audioContextMetronome) return;
    const oscillator = audioContextMetronome.createOscillator();
    const gainNode = audioContextMetronome.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.value = pitch;
    gainNode.gain.value = volume;

    oscillator.connect(gainNode);
    gainNode.connect(audioContextMetronome.destination);
    
    oscillator.start();
    oscillator.stop(audioContextMetronome.currentTime + 0.05);
}

function updateBeatIndicators(activeBeat) {
    const container = document.getElementById("beat-indicators");
    container.innerHTML = '';
    for (let i = 1; i <= beatsPerMeasure; i++) {
        const indicator = document.createElement("div");
        indicator.classList.add("metronome-beat-indicator");
        if (i === 1) {
            indicator.classList.add("first-beat");
        }
        if (i === activeBeat) {
            indicator.classList.add("active");
        }
        container.appendChild(indicator);
    }
}

export function openMetronomeModal() {
    document.getElementById('metronome-modal').classList.remove('hidden');
    if (isMetronomeRunning) {
        toggleMetronome();
    } else {
        updateBeatIndicators(0);
    }
}

export function closeMetronomeModal() {
    document.getElementById('metronome-modal').classList.add('hidden');
    stopMetronome();
}

export function setTempo(newTempo) {
    tempo = parseInt(newTempo);
    document.getElementById("bpm-display").textContent = tempo;
    if (isMetronomeRunning) {
        stopMetronome();
        startMetronome();
    }
}

export function setBeatsPerMeasure(newBeats) {
    beatsPerMeasure = parseInt(newBeats);
    updateBeatIndicators(0);
    if (isMetronomeRunning) {
        stopMetronome();
        startMetronome();
    }
}
