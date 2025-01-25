let message = "";
let firstCard, secondCard, sum, hasBlackJack, isAlive;
let cardsEl, sumEl, messageEl, dealerEl, dealerSum,dealerSumEl;
let playerWins = 0;
let dealerWins = 0;

function getCardDisplay(card) {
    switch(card) {
        case 11:
            return "J";
        case 12:
            return "Q";
        case 13:
            return "K";
        default:
            return card;
    }
}

function startGame() {
    firstCard = Math.floor(Math.random() * 13) + 1;
    secondCard = Math.floor(Math.random() * 13) + 1;
    let dealerCard = Math.floor(Math.random() * 13) + 1;
    hasBlackJack = false;
    isAlive = true;
    
    // Get DOM elements
    cardsEl = document.getElementById("cards-el");
    sumEl = document.getElementById("sum-el");
    messageEl = document.getElementById("message-el");
    dealerEl = document.getElementById("dealer-el");
    dealerSumEl = document.getElementById("dealer-sum-el");

    // Display cards with face card symbols
    cardsEl.textContent = "Cards: " + getCardDisplay(firstCard) + " " + getCardDisplay(secondCard) + " ";
    dealerEl.textContent = "Dealer's cards: " + getCardDisplay(dealerCard);

    // Calculate sum using 10 for face cards
    if (firstCard >= 10){
        firstCard = 10;
    }
    if (secondCard >= 10){
        secondCard = 10;
    }
    if (dealerCard >= 10){
        dealerCard = 10;
    }
    dealerSum = dealerCard;
    sum = firstCard + secondCard;
    sumEl.textContent = "Sum: " + sum;
    dealerSumEl.textContent = "Dealer's Sum: " + dealerSum;

    if (sum <= 20) {
        message = "Hit or Stand";
    } else if (sum === 21) {
        message = "You've got Blackjack!";
        hasBlackJack = true;
    }
        
    messageEl.textContent = message;
}

function stand() {
    dealerEl = document.getElementById("dealer-el");
    dealerSumEl = document.getElementById("dealer-sum-el");

    if (!isAlive || hasBlackJack)
        return;
    while (dealerSum < 17) {
        let newCard = Math.floor(Math.random() * 13) + 1;
        dealerEl.textContent += " " + getCardDisplay(newCard);
        
        if (newCard >= 10){
            newCard = 10;
        }
        dealerSum += newCard;
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

function hit(){
    if (!isAlive || hasBlackJack) 
        return;

    let newCard = Math.floor(Math.random() * 13) + 1;
    cardsEl.textContent += " " + getCardDisplay(newCard);
    
    if (newCard >= 10){
        newCard = 10;
    }
    
    sum += newCard;
    sumEl.textContent = "Sum: " + sum;

    if (sum <= 21) {
        message = "Hit or Stand";
    } else {
        message = "You Busted!";
        updateWinTally('dealer');
        isAlive = false;
    }
    messageEl.textContent = message;
}

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
    // Reset game state
    firstCard = null;
    secondCard = null;
    sum = 0;
    hasBlackJack = false;
    isAlive = false;
    message = "";

    // Reset UI elements
    cardsEl.textContent = "Cards:";
    sumEl.textContent = "Player Sum:";
    dealerEl.textContent = "Dealer's cards:";
    dealerSumEl.textContent = "Dealer's Sum:";
    messageEl.textContent = "Want to start the game?";
}

function resetScore(){
    playerWins = 0;
    dealerWins = 0;
    playerWinsEl.textContent = playerWins;
    dealerWinsEl.textContent = dealerWins;
}
