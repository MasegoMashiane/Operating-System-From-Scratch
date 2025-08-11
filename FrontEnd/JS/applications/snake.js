// FrontEnd/JS/applications/snake.js
// Modular Snake game. Exported class manages canvas & lifecycle.

export class SnakeGame {
  /**
   * containerEl: the element inside the window where the game should render.
   * config: optional { width, height, gridSize, fps }.
   */
  constructor(containerEl, config = {}) {
    this.container = containerEl;
    this.width = config.width || 400;
    this.height = config.height || 400;
    this.grid = config.gridSize || 20;
    this.fps = config.fps || 10;

    this.canvas = null;
    this.ctx = null;
    this._interval = null;

    this.snake = [];
    this.direction = null;
    this.food = null;
    this.score = 0;
    this.running = false;

    // optional process PID if you hook into process system
    this.pid = null;

    this._keyHandler = this._onKeyDown.bind(this);

    this._buildUI();
  }

  _buildUI() {
    // clear container
    this.container.innerHTML = '';

    // create canvas
    const canvas = document.createElement('canvas');
    canvas.width = this.width;
    canvas.height = this.height;
    canvas.style.display = 'block';
    canvas.style.margin = '0 auto';
    canvas.style.background = '#000';
    canvas.style.borderRadius = '6px';
    this.container.appendChild(canvas);

    // status bar
    const status = document.createElement('div');
    status.style.color = '#fff';
    status.style.fontFamily = 'monospace';
    status.style.marginTop = '8px';
    status.textContent = `Score: 0`;
    this.container.appendChild(status);

    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.statusEl = status;

    this._resetGameState();
  }

  _resetGameState() {
    // snake starts in middle
    const cols = Math.floor(this.canvas.width / this.grid);
    const rows = Math.floor(this.canvas.height / this.grid);
    const startX = Math.floor(cols / 2) * this.grid;
    const startY = Math.floor(rows / 2) * this.grid;

    this.snake = [{ x: startX, y: startY }];
    this.direction = null;
    this.food = this._spawnFood();
    this.score = 0;
    this._render(); // initial draw
  }

  _spawnFood() {
    const cols = Math.floor(this.canvas.width / this.grid);
    const rows = Math.floor(this.canvas.height / this.grid);
    const x = Math.floor(Math.random() * cols) * this.grid;
    const y = Math.floor(Math.random() * rows) * this.grid;

    // avoid placing on snake
    if (this.snake.some(s => s.x === x && s.y === y)) return this._spawnFood();
    return { x, y };
  }

  _onKeyDown(e) {
    const k = e.key;
    if ((k === 'ArrowLeft' || k === 'a') && this.direction !== 'RIGHT') this.direction = 'LEFT';
    if ((k === 'ArrowUp' || k === 'w') && this.direction !== 'DOWN') this.direction = 'UP';
    if ((k === 'ArrowRight' || k === 'd') && this.direction !== 'LEFT') this.direction = 'RIGHT';
    if ((k === 'ArrowDown' || k === 's') && this.direction !== 'UP') this.direction = 'DOWN';
  }

  _step() {
    if (!this.direction) return; // don't move until player picks a direction

    const head = { ...this.snake[0] };
    if (this.direction === 'LEFT') head.x -= this.grid;
    if (this.direction === 'RIGHT') head.x += this.grid;
    if (this.direction === 'UP') head.y -= this.grid;
    if (this.direction === 'DOWN') head.y += this.grid;

    // collision with walls
    if (head.x < 0 || head.y < 0 || head.x >= this.canvas.width || head.y >= this.canvas.height) {
      this._gameOver();
      return;
    }

    // collision with self
    if (this.snake.some(s => s.x === head.x && s.y === head.y)) {
      this._gameOver();
      return;
    }

    // eat food
    if (head.x === this.food.x && head.y === this.food.y) {
      this.score++;
      this.food = this._spawnFood();
      // snake grows (don't pop)
    } else {
      // move forward
      this.snake.pop();
    }

    this.snake.unshift(head);
    this._render();
  }

  _render() {
    const ctx = this.ctx;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // food
    ctx.fillStyle = 'red';
    ctx.fillRect(this.food.x, this.food.y, this.grid, this.grid);

    // snake
    for (let i = 0; i < this.snake.length; i++) {
      ctx.fillStyle = i === 0 ? 'lime' : 'green';
      ctx.fillRect(this.snake[i].x, this.snake[i].y, this.grid, this.grid);
    }

    this.statusEl.textContent = `Score: ${this.score}`;
  }

  _gameOver() {
    this.pause();
    // lightweight notification — you can replace this with an in-window modal
    setTimeout(() => {
      // simple alert is fine; apps usually avoid global alert in real UI, but it's concise
      alert(`Game Over — Score: ${this.score}`);
      this._resetGameState();
      this.start(); // auto restart after game over
    }, 50);
  }

  // PUBLIC API

  start() {
    if (this.running) return;
    this.running = true;

    // optional: if there's a process system, spawn here
    // if (typeof processOp !== 'undefined') { this.pid = processOp.spawn(this._dummyProgram()); }

    window.addEventListener('keydown', this._keyHandler);
    this._interval = setInterval(() => this._step(), Math.floor(1000 / this.fps));
  }

  pause() {
    if (!this.running) return;
    this.running = false;
    if (this._interval) clearInterval(this._interval);
    this._interval = null;
    window.removeEventListener('keydown', this._keyHandler);
  }

  resume() {
    if (this.running) return;
    this.start();
  }

  kill() {
    this.pause();
    // optional: kill process if you spawned one
    // if (this.pid && typeof processOp !== 'undefined') processOp.kill(this.pid);
    this.pid = null;
    // remove UI if desired — appManager usually handles window removal
  }

  // Optional placeholder program to register with a scheduler
  _dummyProgram() {
    // small "program" array compatible with your ctors if you have them
    return [{ op: 'noop' }, { op: 'noop' }, { op: 'noop' }];
  }
}