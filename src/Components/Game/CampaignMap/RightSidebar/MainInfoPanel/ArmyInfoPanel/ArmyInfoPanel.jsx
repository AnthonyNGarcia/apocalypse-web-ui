import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
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
    let armySize = 0;
    if (props.mainPanelData.owner === props.playerOne.playerNumber) {
      armySize += props.playerOne.currentBaseArmySize;
    } else if (props.mainPanelData.owner === props.playerTwo.playerNumber) {
      armySize += props.playerTwo.currentBaseArmySize;
    } else {
      console.log('Oops! Couldn\'t map this army to a player!');
    }
    armySize += props.mainPanelData.commander.armySizeBonus;
    setSelectedArmyMaxSize(armySize);
  }, [props]);
  return (
    <React.Fragment>
      <Container>
        <Row className='center-text'>
          <footer>Commander {props.mainPanelData.commander.name}</footer>
        </Row>
        <Row className='center-text'>
          Level {props.mainPanelData.commander.level}
        </Row>
        <Row className='center-text'>
          Units: {props.mainPanelData.units.length}/
          {selectedArmyMaxSize}
        </Row>
        <Row>
          <p>{props.mainPanelData.units.map((unit, index) => (
            <React.Fragment
              key={index + '-' + unit.unitType}>
              {props.allUnitsConstants[unit.unitType].displayName +
              ( index < props.mainPanelData.units.length - 1 ? ', ' : '')}
            </React.Fragment>
          ))}</p>
        </Row>
      </Container>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    mainPanelData: state.game.mainPanelData,
    allUnitsConstants: state.game.gameConstants.allUnits,
    playerOne: state.game.playerOne,
    playerTwo: state.game.playerTwo,
  };
};

ArmyInfoPanel.propTypes = {
  mainPanelData: PropTypes.any,
  allUnitsConstants: PropTypes.any,
  playerOne: PropTypes.any,
  playerTwo: PropTypes.any,
};

export default connect(mapStateToProps)(ArmyInfoPanel);
