/**
 * ENUM file.
 */
;

const WEBSOCKET_MESSAGE_TYPES = {
  ARMY_MOVED_UNCONTESTED: 'ARMY_MOVED_UNCONTESTED',
  ARMY_STANCE_CHANGED: 'ARMY_STANCE_CHANGED',
  PLAYER_ENDED_TURN: 'PLAYER_ENDED_TURN',
  UNIT_RECRUITMENT_QUEUE_UPDATED: 'UNIT_RECRUITMENT_QUEUE_UPDATED',
  UNASSIGNED_UNITS_UPDATED: 'UNASSIGNED_UNITS_UPDATED',
  ARMY_UNITS_UPDATED: 'ARMY_UNITS_UPDATED',
  ARMY_AND_UNASSIGNED_UNITS_UPDATED: 'ARMY_AND_UNASSIGNED_UNITS_UPDATED',
  PLAYER_LEFT_GAME: 'PLAYER_LEFT_GAME',
  BATTLE_STARTED: 'BATTLE_STARTED',
  BATTLE_ENDED: 'BATTLE_ENDED',
  CONFIGURATION_COMPLETE: 'CONFIGURATION_COMPLETE',
  BATTLE_DATA_UPDATED: 'BATTLE_DATA_UPDATED',
};

export default WEBSOCKET_MESSAGE_TYPES;
