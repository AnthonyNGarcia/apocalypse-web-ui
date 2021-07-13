import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/esm/Spinner';
import Button from 'react-bootstrap/Button';
import battleViewAC from
  '../../../../../Redux/actionCreators/battleViewActionCreators';
import chatAC from '../../../../../Redux/actionCreators/chatActionCreators';
import cityCourtyardBattleAC from
  '../../../../../Redux/actionCreators/cityCourtyardBattleActionCreators';
import cityMenuAC from
  '../../../../../Redux/actionCreators/cityMenuActionCreators';
import cityWallsBattleAC from
  '../../../../../Redux/actionCreators/cityWallsBattleActionCreators';
import gameAC from '../../../../../Redux/actionCreators/gameActionCreators';
import gameBoardViewAC from
  '../../../../../Redux/actionCreators/gameBoardViewActionCreators';
import gamePlayerAC from
  '../../../../../Redux/actionCreators/gamePlayerActionCreators';
import generalAC from
  '../../../../../Redux/actionCreators/generalActionCreators';
import lobbyAC from
  '../../../../../Redux/actionCreators/lobbyActionCreators';
import outsideCityWallsBattleAC from
  '../../../../../Redux/actionCreators/outsideCityWallsBattleActionCreators';
import PLAYER from '../../../../Utilities/playerEnums';
import FACTIONS from '../../../../Utilities/factions';
import PlayerDataSection from './PlayerDataSection/PlayerDataSection';
import './PlayerWonGameModal.css';

/**
 *
 * PlayerWonGameModal JSDocs
 *
 * @param {Object} props passed from the parent component
 * @return {JSX} to render
 */
