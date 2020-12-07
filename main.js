import Game from "./game.js";
import { getTime } from "./utils.js";
import { keys, GAME_STATES } from "./variables.js";

const $gameState = document.querySelector(".game-state");
const $score = document.querySelector(".score");
const $highScore = document.querySelector(".high-score");
const $elapsedTime = document.querySelector(".elapsed-time");
const $gameLevel = document.querySelector(".game-level");
const $gamecanvas = document.querySelector("canvas#game-frame");
const $scorecanvas = document.querySelector("canvas#game-score");

const gameContext = $gamecanvas.getContext("2d");
const scoreContext = $scorecanvas.getContext("2d");

gameContext.lineWidth = 0.5;
gameContext.strokeStyle = "#ccc";
const cw = $gamecanvas.width;
const ch = $gamecanvas.height;
const cellSize = 20;
const rows = ch / cellSize;
const columns = cw / cellSize;
const initialX = Math.floor(cw / 2 / cellSize) - 1;
let blockPromixity = initialX >= cw / 2 ? -1 : 1;
let timeBucket = 0;
let elapsedTime = 0;
let timer = 0;
let lastTime = 0;
let speedFactor = 100;
// let gamePaused = false;
let hold = false;

const options = {
  gameContext,
  scoreContext,
  rows,
  columns,
  cellSize,
  initialX,
};

const game = new Game(options);
let player = game.getPlayer();
let mappedField = game.mappedField;

const updateDOM = (el, value) => {
  el.innerHTML = value;
};

updateDOM(
  $highScore,
  (+game.highScore.score.toFixed(2)).toLocaleString() || "0.00"
);

const handleKeyDown = () => {
  player.position.y += 1;
  if (player.hasCollided(mappedField.field)) {
    if (game.state === GAME_STATES.GAMEOVER) {
      timeBucket = 0;
      cancelAnimationFrame(game.frameId);
      return;
    }
    player.position.y--;
    const prevLevel = game.level;
    const score = mappedField.merge(player).getScore();
    if (score) game.updateSpeed();
    if (prevLevel !== game.level) updateDOM($gameLevel, game.level);
    player.score += score;
    const block = player.nextBlock();
    const noplace = block.some((row, y) => {
      return row.some((val, x) => {
        if (block[y][x] !== 0) {
          return (
            !mappedField.field[y + player.position.y] ||
            mappedField.field[y + player.position.y][x + player.position.x] !==
              0
          );
        }
      });
    });
    if (noplace) {
      console.log("game over!");
      game.state = GAME_STATES.GAMEOVER;
      togglePause();
    }
  }
  timeBucket = 0;
};

const checkCollisionAfterMove = (dir) => {
  blockPromixity = player.position.x * cellSize >= cw / 2 ? -1 : 1;
  const isCollisionAfterMove = player.move(dir).hasCollided(mappedField.field);
  if (isCollisionAfterMove) player.position.x -= dir;
};

const rotate = () => {
  player.rotate();
  while (player.hasCollided(mappedField.field)) {
    console.log("correcting path...");
    player.position.x += blockPromixity;
  }
};

const update = (time = 0) => {
  game.timeInterval = 1100 - game.speed * speedFactor;
  const deltaTime = time - lastTime;
  lastTime = time;
  timeBucket += deltaTime;
  elapsedTime += deltaTime;
  gameContext.clearRect(0, 0, cw, ch);
  scoreContext.clearRect(0, 0, $scorecanvas.width, $scorecanvas.height);
  if (player.lastscore < player.score) {
    const deltaScore = (player.score - player.lastscore) / 20;
    player.lastscore += deltaScore;
    player.lastscore = parseFloat(player.lastscore.toFixed(2));
    updateDOM($score, player.lastscore.toLocaleString());
    if (player.score > game.highScore.score || 0) {
      updateDOM($highScore, player.lastscore.toLocaleString());
    }
  } else {
    player.lastscore = player.score;
  }
  game.draw(gameContext, mappedField.field);
  game.draw(gameContext, player.block, player.position);
  game.draw(scoreContext, player.next);
  game.drawGrid(cw, ch, cellSize);
  if (elapsedTime >= 1000) {
    timer++;
    updateDOM($elapsedTime, getTime(timer));
    elapsedTime = 0;
  }
  if (timeBucket > game.timeInterval) {
    handleKeyDown();
  }
  if (game.state === GAME_STATES.RUNNING) {
    requestAnimationFrame(update);
  }
  // game.frameId = requestAnimationFrame(update);
};

const start = (time) => {
  update(time);
  game.music.play();
};

const togglePause = () => {
  hold = !hold;
  // console.log("holdstate", hold);
  if (game.state === GAME_STATES.PAUSED) {
    game.state = GAME_STATES.RUNNING;
  } else if (game.state === GAME_STATES.RUNNING) {
    game.state = GAME_STATES.PAUSED;
  }
  if (hold) {
    game.music.pause();
    cancelAnimationFrame(game.frameId);
  } else {
    if (game.state !== GAME_STATES.GAMEOVER) {
      start(lastTime);
    }
  }
  if (!hold && game.state === GAME_STATES.GAMEOVER) {
    timer = 0;
    let count = 3;
    let iid = setInterval(() => {
      $gameState.classList.add(GAME_STATES.PAUSED, "no-blink");
      updateDOM($gameState, count);
      if (count <= 0) {
        clearInterval(iid);
        $gameState.classList.remove(GAME_STATES.PAUSED, "no-blink");
        game.reset();

        mappedField = game.mappedField;
        game.state = GAME_STATES.RUNNING;
        game.music.currentTime = 0;
        updateDOM($gameLevel, game.level);
        updateDOM($score, player.score);
        start(0);
      } else {
        count--;
      }
    }, 1000);
  }
  $gameState.classList.toggle(GAME_STATES.PAUSED);
  updateDOM($gameState, game.state);
};

document.addEventListener("keydown", (e) => {
  if (e.key === keys.LEFT) checkCollisionAfterMove(-1);
  else if (e.key === keys.RIGHT) checkCollisionAfterMove(1);
  else if (e.key === keys.DOWN) {
    handleKeyDown();
  } else if (e.key === keys.ROTATE) rotate();
  else if (e.key === keys.PAUSE) togglePause();
});

document.addEventListener("DOMContentLoaded", () => start(0));
