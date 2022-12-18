import WEBSOCKET_MESSAGE_TYPES from '../websocketResponseMessageTypes';
import {store} from '../../../../App';
import gameBoardViewAC from
  '../../../../Redux/actionCreators/gameBoardViewActionCreators';
import cityMenuAC from
  '../../../../Redux/actionCreators/cityMenuActionCreators';
import gamePlayerAC from
  '../../../../Redux/actionCreators/gamePlayerActionCreators';
import gameAC from '../../../../Redux/actionCreators/gameActionCreators';
import outsideCityWallsBattleAC from
  '../../../../Redux/actionCreators/outsideCityWallsBattleActionCreators';
import cityWallsBattleAC from
  '../../../../Redux/actionCreators/cityWallsBattleActionCreators';
import cityCourtyardBattleAC from
  '../../../../Redux/actionCreators/cityCourtyardBattleActionCreators';
import CITY_MENU_SUPPLEMENTAL_VIEWS from '../../cityMenuSupplementalViews';
import CITY_MENU_TAB from '../../cityMenuTabs';
import PLAYER from '../../playerEnums';
import UNCLOSEABLE_MODAL_VIEW from '../../uncloseableModalView';
import ADVANCED_DETAILS_MODAL_VIEW from '../../advancedDetailsModalViews';

/**
 * This is the City Menu Message Handler.
 *
 * It handles all logic for updating the currently viewed City Menu from
 * websocket messages.
 *
 * @param {Object} message containing the actual message as well as the
 * WEBSOCKET_RESPONSE_MESSAGE_TYPE value, at websocketResponseMessageType.
 */
const messageHandler = (message) => {
  const messageType = message.websocketResponseMessageType;
  switch (messageType) {
    case WEBSOCKET_MESSAGE_TYPES.CITY_STATE_UPDATED:
      cityStateUpdated(message);
      break;
    case WEBSOCKET_MESSAGE_TYPES.UNIT_RECRUITMENT_QUEUE_UPDATED:
      unitRecruitmentQueueUpdated(message);
      break;
    case WEBSOCKET_MESSAGE_TYPES.UNASSIGNED_UNITS_UPDATED:
      unassignedUnitsUpdated(message);
      break;
    case WEBSOCKET_MESSAGE_TYPES.ARMY_AND_UNASSIGNED_UNITS_UPDATED:
      armyAndUnassignedUnitsUpdated(message);
      break;
    case WEBSOCKET_MESSAGE_TYPES.ARMY_SPAWNED_FROM_CITY:
      armySpawnedFromCity(message);
      break;
    case WEBSOCKET_MESSAGE_TYPES.TIME_WARP_PERFORMED:
      timeWarpPerformed(message);
      break;
    case WEBSOCKET_MESSAGE_TYPES.PREPARE_OUTSIDE_CITY_WALLS_PROMPT:
      promptPreparationForOutsideCityWallsBattle(message);
      break;
    case WEBSOCKET_MESSAGE_TYPES.CITY_SCORCHED:
      cityScorched(message);
      break;
    case WEBSOCKET_MESSAGE_TYPES.CONFIRM_ATTACK_CITY_WALLS_PROMPT:
      confirmAttackCityWallsPrompt(message);
      break;
    case WEBSOCKET_MESSAGE_TYPES.CONFIRM_ATTACK_CITY_COURTYARD_PROMPT:
      confirmAttackCityCourtyardPrompt(message);
      break;
    default:
      console.warn('Unrecognized message type for City Menu topic!');
      console.warn(messageType);
      console.warn(message);
  }
};

const confirmAttackCityCourtyardPrompt = (message) => {
  const state = store.getState();
  const updatedGameBoard = [...state.gameBoardView.gameBoard];
  const attackingArmyTilePosition = message.attackingArmyTilePosition;
  const attackingArmy = message.attackingArmy;
  updatedGameBoard[attackingArmyTilePosition].army = attackingArmy;
  const updatedCityTile = message.cityTile;
  updatedGameBoard[message.cityTile.tilePosition] = updatedCityTile;

  store.dispatch(gameBoardViewAC.setGameBoard(updatedGameBoard));

  store.dispatch(cityCourtyardBattleAC.setAttackingArmyTilePosition(
      attackingArmyTilePosition));
  store.dispatch(cityCourtyardBattleAC.setCityTile(updatedCityTile));

  if (attackingArmy.owner === state.gamePlayer.ownPlayerNumber) {
    store.dispatch(gameAC.setAdvancedDetailsModalView(
        ADVANCED_DETAILS_MODAL_VIEW.ATTACK_CITY_COURTYARD_CONFIRMATION_DIALOG));
  }
};

const confirmAttackCityWallsPrompt = (message) => {
  const state = store.getState();
  const updatedGameBoard = [...state.gameBoardView.gameBoard];
  updatedGameBoard[message.attackingArmyTilePosition]
      .army = message.attackingArmy;
  updatedGameBoard[message.cityTilePosition]
      .city.cityGarrison = message.cityGarrison;

  store.dispatch(gameBoardViewAC.setGameBoard(updatedGameBoard));

  store.dispatch(cityWallsBattleAC.setAttackingArmyTilePosition(
      message.attackingArmyTilePosition));
  store.dispatch(cityWallsBattleAC.setCityTilePosition(
      message.cityTilePosition));

  if (message.attackingArmy.owner === state.gamePlayer.ownPlayerNumber) {
    store.dispatch(gameAC.setAdvancedDetailsModalView(
        ADVANCED_DETAILS_MODAL_VIEW.ATTACK_CITY_WALLS_CONFIRMATION_DIALOG));
  }
};