const PlayerWonGameModal = (props) => {
  const leaveGameHandler = (e) => {
    e.preventDefault();
    props.clearBattleViewReducer();
    props.clearChatReducerExceptGlobalMessages();
    props.clearCityCourtyardBattleReducer();
    props.clearCityMenuReducer();
    props.clearCityWallsBattleReducer();
    props.clearGameReducer();
    props.clearGameBoardViewReducer();
    props.clearGamePlayerReducer();
    props.clearGeneralReducerExceptUserData();
    props.clearLobbyReducer();
    props.clearOutsideCityWallsBattleReducer();
  };

  if (props.winningPlayer && props.winningPlayerData &&
    props.defeatedPlayerData) {
    return (
      <React.Fragment>
        {props.winningPlayer === props.ownPlayerNumber ?
        (
          <React.Fragment>
            <Row noGutters>
              <h1 style={{margin: 'auto'}}>Victory!</h1>
            </Row>
            <Row noGutters>
              <h5>{props.ownPlayerData.factionType === FACTIONS.HUMANS.enum ?
              'Through plasma and steel, you have defeated the enemy! They ' +
              'were simply no match for your swift and superior technology, ' +
              'your smooth military prowess, and your sharp instinct in the ' +
              'heat of battle. You have established a safe haven for your ' +
              'people on this planet- but more importantly, you have created ' +
              'an awe-inspiring legacy of pure military genius and tactical ' +
              'leadership that will deter any possible future threats for ' +
              'generations to come.' :
              'Through monstrous might and terror, you have slaughtered the ' +
              'enemy! Despite all their best efforts, your pathetic foe ' +
              'stood no chance against the hideous creatures you have ' +
              'somehow managed to rally together under one cause- and ' +
              'with unparalleled cunning, no less! The genocide that has ' +
              'taken place here will leave the rivers running red with ' +
              'blood for years. Your most loyal subjects will be provided ' +
              'the luxury to indulge themselves with these tainted waters ' +
              'with great vigor, so that thay may reminisce on the horrific ' +
              'bloodshed and brutality that ravaged this land.'}
              </h5>
            </Row>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Row noGutters>
              <h1 style={{margin: 'auto'}}>Defeat!</h1>
            </Row>
            <Row noGutters>
              <h5>{props.ownPlayerData.factionType === FACTIONS.HUMANS.enum ?
              'Tragedy! Despite your unrelenting will and devotion to ' +
              'cause, your vicious foe has managed to get the better of your ' +
              'troops and destroy their homes. Your people have been cruelly ' +
              'slaughtered this day, but you have escaped with a select few. ' +
              'While this has been a clear setback that will haunt your ' +
              'people for generations, time will heal all wounds. After all, ' +
              'defeat is temporary- permanent only through despair. You ' +
              'musn\'t allow your fallen comrades here today to have lost ' +
              'their lives in vain. Rise again from the ashes like a ' +
              'flaming phoenix and reclaim the honor of your people!':
              'Disaster! Despite your terrifying cunning and the best ' +
              'efforts of your most nightmarish subjects, your opponent has ' +
              'found a way to undercut your cause and burn all of your ' +
              'nests. Fate has provided you one blessing, at least, with a ' +
              'hive queen having escaped and still loyal to your cause. ' +
              'Although grandiose genetic history and evolution was ' +
              'eradicated this day, life always finds a way to recover. ' +
              'After all, defeat is temporary- permanent only through ' +
              'despair. Your loyal subjects will go the ends of the earth ' +
              'for you- don\'t keep them waiting for long!'}
              </h5>
            </Row>
          </React.Fragment>
        )}
        {/* Second section contains winner icon and the player data */}
        <Row noGutters style={{marginTop: '4vh'}}>
          <Col md={4}>
            {props.winningPlayerData.factionType === FACTIONS.HUMANS.enum ?
            (<React.Fragment>
              <img
                src={'HUMAN_ARMY.svg'}
                alt=""
                className='heximage army-icon'
              />
            </React.Fragment>) :
            (<React.Fragment>
              <img
                src={'INSECT_ARMY.svg'}
                alt=""
                className='heximage army-icon'
              />
            </React.Fragment>)}
          </Col>
          <Col md={8}>
            {/* First row is for the game data summary data/headers */}
            <Row noGutters>
              <h3>{props.winningPlayerData.username} Was Victorious After {
                props.gameRound} Rounds</h3>
            </Row>
            {/* Second row is for the player data*/}
            <Row noGutters>
              <Col>
                <PlayerDataSection playerData={props.winningPlayerData}/>
              </Col>
              <Col>
                <PlayerDataSection playerData={props.defeatedPlayerData}/>
              </Col>
            </Row>
          </Col>
        </Row>
        {/* Last Row contains buttons */}
        <Row noGutters>
          <Button variant='success'
            style={{margin: 'auto'}}
            onClick={leaveGameHandler}>
            Leave Game
          </Button>
        </Row>
      </React.Fragment>
    );
  } else {
    return (
      <React.Fragment>
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </React.Fragment>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    ownPlayerNumber: state.gamePlayer.ownPlayerNumber,
    winningPlayer: state.gamePlayer.winningPlayer,
    winningPlayerData: state.gamePlayer.winningPlayer === PLAYER.ONE ?
      state.gamePlayer.playerOne : state.gamePlayer.playerTwo,
    defeatedPlayerData: state.gamePlayer.winningPlayer === PLAYER.ONE ?
      state.gamePlayer.playerTwo : state.gamePlayer.playerOne,
    playerOne: state.gamePlayer.playerOne,
    playerTwo: state.gamePlayer.playerTwo,
    ownPlayerData: state.gamePlayer.ownPlayerNumber === PLAYER.ONE ?
      state.gamePlayer.playerOne : state.gamePlayer.playerTwo,
    gameRound: state.game.gameRound,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    clearBattleViewReducer: () => dispatch(
        battleViewAC.clearBattleViewReducer()),
    clearChatReducerExceptGlobalMessages: () => dispatch(
        chatAC.clearChatReducerExceptGlobalMessags()),
    clearCityCourtyardBattleReducer: () => dispatch(
        cityCourtyardBattleAC.clearCityCourtyardBattleReducer()),
    clearCityMenuReducer: () => dispatch(
        cityMenuAC.clearCityMenuReducer()),
    clearCityWallsBattleReducer: () => dispatch(
        cityWallsBattleAC.clearCityWallsBattleReducer()),
    clearGameReducer: () => dispatch(
        gameAC.clearGameReducer()),
    clearGameBoardViewReducer: () => dispatch(
        gameBoardViewAC.clearGameBoardViewReducer()),
    clearGamePlayerReducer: () => dispatch(
        gamePlayerAC.clearGamePlayerReducer()),
    clearGeneralReducerExceptUserData: () => dispatch(
        generalAC.clearGeneralReducerExceptUserData()),
    clearLobbyReducer: () => dispatch(
        lobbyAC.clearLobbyReducer()),
    clearOutsideCityWallsBattleReducer: () => dispatch(
        outsideCityWallsBattleAC.clearOutsideCityWallsBattleReducer()),
  };
};

PlayerWonGameModal.propTypes = {
  ownPlayerNumber: PropTypes.string,
  winningPlayer: PropTypes.string,
  winningPlayerData: PropTypes.object,
  playerOne: PropTypes.object,
  playerTwo: PropTypes.object,
  ownPlayerData: PropTypes.object,
  gameRound: PropTypes.number,
  clearBattleViewReducer: PropTypes.func,
  clearChatReducerExceptGlobalMessages: PropTypes.func,
  clearCityCourtyardBattleReducer: PropTypes.func,
  clearCityMenuReducer: PropTypes.func,
  clearCityWallsBattleReducer: PropTypes.func,
  clearGameReducer: PropTypes.func,
  clearGameBoardViewReducer: PropTypes.func,
  clearGamePlayerReducer: PropTypes.func,
  clearGeneralReducerExceptUserData: PropTypes.func,
  clearLobbyReducer: PropTypes.func,
  clearOutsideCityWallsBattleReducer: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(
    PlayerWonGameModal);
