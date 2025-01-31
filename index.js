// Game state and UI tracking
let [message, cards, dealerCards] = ["", [], []];
let [sum, dealerSum] = [0, 0];
let [hasBlackJack, isAlive] = [false, false];
let [cardsEl, sumEl, messageEl, dealerEl, dealerSumEl] = [];

// Money management
let playerMoney = parseInt(localStorage.getItem('playerMoney') || '100');  // Starting balance
let currentBet = 10;    // Default bet amount
let minBet = 10;        // Minimum bet
let maxBet = 100;       // Maximum bet based on starting balance

const updateBetDisplay = () => {
    const betSlider = document.getElementById("bet-slider");
    const betAmountEl = document.getElementById("bet-amount-el");
    currentBet = parseInt(betSlider.value);
    betAmountEl.textContent = `Bet: $${currentBet}`;
};

const updateMoneyDisplay = () => {
    const moneyEl = document.getElementById("money-el");
    moneyEl.textContent = `Balance: $${playerMoney}`;
    localStorage.setItem('playerMoney', playerMoney.toString());
};

const addMoney = (amount) => {
    playerMoney += amount;
    updateMoneyDisplay();
    
    // Update max bet if player's balance increases
    maxBet = Math.min(playerMoney, 500);
    const betSlider = document.getElementById("bet-slider");
    if (betSlider) {
        betSlider.max = maxBet;
    }
};

const placeBet = (amount) => {
    if (amount > playerMoney) {
        messageEl.textContent = "Not enough money to place that bet!";
        return false;
    }
    playerMoney -= amount;
    updateMoneyDisplay();
    return true;
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

// Utility functions
const getCardDisplay = card => {
    const displayMap = {1: 'A', 11: 'J', 12: 'Q', 13: 'K'};
    return displayMap[card] || card;
};

const getCardValue = card => {
    if (card === 1) return 11;  // Ace initially counts as 11
    return card >= 10 ? 10 : card;
};

const calculateSum = cardsArray => {
    let sum = 0;
    let aces = 0;
    
    // First pass: count aces and sum other cards
    cardsArray.forEach(card => {
        if (card === 1) {
            aces++;
        } else {
            sum += getCardValue(card);
        }
    });

    // Second pass: add aces
    for (let i = 0; i < aces; i++) {
        if (sum + 11 <= 21) {
            sum += 11;
        } else {
            sum += 1;
        }
    }

    return sum;
};

function startGame() {
    // Require a minimum bet to start the game
    if (!placeBet(currentBet)) return;

    // Reset game state
    [cards, dealerCards] = [[], []];
    [hasBlackJack, isAlive] = [false, true];
    updateUIElements();
    updateMoneyDisplay();

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
        playerMoney += Math.floor(currentBet * 2.5);  // Blackjack pays 3:2 (2.5x)
        updateMoneyDisplay();
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
        isAlive = false;
        
        // Check if player is out of money
        if (playerMoney <= 0) {
            window.location.href = 'gameover.html';
        }
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

    // Determine winner and money payout
    message = dealerSum > 21 ? "Dealer Busts, You Win!!" :
              dealerSum > sum ? "Dealer Win!!" :
              dealerSum < sum ? "You Win!!" : "Push!!";
    
    if (message.includes("You Win")) {
        playerMoney += currentBet * 2;  // Win pays 2x
    } else if (message === "Push!!") {
        playerMoney += currentBet;  // Return original bet on push
    } else {
        // Check if player is out of money
        if (playerMoney <= 0) {
            window.location.href = 'gameover.html';
        }
    }
    
    updateMoneyDisplay();
    messageEl.textContent = message;
}

function resetGame() {
    // Check if player has money to continue
    if (playerMoney <= 0) {
        window.location.href = 'gameover.html';
        return;
    }

    [cards, dealerCards] = [[], []];
    [sum, dealerSum, hasBlackJack, isAlive] = [0, 0, false, false];
    currentBet = 10;
    message = "";

    cardsEl.textContent = "Cards:";
    sumEl.textContent = "Player Sum:";
    dealerEl.textContent = "Dealer's cards:";
    dealerSumEl.textContent = "Dealer's Sum:";
    messageEl.textContent = "Want to start the game?";
}

// Initialize money and bet display on page load
window.onload = () => {
    updateMoneyDisplay();
    updateBetDisplay();
};
