// Este módulo maneja la lógica del Círculo de Quintas.

import { musicalData, CIRCLE_SVG_SIZE, CENTER_X, CENTER_Y, OUTER_RADIUS, INNER_RADIUS, NOTE_CIRCLE_RADIUS, NUM_NOTES } from './data.js';
import { getNoteIndex, getNoteNameFromChromaticIndex, getModeNotesWithIntervals, getDiatonicChords, openChordOptionsModal } from './utils.js';

let currentSelectedKey = null;
let currentKeyType = null;

export function drawCircleOfFifths() {
    const container = document.getElementById("circle-container");
    container.innerHTML = '';
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.setAttribute("viewBox", `0 0 ${CIRCLE_SVG_SIZE} ${CIRCLE_SVG_SIZE}`);

    const centerCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    centerCircle.setAttribute("cx", CENTER_X);
    centerCircle.setAttribute("cy", CENTER_Y);
    centerCircle.setAttribute("r", INNER_RADIUS - 20);
    centerCircle.setAttribute("class", "center-circle");
    svg.appendChild(centerCircle);

    musicalData.circleOfFifths.forEach((majorNote, index) => {
        const angle = (index * 360 / NUM_NOTES) * Math.PI / 180 - Math.PI / 2;
        const outerX = CENTER_X + OUTER_RADIUS * Math.cos(angle);
        const outerY = CENTER_Y + OUTER_RADIUS * Math.sin(angle);

        const majorNoteGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        majorNoteGroup.setAttribute("class", "note-group major");
        majorNoteGroup.setAttribute("data-note-type", "major");
        majorNoteGroup.setAttribute("data-note-value", majorNote);

        const majorNoteCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        majorNoteCircle.setAttribute("cx", outerX);
        majorNoteCircle.setAttribute("cy", outerY);
        majorNoteCircle.setAttribute("r", NOTE_CIRCLE_RADIUS);
        majorNoteCircle.setAttribute("class", "note-circle");

        const majorNoteText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        majorNoteText.setAttribute("x", outerX);
        majorNoteText.setAttribute("y", outerY + 8);
        majorNoteText.setAttribute("text-anchor", "middle");
        majorNoteText.setAttribute("class", "note-text");
        majorNoteText.textContent = majorNote;

        majorNoteGroup.appendChild(majorNoteCircle);
        majorNoteGroup.appendChild(majorNoteText);
        svg.appendChild(majorNoteGroup);

        majorNoteGroup.addEventListener("click", () => {
            highlightCircleNotes(majorNote, "major");
        });

        const minorNote = musicalData.relativeMinors[majorNote];
        const innerX = CENTER_X + INNER_RADIUS * Math.cos(angle);
        const innerY = CENTER_Y + INNER_RADIUS * Math.sin(angle);

        const minorNoteGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        minorNoteGroup.setAttribute("class", "note-group minor");
        minorNoteGroup.setAttribute("data-note-type", "minor");
        minorNoteGroup.setAttribute("data-note-value", minorNote);
        minorNoteGroup.setAttribute("data-relative-major-value", majorNote);

        const minorNoteCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        minorNoteCircle.setAttribute("cx", innerX);
        minorNoteCircle.setAttribute("cy", innerY);
        minorNoteCircle.setAttribute("r", NOTE_CIRCLE_RADIUS * 0.8);
        minorNoteCircle.setAttribute("class", "minor-note-circle");

        const minorNoteTextElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
        minorNoteTextElement.setAttribute("x", innerX);
        minorNoteTextElement.setAttribute("y", innerY + 6);
        minorNoteTextElement.setAttribute("text-anchor", "middle");
        minorNoteTextElement.setAttribute("class", "minor-note-text");
        minorNoteTextElement.textContent = minorNote;

        minorNoteGroup.appendChild(minorNoteCircle);
        minorNoteGroup.appendChild(minorNoteTextElement);
        svg.appendChild(minorNoteGroup);

        minorNoteGroup.addEventListener("click", () => {
            highlightCircleNotes(minorNote, "minor");
        });

        const relativeLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
        relativeLine.setAttribute("x1", outerX);
        relativeLine.setAttribute("y1", outerY);
        relativeLine.setAttribute("x2", innerX);
        relativeLine.setAttribute("y2", innerY);
        relativeLine.setAttribute("class", "relative-line");
        svg.appendChild(relativeLine);
        
        drawMiniKeySignature(svg, majorNote, angle);
    });

    container.appendChild(svg);
}

