let deck = [];
let currentNumber = 0;
let score = 0;
let isGameOver = false;
let usedCounts = {};

function getUrl(num) {
    let code = num;
    if (num === 1) code = "A";
    else if (num === 10) code = "0";
    else if (num === 11) code = "J";
    else if (num === 12) code = "Q";
    else if (num === 13) code = "K";
    return `https://deckofcardsapi.com/static/img/${code}S.png`;
}

function createAllCardsUI() {
    const container = document.getElementById("allCardsDisplay");
    let html = "";
    for (let i = 1; i <= 13; i++) {
        for (let j = 0; j < 4; j++) {
            html += `<img src="${getUrl(i)}" class="mini-card" id="card-${i}-${j}">`;
        }
    }
    container.innerHTML = html;
}

function markAsUsed(num) {
    let count = usedCounts[num];
    let targetId = `card-${num}-${count}`;
    let el = document.getElementById(targetId);
    if (el) el.classList.add("used");
    usedCounts[num]++;
}

function resetGame() {
    score = 0;
    isGameOver = false;
    deck = [];
    usedCounts = {};
    for (let i = 1; i <= 13; i++) {
        usedCounts[i] = 0;
        for (let j = 0; j < 4; j++) deck.push(i);
    }

    createAllCardsUI();

    let index = Math.floor(Math.random() * deck.length);
    currentNumber = deck.splice(index, 1)[0];
    markAsUsed(currentNumber);

    document.getElementById("btnHigh").disabled = false;
    document.getElementById("btnLow").disabled = false;
    document.getElementById("retryArea").innerHTML = "";
    document.getElementById("nextCardImg").src = "https://deckofcardsapi.com/static/img/back.png";
    updateUI("", "black");
}

function guess(playerChoice) {
    if (isGameOver || deck.length === 0) return;

    let index = Math.floor(Math.random() * deck.length);
    let nextNumber = deck.splice(index, 1)[0];

    document.getElementById("nextCardImg").src = getUrl(nextNumber);
    markAsUsed(nextNumber);

    let isWin = (playerChoice === "high") ? (nextNumber >= currentNumber) : (nextNumber <= currentNumber);

    if (isWin) {
        score++;
        updateUI("当たり！", "red");
        setTimeout(() => {
            if (isGameOver) return;
            currentNumber = nextNumber;
            document.getElementById("currentCardImg").src = getUrl(currentNumber);
            document.getElementById("nextCardImg").src = "https://deckofcardsapi.com/static/img/back.png";
            document.getElementById("msg").innerText = "";
            document.getElementById("remaining").innerText = deck.length;
        }, 1000);
    } else {
        isGameOver = true;
        document.getElementById("btnHigh").disabled = true;
        document.getElementById("btnLow").disabled = true;
        updateUI("ハズレ！", "blue");
        document.getElementById("retryArea").innerHTML = '<button class="btn-retry" onclick="resetGame()">もう一度遊ぶ</button>';
    }
}

function updateUI(message, color) {
    document.getElementById("score").innerText = score;
    document.getElementById("remaining").innerText = deck.length;
    document.getElementById("msg").innerText = message;
    document.getElementById("msg").style.color = color;
    document.getElementById("currentCardImg").src = getUrl(currentNumber);
}

window.onload = resetGame;