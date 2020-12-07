import { Field, Player } from "./datastructures.js";
import { colors, GAME_STATES } from "./variables.js";

export default class Game {
  constructor(options = {}) {
    const {
      gameContext,
      scoreContext,
      rows,
      columns,
      cellSize,
      ...playerConfigs
    } = options;
    this.gameContext = gameContext;
    this.scoreContext = scoreContext;
    this.player = new Player(playerConfigs);
    this.mappedField = new Field(columns, rows);
    this.speed = 1;
    this.cellsize = cellSize;
    this.rows = rows;
    this.highScore = this.getHighScore();
    this.columns = columns;
    this.timeInterval = 1000;
    this.level = 1;
    this.frameId = null;
    this.state = GAME_STATES.RUNNING;
    this.music = new Audio("./assets/audio/theme-eightBit.mp3");
    this.levelUp = new Audio("./assets/audio/level-up.wav");
    this.music.loop = true;
  }
  getPlayer() {
    return this.player;
  }
  getHighScore() {
    let savedData = localStorage.getItem("TETRIS_HIGH_SCORE");
    if (!savedData) {
      const data = {
        name: this.player.name,
        score: 0.0,
      };
      localStorage.setItem("TETRIS_HIGH_SCORE", JSON.stringify(data));
      return data;
    }
    return JSON.parse(savedData);
  }
  reset() {
    if (this.player.score > this.highScore.score) {
      const savedData = JSON.stringify({
        name: this.player.name,
        score: this.player.score,
      });
      localStorage.setItem("TETRIS_HIGH_SCORE", savedData);
    }
    this.level = 1;
    this.speed = 1;
    this.music.playbackRate = 1;
    // this.state = GAME_STATES.RUNNING;
    this.highScore = this.getHighScore();
    this.mappedField = new Field(this.columns, this.rows);
    this.player.score = 0.0;
    this.player.lastScore = 0.0;
  }
  updateSpeed() {
    const lastspeed = this.speed;
    if (this.player.score > 100) {
      this.speed += 0.2;
      this.music.playbackRate += 0.002 * this.speed;
    }
    if (Math.floor(this.speed) !== Math.floor(lastspeed)) {
      this.level++;
      this.levelUp.play();
    }
  }
  drawGrid(cw, ch) {
    const { gameContext, cellsize, rows } = this;
    for (let i = 0; i < rows; i++) {
      if (i <= cw) {
        gameContext.beginPath();
        gameContext.moveTo(i * cellsize, ch);
        gameContext.lineTo(i * cellsize, 0);
        gameContext.stroke();
        gameContext.closePath();
      }
      gameContext.beginPath();
      gameContext.moveTo(0, i * cellsize);
      gameContext.lineTo(cw, i * cellsize);
      gameContext.stroke();
      gameContext.closePath();
    }
  }
  draw(context, matrix, pos = { x: 0, y: 0 }) {
    matrix.forEach((row, y) => {
      row.forEach((val, x) => {
        if (val !== 0) {
          context.fillStyle = colors[val] || "#000";
          context.fillRect(
            pos.x * this.cellsize + x * this.cellsize,
            pos.y * this.cellsize + y * this.cellsize,
            this.cellsize,
            this.cellsize
          );
        }
      });
    });
  }
}
