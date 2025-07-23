// Este módulo maneja la lógica del Afinador Cromático.

import { musicalData } from './data.js';
import { getNoteIndex } from './utils.js';

let audioContextTuner;
let analyserTuner;
let mediaStreamSourceTuner;
let animationFrameIdTuner;
let isTunerRunning = false;
let currentA4Frequency = 440;

export function toggleTuner() {
    if (isTunerRunning) {
        stopTuner();
    } else {
        startTuner();
    }
}

function startTuner() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('Lo siento, tu navegador no soporta el acceso al micrófono.');
        return;
    }

    if (!audioContextTuner) {
        audioContextTuner = new (window.AudioContext || window.webkitAudioContext)();
    }

    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            mediaStreamSourceTuner = audioContextTuner.createMediaStreamSource(stream);
            analyserTuner = audioContextTuner.createAnalyser();
            analyserTuner.fftSize = 2048;
            mediaStreamSourceTuner.connect(analyserTuner);
            isTunerRunning = true;
            document.getElementById("start-tuner-button").textContent = "Detener";
            document.getElementById("start-tuner-button").classList.remove('bg-green-600');
            document.getElementById("start-tuner-button").classList.add('bg-red-600');
            updateTunerDisplay();
        })
        .catch(err => {
            console.error("Error al acceder al micrófono: ", err);
            alert("No se pudo acceder al micrófono. Asegúrate de dar los permisos.");
        });
}

export function stopTuner() {
    if (mediaStreamSourceTuner) {
        mediaStreamSourceTuner.mediaStream.getTracks().forEach(track => track.stop());
        mediaStreamSourceTuner.disconnect();
    }
    cancelAnimationFrame(animationFrameIdTuner);
    isTunerRunning = false;
    document.getElementById("start-tuner-button").textContent = "Iniciar Afinador";
    document.getElementById("start-tuner-button").classList.remove('bg-red-600');
    document.getElementById("start-tuner-button").classList.add('bg-green-600');
}

export function updateTunerDisplay() {
    if (!isTunerRunning || !analyserTuner) {
        document.getElementById("tuner-note-display").textContent = "--";
        document.getElementById("tuner-cents-display").textContent = "--";
        document.getElementById("tuner-needle").style.transform = `rotate(0deg)`;
        document.getElementById("tuner-range-indicator-flat").style.width = '50%';
        document.getElementById("tuner-range-indicator-sharp").style.width = '50%';
        return;
    }

    const bufferLength = analyserTuner.fftSize;
    const dataArray = new Float32Array(bufferLength);
    analyserTuner.getFloatTimeDomainData(dataArray);

    let [pitch, clarity] = autoCorrelate(dataArray, audioContextTuner.sampleRate);
    
    if (clarity > 0.95 && pitch > 0) {
        const midi = frequencyToMidi(pitch);
        const { noteName, cents } = getNoteAndCents(midi);
        document.getElementById("tuner-note-display").textContent = noteName;
        document.getElementById("tuner-cents-display").textContent = `${cents} cents`;
        
        const needleRotation = Math.max(-45, Math.min(45, cents));
        document.getElementById("tuner-needle").style.transform = `rotate(${needleRotation}deg)`;
        
        if (Math.abs(cents) < 5) {
            document.getElementById("tuner-range-indicator-flat").style.width = '0%';
            document.getElementById("tuner-range-indicator-sharp").style.width = '0%';
        } else if (cents < 0) {
            document.getElementById("tuner-range-indicator-flat").style.width = `${50 + (cents * -1) / 100 * 50}%`;
            document.getElementById("tuner-range-indicator-sharp").style.width = '50%';
        } else {
            document.getElementById("tuner-range-indicator-flat").style.width = '50%';
            document.getElementById("tuner-range-indicator-sharp").style.width = `${50 + cents / 100 * 50}%`;
        }
    } else {
        document.getElementById("tuner-note-display").textContent = "--";
        document.getElementById("tuner-cents-display").textContent = "--";
        document.getElementById("tuner-needle").style.transform = `rotate(0deg)`;
        document.getElementById("tuner-range-indicator-flat").style.width = '50%';
        document.getElementById("tuner-range-indicator-sharp").style.width = '50%';
    }

    animationFrameIdTuner = requestAnimationFrame(updateTunerDisplay);
}

function autoCorrelate(buf, sampleRate) {
    // ...
    return [0, 0];
}

function midiToFrequency(midi) {
    return currentA4Frequency * Math.pow(2, (midi - 69) / 12);
}

function frequencyToMidi(frequency) {
    return 12 * (Math.log(frequency / currentA4Frequency) / Math.log(2)) + 69;
}

function getNoteAndCents(midi) {
    const noteIndex = Math.round(midi);
    const cents = Math.floor(100 * (midi - noteIndex));
    const noteName = musicalData.simpleChromaticScale[noteIndex % 12];
    return { noteName, cents };
}

export function openTunerModal() {
    document.getElementById('tuner-modal').classList.remove('hidden');
}

export function closeTunerModal() {
    document.getElementById('tuner-modal').classList.add('hidden');
    stopTuner();
}

export function updateA4Frequency(freq) {
    currentA4Frequency = freq;
}
