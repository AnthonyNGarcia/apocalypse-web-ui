import React, {useEffect, useState, useRef} from 'react';
import {connect} from 'react-redux';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import apiEndpoints from '../../Utilities/apiEndpoints';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import PropTypes from 'prop-types';
import LOBBY_VIEWS from '../../Utilities/lobbyViews';
import lobbyAC from '../../../Redux/actionCreators/lobbyActionCreators';
import './BrowseLobbies.css';

/**
 *
 * BrowseLobbies JSDocs
 *
 * @param {Object} props passed from the parent component
 * @return {JSX} to render
 */
const BrowseLobbies = (props) => {
  const [currentLobbies, setCurrentLobbies] = useState([]);
  const isMounted = useRef(null);

  const navigateToInLobby = async (lobbyData) => {
    if (isMounted.current) {
      await props.savePlayerOneUsername(lobbyData.playerOneUsername);
    }
    if (isMounted.current) {
      await props.savePlayerTwoUsername(lobbyData.playerTwoUsername);
    }
    if (isMounted.current) {
      await props.saveLobbyId(lobbyData.lobbyId);
    }
    if (isMounted.current) {
      props.updateLobbyViewToInLobby();
    }
  };

  const createLobbyHandler = async (e) => {
    e.preventDefault();
    try {
      const createLobbyRequest = {
        creator: {
          username: props.ownUsername,
          userId: props.ownUserId,
        },
      };
      const serverResponse = await axios.post(
          apiEndpoints.lobbyController + '/create', createLobbyRequest);
      await navigateToInLobby(serverResponse.data);
    } catch (error) {
      console.warn('Failed to create a new lobby!');
      console.warn(error);
    }
  };

  const joinLobbyHandler = async (e, lobbyId) => {
    e.preventDefault();
    try {
      const joinLobbyRequest = {
        lobbyId: lobbyId,
        playerUsername: props.ownUsername,
      };
      const response = await axios.patch(
          apiEndpoints.lobbyController + '/join', joinLobbyRequest);
      await navigateToInLobby(response.data);
    } catch (error) {
      console.warn('Failed to join Lobby ' + lobbyId + '!');
      console.warn(error);
    }
  };

  const refreshLobbiesHandler = async (e) => {
    e.preventDefault();
    const serverResponse = await
    axios.get(apiEndpoints.lobbyController + '/all');
    if (isMounted.current) {
      setCurrentLobbies(serverResponse.data);
    }
  };

  useEffect(async () => {
    isMounted.current = true;
    const fetchCurrentLobbies = async () => {
      const serverResponse = await
      axios.get(apiEndpoints.lobbyController + '/all');
      if (isMounted.current) {
        setCurrentLobbies(serverResponse.data);
      }
    };
    fetchCurrentLobbies();
    return () => {
      isMounted.current = false;
    };
  }, []);

  return (
    <React.Fragment>
      <Container>
        <Row>
          <Col xs={8}>
            <h3>Browsing Lobbies Component</h3>
          </Col>
          <Col xs={4}>
            <Button variant="primary"
              onClick={(e) => refreshLobbiesHandler(e)}>Refresh</Button>
          </Col>
        </Row>
        {currentLobbies && currentLobbies.length > 0 ?
          currentLobbies.map((lobby) =>
            <Row key={lobby.lobbyId}>
              <Col>
                <p>{lobby.playerOneUsername + '\'s Lobby' +
                (lobby.playerTwoUsername ? ' (2/2)' : ' (1/2)')}</p>
              </Col>
              <Col>
                <Button variant="primary"
                  disabled={lobby.playerTwoUsername && lobby.playerTwoUsername}
                  onClick={(e) => joinLobbyHandler(e, lobby.lobbyId)}>
                  Join</Button>
              </Col>
            </Row>) : <p>No lobbies available to join. Try creating one!</p>}
        <Row>
          <Button variant="primary"
            onClick={createLobbyHandler}>Create Lobby</Button>
        </Row>
      </Container>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    ownUsername: state.general.ownUsername,
    ownUserId: state.general.ownUserId,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateLobbyViewToInLobby: () => dispatch(
        lobbyAC.setLobbyView(LOBBY_VIEWS.IN_LOBBY_VIEW)),
    saveLobbyId: (lobbyId) => dispatch(
        lobbyAC.setLobbyId(lobbyId)),
    savePlayerOneUsername: (username) => dispatch(
        lobbyAC.setPlayerOneUsername(username)),
    savePlayerTwoUsername: (username) => dispatch(
        lobbyAC.setPlayerTwoUsername(username)),
  };
};

BrowseLobbies.propTypes = {
  ownUsername: PropTypes.string,
  ownUserId: PropTypes.string,
  saveLobbyId: PropTypes.func,
  savePlayerOneUsername: PropTypes.func,
  savePlayerTwoUsername: PropTypes.func,
  updateLobbyViewToInLobby: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(BrowseLobbies);
