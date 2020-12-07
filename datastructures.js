import { generateBlock } from "./utils.js";

export class Field {
  constructor(cols, rows) {
    this.field = this.buildField(cols, rows);
    this.audio = {
      score: {
        1: new Audio("./assets/audio/scorepoint-1.wav"),
        2: new Audio("./assets/audio/scorepoint-2.wav"),
        3: new Audio("./assets/audio/scorepoint-3.wav"),
        4: new Audio("./assets/audio/scorepoint-4.wav"),
      },
      mergeblock: new Audio("./assets/audio/drop.wav"),
    };
  }
  buildField(w, h) {
    const matrix = [];
    for (let i = 0; i < h; i++) {
      matrix.push(new Array(w).fill(0));
    }
    return matrix;
  }
  merge(player) {
    const {
      audio: { mergeblock },
      field,
    } = this;
    mergeblock.play();
    const { block, position } = player;
    block.forEach((row, y) => {
      row.forEach((val, x) => {
        if (block[y][x] !== 0) {
          field[y + position.y][x + position.x] = val;
        }
      });
    });
    return this;
  }
  clean(times = 1) {
    const {
      audio: { score },
      field,
    } = this;
    score[times].play();
    while (times--) {
      for (let i = field.length - 1; i >= 0; i--) {
        if (field[i].every((val) => val === 0)) {
          const row = field.splice(i, 1)[0];
          field.unshift(row);
        }
      }
    }
    return this;
  }
  reset() {
    this.field = this.buildField(cols, rows);
  }
  getScore() {
    const { field } = this;
    let cleanAmount = 0;
    let power = 0;
    let score = 0;
    for (let i = field.length - 1; i >= 0; i--) {
      const hasScore = !field[i].some((val) => val === 0);
      if (hasScore) {
        power += 1.5;
        score += 2;
        field[i] = field[i].map((val) => 0);
        cleanAmount++;
      }
    }
    if (score > 0) {
      this.clean(cleanAmount);
      return parseFloat(Math.pow(score, power).toFixed(2));
    }
    return null;
  }
}

export class Player {
  constructor({ name = "Player1", initialX }) {
    this.name = name;
    this.name = "";
    this.score = 0;
    this.lastScore = 0;
    this.baseX = initialX;
    this.block = generateBlock();
    this.next = generateBlock();
    this.color = "#ccc";
    this.audio = {
      rotate: new Audio("./assets/audio/rotate-block.wav"),
      move: new Audio("./assets/audio/block-move.mp3"),
    };
    this.position = {
      x: this.baseX,
      y: 0,
    };
    this.nextBlock = this.nextBlock.bind(this);
    this.move = this.move.bind(this);
    this.rotate = this.rotate.bind(this);
    this.hasCollided = this.hasCollided.bind(this);
  }
  nextBlock() {
    this.block = this.next;
    this.next = generateBlock();
    this.position.y = 0;
    this.position.x = this.baseX;
    return this.block;
  }
  move(dir) {
    const { position, audio } = this;
    audio.move.currentTime = 0;
    audio.move.play();
    position.x += dir;
    return this;
  }
  rotate() {
    const {
      block,
      audio: { rotate },
    } = this;
    // transpose
    rotate.currentTime = 0;
    rotate.play();
    for (let i = 0; i < block.length; i++) {
      for (let j = i; j < block[i].length; j++) {
        if (i !== j) {
          const temp = block[j][i];
          block[j][i] = block[i][j];
          block[i][j] = temp;
        }
      }
    }
    //swap first and last column
    for (let i = 0; i < block.length; i++) {
      const temp = block[i][0];
      const last = block[i].length - 1;
      block[i][0] = block[i][last];
      block[i][last] = temp;
    }
  }

  hasCollided(field) {
    const {
      position: { x: posX, y: posY },
      block,
    } = this;
    const bool = block.some((row, y) => {
      return row.some((val, x) => {
        if (block[y][x] !== 0) {
          return !field[y + posY] || field[y + posY][x + posX] !== 0;
        }
      });
    });
    return bool;
  }
}
