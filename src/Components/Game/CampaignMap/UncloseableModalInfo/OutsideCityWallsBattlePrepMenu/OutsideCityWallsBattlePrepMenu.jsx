import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/esm/Spinner';
import Button from 'react-bootstrap/Button';
import {Scrollbars} from 'react-custom-scrollbars-2';
import Form from 'react-bootstrap/Form';
import outsideCityWallsBattleAC from
  '../../../../../Redux/actionCreators/outsideCityWallsBattleActionCreators';
import UnassignedUnitItem from './UnassignedUnitItem/UnassignedUnitItem';
import OccupyingArmyUnitItem from
  './OccupyingArmyUnitItem/OccupyingArmyUnitItem';
import SallyOutForceUnitItem from
  './SallyOutForceUnitItem/SallyOutForceUnitItem';
import AttackingForceUnitItem from
  './AttackingForceUnitItem/AttackingForceUnitItem';
import PLAYER from '../../../../Utilities/playerEnums';
import apiEndpoints from '../../../../Utilities/apiEndpoints';
import axios from 'axios';
import './OutsideCityWallsBattlePrepMenu.css';

/**
 *
 * OutsideCityWallsBattlePrepMenu JSDocs
 *
 * @param {Object} props passed from the parent component
 * @return {JSX} to render
 */
