import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import {Scrollbars} from 'react-custom-scrollbars-2';
import ArmyUnitItem from './ArmyUnitItem/ArmyUnitItem';
import Spinner from 'react-bootstrap/Spinner';
import './ArmyInfoPanel.css';

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
  if (props.selectedArmy) {
    return (
      <React.Fragment>
        <Container>
          {props.ownPlayerNumber === props.selectedArmy.owner ?
        <React.Fragment>
          <Row className='center-text'>
            <h2>Commander {props.selectedArmy.commander.name}</h2>
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
        </React.Fragment> :
        <React.Fragment>
          <Row className='center-text enemy-entity'>
            <h2>Commander {props.selectedArmy.commander.name}</h2>
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
    allUnitsConstants: state.game.gameConstants.allUnits,
    playerOne: state.game.playerOne,
    playerTwo: state.game.playerTwo,
    ownPlayerNumber: state.game.ownPlayerNumber,
    selectedArmy: state.game.gameBoard[state.game.selectedTilePosition].army,
  };
};

ArmyInfoPanel.propTypes = {
  mainPanelData: PropTypes.any,
  allUnitsConstants: PropTypes.any,
  playerOne: PropTypes.any,
  playerTwo: PropTypes.any,
  ownPlayerNumber: PropTypes.string,
  selectedArmy: PropTypes.any,
};

export default connect(mapStateToProps)(ArmyInfoPanel);
