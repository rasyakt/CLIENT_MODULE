/**
 * Hexaria - Multiplayer Math Puzzle Game
 * LKS Jabar 2023 Web Technologies
 */

// ===========================
// Game State Variables
// ===========================
let gameState = {
    board: [], // 10x8 grid of hexagons
    currentPlayer: 'red', // 'red' or 'blue'
    currentNumber: 0,
    player1Name: '',
    player2Name: '',
    isBot: false,
    level: null, // 'easy', 'medium', 'hard'
    disabledCount: 0,
    scores: { red: 0, blue: 0 },
    gameOver: false,
    moveCount: 0
};

// ===========================
// DOM Elements
// ===========================
const welcomeScreen = document.getElementById('welcomeScreen');
const gameScreen = document.getElementById('gameScreen');
const hexBoard = document.getElementById('hexBoard');
const playGameBtn = document.getElementById('playGameBtn');
const newGameBtn = document.getElementById('newGameBtn');
const player1NameInput = document.getElementById('player1Name');
const player2NameInput = document.getElementById('player2Name');
const player2NameGroup = document.getElementById('player2NameGroup');
const opponentRadios = document.querySelectorAll('input[name="opponent"]');
const levelButtons = document.querySelectorAll('.level-btn');
const currentHexagon = document.getElementById('currentHexagon');
const currentHexValue = document.getElementById('currentHexValue');
const player1NameDisplay = document.getElementById('player1NameDisplay');
const player2NameDisplay = document.getElementById('player2NameDisplay');
const player1ScoreDisplay = document.getElementById('player1Score');
const player2ScoreDisplay = document.getElementById('player2Score');
const gameOverModal = document.getElementById('gameOverModal');
const winnerInfo = document.getElementById('winnerInfo');
const restartBtn = document.getElementById('restartBtn');
const leaderboardList = document.getElementById('leaderboardList');
const sortSelect = document.getElementById('sortSelect');
const detailsModal = document.getElementById('detailsModal');
const closeDetailsBtn = document.getElementById('closeDetailsBtn');
const gameDetailsContent = document.getElementById('gameDetailsContent');
const placeSound = document.getElementById('placeSound');

// ===========================
// Initialization
// ===========================
document.addEventListener('DOMContentLoaded', () => {
    initializeWelcomeScreen();
    loadLeaderboard();
});

/**
 * Initialize welcome screen event listeners
 */
function initializeWelcomeScreen() {
    // Opponent selection
    opponentRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'bot') {
                player2NameGroup.style.display = 'none';
                player2NameInput.value = 'Bot';
            } else {
                player2NameGroup.style.display = 'block';
                player2NameInput.value = '';
            }
            validateForm();
        });
    });

    // Level selection
    levelButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            levelButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            gameState.level = btn.dataset.level;
            validateForm();
        });
    });

    // Name inputs
    player1NameInput.addEventListener('input', validateForm);
    player2NameInput.addEventListener('input', validateForm);

    // Play game button
    playGameBtn.addEventListener('click', startGame);

    // New game button
    newGameBtn.addEventListener('click', () => {
        welcomeScreen.classList.remove('hidden');
        gameScreen.classList.add('hidden');
        resetForm();
    });

    // Restart button
    restartBtn.addEventListener('click', () => {
        gameOverModal.classList.add('hidden');
        initializeGame();
    });

    // Sort leaderboard
    sortSelect.addEventListener('change', loadLeaderboard);

    // Close details modal
    closeDetailsBtn.addEventListener('click', () => {
        detailsModal.classList.add('hidden');
    });
}

/**
 * Validate form inputs and enable/disable play button
 */
function validateForm() {
    const opponent = document.querySelector('input[name="opponent"]:checked').value;
    const player1Valid = player1NameInput.value.trim() !== '';
    const player2Valid = opponent === 'bot' || player2NameInput.value.trim() !== '';
    const levelValid = gameState.level !== null;

    playGameBtn.disabled = !(player1Valid && player2Valid && levelValid);
}

/**
 * Reset form to initial state
 */
