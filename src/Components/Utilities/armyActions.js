/**
 * ENUM file.
 */
;
import ARMY_ACTION_REQUEST_TYPES from './armyActionRequestTypes';

const ARMY_ACTIONS = {
  CAMP: {
    enum: ARMY_ACTION_REQUEST_TYPES.CAMP,
    name: 'Camp',
    tooltip: 'Spend all remaining movement to fortify and heal in place.',
    actionCost: 1,
  },
};

export default ARMY_ACTIONS;
