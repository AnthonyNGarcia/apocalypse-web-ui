import React, {useEffect, useState} from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import './LeftSidebar.css';

/**
 *
 * LeftSidebar JSDocs
 *
 * @param {Object} props passed from the parent component
 * @return {JSX} to render
 */
const LeftSidebar = (props) => {
  const [ownPlayer, setOwnPlayer] = useState(null);

  useEffect(() => {
    if (props.playerOne.username === props.ownUsername) {
      setOwnPlayer(props.playerOne);
    } else {
      setOwnPlayer(props.playerTwo);
    }
  }, [props.playerOne, props.playerTwo]);
  return (
    <React.Fragment>
      <Container>
        <Row>
          <Button disabled>Researching Javelineers</Button>
        </Row>
        <Row>
          <h5>You are playing as {ownPlayer ? ownPlayer.faction : null}</h5>
        </Row>
        <Row>
          <p>You can currently support {ownPlayer ?
            ownPlayer.maxArmies : null} armies.</p>
        </Row>
        <Row>
          <p>You can field armies as large as {ownPlayer ?
            ownPlayer.maxArmySize: null} units.</p>
        </Row>
      </Container>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    ownUsername: state.general.ownUsername,
    playerOne: state.game.playerOne,
    playerTwo: state.game.playerTwo,
  };
};

LeftSidebar.propTypes = {
  ownUsername: PropTypes.string,
  playerOne: PropTypes.any,
  playerTwo: PropTypes.any,
};

export default connect(mapStateToProps)(LeftSidebar);