function resetForm() {
    player1NameInput.value = '';
    player2NameInput.value = '';
    document.querySelector('input[name="opponent"][value="player2"]').checked = true;
    player2NameGroup.style.display = 'block';
    levelButtons.forEach(btn => btn.classList.remove('active'));
    gameState.level = null;
    validateForm();
}

/**
 * Start the game
 */
function startGame() {
    const opponent = document.querySelector('input[name="opponent"]:checked').value;
    gameState.player1Name = player1NameInput.value.trim();
    gameState.player2Name = opponent === 'bot' ? 'Bot' : player2NameInput.value.trim();
    gameState.isBot = opponent === 'bot';

    // Set disabled hexagon count based on level
    switch (gameState.level) {
        case 'easy':
            gameState.disabledCount = 4;
            break;
        case 'medium':
            gameState.disabledCount = 6;
            break;
        case 'hard':
            gameState.disabledCount = 8;
            break;
    }

    welcomeScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');

    initializeGame();
}

/**
 * Initialize game board and state
 */
function initializeGame() {
    // Reset game state
    gameState.board = [];
    gameState.currentPlayer = 'red';
    gameState.scores = { red: 0, blue: 0 };
    gameState.gameOver = false;
    gameState.moveCount = 0;

    // Update player names
    player1NameDisplay.textContent = gameState.player1Name;
    player2NameDisplay.textContent = gameState.player2Name;

    // Create board
    createBoard();

    // Generate first hexagon
    generateNewHexagon();

    // Update scores
    updateScores();
}

/**
 * Create the hexagon board (10x8 grid)
 */
function createBoard() {
    hexBoard.innerHTML = '';
    gameState.board = [];

    // Generate random disabled positions
    const disabledPositions = generateDisabledPositions();

    for (let row = 0; row < 8; row++) {
        const hexRow = document.createElement('div');
        hexRow.className = 'hex-row';

        const rowData = [];

        for (let col = 0; col < 10; col++) {
            const hexagon = document.createElement('div');
            hexagon.className = 'hexagon';
            hexagon.dataset.row = row;
            hexagon.dataset.col = col;

            const hexContent = document.createElement('div');
            hexContent.className = 'hexagon-content';
            hexagon.appendChild(hexContent);

            const isDisabled = disabledPositions.some(pos => pos.row === row && pos.col === col);

            const cellData = {
                row,
                col,
                value: 0,
                color: null,
                disabled: isDisabled,
                element: hexagon
            };

            if (isDisabled) {
                hexagon.classList.add('disabled');
            } else {
                hexagon.addEventListener('click', () => handleHexagonClick(row, col));
                hexagon.addEventListener('mouseenter', () => handleHexagonHover(row, col));
                hexagon.addEventListener('mouseleave', () => clearHoverPreview());
            }

            rowData.push(cellData);
            hexRow.appendChild(hexagon);
        }

        gameState.board.push(rowData);
        hexBoard.appendChild(hexRow);
    }
}

/**
 * Generate random positions for disabled hexagons
 */
function generateDisabledPositions() {
    const positions = [];
    const totalCells = 80;

    while (positions.length < gameState.disabledCount) {
        const row = Math.floor(Math.random() * 8);
        const col = Math.floor(Math.random() * 10);

        // Check if position already exists
        if (!positions.some(pos => pos.row === row && pos.col === col)) {
            positions.push({ row, col });
        }
    }

    return positions;
}

/**
 * Generate a new random hexagon number (1-20)
 */
function generateNewHexagon() {
    gameState.currentNumber = Math.floor(Math.random() * 20) + 1;
    currentHexValue.textContent = gameState.currentNumber;

    // Update current hexagon color
    if (gameState.currentPlayer === 'red') {
        currentHexagon.style.background = '#ef4444';
    } else {
        currentHexagon.style.background = '#3b82f6';
    }
}

/**
 * Handle hexagon click
 */
function handleHexagonClick(row, col) {
    if (gameState.gameOver) return;

    const cell = gameState.board[row][col];

    // Check if cell is valid for placement
    if (cell.disabled || cell.color !== null) return;

    // Place hexagon
    placeHexagon(row, col);
}