const cityScorched = (message) => {
  const updatedCityTile = message.updatedCityTile;
  const state = store.getState();
  const updatedGameBoard = [...state.gameBoardView.gameBoard];
  updatedGameBoard[updatedCityTile.tilePosition] = updatedCityTile;
  store.dispatch(gameBoardViewAC.setGameBoard(updatedGameBoard));
  store.dispatch(gameBoardViewAC.setUncloseableModalView(
      UNCLOSEABLE_MODAL_VIEW.NONE));
  store.dispatch(outsideCityWallsBattleAC
      .clearOutsideCityWallsBattleReducer());
};

const promptPreparationForOutsideCityWallsBattle = (message) => {
  const attackingArmy = message.attackingArmy;
  const state = store.getState();
  const updatedGameBoard = [...state.gameBoardView.gameBoard];
  updatedGameBoard[message.attackingArmyTilePosition]
      .army = attackingArmy;
  const cityUnderAttack = updatedGameBoard[message.cityTilePosition].city;

  const occupyingArmy = updatedGameBoard[message.cityTilePosition].army;

  store.dispatch(gameBoardViewAC.setGameBoard(updatedGameBoard));
  store.dispatch(outsideCityWallsBattleAC.setAttackingArmy(attackingArmy));
  store.dispatch(outsideCityWallsBattleAC.setCityUnderAttack(cityUnderAttack));
  store.dispatch(outsideCityWallsBattleAC.setSallyOutForces({
    commander: null,
    units: [],
  }));
  if (occupyingArmy != null) {
    store.dispatch(outsideCityWallsBattleAC.setOccupyingArmy(occupyingArmy));
  }
  store.dispatch(outsideCityWallsBattleAC.setIncludeOccupyingCommander(false));
  store.dispatch(outsideCityWallsBattleAC.setExcessDefenders(
      message.excessDefenders));
  store.dispatch(gameBoardViewAC.setUncloseableModalView(
      UNCLOSEABLE_MODAL_VIEW.OUTSIDE_CITY_WALLS_BATTLE_PREP));
  store.dispatch(outsideCityWallsBattleAC.setCityTilePosition(
      message.cityTilePosition));
  store.dispatch(outsideCityWallsBattleAC.setAttackingArmyTilePosition(
      message.attackingArmyTilePosition));
};

const cityStateUpdated = (message) => {
  const state = store.getState();
  const updatedGameBoard = [...state.gameBoardView.gameBoard];
  updatedGameBoard[message.cityTilePosition]
      .city = message.updatedCity;
  store.dispatch(gameBoardViewAC.setGameBoard(updatedGameBoard));
};

const unitRecruitmentQueueUpdated = (message) => {
  const state = store.getState();
  const updatedGameBoard = [...state.gameBoardView.gameBoard];
  updatedGameBoard[message.cityTilePosition]
      .city.currentRecruitmentQueue = message.updatedUnitRecruitmentQueue;
  updatedGameBoard[message.cityTilePosition]
      .city.currentConcurrentUnitTrainingCount = message.newConcurrentUnitTrainingCount;
  updatedGameBoard[message.cityTilePosition].city.currentConstructionProject = message.newCurrentConstructionProject;
  store.dispatch(gameBoardViewAC.setGameBoard(updatedGameBoard));
};

const unassignedUnitsUpdated = (message) => {
  const state = store.getState();
  const updatedGameBoard = [...state.gameBoardView.gameBoard];
  updatedGameBoard[message.cityTilePosition]
      .city.unassignedUnits = message.updatedUnassignedUnits;
  store.dispatch(gameBoardViewAC.setGameBoard(updatedGameBoard));
};

const armyAndUnassignedUnitsUpdated = (message) => {
  const state = store.getState();
  const updatedGameBoard = [...state.gameBoardView.gameBoard];
  updatedGameBoard[message.tilePosition]
      .city.unassignedUnits = message.updatedUnassignedUnits;
  updatedGameBoard[message.tilePosition]
      .army.units = message.updatedArmyUnits;
  store.dispatch(gameBoardViewAC.setGameBoard(updatedGameBoard));
};

const armySpawnedFromCity = (message) => {
  const state = store.getState();
  const updatedGameBoard = [...state.gameBoardView.gameBoard];
  updatedGameBoard[message.updatedCityTile.tilePosition] =
     message.updatedCityTile;
  store.dispatch(gameBoardViewAC.setGameBoard(updatedGameBoard));
  store.dispatch(cityMenuAC.setCityMenuSupplementalView(
      CITY_MENU_SUPPLEMENTAL_VIEWS.NONE));
  store.dispatch(cityMenuAC.setCityMenuTab(CITY_MENU_TAB.PRODUCTION));
  store.dispatch(cityMenuAC.setCityMenuSupplementalData({}));
  store.dispatch(gameAC.setAdvancedDetailsModalView(
      ADVANCED_DETAILS_MODAL_VIEW.NONE));
  if (message.updatedPlayer.playerNumber === PLAYER.ONE) {
    store.dispatch(gamePlayerAC.setPlayerOne(message.updatedPlayer));
  } else {
    store.dispatch(gamePlayerAC.setPlayerTwo(message.updatedPlayer));
  }
};

const timeWarpPerformed = (message) => {
  const state = store.getState();
  const updatedGameBoard = [...state.gameBoardView.gameBoard];
  updatedGameBoard[message.updatedCityTile.tilePosition] =
    message.updatedCityTile;
  if (message.updatedPlayer.playerNumber === PLAYER.ONE) {
    store.dispatch(gamePlayerAC.setPlayerOne(message.updatedPlayer));
  } else if (message.updatedPlayer.playerNumber === PLAYER.TWO) {
    store.dispatch(gamePlayerAC.setPlayerTwo(message.updatedPlayer));
  }
  store.dispatch(gameBoardViewAC.setGameBoard(updatedGameBoard));
};

export default messageHandler;
