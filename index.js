// Global variables to track game state and UI elements
let message = "";
let cards = [], dealerCards = [];
let sum = 0, dealerSum = 0, hasBlackJack = false, isAlive = false;
let cardsEl, sumEl, messageEl, dealerEl, dealerSumEl;
let playerWins = 0, dealerWins = 0;
let cardCounter = 2, dealerCounter = 2;

// Convert card number to display symbol (J, Q, K, A)
function getCardDisplay(card) {
    switch(card) {
        case 11: return "J";
        case 12: return "Q";
        case 13: return "K";
        case 1: return "A";
        default: return card;
    }
}

// Calculate optimal value for an Ace based on current sum
function getAceValue(currentSum) {
    return (currentSum + 11 <= 21) ? 11 : 1;
}

// Calculate total sum of cards, handling Aces dynamically
function calculateSum(cardsArray) {
    let sum = 0;
    let aces = 0;

    // First sum non-Ace cards
    for (let card of cardsArray) {
        if (card === 1) {
            aces++;
        } else if (card >= 10) {
            sum += 10;
        } else {
            sum += card;
        }
    }

    // Add Aces with optimal values
    for (let i = 0; i < aces; i++) {
        sum += getAceValue(sum);
    }

    return sum;
}

// Initialize the game, deal initial cards
function startGame() {
    // Reset game arrays and counters
    cards = [];
    dealerCards = [];
    cardCounter = 2;
    dealerCounter = 2;

    // Generate random initial cards for player and dealer
    cards[0] = Math.floor(Math.random() * 13) + 1;
    cards[1] = Math.floor(Math.random() * 13) + 1;
    dealerCards[0] = Math.floor(Math.random() * 13) + 1;

    // Reset game state
    hasBlackJack = false;
    isAlive = true;
    
    // Get references to UI elements
    cardsEl = document.getElementById("cards-el");
    sumEl = document.getElementById("sum-el");
    messageEl = document.getElementById("message-el");
    dealerEl = document.getElementById("dealer-el");
    dealerSumEl = document.getElementById("dealer-sum-el");


    cardsEl.textContent = "Cards: " + getCardDisplay(cards[0]) + " " + getCardDisplay(cards[1]) + " ";
    dealerEl.textContent = "Dealer's cards: " + getCardDisplay(dealerCards[0]) + " ";
    sum = calculateSum(cards);
    dealerSum = calculateSum(dealerCards);
    
    sumEl.textContent = "Sum: " + sum;
    dealerSumEl.textContent = "Dealer's Sum: " + dealerSum;

    if (sum <= 20) {
        message = "Hit or Stand";
    } else if (sum === 21) {
        message = "You've got Blackjack!";
        hasBlackJack = true;
        updateWinTally('player');
    }
        
    messageEl.textContent = message;
}

// Dealer's turn to draw cards
function stand() {
    dealerEl = document.getElementById("dealer-el");
    dealerSumEl = document.getElementById("dealer-sum-el");

    if (!isAlive || hasBlackJack)
        return;

    // Dealer draws cards until sum is 17 or higher
    while (dealerSum < 17) {
        let newCard = Math.floor(Math.random() * 13) + 1;
        dealerCards.push(newCard);
        dealerEl.textContent += " " + getCardDisplay(newCard);
        
        dealerSum = calculateSum(dealerCards);
        dealerCounter++;
    } 

    dealerSumEl.textContent = "Dealer's Sum: " + dealerSum;
    
    if (dealerSum > 21){
        message = "Dealer Busts, You Win!!";
        updateWinTally('player');
    }
    else if (dealerSum > sum){
        message = "Dealer Win!!";
        updateWinTally('dealer');
    } else if (dealerSum < sum){
        message = "You Win!!";
        updateWinTally('player');
    } else {
        message = "Push!";
    }
    messageEl.textContent = message;
}

// Player draws an additional card
function hit(){
    // Only draw if game is active
    if (!isAlive || hasBlackJack) 
        return;

    // Draw a new random card
    let newCard = Math.floor(Math.random() * 13) + 1;
    cards.push(newCard);
    cardsEl.textContent += " " + getCardDisplay(newCard);
    
    // Calculate new sum with dynamic Ace handling
    sum = calculateSum(cards);
    sumEl.textContent = "Sum: " + sum;

    // Check if player busts
    if (sum <= 21) {
        message = "Hit or Stand";
    } else {
        message = "You Busted!";
        updateWinTally('dealer');
        isAlive = false;
    }
    messageEl.textContent = message;
    cardCounter++;
}

// Update win tally for player or dealer
function updateWinTally(winner) {
    let playerWinsEl = document.getElementById("player-wins");
    let dealerWinsEl = document.getElementById("dealer-wins");

    if (winner === 'player') {
        playerWins++;
        playerWinsEl.textContent = playerWins;
    } else if (winner === 'dealer') {
        dealerWins++;
        dealerWinsEl.textContent = dealerWins;
    }
}

function resetGame() {
    cards = [];
    dealerCards = [];
    sum = 0;
    dealerSum = 0;
    hasBlackJack = false;
    isAlive = false;
    message = "";

    cardsEl.textContent = "Cards:";
    sumEl.textContent = "Player Sum:";
    dealerEl.textContent = "Dealer's cards:";
    dealerSumEl.textContent = "Dealer's Sum:";
    messageEl.textContent = "Want to start the game?";
}

function resetScore(){
    playerWins = 0;
    dealerWins = 0;
    let playerWinsEl = document.getElementById("player-wins");
    let dealerWinsEl = document.getElementById("dealer-wins");
    playerWinsEl.textContent = playerWins;
    dealerWinsEl.textContent = dealerWins;
}