/**
 * Place hexagon at specified position
 */
function placeHexagon(row, col) {
    const cell = gameState.board[row][col];

    // Set cell data
    cell.value = gameState.currentNumber;
    cell.color = gameState.currentPlayer;

    // Update visual
    updateHexagonVisual(cell);

    // Play sound effect
    playPlaceSound();

    // Process adjacent hexagons
    processAdjacentHexagons(row, col);

    // Update scores
    updateScores();

    // Check for game over
    if (checkGameOver()) {
        endGame();
        return;
    }

    // Switch player
    switchPlayer();

    // Generate new hexagon
    generateNewHexagon();

    // If bot's turn, make bot move
    if (gameState.isBot && gameState.currentPlayer === 'blue') {
        setTimeout(() => makeBotMove(), 500);
    }
}

/**
 * Update hexagon visual appearance
 */
function updateHexagonVisual(cell) {
    cell.element.classList.add('filled', cell.color);
    cell.element.querySelector('.hexagon-content').textContent = cell.value;
}

/**
 * Process adjacent hexagons for takeover and boost
 */
function processAdjacentHexagons(row, col) {
    const cell = gameState.board[row][col];
    const adjacent = getAdjacentCells(row, col);

    adjacent.forEach(adjCell => {
        if (adjCell.color === null || adjCell.disabled) return;

        if (adjCell.color !== cell.color) {
            // Takeover: if current value is higher
            if (cell.value > adjCell.value) {
                adjCell.color = cell.color;
                adjCell.element.classList.remove('red', 'blue');
                adjCell.element.classList.add(cell.color, 'animate-takeover');
                setTimeout(() => {
                    adjCell.element.classList.remove('animate-takeover');
                }, 500);
            }
        } else {
            // Boost: add 1 to adjacent same color
            adjCell.value += 1;
            adjCell.element.querySelector('.hexagon-content').textContent = adjCell.value;
            adjCell.element.classList.add('animate-boost');
            setTimeout(() => {
                adjCell.element.classList.remove('animate-boost');
            }, 500);
        }
    });
}

/**
 * Get adjacent cells (hexagon has 6 neighbors)
 */
function getAdjacentCells(row, col) {
    const adjacent = [];
    const isEvenRow = row % 2 === 0;

    // Hexagon adjacency depends on whether row is even or odd
    const offsets = isEvenRow
        ? [[-1, -1], [-1, 0], [0, -1], [0, 1], [1, -1], [1, 0]]
        : [[-1, 0], [-1, 1], [0, -1], [0, 1], [1, 0], [1, 1]];

    offsets.forEach(([dRow, dCol]) => {
        const newRow = row + dRow;
        const newCol = col + dCol;

        if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 10) {
            adjacent.push(gameState.board[newRow][newCol]);
        }
    });

    return adjacent;
}

/**
 * Handle hexagon hover for preview
 */
function handleHexagonHover(row, col) {
    if (gameState.gameOver) return;
    if (gameState.isBot && gameState.currentPlayer === 'blue') return;

    const cell = gameState.board[row][col];
    if (cell.disabled || cell.color !== null) return;

    // Clear previous preview
    clearHoverPreview();

    // Show preview
    cell.element.classList.add('preview', gameState.currentPlayer);
    cell.element.querySelector('.hexagon-content').textContent = gameState.currentNumber;

    // Show adjacent effects preview
    const adjacent = getAdjacentCells(row, col);
    adjacent.forEach(adjCell => {
        if (adjCell.color === null || adjCell.disabled) return;

        if (adjCell.color !== gameState.currentPlayer) {
            // Show takeover preview
            if (gameState.currentNumber > adjCell.value) {
                adjCell.element.style.opacity = '0.7';
                adjCell.element.style.transform = 'scale(0.95)';
            }
        } else {
            // Show boost preview
            const content = adjCell.element.querySelector('.hexagon-content');
            const originalValue = content.textContent;
            content.textContent = `${adjCell.value}→${adjCell.value + 1}`;
            content.dataset.original = originalValue;
        }
    });
}

