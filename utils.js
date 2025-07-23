// Este módulo contiene funciones de utilidad que se usan en varios módulos.

import { musicalData, NUM_NOTES } from './data.js';

export function getNoteIndex(noteName) {
    let sharpsIndex = musicalData.fullChromaticScaleSharps.indexOf(noteName);
    if (sharpsIndex !== -1) {
        return sharpsIndex;
    }
    let flatsIndex = musicalData.fullChromaticScaleFlats.indexOf(noteName);
    if (flatsIndex !== -1) {
        return flatsIndex;
    }
    return -1;
}

export function getNoteNameFromChromaticIndex(index, rootNoteForSpelling) {
    index = (index + 12) % 12;
    const preferFlats = rootNoteForSpelling.includes('b') || ['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb'].includes(rootNoteForSpelling);

    if (preferFlats) {
        return musicalData.fullChromaticScaleFlats[index];
    } else {
        return musicalData.fullChromaticScaleSharps[index];
    }
}

export function getModeNotesWithIntervals(rootNote, modeName) {
    const rootIndex = getNoteIndex(rootNote);
    const mode = musicalData.modes[modeName];
    if (!mode) return [];

    const modeNotes = mode.escala.map(interval => {
        let noteIndex = (rootIndex + interval) % NUM_NOTES;
        let noteName = getNoteNameFromChromaticIndex(noteIndex, rootNote);
        let intervalName = musicalData.intervalos[interval];
        return { note: noteName, interval: intervalName, semitones: interval };
    });

    return modeNotes;
}

export function getDiatonicChords(key, isMajor) {
    const scaleNotes = getModeNotesWithIntervals(key, isMajor ? "Jónico (Mayor)" : "Eólico (Menor)").map(n => n.note);
    const chords = isMajor ? ["", "m", "m", "", "", "m", "°"] : ["m", "°", "", "m", "m", "", "°"];

    return scaleNotes.map((note, index) => note + chords[index]);
}

export function getChordDiagramData(chordName) {
    const allNotes = musicalData.simpleChromaticScale;
    const note = chordName.replace(/[m°].*$/, '');
    const quality = chordName.match(/[m°]/)?.[0];
    const rootIndex = allNotes.indexOf(note);

    if (rootIndex === -1) return null;
    
    let intervals;
    if (quality === 'm') {
        intervals = [0, 3, 7];
    } else if (quality === '°') {
        intervals = [0, 3, 6];
    } else {
        intervals = [0, 4, 7];
    }
    const chordNoteIndices = intervals.map(i => (rootIndex + i) % 12);

    const voicings = [
        {
            frets: [3, 2, 0, 0, 0, 3],
            openStrings: [0, 0, 0, 0, 0, 0],
            fingerings: [3, 2, 0, 0, 1, 0]
        },
        {
            frets: [0, 0, 2, 2, 1, 0],
            openStrings: [1, 1, 0, 0, 1, 1],
            fingerings: [0, 0, 2, 3, 1, 0]
        },
        {
            frets: [3, 2, 0, 0, 0, 3],
            openStrings: [0, 0, 0, 0, 0, 0],
            fingerings: [3, 2, 0, 0, 0, 4]
        }
    ];

    return voicings;
}

export function openChordOptionsModal(chordName) {
    const modal = document.getElementById('chord-options-modal');
    const title = document.getElementById('chord-options-title');
    const container = document.getElementById('chord-options-container');
    title.textContent = `Opciones de Acorde: ${chordName}`;
    container.innerHTML = '';

    const voicings = getChordDiagramData(chordName);
    if (voicings && voicings.length > 0) {
        voicings.forEach((voicing, index) => {
            const voicingWrapper = document.createElement('div');
            voicingWrapper.classList.add('flex', 'flex-col', 'items-center', 'p-2', 'rounded-md', 'bg-gray-700');
            const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svgElement.setAttribute("width", "120");
            svgElement.setAttribute("height", "140");
            svgElement.setAttribute("viewBox", "0 0 120 140");
            svgElement.setAttribute("class", "chord-diagram-svg");
            svgElement.setAttribute("data-chord-name", chordName);
            svgElement.setAttribute("data-voicing-index", index);
            drawChordDiagram(svgElement, chordName, voicing, true);
            voicingWrapper.appendChild(svgElement);
            container.appendChild(voicingWrapper);
        });
    } else {
        container.textContent = "No hay opciones de digitación disponibles para este acorde.";
    }
    modal.classList.remove('hidden');
}

export function drawChordDiagram(svg, chordName, voicing, isModal = false) {
    // ...
}
