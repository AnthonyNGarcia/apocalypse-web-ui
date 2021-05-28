import React, {useEffect, useState} from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import ArmyActionButton from './ArmyActionButton/ArmyActionButton';
import PLAYER from '../../../../Utilities/playerEnums';
import './ArmyActionBar.css';

/**
 *
 * ArmyActionBar JSDocs
 *
 * @param {Object} props passed from the parent component
 * @return {JSX} to render
 */
const ArmyActionBar = (props) => {
  const [computedData, setComputedData] = useState();
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
        setComputedData(props.actionBarData);
      } else {
        setComputedData(null);
      }
    } else {
      setComputedData(null);
    }
  }, [props.actionBarData, props.selectedTilePosition,
    props.gameBoard, props.isOwnTurn]);
  return (
    <React.Fragment>
      <h5>Army Action Bar</h5>
      <Container>
        <Row>
          {computedData && computedData.length > 0 ?
            computedData.map((action, index) => (
              <Col key={action.name + '-' + index}>
                <ArmyActionButton actionData={action} tapped={armyIsTapped}/>
              </Col>
            )) : null}
        </Row>
        <Row>{props.actionBarTooltip}</Row>
      </Container>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    actionBarTooltip: state.game.actionBarTooltip,
    actionBarData: state.game.actionBarData,
    selectedTilePosition: state.game.selectedTilePosition,
    gameBoard: state.game.gameBoard,
    playerOne: state.game.playerOne,
    playerTwo: state.game.playerTwo,
    ownUsername: state.general.ownUsername,
    isOwnTurn: state.game.isOwnTurn,
  };
};

ArmyActionBar.propTypes = {
  actionBarTooltip: PropTypes.string,
  actionBarData: PropTypes.array,
  selectedTilePosition: PropTypes.number,
  gameBoard: PropTypes.any,
  playerOne: PropTypes.any,
  playerTwo: PropTypes.any,
  ownUsername: PropTypes.string,
  isOwnTurn: PropTypes.bool,
};

export default connect(mapStateToProps)(ArmyActionBar);

