// dom manipulation
document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".container");
  const width = 10;
  let currentRotation = 0;
  let currentPosition = Math.floor(width / 2) - 1;
  const cellArr = [];
  const ztetromino = [
    [0, 1, 1 + width, width + 2],
    [1, width, width + 1, 2 * width],
  ];
  const ttetromino = [
    [width, width + 1, width + 2, 2 * width + 1],
    [0, width, width + 1, 2 * width],
    [width + 1, 2 * width, 2 * width + 1, 2 * width + 2],
    [1, width, width + 1, 2 * width + 1],
  ];
  const ltetromino = [
    [1, width + 1, 2 * width + 2, 2 * width + 1],
    [width + 2, 2 * width, 2 * width + 1, 2 * width + 2],
  ];
  const itetromino = [
    [1, width + 1, 2 * width + 1, 3 * width + 1],
    [width, width + 1, width + 2, width + 3],
  ];
  const stetromino = [
    [width + 1, width + 2, 2 * width, 2 * width + 1],
    [2, width + 1, width + 2, 2 * width + 1],
  ];
  const jtetromino = [
    [0, 1, width + 1, 2 * width + 1],
    [width, 2 * width, 2 * width + 1, 2 * width + 2],
  ];
  const otetromino = [[0, 1, width, width + 1]];
  const tetrominoes = [
    ztetromino,
    ttetromino,
    itetromino,
    ltetromino,
    stetromino,
    jtetromino,
    otetromino,
  ];

  const colors = [
    "linear-gradient(-45deg, #248428, #05ff0f)",
    "linear-gradient(-45deg, #333b65, #536dfb)",
    "linear-gradient(-45deg, #c65430, #FF5722)",
    "linear-gradient(-45deg, #FFEB3B, #FFC107)",
    "linear-gradient(-45deg, #88425a, #E91E63)",
    "linear-gradient(-45deg, #1b7097, #00BCD4)",
  ];
  let color = "black";
  // const current = ttetromino[0];
  let id = null;
  let current = [];
  let currentBlock = [];
  for (let i = 0; i < 200; i++) {
    const div = document.createElement("div");
    // div.classList.add("cell");
    div.dataset.id = i;
    if (i > 199 - width) {
      div.classList.add("bottom");
    } else {
      div.classList.add("cell");
    }
    cellArr.push(div);
    container.appendChild(div);
  }

  const undraw = () => {
    // current.forEach((index) => {
    //   cellArr[index + currentPosition].classList.remove("tetris-cell");
    // });
    cellArr.forEach((cell) => {
      if (!cell.classList.contains("bottom")) {
        cell.style.backgroundImage = "";
      }
      cell.classList.remove("tetris-cell");
    });
  };

  const merge = (block) => {
    block.forEach((index) => {
      cellArr[index + currentPosition].classList.add("bottom");
    });
    const points = matchLines();
    console.log(points);
  };

  const createPiece = () => {
    color = colors[Math.floor(Math.random() * colors.length)];
    let block;
    do {
      const rng = Math.floor(Math.random() * (tetrominoes.length - 1));
      block = tetrominoes[rng];
    } while (!block);
    // const rng = Math.floor(Math.random() * (tetrominoes.length - 1));
    currentBlock = block;
    currentPosition = Math.floor(width / 2) - 2;
    current = currentBlock[currentRotation];
    animate();
  };

  const matchLines = () => {
    const point = 5;
    let matches = 0;
    let rowsMatched = 0;
    outer: for (let i = 199 - width; i >= 9; i -= width) {
      const limit = i;
      for (let j = i; j >= limit - width; j--) {
        if (!cellArr[j].classList.contains("bottom")) {
          matches = 0;
          continue outer;
        }
        matches += 1;
        if (matches === width) {
          rowsMatched += 1;
          for (let k = limit; k >= limit - width; k--) {
            cellArr[k].style.backgroundColor = "white";
          }
        }
      }
      matches = 0;
    }
    return Math.pow(point, rowsMatched);
  };

  const rotate = (dir) => {
    currentRotation += dir;
    if (!currentBlock[currentRotation]) {
      currentRotation = 0;
      current = currentBlock[currentRotation];
    } else {
      current = currentBlock[currentRotation];
    }
  };

  const draw = () => {
    // undraw();
    update();
  };

  const moveLeft = () => {
    if (current.some((index) => (index + currentPosition) % width === 0))
      return;
    currentPosition += -1;
  };

  const moveRight = () => {
    if (current.some((index) => (index + 1 + currentPosition) % width === 0))
      return;
    currentPosition += 1;
  };

  const moveDown = () => {
    if (
      current.some((i) =>
        cellArr[i + currentPosition + width].classList.contains("bottom")
      )
    )
      return;
    currentPosition += width;
  };

  // const movePiece = (dir) => {
  //   if (
  //     current.some((i) =>
  //       cellArr[i + currentPosition + width].classList.contains("bottom")
  //     )
  //   )
  //     return;
  //   const isLeftEdge = current.some((index) => {
  //     return +cellArr[index + currentPosition].dataset.id % width === 0;
  //   });
  //   console.log("is left", isLeftEdge);
  //   if (isLeftEdge) return;
  //   const isRightEdge = current.some((index) => {
  //     return (
  //       (+cellArr[index - 1 + currentPosition].dataset.id + 1) % width === 0
  //     );
  //   });
  //   console.log("is right ", isRightEdge);

  //   if (isRightEdge) return ++currentPosition;
  //   currentPosition += dir;
  // };

  const update = () => {
    undraw();
    current.forEach((index) => {
      cellArr[index + currentPosition].classList.add("tetris-cell");
      cellArr[index + currentPosition].style.backgroundImage = color;
    });
    if (
      current.some((index) =>
        cellArr[index + currentPosition + width].classList.contains("bottom")
      )
    ) {
      merge(current);
      clearInterval(id);
      currentPosition = 0;
      createPiece();
    } else {
      currentPosition += width;
    }
  };

  document.addEventListener("keydown", (e) => {
    if (e.keyCode === 37) {
      // currentPosition -= 1;
      // movePiece(-1);
      moveLeft();
    } else if (e.keyCode === 39) {
      // currentPosition += 1;
      // movePiece(1);
      moveRight();
    } else if (e.keyCode === 38) {
      rotate(1);
    } else if (e.keyCode === 40) {
      // movePiece(width);
      moveDown();
    }
  });

  const animate = () => {
    id = setInterval(() => {
      draw();
    }, 1500);
  };

  createPiece();
});
