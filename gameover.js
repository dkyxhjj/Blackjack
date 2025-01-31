document.addEventListener('DOMContentLoaded', () => {
    const addMoneyBtn = document.getElementById('add-money-btn');
    const mainMenuBtn = document.getElementById('main-menu-btn');

    addMoneyBtn.addEventListener('click', () => {
        // Retrieve and update money from localStorage
        let playerMoney = parseInt(localStorage.getItem('playerMoney') || '0');
        playerMoney += 100;
        localStorage.setItem('playerMoney', playerMoney.toString());
        
        // Redirect back to the game
        window.location.href = 'blackjack.html';
    });

    mainMenuBtn.addEventListener('click', () => {
        // Clear any stored game state
        localStorage.removeItem('playerMoney');
        window.location.href = 'index.html';
    });
});
