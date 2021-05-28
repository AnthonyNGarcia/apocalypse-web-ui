/**
 * ENUM file.
 */
;
import ARMY_ACTION_ENUMS from './armyActionEnums';

const ARMY_ACTIONS = {
  MOVE: {
    enum: ARMY_ACTION_ENUMS.MOVE,
    name: 'Move',
    tooltip: 'Move the selected army to an adjacent tile.',
    actionCost: 1,
  },
};

export default ARMY_ACTIONS;