/**
 * Clear hover preview
 */
function clearHoverPreview() {
    gameState.board.forEach(row => {
        row.forEach(cell => {
            if (cell.element.classList.contains('preview')) {
                cell.element.classList.remove('preview', 'red', 'blue');
                if (cell.color === null) {
                    cell.element.querySelector('.hexagon-content').textContent = '';
                }
            }

            // Reset adjacent effects
            cell.element.style.opacity = '';
            cell.element.style.transform = '';
            const content = cell.element.querySelector('.hexagon-content');
            if (content.dataset.original) {
                content.textContent = content.dataset.original;
                delete content.dataset.original;
            }
        });
    });
}

/**
 * Switch to next player
 */
function switchPlayer() {
    gameState.currentPlayer = gameState.currentPlayer === 'red' ? 'blue' : 'red';
    gameState.moveCount++;
}

/**
 * Update score displays
 */
function updateScores() {
    let redScore = 0;
    let blueScore = 0;

    gameState.board.forEach(row => {
        row.forEach(cell => {
            if (cell.color === 'red') {
                redScore += cell.value;
            } else if (cell.color === 'blue') {
                blueScore += cell.value;
            }
        });
    });

    gameState.scores.red = redScore;
    gameState.scores.blue = blueScore;

    player1ScoreDisplay.textContent = redScore;
    player2ScoreDisplay.textContent = blueScore;
}

/**
 * Check if game is over (no empty hexagons left)
 */
function checkGameOver() {
    return gameState.board.every(row =>
        row.every(cell => cell.disabled || cell.color !== null)
    );
}

/**
 * End game and show winner
 */
function endGame() {
    gameState.gameOver = true;

    const redScore = gameState.scores.red;
    const blueScore = gameState.scores.blue;

    let winner, winnerScore, loserScore;

    if (redScore > blueScore) {
        winner = gameState.player1Name;
        winnerScore = redScore;
        loserScore = blueScore;
    } else if (blueScore > redScore) {
        winner = gameState.player2Name;
        winnerScore = blueScore;
        loserScore = redScore;
    } else {
        winner = 'Draw';
        winnerScore = redScore;
        loserScore = blueScore;
    }

    // Display winner info
    winnerInfo.innerHTML = `
        <strong>${winner === 'Draw' ? "It's a Draw!" : winner + ' Wins!'}</strong>
        <p>${gameState.player1Name}: ${redScore} points</p>
        <p>${gameState.player2Name}: ${blueScore} points</p>
    `;

    gameOverModal.classList.remove('hidden');

    // Save to leaderboard
    saveToLeaderboard(winner, winnerScore, loserScore);
}

/**
 * Save game result to leaderboard (localStorage)
 */
function saveToLeaderboard(winner, winnerScore, loserScore) {
    const games = JSON.parse(localStorage.getItem('hexariaLeaderboard') || '[]');

    const gameData = {
        id: Date.now(),
        date: new Date().toISOString(),
        player1: gameState.player1Name,
        player2: gameState.player2Name,
        winner: winner,
        score1: gameState.scores.red,
        score2: gameState.scores.blue,
        winnerScore: winnerScore,
        level: gameState.level,
        isBot: gameState.isBot
    };

    games.push(gameData);
    localStorage.setItem('hexariaLeaderboard', JSON.stringify(games));

    loadLeaderboard();
}

/**
 * Load and display leaderboard
 */
function loadLeaderboard() {
    const games = JSON.parse(localStorage.getItem('hexariaLeaderboard') || '[]');

    if (games.length === 0) {
        leaderboardList.innerHTML = '<p class="no-games">No games played yet</p>';
        return;
    }

    // Sort games
    const sortBy = sortSelect.value;
    games.sort((a, b) => {
        if (sortBy === 'score') {
            return b.winnerScore - a.winnerScore;
        } else {
            return new Date(b.date) - new Date(a.date);
        }
    });

    // Display games
    leaderboardList.innerHTML = games.map(game => {
        const date = new Date(game.date);
        const dateStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();

        return `
            <div class="leaderboard-item">
                <div class="leaderboard-item-header">
                    <h4>${game.player1} vs ${game.player2}</h4>
                </div>
                <div class="leaderboard-item-score">
                    Winner: ${game.winner} (${game.winnerScore} pts)
                </div>
                <div class="leaderboard-item-date">
                    ${dateStr} • ${game.level}
                </div>
                <button class="details-btn" onclick="showGameDetails(${game.id})">Details</button>
            </div>
        `;
    }).join('');
}

