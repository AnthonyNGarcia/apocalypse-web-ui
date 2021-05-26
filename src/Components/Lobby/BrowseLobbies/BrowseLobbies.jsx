import React, {useEffect, useState} from 'react';
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

  const navigateToInLobby = async (lobbyData) => {
    console.log(lobbyData);
    props.savePlayerOneUsername(lobbyData.playerOneUsername);
    props.savePlayerTwoUsername(lobbyData.playerTwoUsername);
    props.saveLobbyId(lobbyData.lobbyId);
    props.updateLobbyViewToInLobby();
  };

  const createLobbyHandler = async (e) => {
    e.preventDefault();
    try {
      const createLobbyRequest = {
        creatorUsername: props.ownUsername,
      };
      console.log(createLobbyRequest);
      const serverResponse = await axios.post(
          apiEndpoints.lobbyController + '/in-memory', createLobbyRequest);
      console.log(serverResponse);
      await navigateToInLobby(serverResponse.data);
    } catch (error) {
      console.log('Failed to create a new lobby!');
      console.log(error);
    }
  };

  const joinLobbyHandler = async (e, lobbyId) => {
    e.preventDefault();
    try {
      const joinLobbyRequest = {
        lobbyId: lobbyId,
        joinerUsername: props.ownUsername,
      };
      console.log(joinLobbyRequest);
      const response = await axios.patch(
          apiEndpoints.lobbyController + '/in-memory-join', joinLobbyRequest);
      console.log(response);
      await navigateToInLobby(response.data);
    } catch (error) {
      console.log('Failed to join Lobby ' + lobbyId + '!');
      console.log(error);
    }
  };

  useEffect(async () => {
    const fetchCurrentLobbies = async () => {
      const serverResponse = await
      axios.get(apiEndpoints.lobbyController + '/in-memory');
      console.log(serverResponse);
      console.log(serverResponse.data);
      return serverResponse.data;
    };

    setCurrentLobbies(await fetchCurrentLobbies());
  }, []);

  return (
    <React.Fragment>
      <h3>Browsing Lobbies Component</h3>
      <Container>
        {currentLobbies.length > 0 ? currentLobbies.map((lobby) =>
          <Row key={lobby.lobbyId}>
            <Col>
              <p>{lobby.playerOneUsername + '\'s Lobby'}</p>
            </Col>
            <Col>
              <Button variant="primary"
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
  saveLobbyId: PropTypes.func,
  savePlayerOneUsername: PropTypes.func,
  savePlayerTwoUsername: PropTypes.func,
  updateLobbyViewToInLobby: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(BrowseLobbies);
