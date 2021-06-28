import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import Spinner from 'react-bootstrap/Spinner';
import axios from 'axios';
import apiEndpoints from '../../../Utilities/apiEndpoints';
import FACTIONS from '../../../Utilities/factions';
import './InLobbyPlayer.css';

/**
 *
 * InLobbyPlayer JSDocs
 *
 * @param {Object} props passed from the parent component
 * @return {JSX} to render
 */
const InLobbyPlayer = (props) => {
  const changeFactionTypeHandler = (e, factionType) => {
    e.preventDefault();
    const updatedLobbyPlayer = {...props.lobbyPlayer};
    updatedLobbyPlayer.factionType = factionType;

    try {
      const request = {
        lobbyId: props.lobbyId,
        inLobbyPlayer: updatedLobbyPlayer,
      };
      axios.put(
          apiEndpoints.lobbyController + '/update-player', request);
    } catch (e) {
      console.warn('Oops! There was an error trying to update a lobby player!');
      console.warn(e);
    }
  };

  if (props.lobbyPlayer) {
    return (
      <React.Fragment>
        <Row noGutters className='center-text'>
          <h4 className={props.lobbyPlayer.userId ===
                  props.ownUserId ? 'own-player-title' : 'enemy-player-title'}>
            {props.lobbyPlayer.username}</h4>
        </Row>
        <Row noGutters className='center-text'>
          <Col style={{textAlign: 'right', marginRight: '0.5vw'}}>
            <h4>Faction: </h4>
          </Col>
          <Col>
            {props.lobbyPlayer.userId === props.ownUserId ? (
                  <React.Fragment>
                    <Dropdown>
                      <Dropdown.Toggle variant='success'
                        id="player-two-faction-dropdown">
                        {props.lobbyPlayer.factionType ===
                FACTIONS.HUMANS.enum ? FACTIONS.HUMANS.displayName :
                      props.lobbyPlayer.factionType ===
                FACTIONS.INSECTS.enum ? FACTIONS.INSECTS.displayName :
                'Unknown Faction Type'}
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item
                          onClick={(e) =>
                            changeFactionTypeHandler(
                                e, FACTIONS.HUMANS.enum)}>
                    Humans</Dropdown.Item>
                        <Dropdown.Item
                          onClick={(e) =>
                            changeFactionTypeHandler(
                                e, FACTIONS.INSECTS.enum)}>
                    Insects</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <Button disabled variant='danger'>
                      {props.lobbyPlayer.factionType ===
                FACTIONS.HUMANS.enum ? FACTIONS.HUMANS.displayName :
                      props.lobbyPlayer.factionType ===
                FACTIONS.INSECTS.enum ? FACTIONS.INSECTS.displayName :
                'Unknown Faction Type'}
                    </Button>
                  </React.Fragment>
                )}
          </Col>
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
    ownUserId: state.general.ownUserId,
    lobbyId: state.lobby.lobbyId,
  };
};

InLobbyPlayer.propTypes = {
  ownUserId: PropTypes.string,
  lobbyId: PropTypes.string,
  lobbyPlayer: PropTypes.any,
};

export default connect(mapStateToProps)(InLobbyPlayer);
