// Este módulo contiene todos los datos musicales estáticos.

export const CIRCLE_SVG_SIZE = 600;
export const CENTER_X = CIRCLE_SVG_SIZE / 2;
export const CENTER_Y = CIRCLE_SVG_SIZE / 2;
export const OUTER_RADIUS = 280;
export const INNER_RADIUS = 180;
export const NOTE_CIRCLE_RADIUS = 30;
export const NUM_NOTES = 12;

export const NUM_STRINGS = 6;
export const NUM_FRETS = 24;
export const FRETBOARD_WIDTH = 900;
export const FRETBOARD_HEIGHT = 250;
export const FRET_SPACING = FRETBOARD_WIDTH / (NUM_FRETS + 1);
export const STRING_SPACING = FRETBOARD_HEIGHT / (NUM_STRINGS + 1);
export const STRING_TUNING_NOTES = ["E", "A", "D", "G", "B", "E"];

export const musicalData = {
    circleOfFifths: ["C", "G", "D", "A", "E", "B", "F#", "Db", "Ab", "Eb", "Bb", "F"],
    fullChromaticScaleSharps: ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"],
    fullChromaticScaleFlats: ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"],
    simpleChromaticScale: ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"],
    intervalos: [
        "Tónica", "2ªm", "2ªM", "3ªm", "3ªM", "4ªJ", "4ªaum/5ªdis", "5ªJ", "5ªaum/6ªm", "6ªM", "7ªm", "7ªM"
    ],
    relativeMinors: {
        "C": "Am", "G": "Em", "D": "Bm", "A": "F#m", "E": "C#m", "B": "G#m", "F#": "D#m",
        "Db": "Bbm", "Ab": "Fm", "Eb": "Cm", "Bb": "Gm", "F": "Dm", "Gb": "Ebm", "Cb": "Abm"
    },
    relativeMajors: {
        "Am": "C", "Em": "G", "Bm": "D", "F#m": "A", "C#m": "E", "G#m": "B", "D#m": "F#",
        "Bbm": "Db", "Fm": "Ab", "Cm": "Eb", "Gm": "Bb", "Dm": "F", "Ebm": "Gb", "Abm": "Cb"
    },
    modes: {
        "Jónico (Mayor)": { escala: [0, 2, 4, 5, 7, 9, 11], formula: "T - T - S - T - T - T - S", theory: "El modo Jónico es nuestra escala mayor estándar. Es alegre, brillante y el punto de partida de la teoría musical occidental." },
        "Dórico": { escala: [0, 2, 3, 5, 7, 9, 10], formula: "T - S - T - T - T - S - T", theory: "El modo Dórico tiene un sonido 'funk' o de 'rock' clásico. Su 6ª mayor y 7ª menor le dan un toque melódico y 'cool'. Es popular en el jazz y el blues." },
        "Frigio": { escala: [0, 1, 3, 5, 7, 8, 10], formula: "S - T - T - T - S - T - T", theory: "El modo Frigio es oscuro y exótico. Su 2ª menor es su nota más característica, creando una sonoridad flamenca o metalera. Es ideal para crear tensión." },
        "Lidio": { escala: [0, 2, 4, 6, 7, 9, 11], formula: "T - T - T - S - T - T - S", theory: "El modo Lidio es etéreo y soñador. Su 4ª aumentada le da un sonido brillante, casi celestial. Se usa mucho en soundtracks de películas y jazz." },
        "Mixolidio": { escala: [0, 2, 4, 5, 7, 9, 10], formula: "T - T - S - T - T - S - T", theory: "El modo Mixolidio es la 'escala del rock'. Con su 7ª menor, tiene un sonido bluesy y relajado, pero con la energía de la escala mayor. Es la base de muchas canciones de rock and roll." },
        "Eólico (Menor)": { escala: [0, 2, 3, 5, 7, 8, 10], formula: "T - S - T - T - S - T - T", theory: "El modo Eólico es la escala menor natural. Es melancólico, introspectivo y se usa para crear atmósferas tristes o serias. Es la base de la mayoría de la música en tonalidad menor." },
        "Lócrio": { escala: [0, 1, 3, 5, 6, 8, 10], formula: "S - T - T - S - T - T - T", theory: "El modo Lócrio es el más disonante por su 2ª menor y 5ª disminuida. Es inestable y se usa poco melódicamente, ¡pero puede crear tensión extrema en contextos experimentales!"
        }
    },
    fretboardPatterns: {
        "Full Fretboard": {
            patternLowestFret: 0,
            relativeFrets: [
                [0, 2, 3, 5, 7, 8, 10, 12, 14, 15, 17, 19, 20, 22],
                [0, 1, 3, 5, 7, 8, 10, 12, 13, 15, 17, 19, 20, 22],
                [0, 2, 4, 5, 7, 9, 10, 12, 14, 16, 17, 19, 21, 22],
                [0, 2, 3, 5, 7, 8, 10, 12, 14, 15, 17, 19, 20, 22],
                [0, 2, 3, 5, 7, 8, 10, 12, 13, 15, 17, 19, 20, 22],
                [0, 2, 4, 5, 7, 9, 10, 12, 14, 16, 17, 19, 21, 22]
            ]
        },
        "Position 1": {
            patternLowestFret: 8,
            relativeFrets: [
                [0, 1, 3],
                [0, 1, 3],
                [0, 2],
                [0, 2, 3],
                [0, 2],
                [1, 3]
            ]
        },
        "Position 2": {
            patternLowestFret: 3,
            relativeFrets: [
                [1, 3, 4],
                [1, 3],
                [0, 2, 4],
                [0, 2],
                [1, 3, 5],
                [1, 3, 4]
            ]
        },
        "Position 3": {
            patternLowestFret: 10,
            relativeFrets: [
                [0, 2, 3],
                [0, 1, 3],
                [0, 2],
                [0, 2, 3],
                [2, 3],
                [0, 2]
            ]
        },
        "Position 4": {
            patternLowestFret: 8,
            relativeFrets: [
                [1, 3],
                [0, 2, 3],
                [0, 2, 4],
                [0, 2],
                [0, 1, 3],
                [0, 2, 4]
            ]
        },
        "Position 5": {
            patternLowestFret: 5,
            relativeFrets: [
                [2, 3, 5],
                [1, 3, 5],
                [0, 2, 4],
                [0, 2, 4],
                [2, 4],
                [2, 3, 5]
            ]
        }
    },
    tunings: {
        "Standard (EADGBe)": [40, 45, 50, 55, 59, 64],
        "Half Step Down (Eb Standard)": [39, 44, 49, 54, 58, 63],
        "Full Step Down (D Standard)": [38, 43, 48, 53, 57, 62]
    }
};

export const intervalNames = musicalData.intervalos;
