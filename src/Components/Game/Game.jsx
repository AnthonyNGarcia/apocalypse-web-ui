import React, {useRef} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import GAME_VIEWS from '../Utilities/gameViews';
import flattenObject from '../Utilities/flattenObjectValuesToArray';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import AbstractedWebsocket from '../Utilities/AbstractedWebsocket';
import CampaignMap from './CampaignMap/CampaignMap';
import MAIN_VIEWS from '../Utilities/mainViews';
import LOBBY_VIEWS from '../Utilities/lobbyViews';
import generalAC from '../../Redux/actionCreators/generalActionCreators';
import gameAC from '../../Redux/actionCreators/gameActionCreators';
import lobbyAC from '../../Redux/actionCreators/lobbyActionCreators';
import apiEndpoints from '../Utilities/apiEndpoints';
import axios from 'axios';
import {useBeforeunload} from 'react-beforeunload';
import WEBSOCKET_MESSAGE_TYPES from '../Utilities/websocketMessageTypes';
import BattleMap from './BattleMap/BattleMap';
import './Game.css';

/**
 *
 * Game JSDocs
 *
 * @param {Object} props passed from the parent component
 * @return {JSX} to render
 */
const Game = (props) => {
  const websocket = useRef(null);

  const gameCleanup = () => {
    try {
      const leaveRequest = {
        gameId: props.gameId,
        playerUsername: props.ownUsername,
      };
      axios.patch(
          apiEndpoints.gameController + '/in-memory-leave', leaveRequest);
    } catch (e) {
      console.warn('Oops! There was an error trying to leave the game!');
      console.warn(e);
    }
  };

  useBeforeunload(() => {
    gameCleanup();
  });

  const leaveGameHandler = (e) => {
    e.preventDefault();
    gameCleanup();
    navigateToBrowseLobbies();
  };

  const navigateToBrowseLobbies = () => {
    props.saveGameId(null);
    props.clearLobbyId();
    props.clearLobbyPlayerOneUsername();
    props.clearLobbyPlayerTwoUsername();
    props.updateLobbyViewToBrowseLobbies();
    props.updateMainView(MAIN_VIEWS.LOBBY_VIEW);
  };

  const navigateToBattleMap = async (battleData) => {
    await props.saveBattleData(battleData);
    await props.updateShowEnemyArmyInBattle(false);
    await props.updateOwnArmySubmitted(false);
    props.updateGameView(GAME_VIEWS.BATTLE_MAP_VIEW);
  };

  const handleConfigurationsComplete = async (battleData) => {
    await props.saveBattleData(battleData);
    props.updateShowEnemyArmyInBattle(true);
  };

  const navigateToCampaignMap = async (battleResults) => {
    const gameBoardWithArmiesUpdated = await JSON.parse(
        JSON.stringify(props.gameBoard));
    gameBoardWithArmiesUpdated[battleResults.attackingArmyStartingTilePosition]
        .army = null;
    gameBoardWithArmiesUpdated[battleResults.defendingArmyStartingTilePosition]
        .army = null;
    gameBoardWithArmiesUpdated[battleResults.attackingArmyEndingTilePosition]
        .army = battleResults.attackingArmy;
    gameBoardWithArmiesUpdated[battleResults.defendingArmyEndingTilePosition]
        .army = battleResults.defendingArmy;
    await props.updateGameBoard(gameBoardWithArmiesUpdated);
    await props.updateGameView(GAME_VIEWS.CAMPAIGN_MAP_VIEW);
  };

  const onReceiveMessage = (message) => {
    console.log(message);
    const messageType = message.body.messageType;
    switch (messageType) {
      case WEBSOCKET_MESSAGE_TYPES.PLAYER_LEFT_GAME:
        const playerUsername = message.body.leavingPlayerUsername;
        console.log('Player ' + playerUsername + ' has left! Closing game...');
        gameCleanup();
        navigateToBrowseLobbies();
        break;
      case WEBSOCKET_MESSAGE_TYPES.BATTLE_STARTED:
        console.log('A battle has started! Changing to battle view...');
        console.log(message.body);
        navigateToBattleMap(message.body.battleData);
        break;
      case WEBSOCKET_MESSAGE_TYPES.BATTLE_ENDED:
        console.log('A battle has ended! Changing to campaign view...');
        console.log(message.body);
        navigateToCampaignMap(message.body);
        break;
      case WEBSOCKET_MESSAGE_TYPES.CONFIGURATION_COMPLETE:
        console.log('Configuration complete! Revealing enemy army...');
        console.log(message.body);
        handleConfigurationsComplete(message.body.battleData);
        break;
      case WEBSOCKET_MESSAGE_TYPES.BATTLE_DATA_UPDATED:
        console.log('Received updated battle data from server! ' +
          'Updating local state...');
        props.saveBattleData(message.body.battleData);
        break;
      default:
        console.warn('Received unexpected websocket message for ' +
          'the general Game component!');
    }
  };

  const onDisconnect = () => {
    console.log('Disconnected from game websocket!');
    gameCleanup();
    navigateToBrowseLobbies();
  };

  return (
    <React.Fragment>
      <AbstractedWebsocket topics={['/game/' + props.gameId]}
        onReceiveMessage={onReceiveMessage} ref={websocket}
        onDisconnect={onDisconnect}/>
      <Container className='game-sizing'>
        <Row>
          {props.gameView === GAME_VIEWS.CAMPAIGN_MAP_VIEW ?
          <CampaignMap/> : props.gameView === GAME_VIEWS.BATTLE_MAP_VIEW ?
          <BattleMap/> :
          <p>Oops! An invalid game view was rendered!</p>}
        </Row>
        <Row>
          {props.gameView === GAME_VIEWS.CAMPAIGN_MAP_VIEW ? (
            <Button variant="primary" onClick={leaveGameHandler}>Leave</Button>
          ): null}
        </Row>
      </Container>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    gameView: state.game.gameView,
    gameId: state.game.gameId,
    ownUsername: state.general.ownUsername,
    gameBoard: state.game.gameBoard,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateMainView: (mainView) => dispatch(
        generalAC.setMainView(mainView)),
    updateLobbyViewToBrowseLobbies: () => dispatch(
        lobbyAC.setLobbyView(LOBBY_VIEWS.BROWSE_LOBBIES_VIEW)),
    clearPlayerOne: () => dispatch(
        gameAC.setPlayerOne(null)),
    clearPlayerTwo: () => dispatch(
        gameAC.setPlayerTwo(null)),
    saveGameId: (gameId) => dispatch(
        gameAC.setGameId(gameId)),
    clearLobbyPlayerOneUsername: () => dispatch(
        lobbyAC.setPlayerOneUsername(null)),
    clearLobbyPlayerTwoUsername: () => dispatch(
        lobbyAC.setPlayerTwoUsername(null)),
    clearLobbyId: () => dispatch(
        lobbyAC.setLobbyId(null)),
    updateGameView: (gameView) => dispatch(
        gameAC.setGameView(gameView)),
    updateGameBoard: (gameBoard) => dispatch(
        gameAC.setGameBoard(gameBoard)),
    saveBattleData: (battleData) => dispatch(
        gameAC.setBattleData(battleData)),
    updateShowEnemyArmyInBattle: (showEnemyArmyInBattle) => dispatch(
        gameAC.setShowEnemyArmyInBattle(showEnemyArmyInBattle)),
    updateOwnArmySubmitted: (ownArmySubmitted) => dispatch(
        gameAC.setOwnArmySubmitted(ownArmySubmitted)),
  };
};

Game.propTypes = {
  gameView: PropTypes.oneOf(flattenObject(GAME_VIEWS)),
  gameId: PropTypes.string,
  ownUsername: PropTypes.string,
  updateMainView: PropTypes.func,
  updateLobbyViewToBrowseLobbies: PropTypes.func,
  clearPlayerOne: PropTypes.func,
  clearPlayerTwo: PropTypes.func,
  clearLobbyPlayerOneUsername: PropTypes.func,
  clearLobbyPlayerTwoUsername: PropTypes.func,
  clearLobbyId: PropTypes.func,
  saveGameId: PropTypes.func,
  updateGameView: PropTypes.func,
  updateGameBoard: PropTypes.func,
  gameBoard: PropTypes.any,
  saveBattleData: PropTypes.func,
  updateShowEnemyArmyInBattle: PropTypes.func,
  updateOwnArmySubmitted: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(Game);