function drawMiniKeySignature(svg, majorNote, angle) {
    const keySignatureData = {
        "C": { symbols: [], sharps: 0, flats: 0 },
        "G": { symbols: ["F"], sharps: 1, flats: 0 },
        "D": { symbols: ["F", "C"], sharps: 2, flats: 0 },
        "A": { symbols: ["F", "C", "G"], sharps: 3, flats: 0 },
        "E": { symbols: ["F", "C", "G", "D"], sharps: 4, flats: 0 },
        "B": { symbols: ["F", "C", "G", "D", "A"], sharps: 5, flats: 0 },
        "F#": { symbols: ["F", "C", "G", "D", "A", "E"], sharps: 6, flats: 0 },
        "C#": { symbols: ["F", "C", "G", "D", "A", "E", "B"], sharps: 7, flats: 0 },
        "F": { symbols: ["B"], sharps: 0, flats: 1 },
        "Bb": { symbols: ["B", "E"], sharps: 0, flats: 2 },
        "Eb": { symbols: ["B", "E", "A"], sharps: 0, flats: 3 },
        "Ab": { symbols: ["B", "E", "A", "D"], sharps: 0, flats: 4 },
        "Db": { symbols: ["B", "E", "A", "D", "G"], sharps: 0, flats: 5 },
        "Gb": { symbols: ["B", "E", "A", "D", "G", "C"], sharps: 0, flats: 6 },
        "Cb": { symbols: ["B", "E", "A", "D", "G", "C", "F"], sharps: 0, flats: 7 }
    };
    
    const keyData = keySignatureData[majorNote] || { symbols: [], sharps: 0, flats: 0 };
    const radius = 100;
    const x = CENTER_X + radius * Math.cos(angle);
    const y = CENTER_Y + radius * Math.sin(angle);
    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    group.setAttribute("class", "key-signature-group");

    for (let i = 0; i < 5; i++) {
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", x - 20);
        line.setAttribute("y1", y - 10 + (i * 2));
        line.setAttribute("x2", x + 20);
        line.setAttribute("y2", y - 10 + (i * 2));
        line.setAttribute("class", "mini-staff-line");
        group.appendChild(line);
    }
    const clef = document.createElementNS("http://www.w3.org/2000/svg", "path");
    clef.setAttribute("d", `M${x - 15},${y + 10} C${x - 5},${y - 20} ${x + 5},${y - 20} ${x + 15},${y + 10}`);
    clef.setAttribute("class", "mini-clef");
    group.appendChild(clef);

    const sharpPositions = { "F": -8, "C": -6, "G": -9, "D": -7, "A": -4, "E": -1, "B": -5 };
    const flatPositions = { "B": -5, "E": -1, "A": 2, "D": -7, "G": -4, "C": -8, "F": -6 };

    const positions = keyData.sharps > 0 ? sharpPositions : flatPositions;
    keyData.symbols.forEach((symbol, i) => {
        const symbolText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        symbolText.setAttribute("x", x + i * 5 - 10);
        symbolText.setAttribute("y", y + positions[symbol]);
        symbolText.setAttribute("class", "key-symbol");
        symbolText.textContent = keyData.sharps > 0 ? '#' : 'b';
        group.appendChild(symbolText);
    });

    svg.appendChild(group);
}

