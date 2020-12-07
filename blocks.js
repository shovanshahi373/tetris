const x = "x";

const T = [
  [0, 0, 0],
  [x, x, x],
  [0, x, 0],
];

const S = [
  [0, x, x],
  [x, x, 0],
  [0, 0, 0],
];

const Z = [
  [x, x, 0],
  [0, x, x],
  [0, 0, 0],
];

const L = [
  [x, 0, 0],
  [x, 0, 0],
  [x, x, 0],
];

const J = [
  [0, 0, x],
  [0, 0, x],
  [0, x, x],
];

const O = [
  [x, x],
  [x, x],
];

const I = [
  [0, x, 0, 0],
  [0, x, 0, 0],
  [0, x, 0, 0],
  [0, x, 0, 0],
];

const blocks = [
  {
    name: "T",
    block: T,
  },
  {
    name: "S",
    block: S,
  },
  {
    name: "Z",
    block: Z,
  },
  {
    name: "L",
    block: L,
  },
  {
    name: "J",
    block: J,
  },
  {
    name: "O",
    block: O,
  },
  {
    name: "I",
    block: I,
  },
];

export const getBlockByName = (n) => {
  const result = blocks.find(({ name }) => n === name);
  return result;
};

export default blocks;
