const getAdjacentHexagonIndices = (x, y, index) => {
  const bounds = x * y - 1;
  const adjacentHexagonIndices = [];
  if (index < 0 || index > bounds) {
    // An invalid index was provided, there will not be any adjacent hexagons
    return [];
  }
  // Check hexagon directly to the left
  if (index % x > 0) {
    adjacentHexagonIndices.push((index - 1));
  }
  // Check hexagon directly to the right
  if (index % x !== (x - 1)) {
    adjacentHexagonIndices.push((index + 1));
  }
  // Determine if we are on left-staggered row or not, for differential logic
  const leftStagger = Math.floor(index / x) % 2 !== 0;
  let topLeftHexagonIndex;
  let topRightHexagonIndex;
  let bottomLeftHexagonIndex;
  let bottomRightHexagonIndex;
  if (leftStagger) {
    topLeftHexagonIndex = (index % x !== 0) ? index - x - 1 : -1;
    topRightHexagonIndex = index - x;
    bottomLeftHexagonIndex = (index <= bounds - x) &&
      (index % x !== 0) ? index + x - 1 : -1;
    bottomRightHexagonIndex = (index <= bounds - x) ? index + x : -1;
  } else {
    topLeftHexagonIndex = (index > x - 1) ? index - x : -1;
    topRightHexagonIndex = (index > x - 1) &&
      (index % x !== x - 1 ) ? index - x + 1 : -1;
    bottomLeftHexagonIndex = index + x;
    bottomRightHexagonIndex = (index % x !== x - 1) ? index + x + 1 : -1;
  }
  // Check remaining hexagons
  if (topLeftHexagonIndex >= 0 && topLeftHexagonIndex <= bounds) {
    adjacentHexagonIndices.push(topLeftHexagonIndex);
  }
  if (topRightHexagonIndex >= 0 && topRightHexagonIndex <= bounds) {
    adjacentHexagonIndices.push(topRightHexagonIndex);
  }
  if (bottomLeftHexagonIndex >= 0 && bottomLeftHexagonIndex <= bounds) {
    adjacentHexagonIndices.push(bottomLeftHexagonIndex);
  }
  if (bottomRightHexagonIndex >= 0 && bottomRightHexagonIndex <= bounds) {
    adjacentHexagonIndices.push(bottomRightHexagonIndex);
  }
  // Return result
  return adjacentHexagonIndices;
};

export default getAdjacentHexagonIndices;

// Testing
// const x = 5;
// const y = 6;

// console.log('---For x: ' + x + ', y: ' + y + '---');
// for (let i = 0; i < (x*y); i++) {
//   console.log('Index: ' + i);
//   console.log(getAdjacentHexagonIndices(x, y, i));
//   console.log('----');
// }
