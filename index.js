// Game state and UI tracking
let [message, cards, dealerCards] = ["", [], []];
let [sum, dealerSum, playerWins, dealerWins] = [0, 0, 0, 0];
let [hasBlackJack, isAlive] = [false, false];
let [cardsEl, sumEl, messageEl, dealerEl, dealerSumEl] = [];

// Utility functions
const getCardDisplay = card => {
    const displayMap = {1: 'A', 11: 'J', 12: 'Q', 13: 'K'};
    return displayMap[card] || card;
};

const getAceValue = currentSum => currentSum + 11 <= 21 ? 11 : 1;

const calculateSum = cardsArray => {
    let sum = 0, aces = 0;
    
    // Sum non-Ace cards first
    cardsArray.forEach(card => {
        if (card === 1) aces++;
        else sum += card >= 10 ? 10 : card;
    });

    // Add Aces with optimal values
    for (let i = 0; i < aces; i++) {
        sum += getAceValue(sum);
    }

    return sum;
};

const updateWinTally = winner => {
    const playerWinsEl = document.getElementById("player-wins");
    const dealerWinsEl = document.getElementById("dealer-wins");

    if (winner === 'player') {
        playerWins++;
        playerWinsEl.textContent = playerWins;
    } else if (winner === 'dealer') {
        dealerWins++;
        dealerWinsEl.textContent = dealerWins;
    }
};

const updateUIElements = () => {
    [cardsEl, sumEl, messageEl, dealerEl, dealerSumEl] = [
        document.getElementById("cards-el"),
        document.getElementById("sum-el"),
        document.getElementById("message-el"),
        document.getElementById("dealer-el"),
        document.getElementById("dealer-sum-el")
    ];
};

function startGame() {
    // Reset game state
    [cards, dealerCards] = [[], []];
    [hasBlackJack, isAlive] = [false, true];
    updateUIElements();

    // Initial card draw
    cards.push(...[0, 1].map(() => Math.floor(Math.random() * 13) + 1));
    dealerCards.push(Math.floor(Math.random() * 13) + 1);

    // Update UI with initial cards
    cardsEl.textContent = `Cards: ${cards.map(getCardDisplay).join(' ')}`;
    dealerEl.textContent = `Dealer's cards: ${getCardDisplay(dealerCards[0])}`;

    // Calculate and display sums
    [sum, dealerSum] = [calculateSum(cards), calculateSum(dealerCards)];
    sumEl.textContent = `Sum: ${sum}`;
    dealerSumEl.textContent = `Dealer's Sum: ${dealerSum}`;

    // Check initial game conditions
    message = sum === 21 ? "You've got Blackjack!" : "Hit or Stand";
    if (sum === 21) {
        hasBlackJack = true;
        updateWinTally('player');
    }
    messageEl.textContent = message;
}

function hit() {
    if (!isAlive || hasBlackJack) return;

    const newCard = Math.floor(Math.random() * 13) + 1;
    cards.push(newCard);
    cardsEl.textContent += ` ${getCardDisplay(newCard)}`;
    
    sum = calculateSum(cards);
    sumEl.textContent = `Sum: ${sum}`;

    message = sum <= 21 ? "Hit or Stand" : "You Busted!";
    if (sum > 21) {
        updateWinTally('dealer');
        isAlive = false;
    }
    messageEl.textContent = message;
}

function stand() {
    if (!isAlive || hasBlackJack) return;

    // Dealer's turn
    while (dealerSum < 17) {
        const newCard = Math.floor(Math.random() * 13) + 1;
        dealerCards.push(newCard);
        dealerEl.textContent += ` ${getCardDisplay(newCard)}`;
        dealerSum = calculateSum(dealerCards);
    }
    dealerSumEl.textContent = `Dealer's Sum: ${dealerSum}`;

    // Determine winner
    message = dealerSum > 21 ? "Dealer Busts, You Win!!" :
              dealerSum > sum ? "Dealer Win!!" :
              dealerSum < sum ? "You Win!!" : "Push!";
    
    if (message.includes("You Win")) updateWinTally('player');
    if (message.includes("Dealer Win")) updateWinTally('dealer');
    
    messageEl.textContent = message;
}

function resetGame() {
    [cards, dealerCards] = [[], []];
    [sum, dealerSum, hasBlackJack, isAlive] = [0, 0, false, false];
    message = "";

    cardsEl.textContent = "Cards:";
    sumEl.textContent = "Player Sum:";
    dealerEl.textContent = "Dealer's cards:";
    dealerSumEl.textContent = "Dealer's Sum:";
    messageEl.textContent = "Want to start the game?";
}

function resetScore() {
    [playerWins, dealerWins] = [0, 0];
    document.getElementById("player-wins").textContent = playerWins;
    document.getElementById("dealer-wins").textContent = dealerWins;
}
