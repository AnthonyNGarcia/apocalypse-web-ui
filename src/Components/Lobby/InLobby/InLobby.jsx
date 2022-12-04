import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import apiEndpoints from '../../Utilities/apiEndpoints';
import {useBeforeunload} from 'react-beforeunload';
import InLobbyPlayer from './InLobbyPlayer/InLobbyPlayer';
import './InLobby.css';

/**
 *
 * InLobby JSDocs
 *
 * @param {Object} props passed from the parent component
 * @return {JSX} to render
 */
const InLobby = (props) => {
  const lobbyCleanup = () => {
    if (props.lobbyId) {
      try {
        const leaveRequest = {
          lobbyId: props.lobbyId,
          inLobbyPlayer: props.ownUserId === props.lobbyPlayerOne.userId ?
          props.lobbyPlayerOne : props.lobbyPlayerTwo,
        };
        axios.patch(
            apiEndpoints.lobbyController + '/leave', leaveRequest);
      } catch (e) {
        console.warn('Oops! There was an error trying to leave the lobby!');
        console.warn(e);
      }
    }
  };

  useBeforeunload(() => {
    lobbyCleanup();
  });

  const leaveLobbyHandler = async (e) => {
    e.preventDefault();
    lobbyCleanup();
  };

  const startGameHandler = async (e) => {
    e.preventDefault();
    try {
      if (props.gameIdBeingRestored && props.gameIdBeingRestored != 'NONE') {
        console.log('Restoring game with gameId: ' + props.gameIdBeingRestored);
        const gameDataToRestore = props.savedGames[props.gameIdBeingRestored];
        const startGameRequest = {
          lobbyId: props.lobbyId,
          lobbyPlayerOne: props.lobbyPlayerOne,
          lobbyPlayerTwo: props.lobbyPlayerTwo,
          gameData: gameDataToRestore,
        };
        console.log(JSON.stringify(startGameRequest));
        await axios.post(
            apiEndpoints.gameController + '/restore', startGameRequest);
      } else {
        console.log('Creating new game!');
        const startGameRequest = {
          lobbyId: props.lobbyId,
          lobbyPlayerOne: props.lobbyPlayerOne,
          lobbyPlayerTwo: props.lobbyPlayerTwo,
        };
        await axios.post(
            apiEndpoints.gameController + '/start', startGameRequest);
      }
    } catch (e) {
      console.warn('Oops! There was an error trying to start the game!');
      console.warn(e);
    }
  };

  return (
    <React.Fragment>
      <Container>
        <Row className='center-text'
          style={{marginTop: '2vh'}}>
          <h4>Lobby Id: {props.lobbyId}</h4>
        </Row>
        <Row style={{marginTop: '2vh'}} noGutters>
          <Col>
            {props.lobbyPlayerOne ? (
            <React.Fragment>
              <InLobbyPlayer lobbyPlayer={props.lobbyPlayerOne}/>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Row noGutters className='center-text'>
                <p>(Empty Slot)</p>
              </Row>
            </React.Fragment>
          )}
          </Col>
          <Col>
            {props.lobbyPlayerTwo ? (
            <React.Fragment>
              <InLobbyPlayer lobbyPlayer={props.lobbyPlayerTwo}/>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Row noGutters className='center-text'>
                <p>(Empty Slot)</p>
              </Row>
            </React.Fragment>
          )}
          </Col>
        </Row>
        <Row style={{marginTop: '10vh'}}>
          <Col style={{textAlign: 'center'}}>
            <Button variant="primary" onClick={leaveLobbyHandler}>
              {props.lobbyPlayerOne.userId ===
              props.ownUserId ? 'Close Lobby' : 'Leave Lobby'}
            </Button>
          </Col>
        </Row>
        <Row style={{marginTop: '2vh'}}>
          <Col style={{textAlign: 'center'}}>
            {props.ownUserId === props.lobbyPlayerOne.userId ?
            <Button variant="primary"
              disabled={props.lobbyPlayerOne === null ||
                props.lobbyPlayerTwo === null}
              onClick={startGameHandler}>Start Game</Button> :
            <Button variant="primary"
              disabled={true}>Waiting for Host To Start Game</Button>}
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    ownUserId: state.general.ownUserId,
    lobbyId: state.lobby.lobbyId,
    lobbyPlayerOne: state.lobby.lobbyPlayerOne,
    lobbyPlayerTwo: state.lobby.lobbyPlayerTwo,
    gameIdBeingRestored: state.general.gameIdBeingRestored,
    savedGames: state.general.savedGames,
  };
};

InLobby.propTypes = {
  ownUserId: PropTypes.string,
  lobbyId: PropTypes.string,
  lobbyPlayerOne: PropTypes.any,
  lobbyPlayerTwo: PropTypes.any,
  gameIdBeingRestored: PropTypes.string,
  savedGames: PropTypes.object,
};

export default connect(mapStateToProps)(InLobby);
