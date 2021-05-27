import React from 'react';
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
          {props.mainPanelData.maxArmySize}
        </Row>
        <Row>
          <p>{props.mainPanelData.units.map((unit, index) => (
            <React.Fragment
              key={index + '-' + unit.unitType}>
              {unit.unitType + ' '}
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
  };
};

ArmyInfoPanel.propTypes = {
  mainPanelData: PropTypes.any,
};

export default connect(mapStateToProps)(ArmyInfoPanel);
