import { getBlockByName } from "./blocks.js";
import { colors } from "./variables.js";

const history = [];
const initialProb = 1 / 7;
const probabilityMap = {
  S: initialProb,
  T: initialProb,
  L: initialProb,
  J: initialProb,
  O: initialProb,
  I: initialProb,
  Z: initialProb,
};
const blocks = Object.keys(probabilityMap);
const POOL_SIZE = 50;
const losePoints = 0.3 * initialProb;
const gainPoints = losePoints / 6;

const shuffle = (arr) => {
  for (let i = arr.length - 1; i >= 0; i--) {
    const rng = Math.floor(Math.random() * i);
    const temp = arr[rng];
    arr[rng] = arr[i];
    arr[i] = temp;
  }
  return arr;
};

const eveness = () => {
  const accr = blocks
    .map((block) => {
      const sum = history.reduce((ttl, bl) => {
        if (bl === block) return ++ttl;
        return ttl;
      }, 0);
      return sum;
    })
    .reduce((sum, val) => {
      return (sum += (val / 20) * 100);
    }, 0);
};

const buildblockPool = () => {
  const result = Object.entries(probabilityMap).reduce(
    (ttl, [type, chance]) => {
      let amount = chance * POOL_SIZE;
      amount = amount < 0 ? 0 : Math.floor(amount);
      ttl.push(...Array(amount).fill(type));
      return ttl;
    },
    []
  );
  return shuffle(result).map((name) => getBlockByName(name));
};

const updateHistory = (name) => {
  history.unshift(name);
  if (history.length > 20) history.pop();
  for (const key in probabilityMap) {
    if (name == key) {
      probabilityMap[key] -= losePoints;
    } else {
      probabilityMap[key] += gainPoints;
    }
  }
  // eveness();
};

export const generateBlock = () => {
  const Pool = buildblockPool();
  const colorIndex =
    Math.ceil(Math.random() * Object.keys(colors).length - 1) + 1;
  const { name, block } = Pool[(Math.random() * Pool.length) | 0];
  updateHistory(name);
  return block.map((row, y) => {
    return row.map((val, x) => {
      if (val === "x") return colorIndex;
      return val;
    });
  });
};

export const getTime = (seconds = 1000) => {
  let sec = seconds % 60 | 0;
  let min = (seconds / 60) % 60 | 0;
  let hours = (seconds / (60 * 60)) % 24 | 0;
  sec = sec ? sec + "s " : "";
  min = min ? min + "m " : "";
  hours = hours ? hours + "h " : "";
  return hours + min + sec;
};
