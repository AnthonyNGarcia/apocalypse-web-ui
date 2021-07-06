import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/esm/Spinner';
import Button from 'react-bootstrap/Button';
import {Scrollbars} from 'react-custom-scrollbars-2';
// eslint-disable-next-line max-len
import AttackingForceUnitItem from '../../UncloseableModalInfo/OutsideCityWallsBattlePrepMenu/AttackingForceUnitItem/AttackingForceUnitItem';
import apiEndpoints from '../../../../Utilities/apiEndpoints';
import axios from 'axios';
import ADVANCED_DETAILS_MODAL_VIEW from
  '../../../../Utilities/advancedDetailsModalViews';
import cityCourtyardBattleAC from
  '../../../../../Redux/actionCreators/cityCourtyardBattleActionCreators';
import gameAC from '../../../../../Redux/actionCreators/gameActionCreators';
import './AttackCityCourtyardConfirmationDialog.css';

/**
 *
 * AttackCityCourtyardConfirmationDialog JSDocs
 *
 * @param {Object} props passed from the parent component
 * @return {JSX} to render
 */
const AttackCityCourtyardConfirmationDialog = (props) => {
  const attackCityCourtyardHandler = (e) => {
    e.preventDefault();
    try {
      const request = {
        gameId: props.gameId,
        attackingArmyTilePosition: props.attackingArmyTilePosition,
        cityTilePosition: props.cityTile.tilePosition,
      };
      axios.post(apiEndpoints.battleController + '/attack-city-courtyard',
          request);
    } catch (e) {
      console.warn(e);
      console.warn('Oops! There was an error trying to attack the City ' +
        'Courtyard!');
    }
  };

  const backOffHandler = (e) => {
    e.preventDefault();
    props.updateAdvancedDetailsModalView(ADVANCED_DETAILS_MODAL_VIEW.NONE);
    props.clearCityCourtyardBattleReducer();
  };

  if (props.cityTile.city && props.attackingArmy) {
    return (
      <React.Fragment>
        {/* First Row  is for attacker and note */}
        <Row noGutters>
          <div className='city-courtyard-header-container'>
            <h3 className='city-courtyard-title'>
              <span className='city-courtyard-own-commander-name'>{
                props.attackingArmy.commander.commanderInfo
                    .displayName}</span> is attacking <span
                className='city-courtyard-enemy-city-name'>
                {props.cityTile.city.name}</span>!!</h3>
            <p className='city-courtyard-description'>
              {'The outskirts of this pathetic City have been Scorched, and ' +
              'their Walls in shambles! Only these final Defenders stand in ' +
              'our way from capturing this City. Should we proceed and storm ' +
              'the City Courtyard?'}</p>
          </div>
        </Row>
        {/* One big row to start making columns */}
        <Row noGutters>
          {/* First column contains the Attacking Army Unit List*/}
          <Col md={4}>
            <h3 className='city-courtyard-forces-title'>
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
          {/* Second column contains the City Garrison Unit List*/}
          <Col md={4}>
            <h3 className='city-courtyard-forces-title'>
              Final Defenders
            </h3>
            <Scrollbars style={{height: '30vh', width: '95%'}}>
              {props.cityTile.army.units &&
                props.cityTile.army.units.length > 0 ?
                props.cityTile.army.units
                    .map((unit, index) => unit ? (
                      <React.Fragment key={index}>
                        <AttackingForceUnitItem unit={{...unit}}/>
                      </React.Fragment>
                    ) : null) : (
                  <React.Fragment>
                    This City has no Defending Units.
                  </React.Fragment>
                )}
            </Scrollbars>
          </Col>
        </Row>
        {/* Row for Buttons on what to do*/}
        <Row noGutters
          className='attack-city-courtyard-options-container'>
          <Col>
            <Button onClick={attackCityCourtyardHandler}>
              Storm the Courtyard!
            </Button>
          </Col>
          <Col>
            <Button variant='danger' onClick={backOffHandler}>
              Back off
            </Button>
          </Col>
        </Row>
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
    gameId: state.game.gameId,
    attackingArmyTilePosition: state.cityCourtyardBattle
        .attackingArmyTilePosition,
    attackingArmy: state.cityCourtyardBattle.attackingArmyTilePosition >= 0 ?
      state.gameBoardView.gameBoard[
          state.cityCourtyardBattle.attackingArmyTilePosition].army : null,
    cityTile: state.cityCourtyardBattle.cityTile,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateAdvancedDetailsModalView: (view) => dispatch(
        gameAC.setAdvancedDetailsModalView(view)),
    clearCityCourtyardBattleReducer: () => dispatch(
        cityCourtyardBattleAC.clearCityCourtyardBattleReducer()),
  };
};

AttackCityCourtyardConfirmationDialog.propTypes = {
  ownPlayerNumber: PropTypes.string,
  gameId: PropTypes.string,
  attackingArmyTilePosition: PropTypes.number,
  attackingArmy: PropTypes.object,
  cityTile: PropTypes.object,
  updateAdvancedDetailsModalView: PropTypes.func,
  clearCityCourtyardBattleReducer: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(
    AttackCityCourtyardConfirmationDialog);
