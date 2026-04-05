let players = [];
let scores = {};
let currentPlayerIndex = 0;

let steps = 0;
let goal = 10;

let isRed = false;
let gameOver = false;
let waitingChoice = false;
let canPress = true;

function startGame() {
    let num = parseInt(document.getElementById("numPlayers").value);

    if (num < 1) return;

    players = [];
    scores = {};

    for (let i = 1; i <= num; i++) {
        let name = "Jugador " + i;
        players.push(name);
        scores[name] = 0;
    }

    document.getElementById("menu").style.display = "none";
    document.getElementById("game").style.display = "block";

    currentPlayerIndex = 0;

    startTurn();
}

function getCurrentPlayer() {
    return players[currentPlayerIndex];
}

function startTurn() {
    steps = 0;
    gameOver = false;

    document.body.style.background = "lightblue";
    document.getElementById("status").innerText = `${getCurrentPlayer()} prepárate...`;
    document.getElementById("steps").innerText = "Pasos: 0";

    setTimeout(greenLight, 1500);
}

function greenLight() {
    if (gameOver) return;

    isRed = false;
    canPress = true;

    document.body.style.background = "lightgreen";
    document.getElementById("status").innerText = "🟢 GREEN LIGHT";

    let tiempo = Math.random() * 2000 + 2000;
    setTimeout(redLight, tiempo);
}

function redLight() {
    if (gameOver) return;

    canPress = false;

    document.body.style.background = "tomato";
    document.getElementById("status").innerText = "🔴 RED LIGHT";

    setTimeout(() => {
        isRed = true;
        canPress = true;
        setTimeout(greenLight, 2000);
    }, 300);
}

function endTurn() {
    scores[getCurrentPlayer()] = steps;
    currentPlayerIndex++;

    if (currentPlayerIndex < players.length) {
        setTimeout(startTurn, 2000);
    } else {
        setTimeout(showWinner, 2000);
    }
}

function showWinner() {
    let winner = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);

    let text = "Resultados:\n";
    for (let p in scores) {
        text += `${p}: ${scores[p]}\n`;
    }

    text += `\n🏆 Ganador: ${winner}`;
    text += "\n\nPresiona R para jugar de nuevo";
    text += "\nPresiona Q para salir";

    document.getElementById("status").innerText = text;
    document.body.style.background = "lightblue";

    waitingChoice = true;
}

function resetGame() {
    scores = {};
    players.forEach(p => scores[p] = 0);

    currentPlayerIndex = 0;
    waitingChoice = false;

    startTurn();
}

document.addEventListener("keydown", function(e) {

    if (waitingChoice) {
        if (e.key.toLowerCase() === "r") resetGame();
        if (e.key.toLowerCase() === "q") location.reload();
        return;
    }

    if (gameOver || !canPress) return;

    if (e.key === "ArrowUp") {
        if (isRed) {
            document.getElementById("status").innerText = "💀 PERDISTE";
            gameOver = true;
            endTurn();
        } else {
            steps++;
            document.getElementById("steps").innerText = `Pasos: ${steps}`;

            if (steps >= goal) {
                document.getElementById("status").innerText = `🏆 ${getCurrentPlayer()} terminó!`;
                gameOver = true;
                endTurn();
            }
        }
    }
});