export function highlightCircleNotes(note, type) {
    currentSelectedKey = note;
    currentKeyType = type;

    const allNoteGroups = document.querySelectorAll('.note-group');
    allNoteGroups.forEach(group => {
        group.classList.remove('highlighted-tonic-major', 'highlighted-other-major-diatonic', 'highlighted-other-minor-diatonic', 'highlighted-diminished-diatonic');
    });

    const rootIndex = getNoteIndex(note);
    const isMajor = type === "major";
    const modeNotes = getModeNotesWithIntervals(note, isMajor ? "Jónico (Mayor)" : "Eólico (Menor)");
    const modeNoteIndices = modeNotes.map(n => getNoteIndex(n.note));
    const diatonicChords = getDiatonicChords(note, isMajor);

    updateDiatonicChordsTable(diatonicChords, note);
    updateInfoDisplay(note, isMajor, modeNotes);

    allNoteGroups.forEach(group => {
        const groupNote = group.getAttribute('data-note-value');
        const groupType = group.getAttribute('data-note-type');
        const groupIndex = getNoteIndex(groupNote);

        if (modeNoteIndices.includes(groupIndex)) {
            const semitoneInterval = (groupIndex - rootIndex + 12) % 12;

            if (groupNote === note) {
                group.classList.add('highlighted-tonic-major');
            } else if (isMajor) {
                if (semitoneInterval === 5 || semitoneInterval === 7) {
                    group.classList.add('highlighted-other-major-diatonic');
                } else if (semitoneInterval === 2 || semitoneInterval === 4 || semitoneInterval === 9) {
                    if(groupType === 'minor'){
                        group.classList.add('highlighted-other-minor-diatonic');
                    }
                } else if (semitoneInterval === 11) {
                    if(groupType === 'minor'){
                        group.classList.add('highlighted-diminished-diatonic');
                    }
                }
            } else {
                if (semitoneInterval === 3 || semitoneInterval === 8) {
                    group.classList.add('highlighted-other-major-diatonic');
                } else if (semitoneInterval === 0 || semitoneInterval === 5 || semitoneInterval === 7) {
                    if(groupType === 'minor'){
                        group.classList.add('highlighted-other-minor-diatonic');
                    }
                } else if (semitoneInterval === 1) {
                    if(groupType === 'minor'){
                        group.classList.add('highlighted-diminished-diatonic');
                    }
                }
            }
        }
    });
}

function updateDiatonicChordsTable(chords, keyName) {
    const tableKeyDisplay = document.getElementById("diatonic-chords-key-display");
    tableKeyDisplay.textContent = keyName;

    const chordsRow = document.getElementById("diatonic-chords-row");
    chordsRow.innerHTML = '';
    chords.forEach(chordName => {
        const cell = document.createElement("td");
        cell.innerHTML = `<span class="chord-name">${chordName}</span>`;
        cell.addEventListener('click', () => {
            openChordOptionsModal(chordName);
        });
        chordsRow.appendChild(cell);
    });
}

function updateInfoDisplay(note, isMajor, modeNotes) {
    const keyTitle = document.getElementById("selected-key-title");
    keyTitle.textContent = `Tonalidad de ${note} (${isMajor ? 'Mayor' : 'Menor'})`;
    
    const scaleNotesDisplay = document.getElementById("scale-notes-display");
    scaleNotesDisplay.textContent = `Notas: ${modeNotes.map(n => n.note).join(", ")}`;
    
    const theoryExplanation = document.getElementById("current-theory-text");
    theoryExplanation.textContent = musicalData.modes[isMajor ? "Jónico (Mayor)" : "Eólico (Menor)"].theory;
}

export function getCurrentSelectedKey() {
    return currentSelectedKey;
}

export function getCurrentKeyType() {
    return currentKeyType;
}

export function resetCircleSelection() {
    highlightCircleNotes(null, null);
    updateDiatonicChordsTable([], "--");
    updateInfoDisplay("Selecciona una tonalidad...", null, []);
}
