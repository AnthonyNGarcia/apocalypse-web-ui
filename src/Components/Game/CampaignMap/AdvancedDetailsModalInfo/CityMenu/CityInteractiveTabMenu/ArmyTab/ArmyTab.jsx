import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {Scrollbars} from 'react-custom-scrollbars-2';
import UnassignedUnitItem from './UnassignedUnitItem/UnassignedUnitItem';
import CommanderUnitItem from './CommanderUnitItem/CommanderUnitItem';
import './ArmyTab.css';

/**
 *
 * ArmyTab JSDocs
 *
 * @param {Object} props passed from the parent component
 * @return {JSX} to render
 */
const ArmyTab = (props) => {
  return (
    <React.Fragment>
      {/* First col is for unassigned*/}
      <Col>
        {/* First row is the header */}
        <Row>
          <h5 style={{'margin': 'auto'}}>Unassigned Units</h5>
        </Row>
        {/* Second row is the scrollbar */}
        <Row>
          <Scrollbars style={{height: '30vh', width: '95%'}}>
            {props.selectedCity.unassignedUnits &&
              props.selectedCity.unassignedUnits.length > 0 ?
              props.selectedCity.unassignedUnits
                  .map((unit, index) => (
                    <React.Fragment key={index}>
                      <UnassignedUnitItem
                        key={index +
                          unit.unitType}
                        unit={{...unit}}/>
                    </React.Fragment>
                  )) : (
                <React.Fragment>
                  There are no unassigned units in this city.
                </React.Fragment>
              )}
          </Scrollbars>
        </Row>
      </Col>
      {/* Second col is for occupying Army */}
      <Col >
        {/* First row is the header for the Army */}
        <Row>
          <h5 style={{'margin': 'auto'}}>
            {props.selectedTile.army ?
              ('Commander ' + props.selectedTile.army.commander.name + ' L.' +
                props.selectedTile.army.commander.level) :
                ''}
          </h5>
        </Row>
        {/* Second row is recruitment queue */}
        <Row>
          <Scrollbars style={{height: '30vh', width: '95%'}}>
            {props.selectedTile.army &&
              props.selectedTile.army.units &&
              props.selectedTile.army.units.length > 0 ?
              props.selectedTile.army.units
                  .map((unit, index) => (
                    <React.Fragment key={index +
                    props.selectedTile.army.units.length}>
                      <CommanderUnitItem
                        key={index}
                        unit={{...unit}}
                        discardingIndex={index}/>
                    </React.Fragment>
                  )) : (
                <React.Fragment>
                  There are no assigned Units to a Commander in this City.
                </React.Fragment>
              )}
          </Scrollbars>
        </Row>
      </Col>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    selectedCity: state.game.gameBoard[state.game.selectedTilePosition].city,
    selectedTile: state.game.gameBoard[state.game.selectedTilePosition],
  };
};

ArmyTab.propTypes = {
  selectedCity: PropTypes.any,
  selectedTile: PropTypes.any,
};

export default connect(mapStateToProps)(ArmyTab);
