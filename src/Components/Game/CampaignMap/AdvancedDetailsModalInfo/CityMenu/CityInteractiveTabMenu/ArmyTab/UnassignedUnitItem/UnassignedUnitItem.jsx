import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';
import Spinner from 'react-bootstrap/esm/Spinner';
import CITY_MENU_SUPPLEMENTAL_VIEWS from
  '../../../../../../../Utilities/cityMenuSupplementalViews';
import cityMenuAC from
  '../../../../../../../../Redux/actionCreators/cityMenuActionCreators';
import axios from 'axios';
import apiEndpoints from '../../../../../../../Utilities/apiEndpoints';
import PLAYER from '../../../../../../../Utilities/playerEnums';
import getHeroUnitCount from '../../../../../../../Utilities/getHeroUnitCount';
import './UnassignedUnitItem.css';

/**
 *
 * UnassignedUnitItem JSDocs
 *
 * @param {Object} props passed from the parent component
 * @return {JSX} to render
 */
const UnassignedUnitItem = (props) => {
  const [fullUnitInfo, setFullUnitInfo] = useState(null);

  useEffect( () => {
    if (props.unit && props.unit.unitType) {
      const freshFullUnitInfo = props.allUnits[props.unit.unitType];
      setFullUnitInfo(freshFullUnitInfo);
    }
  }, [props]);

  const viewUnitHandler = (e) => {
    e.preventDefault();
    props.updateCityMenuSupplementalView(CITY_MENU_SUPPLEMENTAL_VIEWS.UNIT);
    props.updateCityMenuSupplementalData(props.unit.unitType);
  };

  const removeUnitHandler = (e) => {
    e.preventDefault();
    try {
      const removeUnitRequest = {
        gameId: props.gameId,
        tilePosition: props.selectedTilePosition,
        unitIndex: props.discardingIndex,
      };
      axios.patch(apiEndpoints.cityController +
          '/disband-unassigned-unit', removeUnitRequest);
    } catch (e) {
      console.warn('Oops! There was an error trying to disband ' +
        'an unassigned unit!');
      console.warn(e);
    }
  };

  const assignUnitHandler = (e) => {
    e.preventDefault();
    try {
      const assignUnitRequest = {
        gameId: props.gameId,
        tilePosition: props.selectedTilePosition,
        unitIndex: props.discardingIndex,
      };
      axios.patch(apiEndpoints.cityController + '/assign-army-unit',
          assignUnitRequest);
    } catch (e) {
      console.warn('Oops! There was an error trying to assign ' +
        'an unassigned unit!');
      console.warn(e);
    }
  };

  if (props.unit.unitType && fullUnitInfo) {
    return (
      <div className='unit-option-container'>
        <Row onClick={(e) => viewUnitHandler(e)}
          className='vertically-center' noGutters>
          <Col md={2}>
            <Button
              variant='danger'
              onClick={removeUnitHandler}
              disabled={!props.isOwnTurn}>
                x
            </Button>
          </Col>
          <Col md={2}>
            <img
              src={props.unit.unitType + '_ICON.svg'}
              onError={(e)=>e.target.src='shield.svg'}
              alt=""
              className='unit-icon'/>
          </Col>
          <Col md={6}>
            <p>
              {fullUnitInfo.displayName} ({
                props.unit.currentHealth}/{props.unit
                  .maxHealth} <span><img
                src={'health.svg'}
                alt=""
                className={'black-health-icon'}
              /></span>) {
            fullUnitInfo.tier === 3 ? (
              <span><img
                src={'hero_unit_icon.svg'}
                alt=""
                className={'black-hero-unit-icon'}
              /></span>
            ) : null}
            </p>
          </Col>
          <Col md={1}>
            <Button
              variant='dark'
              onClick={assignUnitHandler}
              disabled={!props.isOwnTurn || !props.selectedTile.army ||
              (props.selectedTile.army &&
                props.selectedTile.army.units.length >=
                props.ownPlayerData.currentBaseArmySize) ||
                (getHeroUnitCount(props.selectedTile.army.units) >=
                props.ownPlayerData.currentBaseTier3HeroUnitsSupported &&
                fullUnitInfo.tier === 3)}>
              {'>>'}
            </Button>
          </Col>
        </Row>
      </div>
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
    gameId: state.game.gameId,
    allUnits: state.game.gameConstants.allUnits,
    isOwnTurn: state.gamePlayer.ownPlayerNumber ===
      state.gamePlayer.playerWhoseTurnItIs,
    selectedTilePosition: state.gameBoardView.selectedTilePosition,
    selectedTile: state.gameBoardView.gameBoard[
        state.gameBoardView.selectedTilePosition],
    ownPlayerData: state.gamePlayer.ownPlayerNumber === PLAYER.ONE ?
      state.gamePlayer.playerOne : state.gamePlayer.playerTwo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateCityMenuSupplementalData: (cityMenuSupplementalData) => dispatch(
        cityMenuAC.setCityMenuSupplementalData(cityMenuSupplementalData)),
    updateCityMenuSupplementalView: (cityMenuSupplementalView) => dispatch(
        cityMenuAC.setCityMenuSupplementalView(cityMenuSupplementalView)),
  };
};

UnassignedUnitItem.propTypes = {
  unit: PropTypes.any,
  discardingIndex: PropTypes.number,
  gameId: PropTypes.string,
  allUnits: PropTypes.any,
  isOwnTurn: PropTypes.bool,
  updateCityMenuSupplementalData: PropTypes.func,
  updateCityMenuSupplementalView: PropTypes.func,
  selectedTilePosition: PropTypes.number,
  ownPlayerData: PropTypes.any,
  selectedTile: PropTypes.any,
};

export default connect(mapStateToProps, mapDispatchToProps)(UnassignedUnitItem);
