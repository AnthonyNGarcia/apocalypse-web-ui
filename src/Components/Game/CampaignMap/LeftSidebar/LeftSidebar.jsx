import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import './LeftSidebar.css';
import PLAYER from '../../../Utilities/playerEnums';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import apiEndpoints from '../../../Utilities/apiEndpoints';

/**
 *
 * LeftSidebar JSDocs
 *
 * @param {Object} props passed from the parent component
 * @return {JSX} to render
 */
const LeftSidebar = (props) => {
  const forfeitGameHandler = (e) => {
    e.preventDefault();
    const leaveGameRequest = {
      gameId: props.gameId,
      inGamePlayer: {
        userId: props.ownUserId,
      },
    };
    axios.patch(apiEndpoints.gameController + '/leave', leaveGameRequest);
  };

  const saveGameHandler = async (e) => {
    e.preventDefault();
    const response = await axios.get(apiEndpoints.gameController + '/game-save/' + props.gameId);
    const newSavedGames = {...props.savedGames};
    newSavedGames[props.gameId] = response.data.gameData;
    localStorage.setItem('SAVED_GAMES', JSON.stringify(newSavedGames));
  };

  return (
    <div className='left-sidebar-sizer'>
      <div className='astridium-count-container'>
        <Row noGutters className='left-sidebar-menu-buttons'>
          <Col md={6}>
            <Button
              variant='danger'
              disabled={!props.isOwnTurn}
              onClick={forfeitGameHandler}
            >
            Forfeit Game
            </Button>
          </Col>
          <Col md={6}>
            <Button
              variant='primary'
              disabled={!props.isOwnTurn}
              onClick={saveGameHandler}
            >
            Save Game
            </Button>
          </Col>
        </Row>
        <Row noGutters>
          <p>Astridium Collected: {
            props.ownPlayerData.astridiumCollected}</p>
        </Row>
        <Row noGutters>
          <p>Current Astridium: {props.ownPlayerData.currentAstridium}</p>
        </Row>
      </div>
      <div className='scoreboard-container'>
        <Row noGutters style={{display: 'block'}}>
          <h3 className='scoreboard-title'>Scoreboard</h3>
          {props.playerOne.score >= props.playerTwo.score ? (
            <React.Fragment>
              <h4 className={props.ownPlayerNumber === PLAYER.ONE ?
              'leading own-scoreboard-label' : 'leading other-scoreboard-label'}
              >{props.playerOne.username} - {props.playerOne.score}</h4>
              <h4 className={props.ownPlayerNumber === PLAYER.TWO ?
              'trailing own-scoreboard-label' :
              'trailing other-scoreboard-label'}
              >{props.playerTwo.username} - {props.playerTwo.score}</h4>
            </React.Fragment>
          ) : (
             <React.Fragment>
               <h4 className={props.ownPlayerNumber === PLAYER.TWO ?
              'leading own-scoreboard-label' : 'leading other-scoreboard-label'}
               >{props.playerTwo.username} - {props.playerTwo.score}</h4>
               <h4 className={props.ownPlayerNumber === PLAYER.ONE ?
              'trailing own-scoreboard-label' :
              'trailing other-scoreboard-label'}
               >{props.playerOne.username} - {props.playerOne.score}</h4>
             </React.Fragment>
          )}
        </Row>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    playerOne: state.gamePlayer.playerOne,
    playerTwo: state.gamePlayer.playerTwo,
    ownPlayerData: state.gamePlayer.ownPlayerNumber === PLAYER.ONE ?
      state.gamePlayer.playerOne : state.gamePlayer.playerTwo,
    ownPlayerNumber: state.gamePlayer.ownPlayerNumber,
    isOwnTurn: state.gamePlayer.ownPlayerNumber ===
      state.gamePlayer.playerWhoseTurnItIs,
    gameId: state.game.gameId,
    ownUserId: state.general.ownUserId,
    savedGames: state.general.savedGames,
  };
};

LeftSidebar.propTypes = {
  playerOne: PropTypes.object,
  playerTwo: PropTypes.object,
  ownPlayerData: PropTypes.object,
  ownPlayerNumber: PropTypes.string,
  isOwnTurn: PropTypes.bool,
  gameId: PropTypes.string,
  ownUserId: PropTypes.string,
  savedGames: PropTypes.object,
};

export default connect(mapStateToProps)(LeftSidebar);

