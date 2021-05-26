import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import BrowseLobbies from './BrowseLobbies/BrowseLobbies';
import InLobby from './InLobby/InLobby';
import flattenObject from '../Utilities/flattenObjectValuesToArray';
import LOBBY_VIEWS from '../Utilities/lobbyViews';
import axios from 'axios';
import './Lobby.css';
import apiEndpoints from '../Utilities/apiEndpoints';

/**
 *
 * Lobby JSDocs
 *
 * @param {Object} props passed from the parent component
 * @return {JSX} to render
 */
const Lobby = (props) => {
  const createLobbyHandler = (e) => {
    e.preventDefault();
    try {
      const createLobbyRequest = {
        username: props.ownUsername,
      };
      const response = axios.post(
          apiEndpoints.lobbyController + '/create-im', createLobbyRequest);
      console.log(response);
    } catch (error) {
      console.log('Failed to create a new lobby!');
      console.log(error);
    }
  };

  return (
    <React.Fragment>
      <Container>
        <Row>
          <Col xs={9}>
            <h1>Lobby Component</h1>
          </Col>
          <Col xs={3} className="center-text">
            <h3>{props.ownUsername}</h3>
          </Col>
        </Row>
        <Row>
          {props.lobbyView ===
          LOBBY_VIEWS.BROWSE_LOBBIES_VIEW ? <BrowseLobbies/> :
          props.lobbyView ===
          LOBBY_VIEWS.IN_LOBBY_VIEW ? <InLobby/> :
          <p>Oops! An invalid lobby view was provided!</p>}
        </Row>
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
    lobbyView: state.lobby.lobbyView,
  };
};

Lobby.propTypes = {
  ownUsername: PropTypes.string,
  lobbyView: PropTypes.oneOf(flattenObject(LOBBY_VIEWS)),
};

export default connect(mapStateToProps)(Lobby);
