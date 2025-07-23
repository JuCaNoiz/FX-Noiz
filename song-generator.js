// Este módulo maneja la lógica del generador de ideas para rolas.

export function drawStrummingPattern(containerId, complexity) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "80");
    svg.setAttribute("viewBox", "0 0 400 80");
    svg.setAttribute("class", "strum-pattern-svg");

    const strumPatterns = {
        "facil": [
            [{ type: "down", beat: "1" }, { type: "down", beat: "2" }, { type: "down", beat: "3" }, { type: "down", beat: "4" }],
            [{ type: "down", beat: "1" }, { type: "rest", beat: "X" }, { type: "down", beat: "2" }, { type: "rest", beat: "X" }, { type: "down", beat: "3" }, { type: "rest", beat: "X" }, { type: "down", beat: "4" }, { type: "rest", beat: "X" }]
        ],
        "intermedio": [
            [{ type: "down", beat: "1" }, { type: "up", beat: "&" }, { type: "down", beat: "2" }, { type: "up", beat: "&" }, { type: "down", beat: "3" }, { type: "up", beat: "&" }, { type: "down", beat: "4" }, { type: "up", beat: "&" }],
            [{ type: "down", beat: "1" }, { type: "rest", beat: "X" }, { type: "down", beat: "2" }, { type: "up", beat: "&" }, { type: "down", beat: "3" }, { type: "rest", beat: "X" }, { type: "up", beat: "&" }, { type: "down", beat: "4" }]
        ],
        "avanzado": [
            [{ type: "down", beat: "1" }, { type: "up", beat: "e" }, { type: "down", beat: "&" }, { type: "up", beat: "a" }, { type: "down", beat: "2" }, { type: "up", beat: "e" }, { type: "down", beat: "&" }, { type: "up", beat: "a" }],
            [{ type: "down", beat: "1" }, { type: "down", beat: " " }, { type: "up", beat: "&" }, { type: "down", beat: "2" }, { type: "down", beat: " " }, { type: "up", beat: "&" }, { type: "down", beat: "3" }, { type: "down", beat: " " }, { type: "up", beat: "&" }, { type: "down", beat: "4" }]
        ]
    };

    const selectedPattern = strumPatterns[complexity][Math.floor(Math.random() * strumPatterns[complexity].length)];
    const startX = 30;
    const spacing = 45;
    const arrowY = 30;
    const beatTextY = 60;

    selectedPattern.forEach((strum, index) => {
        const x = startX + (index * spacing);
        if (strum.type === "down") {
            const pathD = `M ${x} ${arrowY - 15} L ${x - 8} ${arrowY} L ${x + 8} ${arrowY} Z M ${x} ${arrowY} V ${arrowY + 20}`;
            const arrowPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
            arrowPath.setAttribute("d", pathD);
            arrowPath.setAttribute("class", "strum-arrow");
            svg.appendChild(arrowPath);
        } else if (strum.type === "up") {
            const pathD = `M ${x} ${arrowY + 20 + 15} L ${x - 8} ${arrowY + 20} L ${x + 8} ${arrowY + 20} Z M ${x} ${arrowY} V ${arrowY + 20}`;
            const arrowPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
            arrowPath.setAttribute("d", pathD);
            arrowPath.setAttribute("class", "strum-arrow");
            svg.appendChild(arrowPath);
        } else if (strum.type === "rest") {
            const restSymbol = document.createElementNS("http://www.w3.org/2000/svg", "text");
            restSymbol.setAttribute("x", x);
            restSymbol.setAttribute("y", arrowY + 10);
            restSymbol.setAttribute("text-anchor", "middle");
            restSymbol.setAttribute("class", "strum-rest-symbol");
            restSymbol.textContent = strum.beat;
            svg.appendChild(restSymbol);
        }

        const beatText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        beatText.setAttribute("x", x);
        beatText.setAttribute("y", beatTextY);
        beatText.setAttribute("text-anchor", "middle");
        beatText.setAttribute("class", "strum-beat-text");
        beatText.textContent = strum.beat;
        svg.appendChild(beatText);
    });

    container.appendChild(svg);
}

export function exportToMidi() {
    // ... logic to export MIDI
}
