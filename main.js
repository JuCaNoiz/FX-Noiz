// Este es el script principal que une todos los módulos.

import { drawCircleOfFifths, highlightCircleNotes, resetCircleSelection, getCurrentSelectedKey } from './circle-of-fifths.js';
import { drawFretboard, setCurrentFretboardPosition } from './fretboard.js';
import { openTunerModal, closeTunerModal, toggleTuner, updateA4Frequency } from './tuner.js';
import { openMetronomeModal, closeMetronomeModal, toggleMetronome, setTempo, setBeatsPerMeasure } from './metronome.js';
import { drawStrummingPattern } from './song-generator.js';

function updateModeDisplayAndFretboard() {
    const currentSelectedKey = getCurrentSelectedKey();
    if (!currentSelectedKey) {
        return;
    }
    drawFretboard();
}

function handleReset() {
    resetCircleSelection();
    drawFretboard();
    updateModeDisplayAndFretboard();
}

function handleFretboardPositionChange(event) {
    setCurrentFretboardPosition(event.target.value);
    updateModeDisplayAndFretboard();
}

function handleMetronomeBPMChange(event) {
    setTempo(event.target.value);
}

function handleMetronomeBeatsChange(event) {
    setBeatsPerMeasure(event.target.value);
}

function handleTunerA4Change(event) {
    updateA4Frequency(parseFloat(event.target.value));
}

document.addEventListener("DOMContentLoaded", () => {
    try {
        drawCircleOfFifths();
        drawFretboard();

        const modeSelect = document.getElementById("mode-select");
        for (const mode in musicalData.modes) {
            const option = document.createElement("option");
            option.value = mode;
            option.textContent = mode;
            modeSelect.appendChild(option);
        }

        modeSelect.addEventListener("change", updateModeDisplayAndFretboard);
        document.getElementById("reset-button").addEventListener("click", handleReset);
        document.getElementById("open-tuner-button").addEventListener("click", openTunerModal);
        document.getElementById("tuner-close-button").addEventListener("click", closeTunerModal);
        document.getElementById("open-metronome-button").addEventListener("click", openMetronomeModal);
        document.getElementById("metronome-close-button").addEventListener("click", closeMetronomeModal);
        document.getElementById("start-tuner-button").addEventListener("click", toggleTuner);
        document.getElementById("tuner-a4-frequency").addEventListener("change", handleTunerA4Change);
        document.getElementById("metronome-button").addEventListener("click", toggleMetronome);
        document.getElementById("bpm-slider").addEventListener("input", handleMetronomeBPMChange);
        document.getElementById("beats-per-measure-select").addEventListener("change", handleMetronomeBeatsChange);
        document.getElementById("fretboard-position-select").addEventListener("change", handleFretboardPositionChange);

    } catch (e) {
        console.error("Error durante la inicialización de la aplicación:", e);
        alert("¡Uy! Hubo un error al iniciar la aplicación. Revisa la consola para más detalles.");
    }
});
