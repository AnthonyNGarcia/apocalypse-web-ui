import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import {Scrollbars} from 'react-custom-scrollbars-2';
import ArmyUnitItem from './ArmyUnitItem/ArmyUnitItem';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import apiEndpoints from '../../../../../Utilities/apiEndpoints';
import gameBoardViewAC from
  '../../../../../../Redux/actionCreators/gameBoardViewActionCreators';
import './ArmyInfoPanel.css';
import tileHighlightManager from
  '../../../../../Utilities/tileHighlightManager';

/**
 *
 * ArmyInfoPanel JSDocs
 *
 * @param {Object} props passed from the parent component
 * @return {JSX} to render
 */
const ArmyInfoPanel = (props) => {
  const [selectedArmyMaxSize, setSelectedArmyMaxSize] = useState(0);

  useEffect(() => {
    if (props.selectedArmy) {
      let armySize = 0;
      if (props.selectedArmy.owner === props.playerOne.playerNumber) {
        armySize += props.playerOne.currentBaseArmySize;
      } else if (props.selectedArmy.owner === props.playerTwo.playerNumber) {
        armySize += props.playerTwo.currentBaseArmySize;
      } else {
        console.log('Oops! Couldn\'t map this army to a player!');
      }
      armySize += props.selectedArmy.commander.armySizeBonus;
      setSelectedArmyMaxSize(armySize);
    }
  }, [props]);

  const fortifyArmyHandler = (e) => {
    e.preventDefault();
    props.updateIsMovingArmy(false);
    tileHighlightManager.unhighlightAllTiles();
    try {
      const armyActionRequest = {
        gameId: props.gameId,
        primaryArmyActionType: 'FORTIFY',
        primaryTilePosition: props.selectedTilePosition,
        secondaryTilePosition: -1,
      };
      axios.post(
          apiEndpoints.armyController + '/action', armyActionRequest);
    } catch (error) {
      console.warn('Failed to fortify army!');
      console.warn(error);
    }
  };

  if (props.selectedArmy) {
    return (
      <React.Fragment>
        <Container>
          {props.ownPlayerNumber === props.selectedArmy.owner ?
        <React.Fragment>
          <Row className='center-text'>
            <h2>{props.selectedArmy.commander.commanderInfo.displayName}</h2>
          </Row>
          <Row className='center-text'>
            <h5>Level {props.selectedArmy.commander.level}</h5>
          </Row>
          <Row className='center-text'>
            <h5>Units: {props.selectedArmy.units.length}/
              {selectedArmyMaxSize}</h5>
          </Row>
          <Row>
            <Scrollbars style={{height: '30vh', width: '95%'}}>
              {props.selectedArmy.units &&
                props.selectedArmy.units.length > 0 ?
                props.selectedArmy.units
                    .map((unit, index) => unit ? (
                      <React.Fragment key={index}>
                        <ArmyUnitItem
                          key={index +
                            unit.unitType}
                          unit={{...unit}}
                          discardingIndex={index}/>
                      </React.Fragment>
                    ) : null) : (
                  <React.Fragment>
                    This commander is not leading any units.
                  </React.Fragment>
                )}
            </Scrollbars>
          </Row>
          <Row>
            <Button
              disabled={props.selectedArmy.remainingActions <= 0 ||
                !props.isOwnTurn}
              onClick={fortifyArmyHandler}>
            Fortify
            </Button>
          </Row>
        </React.Fragment> :
        <React.Fragment>
          <Row className='center-text enemy-entity'>
            <h2>{props.selectedArmy.commander.commanderInfo.displayName}</h2>
          </Row>
          <Row className='center-text enemy-entity'>
            <h5>Level {props.selectedArmy.commander.level}</h5>
          </Row>
          <Row className='center-text enemy-entity'>
            <h5>Units: {props.selectedArmy.units.length}/
              {selectedArmyMaxSize}</h5>
          </Row>
          <Row className='center-text enemy-entity'>
            This is an enemy Army.
          </Row>
        </React.Fragment>}
        </Container>
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
    isOwnTurn: state.gamePlayer.ownPlayerNumber ===
      state.gamePlayer.playerWhoseTurnItIs,
    allUnitsConstants: state.game.gameConstants.allUnits,
    playerOne: state.gamePlayer.playerOne,
    playerTwo: state.gamePlayer.playerTwo,
    ownPlayerNumber: state.gamePlayer.ownPlayerNumber,
    selectedArmy: state.gameBoardView.gameBoard[
        state.gameBoardView.selectedTilePosition].army,
    gameId: state.game.gameId,
    selectedTilePosition: state.gameBoardView.selectedTilePosition,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateIsMovingArmy: (isMovingArmy) => dispatch(
        gameBoardViewAC.setIsMovingArmy(isMovingArmy)),
  };
};

ArmyInfoPanel.propTypes = {
  isOwnTurn: PropTypes.bool,
  mainPanelData: PropTypes.any,
  allUnitsConstants: PropTypes.any,
  playerOne: PropTypes.any,
  playerTwo: PropTypes.any,
  ownPlayerNumber: PropTypes.string,
  selectedArmy: PropTypes.any,
  gameId: PropTypes.string,
  selectedTilePosition: PropTypes.number,
  updateIsMovingArmy: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(ArmyInfoPanel);
