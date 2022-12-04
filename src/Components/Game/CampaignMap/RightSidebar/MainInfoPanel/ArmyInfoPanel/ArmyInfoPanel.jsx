import React, {useEffect, useState} from 'react';
// import useDeepCompareEffect from 'use-deep-compare-effect';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import {Scrollbars} from 'react-custom-scrollbars-2';
import ArmyUnitItem from './ArmyUnitItem/ArmyUnitItem';
import axios from 'axios';
import apiEndpoints from '../../../../../Utilities/apiEndpoints';
import gameBoardViewAC from
  '../../../../../../Redux/actionCreators/gameBoardViewActionCreators';
import tileHighlightManager from
  '../../../../../Utilities/tileHighlightManager';
import ASTRIDIUM_ABILITY_TYPE from
  '../../../../../Utilities/astridiumAbilityTypes';
import PLAYER from '../../../../../Utilities/playerEnums';
import './ArmyInfoPanel.css';
import getHeroUnitCount from '../../../../../Utilities/getHeroUnitCount';

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
    if (props.selectedArmy && !isEmpty(props.selectedArmy) &&
    props.selectedArmy.commander) {
      let armySize = 0;
      if (props.selectedArmy.owner === props.playerOne.playerNumber) {
        armySize += props.playerOne.currentBaseArmySize;
      } else if (props.selectedArmy.owner === props.playerTwo.playerNumber) {
        armySize += props.playerTwo.currentBaseArmySize;
      }
      armySize += props.selectedArmy.commander.armySizeBonus;
      setSelectedArmyMaxSize(armySize);
    }
  }, [props, props.selectedArmy]);

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

  const superchargeHandler = (e) => {
    e.preventDefault();
    try {
      const request = {
        gameId: props.gameId,
        playerPerformingAction: props.ownPlayerNumber,
        armyTilePosition: props.selectedTilePosition,
      };
      axios.post(apiEndpoints.armyController + '/supercharge', request);
    } catch (error) {
      console.warn('Error trying to supercharge!');
      console.warn(error);
    }
  };

  const isEmpty = (obj) => {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  };

  if (props.selectedArmy && !isEmpty(props.selectedArmy)) {
    return (
      <React.Fragment>
        {props.ownPlayerNumber === props.selectedArmy.owner ?
        <React.Fragment>
          {props.selectedArmy.commander ?
            (
              <React.Fragment>
                <Row className='center-text own-army-entity'>
                  <h2>{props.allCommanders[props.selectedArmy.commander
                      .commanderType].displayName}</h2>
                </Row>
                <Row className='center-text own-army-entity'>
                  <h5>Level {props.selectedArmy.commander.level}</h5>
                </Row>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Row className='center-text own-army-entity'>
                  <h2>No Commander Leads This Army</h2>
                </Row>
              </React.Fragment>
            )}

          <Row className='center-text own-army-entity'>
            <h5>Units: {props.selectedArmy.units.length}/
              {selectedArmyMaxSize} <span>
                <img
                  src={'unit_count.svg'}
                  alt=""
                  className={'hero-unit-icon'}
                /></span></h5>
          </Row>
          <Row className='center-text own-army-entity'>
            <h5>Legendary Units: {getHeroUnitCount(props.selectedArmy.units)}/
              {props.ownPlayerData.currentBaseTier3HeroUnitsSupported} <span>
                <img
                  src={'hero_unit_icon.svg'}
                  alt=""
                  className={'hero-unit-icon'}
                /></span></h5>
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
                          discardingIndex={index}
                          showRemoveUnit={true}/>
                      </React.Fragment>
                    ) : null) : (
                  <React.Fragment>
                    This commander is not leading any units.
                  </React.Fragment>
                )}
            </Scrollbars>
          </Row>
          <Row>
            <Col md={4}>
              <Button
                disabled={props.selectedArmy.remainingActions <= 0 ||
                !props.isOwnTurn}
                onClick={fortifyArmyHandler}>
                {props.selectedArmy.armyStance === 'NONE' ?
              'Fortify' : 'Entrench'}
              </Button>
            </Col>
            <Col md={8}>
              <OverlayTrigger
                key='supercharge-overlay'
                placement='bottom'
                trigger={['hover', 'focus']}
                overlay={
                  <Tooltip id='supercharge-tooltip'>
                    <strong>{props.supercharge.displayName}</strong> - {
                      props.supercharge.description}
                  </Tooltip>
                }>
                <Button variant="primary"
                  disabled={!props.isOwnTurn ||
                (props.ownPlayerData.currentAstridium <
                  props.supercharge.astridiumCost)}
                  onClick={superchargeHandler}>
                  <span>
                    {props.supercharge.displayName} ({
                      props.supercharge.astridiumCost} <img
                      src={'ASTEROID.svg'}
                      alt=""
                      className={'tiny-asteroid-icon-army'}/>)
                  </span>
                </Button>
              </OverlayTrigger>
            </Col>
          </Row>
        </React.Fragment> :
        <React.Fragment>
          {props.selectedArmy.commander ?
            (
              <React.Fragment>
                <Row className='center-text enemy-entity'>
                  <h2>{props.allCommanders[props.selectedArmy.commander
                      .commanderType].displayName}</h2>
                </Row>
                <Row className='center-text enemy-entity'>
                  <h5>Level {props.selectedArmy.commander.level}</h5>
                </Row>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Row className='center-text enemy-entity'>
                  <h2>No Commander Leads This Army</h2>
                </Row>
              </React.Fragment>
            )}
          <Row className='center-text enemy-entity'>
            <h5>Units: {props.selectedArmy.units ?
            props.selectedArmy.units.length : 0}/
            {selectedArmyMaxSize}</h5>
          </Row>
          <Row className='center-text enemy-entity'>
            This is an enemy Army.
          </Row>
        </React.Fragment>}
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
    playerOne: state.gamePlayer.playerOne,
    playerTwo: state.gamePlayer.playerTwo,
    ownPlayerNumber: state.gamePlayer.ownPlayerNumber,
    selectedArmy: {...state.gameBoardView.gameBoard[
        state.gameBoardView.selectedTilePosition].army},
    gameId: state.game.gameId,
    selectedTilePosition: state.gameBoardView.selectedTilePosition,
    ownPlayerData: state.gamePlayer.ownPlayerNumber ===
    PLAYER.ONE ? state.gamePlayer.playerOne : state.gamePlayer.playerTwo,
    supercharge: state.game.gameConstants.allAstridiumAbilities[
        ASTRIDIUM_ABILITY_TYPE.SUPERCHARGE],
    allCommanders: state.game.gameConstants.allCommanders,
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
  mainPanelData: PropTypes.object,
  playerOne: PropTypes.object,
  playerTwo: PropTypes.object,
  ownPlayerNumber: PropTypes.string,
  selectedArmy: PropTypes.object,
  gameId: PropTypes.string,
  selectedTilePosition: PropTypes.number,
  updateIsMovingArmy: PropTypes.func,
  supercharge: PropTypes.any,
  ownPlayerData: PropTypes.object,
  allCommanders: PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(ArmyInfoPanel);