/**
 * Show game details modal
 */
function showGameDetails(gameId) {
    const games = JSON.parse(localStorage.getItem('hexariaLeaderboard') || '[]');
    const game = games.find(g => g.id === gameId);

    if (!game) return;

    const date = new Date(game.date);
    const dateStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();

    gameDetailsContent.innerHTML = `
        <p><strong>Date:</strong> ${dateStr}</p>
        <p><strong>Level:</strong> ${game.level}</p>
        <p><strong>Player 1:</strong> ${game.player1} (Red) - ${game.score1} points</p>
        <p><strong>Player 2:</strong> ${game.player2} (Blue) - ${game.score2} points</p>
        <p><strong>Winner:</strong> ${game.winner}</p>
        <p><strong>Winning Score:</strong> ${game.winnerScore} points</p>
        <p><strong>Opponent Type:</strong> ${game.isBot ? 'Bot' : 'Human'}</p>
    `;

    detailsModal.classList.remove('hidden');
}

/**
 * Bot AI - Make a move
 */
function makeBotMove() {
    if (gameState.gameOver) return;

    // Show 3 random steps before actual move (imitate human)
    const emptyCells = getEmptyCells();
    if (emptyCells.length === 0) return;

    let stepCount = 0;
    const maxSteps = Math.min(3, emptyCells.length);
    const randomSteps = [];

    // Generate random steps
    while (randomSteps.length < maxSteps) {
        const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        if (!randomSteps.some(s => s.row === randomCell.row && s.col === randomCell.col)) {
            randomSteps.push(randomCell);
        }
    }

    // Show steps with animation
    const showStep = () => {
        if (stepCount < randomSteps.length) {
            const step = randomSteps[stepCount];
            handleHexagonHover(step.row, step.col);

            setTimeout(() => {
                clearHoverPreview();
                stepCount++;
                showStep();
            }, 1000);
        } else {
            // Make actual move
            const bestMove = calculateBestMove();
            if (bestMove) {
                placeHexagon(bestMove.row, bestMove.col);
            }
        }
    };

    showStep();
}

/**
 * Get all empty cells
 */
function getEmptyCells() {
    const empty = [];
    gameState.board.forEach(row => {
        row.forEach(cell => {
            if (!cell.disabled && cell.color === null) {
                empty.push(cell);
            }
        });
    });
    return empty;
}

/**
 * Calculate best move for bot (simple AI)
 */
function calculateBestMove() {
    const emptyCells = getEmptyCells();
    if (emptyCells.length === 0) return null;

    let bestMove = null;
    let bestScore = -1;

    emptyCells.forEach(cell => {
        let score = 0;
        const adjacent = getAdjacentCells(cell.row, cell.col);

        adjacent.forEach(adjCell => {
            if (adjCell.color === null || adjCell.disabled) return;

            if (adjCell.color !== 'blue') {
                // Can takeover opponent
                if (gameState.currentNumber > adjCell.value) {
                    score += adjCell.value + 10; // High priority
                }
            } else {
                // Can boost own hexagon
                score += 5;
            }
        });

        // Add randomness
        score += Math.random() * 3;

        if (score > bestScore) {
            bestScore = score;
            bestMove = cell;
        }
    });

    return bestMove || emptyCells[0];
}

/**
 * Play sound effect
 */
function playPlaceSound() {
    placeSound.currentTime = 0;
    placeSound.play().catch(() => {
        // Ignore errors if sound can't play
    });
}

// Make showGameDetails available globally
window.showGameDetails = showGameDetails;
