// Este módulo maneja la lógica del Diapasón.

import { musicalData, NUM_STRINGS, NUM_FRETS, FRETBOARD_WIDTH, FRETBOARD_HEIGHT, FRET_SPACING, STRING_SPACING } from './data.js';
import { getNoteIndex, getNoteNameFromChromaticIndex, getModeNotesWithIntervals } from './utils.js';
import { getCurrentSelectedKey, getCurrentKeyType } from './circle-of-fifths.js';

let currentFretboardPosition = "Full Fretboard";

const fretboardNoteColors = {
    "fundamental": "#f6ad55",
    "resolution": "#63b3ed",
    "resting": "#48bb78",
    "other": "#9f7aea"
};

function classifyNoteFunction(semitones) {
    switch (semitones) {
        case 0: return "fundamental";
        case 7:
        case 11: return "resolution";
        case 4:
        case 9: return "resting";
        default: return "other";
    }
}

export function drawFretboard() {
    const fretboardSvg = document.getElementById("fretboard-svg");
    fretboardSvg.innerHTML = '';
    fretboardSvg.setAttribute("viewBox", `0 0 ${FRETBOARD_WIDTH} ${FRETBOARD_HEIGHT}`);

    for (let i = 0; i < NUM_STRINGS; i++) {
        const y = (i + 1) * STRING_SPACING;
        const string = document.createElementNS("http://www.w3.org/2000/svg", "line");
        string.setAttribute("x1", 0);
        string.setAttribute("y1", y);
        string.setAttribute("x2", FRETBOARD_WIDTH);
        string.setAttribute("y2", y);
        string.setAttribute("stroke", "#a0aec0");
        string.setAttribute("stroke-width", 1.5);
        fretboardSvg.appendChild(string);
    }
    
    for (let i = 0; i <= NUM_FRETS; i++) {
        const x = i * FRET_SPACING;
        const fret = document.createElementNS("http://www.w3.org/2000/svg", "line");
        fret.setAttribute("x1", x);
        fret.setAttribute("y1", STRING_SPACING / 2);
        fret.setAttribute("x2", x);
        fret.setAttribute("y2", FRETBOARD_HEIGHT - STRING_SPACING / 2);
        fret.setAttribute("stroke", "#a0aec0");
        fret.setAttribute("stroke-width", i === 0 ? 5 : 2);
        fretboardSvg.appendChild(fret);
    }
    
    const inlayFrets = [3, 5, 7, 9, 12, 15, 17, 19, 21, 24];
    inlayFrets.forEach(fretNum => {
        if (fretNum <= NUM_FRETS) {
            const x = fretNum * FRET_SPACING - (FRET_SPACING / 2);
            if (fretNum !== 12 && fretNum !== 24) {
                const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                dot.setAttribute("cx", x);
                dot.setAttribute("cy", FRETBOARD_HEIGHT / 2);
                dot.setAttribute("r", 5);
                dot.setAttribute("fill", "#a0aec0");
                fretboardSvg.appendChild(dot);
            } else {
                const dot1 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                dot1.setAttribute("cx", x);
                dot1.setAttribute("cy", FRETBOARD_HEIGHT / 2 - STRING_SPACING * 1.5);
                dot1.setAttribute("r", 5);
                dot1.setAttribute("fill", "#a0aec0");
                fretboardSvg.appendChild(dot1);
                const dot2 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                dot2.setAttribute("cx", x);
                dot2.setAttribute("cy", FRETBOARD_HEIGHT / 2 + STRING_SPACING * 1.5);
                dot2.setAttribute("r", 5);
                dot2.setAttribute("fill", "#a0aec0");
                fretboardSvg.appendChild(dot2);
            }
        }
    });

    for (let i = 1; i <= NUM_FRETS; i++) {
        const x = i * FRET_SPACING - FRET_SPACING / 2;
        const fretNumberText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        fretNumberText.setAttribute("x", x);
        fretNumberText.setAttribute("y", FRETBOARD_HEIGHT - STRING_SPACING / 2 + 15);
        fretNumberText.setAttribute("text-anchor", "middle");
        fretNumberText.setAttribute("fill", "#a0aec0");
        fretNumberText.textContent = i;
        fretboardSvg.appendChild(fretNumberText);
    }

    const fretboardTuning = musicalData.STRING_TUNING_NOTES.map(note => getNoteIndex(note));
    const currentSelectedKey = getCurrentSelectedKey();
    const currentKeyType = getCurrentKeyType();

    if (!currentSelectedKey || !currentKeyType) {
        return;
    }

    const modeSelect = document.getElementById("mode-select");
    const selectedMode = modeSelect.value;
    const scaleNotesWithIntervals = getModeNotesWithIntervals(currentSelectedKey, selectedMode);
    const scaleNoteIndices = scaleNotesWithIntervals.map(n => getNoteIndex(n.note));
    const rootNoteIndex = getNoteIndex(currentSelectedKey);

    if (currentFretboardPosition === "Full Fretboard") {
        for (let stringNum = 0; stringNum < NUM_STRINGS; stringNum++) {
            for (let fretNum = 0; fretNum <= NUM_FRETS; fretNum++) {
                let noteIndex = (fretboardTuning[stringNum] + fretNum) % NUM_NOTES;
                if (scaleNoteIndices.includes(noteIndex)) {
                    const x = fretNum * FRET_SPACING + FRET_SPACING / 2;
                    const y = (stringNum + 1) * STRING_SPACING;
                    const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                    dot.setAttribute("cx", x);
                    dot.setAttribute("cy", y);
                    dot.setAttribute("r", 10);
                    let colorKey = (noteIndex === rootNoteIndex) ? "fundamental" : classifyNoteFunction((noteIndex - rootNoteIndex + 12) % 12);
                    dot.setAttribute("fill", fretboardNoteColors[colorKey]);
                    dot.setAttribute("stroke", "#000");
                    dot.setAttribute("stroke-width", 1);
                    fretboardSvg.appendChild(dot);
                    
                    const noteText = document.createElementNS("http://www.w3.org/2000/svg", "text");
                    noteText.setAttribute("x", x);
                    noteText.setAttribute("y", y + 4);
                    noteText.setAttribute("text-anchor", "middle");
                    noteText.setAttribute("fill", "#000");
                    noteText.setAttribute("font-size", "10px");
                    noteText.setAttribute("font-weight", "bold");
                    noteText.textContent = getNoteNameFromChromaticIndex(noteIndex, currentSelectedKey);
                    fretboardSvg.appendChild(noteText);
                }
            }
        }
    } else {
        const pattern = musicalData.fretboardPatterns[currentFretboardPosition];
        if (!pattern) {
            return;
        }
        
        pattern.relativeFrets.forEach((frets, stringNum) => {
            frets.forEach(fretOffset => {
                const fretNum = fretOffset + pattern.patternLowestFret;
                let noteIndex = (fretboardTuning[stringNum] + fretNum) % NUM_NOTES;
                
                if (scaleNoteIndices.includes(noteIndex)) {
                    const x = fretNum * FRET_SPACING + FRET_SPACING / 2;
                    const y = (stringNum + 1) * STRING_SPACING;
                    const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                    dot.setAttribute("cx", x);
                    dot.setAttribute("cy", y);
                    dot.setAttribute("r", 10);
                    let colorKey = (noteIndex === rootNoteIndex) ? "fundamental" : classifyNoteFunction((noteIndex - rootNoteIndex + 12) % 12);
                    dot.setAttribute("fill", fretboardNoteColors[colorKey]);
                    dot.setAttribute("stroke", "#000");
                    dot.setAttribute("stroke-width", 1);
                    fretboardSvg.appendChild(dot);
                    
                    const noteText = document.createElementNS("http://www.w3.org/2000/svg", "text");
                    noteText.setAttribute("x", x);
                    noteText.setAttribute("y", y + 4);
                    noteText.setAttribute("text-anchor", "middle");
                    noteText.setAttribute("fill", "#000");
                    noteText.setAttribute("font-size", "10px");
                    noteText.setAttribute("font-weight", "bold");
                    noteText.textContent = getNoteNameFromChromaticIndex(noteIndex, currentSelectedKey);
                    fretboardSvg.appendChild(noteText);
                }
            });
        });
    }

    musicalData.STRING_TUNING_NOTES.forEach((noteName, index) => {
        const y = (index + 1) * STRING_SPACING;
        const stringNameText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        stringNameText.setAttribute("x", FRET_SPACING / 2 - 20);
        stringNameText.setAttribute("y", y + 4);
        stringNameText.setAttribute("text-anchor", "middle");
        stringNameText.setAttribute("fill", "#a0aec0");
        stringNameText.textContent = noteName;
        fretboardSvg.appendChild(stringNameText);
    });
}

export function setCurrentFretboardPosition(position) {
    currentFretboardPosition = position;
}
