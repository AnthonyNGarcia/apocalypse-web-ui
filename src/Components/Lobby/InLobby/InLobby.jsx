import React, {useRef} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import AbstractedWebsocket from '../../Utilities/AbstractedWebsocket';
import LOBBY_VIEWS from '../../Utilities/lobbyViews';
import lobbyAC from '../../../Redux/actionCreators/lobbyActionCreators';
import './InLobby.css';

/**
 *
 * InLobby JSDocs
 *
 * @param {Object} props passed from the parent component
 * @return {JSX} to render
 */
const InLobby = (props) => {
  const websocket = useRef(null);

  const onReceiveMessage = (message) => {
    console.log(message);
    const playerOneUsername = message.body.playerOneUsername;
    if (playerOneUsername !== props.playerOneUsername) {
      props.savePlayerOneUsername(playerOneUsername);
    }
    const playerTwoUsername = message.body.playerTwoUsername;
    if (playerTwoUsername !== props.playerTwoUsername) {
      props.savePlayerTwoUsername(playerTwoUsername);
    }
  };

  return (
    <React.Fragment>
      <AbstractedWebsocket topics={['/lobby/' + props.lobbyId]}
        onReceiveMessage={onReceiveMessage} ref={websocket}/>
      <h3>In Lobby Component</h3>
      <Container>
        <Row>
          <h4>Lobby Id: {props.lobbyId}</h4>
        </Row>
        <Row>
          <Col>
            <h4>Player One: {props.playerOneUsername}</h4>
          </Col>
          <Col>
            <h4>Player Two: {props.playerTwoUsername}</h4>
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    lobbyId: state.lobby.lobbyId,
    playerOneUsername: state.lobby.playerOneUsername,
    playerTwoUsername: state.lobby.playerTwoUsername,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateLobbyViewToBrowseLobbies: () => dispatch(
        lobbyAC.setLobbyView(LOBBY_VIEWS.BROWSE_LOBBIES_VIEW)),
    savePlayerOneUsername: (username) => dispatch(
        lobbyAC.setPlayerOneUsername(username)),
    savePlayerTwoUsername: (username) => dispatch(
        lobbyAC.setPlayerTwoUsername(username)),
  };
};

InLobby.propTypes = {
  lobbyId: PropTypes.string,
  playerOneUsername: PropTypes.string,
  playerTwoUsername: PropTypes.string,
  updateLobbyViewToBrowseLobbies: PropTypes.func,
  savePlayerOneUsername: PropTypes.func,
  savePlayerTwoUsername: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(InLobby);
