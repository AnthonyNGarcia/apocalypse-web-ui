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
import cityWallsBattleAC from
  '../../../../../Redux/actionCreators/cityWallsBattleActionCreators';
import gameAC from '../../../../../Redux/actionCreators/gameActionCreators';
import './AttackCityWallsConfirmationDialog.css';

/**
 *
 * AttackCityWallsConfirmationDialog JSDocs
 *
 * @param {Object} props passed from the parent component
 * @return {JSX} to render
 */
const AttackCityWallsConfirmationDialog = (props) => {
  const attackCityWallsHandler = (e) => {
    e.preventDefault();
    try {
      const request = {
        gameId: props.gameId,
        attackingArmyTilePosition: props.attackingArmyTilePosition,
        cityTilePosition: props.cityTilePosition,
      };
      axios.post(apiEndpoints.battleController + '/attack-city-walls', request);
    } catch (e) {
      console.warn(e);
      console.warn('Oops! There was an error trying to attack the City Walls!');
    }
  };

  const backOffHandler = (e) => {
    e.preventDefault();
    props.updateAdvancedDetailsModalView(ADVANCED_DETAILS_MODAL_VIEW.NONE);
    props.clearCityWallsBattleReducer();
  };

  if (props.cityUnderAttack && props.attackingArmy) {
    return (
      <React.Fragment>
        {/* First Row  is for attacker and note */}
        <Row noGutters>
          <div className='city-walls-header-container'>
            <h3 className='city-walls-title'>
              <span className='city-walls-own-commander-name'>{
                props.attackingArmy.commander.commanderInfo
                    .displayName}</span> is attacking <span
                className='city-walls-enemy-city-name'>
                {props.cityUnderAttack.name}</span>!!</h3>
            <p className='city-walls-description'>
              {'The outskirts of this pathetic City have been Scorched! It ' +
            'is now vulnerable to a direct assault. Dare you proceed to ' +
            'actually attack the City Walls?'}</p>
          </div>
        </Row>
        {/* One big row to start making columns */}
        <Row noGutters>
          {/* First column contains the Attacking Army Unit List*/}
          <Col md={4}>
            <h3 className='city-walls-forces-title'>
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
            <h3 className='city-walls-forces-title'>
              City Garrison
            </h3>
            <Scrollbars style={{height: '30vh', width: '95%'}}>
              {props.cityUnderAttack.cityGarrison &&
                props.cityUnderAttack.cityGarrison.length > 0 ?
                props.cityUnderAttack.cityGarrison
                    .map((unit, index) => unit ? (
                      <React.Fragment key={index}>
                        <AttackingForceUnitItem unit={{...unit}}/>
                      </React.Fragment>
                    ) : null) : (
                  <React.Fragment>
                    This City has no Garrison Units.
                  </React.Fragment>
                )}
            </Scrollbars>
          </Col>
        </Row>
        {/* Row for Buttons on what to do*/}
        <Row noGutters>
          <Col>
            <Button onClick={attackCityWallsHandler}>
              Attack The City Walls!
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
    attackingArmyTilePosition: state.cityWallsBattle
        .attackingArmyTilePosition,
    cityTilePosition: state.cityWallsBattle.cityTilePosition,
    attackingArmy: state.cityWallsBattle.attackingArmyTilePosition >= 0 ?
      state.gameBoardView.gameBoard[
          state.cityWallsBattle.attackingArmyTilePosition].army : null,
    cityUnderAttack: state.cityWallsBattle.cityTilePosition >= 0 ?
      state.gameBoardView.gameBoard[
          state.cityWallsBattle.cityTilePosition].city : null,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateAdvancedDetailsModalView: (view) => dispatch(
        gameAC.setAdvancedDetailsModalView(view)),
    clearCityWallsBattleReducer: () => dispatch(
        cityWallsBattleAC.clearCityWallsBattleReducer()),
  };
};

AttackCityWallsConfirmationDialog.propTypes = {
  ownPlayerNumber: PropTypes.string,
  gameId: PropTypes.string,
  attackingArmyTilePosition: PropTypes.number,
  cityTilePosition: PropTypes.number,
  attackingArmy: PropTypes.object,
  cityUnderAttack: PropTypes.object,
  updateAdvancedDetailsModalView: PropTypes.func,
  clearCityWallsBattleReducer: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(
    AttackCityWallsConfirmationDialog);
