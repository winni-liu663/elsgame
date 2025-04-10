// 游戏常量
const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;
const COLORS = [
    'cyan', 'blue', 'orange', 'yellow', 'green', 'purple', 'red'
];

// 方块形状定义
const SHAPES = [
    [[1, 1, 1, 1]],                    // I
    [[1, 1, 1], [0, 1, 0]],           // T
    [[1, 1, 1], [1, 0, 0]],           // L
    [[1, 1, 1], [0, 0, 1]],           // J
    [[1, 1], [1, 1]],                 // O
    [[1, 1, 0], [0, 1, 1]],           // Z
    [[0, 1, 1], [1, 1, 0]]            // S
];

// 游戏状态
let canvas;
let ctx;
let gameBoard;
let score = 0;
let currentPiece;
let currentX;
let currentY;
let gameLoop;
let dropInterval = 1000;

// 初始化游戏
function init() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    
    // 初始化游戏板
    gameBoard = Array(ROWS).fill().map(() => Array(COLS).fill(0));
    
    // 事件监听
    document.addEventListener('keydown', handleKeyPress);
    
    // 开始游戏
    newGame();
}

// 开始新游戏
function newGame() {
    resetBoard();
    newPiece();
    if (gameLoop) clearInterval(gameLoop);
    gameLoop = setInterval(drop, dropInterval);
}

// 重置游戏板
function resetBoard() {
    score = 0;
    document.getElementById('score').textContent = score;
    gameBoard = Array(ROWS).fill().map(() => Array(COLS).fill(0));
}

// 创建新方块
function newPiece() {
    const randomIndex = Math.floor(Math.random() * SHAPES.length);
    currentPiece = SHAPES[randomIndex];
    currentX = Math.floor(COLS / 2) - Math.floor(currentPiece[0].length / 2);
    currentY = 0;
    
    if (!isValid(0, 0)) {
        // 游戏结束
        alert('游戏结束！得分：' + score);
        newGame();
    }
}

// 检查移动是否有效
function isValid(offsetX, offsetY, newPiece = currentPiece) {
    for (let y = 0; y < newPiece.length; y++) {
        for (let x = 0; x < newPiece[y].length; x++) {
            if (!newPiece[y][x]) continue;
            
            const newX = currentX + x + offsetX;
            const newY = currentY + y + offsetY;
            
            if (newX < 0 || newX >= COLS || newY >= ROWS) return false;
            if (newY < 0) continue;
            if (gameBoard[newY][newX]) return false;
        }
    }
    return true;
}

// 方块下落
function drop() {
    if (isValid(0, 1)) {
        currentY++;
    } else {
        freeze();
        clearLines();
        newPiece();
    }
    draw();
}

// 冻结方块
function freeze() {
    for (let y = 0; y < currentPiece.length; y++) {
        for (let x = 0; x < currentPiece[y].length; x++) {
            if (currentPiece[y][x]) {
                gameBoard[currentY + y][currentX + x] = 1;
            }
        }
    }
}

// 清除完整的行
function clearLines() {
    let linesCleared = 0;
    
    for (let y = ROWS - 1; y >= 0; y--) {
        if (gameBoard[y].every(cell => cell)) {
            gameBoard.splice(y, 1);
            gameBoard.unshift(Array(COLS).fill(0));
            linesCleared++;
            y++;
        }
    }
    
    if (linesCleared > 0) {
        score += linesCleared * 100;
        document.getElementById('score').textContent = score;
    }
}

// 旋转方块
function rotate() {
    const newPiece = currentPiece[0].map((_, i) =>
        currentPiece.map(row => row[i]).reverse()
    );
    
    if (isValid(0, 0, newPiece)) {
        currentPiece = newPiece;
    }
}

// 处理键盘输入
function handleKeyPress(event) {
    switch(event.keyCode) {
        case 37: // 左箭头
            if (isValid(-1, 0)) currentX--;
            break;
        case 39: // 右箭头
            if (isValid(1, 0)) currentX++;
            break;
        case 40: // 下箭头
            if (isValid(0, 1)) currentY++;
            break;
        case 38: // 上箭头
            rotate();
            break;
        case 32: // 空格
            while(isValid(0, 1)) currentY++;
            break;
    }
    draw();
}

// 绘制游戏
function draw() {
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 绘制游戏板
    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
            if (gameBoard[y][x]) {
                drawBlock(x, y);
            }
        }
    }
    
    // 绘制当前方块
    for (let y = 0; y < currentPiece.length; y++) {
        for (let x = 0; x < currentPiece[y].length; x++) {
            if (currentPiece[y][x]) {
                drawBlock(currentX + x, currentY + y);
            }
        }
    }
}

// 绘制单个方块
function drawBlock(x, y) {
    ctx.fillStyle = '#000';
    ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
    ctx.strokeStyle = '#fff';
    ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
}

// 启动游戏
document.addEventListener('DOMContentLoaded', init); 