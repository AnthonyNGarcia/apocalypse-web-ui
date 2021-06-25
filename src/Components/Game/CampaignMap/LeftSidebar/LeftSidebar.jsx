import React from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import './LeftSidebar.css';
import PLAYER from '../../../Utilities/playerEnums';

/**
 *
 * LeftSidebar JSDocs
 *
 * @param {Object} props passed from the parent component
 * @return {JSX} to render
 */
const LeftSidebar = (props) => {
  return (
    <React.Fragment>
      <Container>
        <Row>
          <Button disabled>Researching Javelineers</Button>
        </Row>
        <Row>
          <p>Astridium Collected: {
            props.ownPlayerData.astridiumCollected}</p>
        </Row>
        <Row>
          <p>Current Astridium: {props.ownPlayerData.currentAstridium}</p>
        </Row>
        <Row>
          <h4>Scoreboard</h4>
          <h5>{props.playerOne.username} - 420</h5>
          <h5>{props.playerTwo.username} - 69</h5>
        </Row>
      </Container>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    playerOne: state.gamePlayer.playerOne,
    playerTwo: state.gamePlayer.playerTwo,
    ownPlayerData: state.gamePlayer.ownPlayerNumber === PLAYER.ONE ?
      state.gamePlayer.playerOne : state.gamePlayer.playerTwo,
  };
};

LeftSidebar.propTypes = {
  playerOne: PropTypes.any,
  playerTwo: PropTypes.any,
  ownPlayerData: PropTypes.any,
};

export default connect(mapStateToProps)(LeftSidebar);