const OutsideCityWallsBattlePrepMenu = (props) => {
  const stayInsideHandler = (e) => {
    e.preventDefault();
    try {
      const request = {
        gameId: props.gameId,
        attackingArmyTilePosition: props.attackingArmyTilePosition,
        cityTilePosition: props.cityTilePosition,
      };
      axios.post(apiEndpoints.cityController + '/let-enemy-scorch', request);
    } catch (e) {
      console.warn(e);
      console.warn('There was error trying to sally out!');
    }
  };

  const toggleCommanderLeadingSally = (e) => {
    props.updateIncludeOccupyingCommander(e.target.checked);
  };

  const sallyOutHandler = (e) => {
    e.preventDefault();
    try {
      const request = {
        gameId: props.gameId,
        sallyOutArmyUnits: props.sallyOutForces.units,
        updatedOccupyingArmyUnits: props.occupyingArmy.units,
        updatedUnassignedUnits: props.cityUnderAttack.unassignedUnits,
        attackingArmyTilePosition: props.attackingArmyTilePosition,
        cityTilePosition: props.cityTilePosition,
        includeOccupyingCommanderInSally: props.includeOccupyingCommander,
      };
      axios.post(apiEndpoints.battleController + '/sally-outside-city-walls',
          request);
    } catch (e) {
      console.warn(e);
      console.warn('There was error trying to sally out!');
    }
  };

  if (props.cityUnderAttack && props.attackingArmy) {
    return (
      <React.Fragment>
        {/* First Row  is for attacker and note */}
        <Row noGutters>
          <div className='outside-city-walls-header-container'>
            <h3 className='outside-city-walls-title'>
              <span className={
                props.attackingArmy.owner === props.ownPlayerNumber ?
                'outside-city-walls-own-commander-name' :
                'outside-city-walls-enemy-commander-name'}>{
                  props.attackingArmy.commander.commanderInfo
                      .displayName}</span> is attacking <span
                className={
                props.cityUnderAttack.owner === props.ownPlayerNumber ?
                'outside-city-walls-own-city-name' :
                'outside-city-walls-enemy-city-name'}>
                {props.cityUnderAttack.name}</span>!!</h3>
            <p className='outside-city-walls-description'>
              {'If left uncontested, they will scorch the earth around the ' +
            'City, crippling it severely!'}</p>
          </div>
        </Row>
        {/* Second row renders for City owner if they have excess defenders */}
        {props.cityUnderAttack.owner === props.ownPlayerNumber &&
        props.excessDefenders > 0 ? (
          <Row>
            <p className='outside-city-walls-must-sally-description'>
              {'Because you have too many units in this City for a Courtyard ' +
              ' Battle, you MUST Sally Out with at least ' +
              props.excessDefenders + ' more unit(s)!'}
            </p>
          </Row>
        ) : null}
        {/* One big row to start making columns */}
        <Row noGutters>
          {/* First column contains the Attacking Army Unit List*/}
          <Col md={4}>
            <h3 className='outside-city-walls-forces-title'>
              Attacking Force
            </h3>
            <Scrollbars style={{height: '30vh', width: '95%'}}>
              {props.attackingArmy.units &&
                props.attackingArmy.units.length > 0 ?
                props.attackingArmy.units
                    .map((unit, index) => unit ? (
                      <React.Fragment key={index}>
                        <AttackingForceUnitItem unit={{...unit}}/>
                      </React.Fragment>
                    ) : null) : (
                  <React.Fragment>
                    This commander is not leading any units.
                  </React.Fragment>
                )}
            </Scrollbars>
          </Col>
          {/* Second Column renders differentially if attacker or defender */}
          <Col>
            {props.cityUnderAttack.owner === props.ownPlayerNumber ?
            (
              <React.Fragment>
                {/* New Row to Split deeper Columns */}
                <Row noGutters>
                  {/* First Col Contains the Sally Out Forces */}
                  <Col>
                    <div className=
                      'outside-city-walls-sally-out-force-container'>
                      <h3 className='outside-city-walls-forces-title'>
                    Sally Out Force ({props.sallyOutForces.units.length}/{
                          props.maxArmySize})
                      </h3>
                      {props.occupyingArmy && props.occupyingArmy.commander ?
                      (<Form.Check type="checkbox"
                        label={'Have ' + props.occupyingArmy.commander
                            .commanderInfo.displayName +
                            ' Lead the Sally Out Force'}
                        onChange={toggleCommanderLeadingSally}
                        checked={props.includeOccupyingCommander}/>) :
                      (<Form.Check type="checkbox"
                        label={'No Commander Available to ' +
                          'Lead the Sally Out Force'}
                        disabled={true}
                        checked={false}/>)}
                      <Scrollbars style={{height: '30vh', width: '95%'}}>
                        {props.sallyOutForces.units &&
                      props.sallyOutForces.units.length > 0 ?
                      props.sallyOutForces.units
                          .map((unit, index) => unit ? (
                            <React.Fragment key={index}>
                              <SallyOutForceUnitItem
                                unit={{...unit}}
                                unitIndex={index}/>
                            </React.Fragment>
                          ) : null) : (
                        <React.Fragment>
                          There are no units assigned to sally out.
                        </React.Fragment>
                      )}
                      </Scrollbars>
                    </div>
                  </Col>
                  {/* Second Col Contains the Available City Forces */}
                  <Col>
                    <div className=
                      'outside-city-walls-available-units-container'>
                      {/* First Row contains the unassigned units */}
                      <h3 className='outside-city-walls-forces-title'>
                        Unassigned Units in City ({
                          props.cityUnderAttack.unassignedUnits.length}/{
                          props.maxArmySize})
                      </h3>
                      <Row noGutters>
                        <Scrollbars style={{height: '30vh', width: '95%'}}>
                          {props.cityUnderAttack.unassignedUnits &&
                        props.cityUnderAttack.unassignedUnits.length > 0 ?
                        props.cityUnderAttack.unassignedUnits
                            .map((unit, index) => unit ? (
                              <React.Fragment key={index}>
                                <UnassignedUnitItem
                                  unit={{...unit}}
                                  unitIndex={index}/>
                              </React.Fragment>
                            ) : null) : (
                          <React.Fragment>
                            There are no unassigned units in this City.
                          </React.Fragment>
                        )}
                        </Scrollbars>
                      </Row>
                      {/* Second Row contains the occupying army units */}
                      {props.occupyingArmy ? (
                        <React.Fragment>
                          <h3 className='outside-city-walls-forces-title'>
                            {props.occupyingArmy.commander
                                .commanderInfo.displayName} ({
                              props.occupyingArmy.units.length}/{
                              props.maxArmySize})
                          </h3>
                          <Row noGutters>
                            <Scrollbars style={{height: '30vh', width: '95%'}}>
                              {props.occupyingArmy.units &&
                        props.occupyingArmy.units.length > 0 ?
                        props.occupyingArmy.units
                            .map((unit, index) => unit ? (
                              <React.Fragment key={index}>
                                <OccupyingArmyUnitItem
                                  unit={{...unit}}
                                  unitIndex={index}/>
                              </React.Fragment>
                            ) : null) : (
                          <React.Fragment>
                            {'There are no units assigned to this Commander.'}
                          </React.Fragment>
                        )}
                            </Scrollbars>
                          </Row>
                        </React.Fragment>
                      ) : (
                        <React.Fragment>
                          <p>
                            There is no Commander in this City.
                          </p>
                        </React.Fragment>
                      )}
                    </div>
                  </Col>
                </Row>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <p className='outside-city-walls-attacker-waiting-description'>
                  {'Waiting for the enemy to organize some troops to sally ' +
                  'out and protect the City in a battle outside the City ' +
                  ' Walls...' }
                </p>
              </React.Fragment>
            )}
          </Col>
        </Row>
        {/* Row for Buttons, for Defender */}
        {props.cityUnderAttack.owner === props.ownPlayerNumber ? (
          <React.Fragment>
            <div style={{textAlign: 'center', paddingTop: '1vh'}}>
              <Row noGutters>
                {/* First Col is for Sally Out Button */}
                <Col>
                  <Button disabled={!props.sallyOutForces ||
                  !props.sallyOutForces.units ||
                  props.sallyOutForces.units.length <= 0}
                  onClick={sallyOutHandler}>
                        Sally Out!
                  </Button>
                </Col>
                <Col>
                  <Button disabled={props.excessDefenders > 0 ||
                  props.sallyOutForces.units.length > 0} variant='danger'
                  onClick={stayInsideHandler}>
                    {'Stay Inside and Let the Enemy Scorch ' +
                        props.cityUnderAttack.name}...
                  </Button>
                </Col>
              </Row>
            </div>
          </React.Fragment>
        ) : null}
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
    ownPlayerNumber: state.gamePlayer.ownPlayerNumber,
    cityUnderAttack: state.outsideCityWallsBattle.cityUnderAttack,
    attackingArmy: state.outsideCityWallsBattle.attackingArmy,
    sallyOutForces: state.outsideCityWallsBattle.sallyOutForces,
    occupyingArmy: state.outsideCityWallsBattle.occupyingArmy,
    includeOccupyingCommander: state.outsideCityWallsBattle
        .includeOccupyingCommander,
    excessDefenders: state.outsideCityWallsBattle.excessDefenders,
    maxArmySize: state.gamePlayer.ownPlayerNumber === PLAYER.ONE ?
      state.gamePlayer.playerOne.currentBaseArmySize :
      state.gamePlayer.playerTwo.currentBaseArmySize,
    gameId: state.game.gameId,
    attackingArmyTilePosition: state.outsideCityWallsBattle
        .attackingArmyTilePosition,
    cityTilePosition: state.outsideCityWallsBattle.cityTilePosition,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateIncludeOccupyingCommander: (includeOccupyingCommander) => dispatch(
        outsideCityWallsBattleAC.setIncludeOccupyingCommander(
            includeOccupyingCommander)),
  };
};

OutsideCityWallsBattlePrepMenu.propTypes = {
  ownPlayerNumber: PropTypes.string,
  cityUnderAttack: PropTypes.object,
  attackingArmy: PropTypes.object,
  sallyOutForces: PropTypes.object,
  occupyingArmy: PropTypes.object,
  includeOccupyingCommander: PropTypes.bool,
  excessDefenders: PropTypes.number,
  updateIncludeOccupyingCommander: PropTypes.func,
  clearOutsideCityWallsBattleReducer: PropTypes.func,
  maxArmySize: PropTypes.number,
  gameId: PropTypes.string,
  attackingArmyTilePosition: PropTypes.number,
  cityTilePosition: PropTypes.number,
};

export default connect(mapStateToProps, mapDispatchToProps)(
    OutsideCityWallsBattlePrepMenu);
