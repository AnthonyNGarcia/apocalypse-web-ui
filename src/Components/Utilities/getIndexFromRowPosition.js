/**
 * This utility function can calculate what the unit's index in an army
 * will be from being provided the army's grid, and the unit's row+position
 * @param {Object} armyGrid containing maxRows, maxPositions
 * @param {*} row the row of the unit in the grid
 * @param {*} position the position of the unit in the grid
 * @return {number} unitIndex for the unit in its army.units array
 */
const getIndexFromRowPosition = (armyGrid, row, position) => {
  const positionsPerRow = armyGrid.maxPositions;
  let unitIndex = position;
  unitIndex += row * positionsPerRow;
  return unitIndex;
};

export default getIndexFromRowPosition;
