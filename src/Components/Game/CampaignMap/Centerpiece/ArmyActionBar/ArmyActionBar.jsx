import React, {useEffect, useState} from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import PLAYER from '../../../../Utilities/playerEnums';
import ArmyActionButton from './ArmyActionButton/ArmyActionButton';
import './ArmyActionBar.css';
import ARMY_ACTION_REQUEST_TYPES from
  '../../../../Utilities/armyActionRequestTypes';

const fortifyActionData = {
  enum: ARMY_ACTION_REQUEST_TYPES.FORTIFY,
  name: 'Fortify',
  tooltip: 'Fortify in place for +25% Block now, ' +
    'and heal 50% max health next turn.',
};

/**
 *
 * ArmyActionBar JSDocs
 *
 * @param {Object} props passed from the parent component
 * @return {JSX} to render
 */
const ArmyActionBar = (props) => {
  const [armyIsTapped, setArmyIsTapped] = useState(false);

  useEffect(() => {
    if (props.selectedTilePosition >= 0) {
      const tileData = props.gameBoard[props.selectedTilePosition];
      if ((tileData.army) && ((props.ownUsername === props.playerOne.username &&
        tileData.army.owner === PLAYER.ONE) ||
        (props.ownUsername === props.playerTwo.username &&
          tileData.army.owner === PLAYER.TWO))) {
        setArmyIsTapped(tileData.army.remainingActions <= 0 ||
            !props.isOwnTurn);
      } else {
        setComputedData(null);
      }
    } else {
      setComputedData(null);
    }
  }, [props.selectedTilePosition,
    props.gameBoard, props.isOwnTurn]);

  return (
    <React.Fragment>
      <h5>Action Bar</h5>
      <Container>
        <Row>
          <Col>
            <ArmyActionButton
              actionData={fortifyActionData} tapped={armyIsTapped}/>
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    selectedTilePosition: state.gameBoardView.selectedTilePosition,
    gameBoard: state.gameBoardView.gameBoard,
    playerOne: state.gamePlayer.playerOne,
    playerTwo: state.gamePlayer.playerTwo,
    ownUsername: state.general.ownUsername,
    isOwnTurn: state.gamePlayer.ownPlayerNumber ===
      state.gamePlayer.playerWhoseTurnItIs,
  };
};

ArmyActionBar.propTypes = {
  selectedTilePosition: PropTypes.number,
  gameBoard: PropTypes.any,
  playerOne: PropTypes.any,
  playerTwo: PropTypes.any,
  ownUsername: PropTypes.string,
  isOwnTurn: PropTypes.bool,
};

export default connect(mapStateToProps)(ArmyActionBar);

