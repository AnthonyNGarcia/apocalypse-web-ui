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
import './CommanderUnitItem.css';

/**
 *
 * CommanderUnitItem JSDocs
 *
 * @param {Object} props passed from the parent component
 * @return {JSX} to render
 */
const CommanderUnitItem = (props) => {
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

  const removeUnitHandler = async (e) => {
    e.preventDefault();
    try {
      const removeUnitRequest = {
        gameId: props.gameId,
        tilePosition: props.selectedTilePosition,
        unitIndex: props.discardingIndex,
      };
      console.log(await axios.patch(
          apiEndpoints.armyController +
          '/disband-army-unit', removeUnitRequest));
    } catch (e) {
      console.warn('Oops! There was an error trying to disband an Army unit!');
      console.warn(e);
    }
  };

  const unassignUnitHandler = async (e) => {
    e.preventDefault();
    try {
      const unassignUnitRequest = {
        gameId: props.gameId,
        tilePosition: props.selectedTilePosition,
        unitIndex: props.discardingIndex,
      };
      console.log(await axios.patch(
          apiEndpoints.cityController +
          '/unassign-army-unit',
          unassignUnitRequest));
    } catch (e) {
      console.warn('Oops! There was an error trying to unassign ' +
        'an army unit!');
      console.warn(e);
    }
  };

  if (props.unit.unitType && fullUnitInfo) {
    return (
      <div className='unit-option-container'>
        <Row onClick={(e) => viewUnitHandler(e)} className='vertically-center'>
          <Col md={2}>
            <Button
              variant='dark'
              onClick={unassignUnitHandler}
              disabled={!props.isOwnTurn ||
              (props.selectedTile.city.unassignedUnits.length +
                props.selectedTile.city.currentRecruitmentQueue.length >=
                props.ownPlayerData.currentBaseArmySize)}>
              {'<<'}
            </Button>
          </Col>
          <Col md={2}>
            <img
              src={props.unit.unitType + '_ICON.svg'}
              onError={(e)=>e.target.src='shield.png'}
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
                className={'tiny-hammer-icon'}
              /></span>)
            </p>
          </Col>
          <Col md={1}>
            <Button
              variant='danger'
              onClick={removeUnitHandler}
              disabled={!props.isOwnTurn}>
                x
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

CommanderUnitItem.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(CommanderUnitItem);
