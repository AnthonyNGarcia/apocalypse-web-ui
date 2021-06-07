import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {Scrollbars} from 'react-custom-scrollbars-2';
import UnassignedUnitItem from './UnassignedUnitItem/UnassignedUnitItem';
import CommanderUnitItem from './CommanderUnitItem/CommanderUnitItem';
import PLAYER from '../../../../../../Utilities/playerEnums';
import './ArmyTab.css';

/**
 *
 * ArmyTab JSDocs
 *
 * @param {Object} props passed from the parent component
 * @return {JSX} to render
 */
const ArmyTab = (props) => {
  const [unitPopLabel, setUnitPopLabel] = useState('');

  useEffect(() => {
    const currentPopCount = props.selectedCity.unassignedUnits.length +
      props.selectedCity.currentRecruitmentQueue.length;
    setUnitPopLabel('' + currentPopCount + '/' +
      props.ownPlayerData.currentBaseArmySize);
  }, [props]);
  return (
    <React.Fragment>
      {/* First col is for unassigned*/}
      <Col>
        {/* First row is the header */}
        <Row>
          <h5 style={{'margin': 'auto'}}>Unassigned Units (
            {unitPopLabel} <span><img
              src={'unit_count.svg'}
              alt=""
              className={'tiny-hammer-icon'}
            /></span>)</h5>
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
                        unit={{...unit}}
                        discardingIndex={index}/>
                    </React.Fragment>
                  )) : (
                <React.Fragment>
                  There are no unassigned units in this city.
                </React.Fragment>
              )}
            {props.selectedCity.currentRecruitmentQueue.length > 0 ?
              'An additional ' + props.selectedCity
                  .currentRecruitmentQueue.length +
            ' unit(s) in training account for the total population ' +
            'space in use.': ''}
          </Scrollbars>
        </Row>
      </Col>
      {/* Second col is for occupying Army */}
      <Col >
        {/* First row is the header for the Army */}
        <Row>
          <h5 style={{'margin': 'auto'}}>
            {props.selectedTile.army ?
              <span>{'Commander ' + props.selectedTile.army.commander.name +
              ' L.' +
                props.selectedTile.army.commander.level + ' (' +
                props.selectedTile.army.units.length + '/' +
                props.ownPlayerData.currentBaseArmySize
              } <span><img
                src={'unit_count.svg'}
                alt=""
                className={'tiny-hammer-icon'}
              /></span>)</span> : null
            }
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
    ownPlayerData: state.game.ownPlayerNumber === PLAYER.ONE ?
      state.game.playerOne : state.game.playerTwo,
  };
};

ArmyTab.propTypes = {
  selectedCity: PropTypes.any,
  selectedTile: PropTypes.any,
  ownPlayerData: PropTypes.any,
};

export default connect(mapStateToProps)(ArmyTab);
