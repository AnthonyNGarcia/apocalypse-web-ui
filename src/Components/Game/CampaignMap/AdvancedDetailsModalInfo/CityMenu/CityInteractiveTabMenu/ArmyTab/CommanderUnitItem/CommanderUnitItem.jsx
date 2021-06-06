import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';
import Spinner from 'react-bootstrap/esm/Spinner';
import CITY_MENU_SUPPLEMENTAL_VIEWS from
  '../../../../../../../Utilities/cityMenuSupplementalViews';
import gameAC from
  '../../../../../../../../Redux/actionCreators/gameActionCreators';
import axios from 'axios';
import apiEndpoints from '../../../../../../../Utilities/apiEndpoints';
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
        armyTilePosition: props.selectedTilePosition,
        discardingIndex: props.discardingIndex,
      };
      console.log(await axios.patch(
          apiEndpoints.gameController +
          '/in-memory-army-units/' + props.gameId, removeUnitRequest));
    } catch (e) {
      console.warn('Oops! There was an error trying to recruit a unit!');
      console.warn(e);
    }
  };

  if (props.unit.unitType && fullUnitInfo) {
    return (
      <div className='unit-option-container'>
        <Row onClick={(e) => viewUnitHandler(e)} className='vertically-center'>
          <Col md={2}>
            <img
              src={fullUnitInfo.unitType + '_ICON.svg'}
              onError={(e)=>e.target.src='shield.png'}
              alt=""
              className='unit-icon'/>
          </Col>
          <Col md={7}>
            <p>
              {fullUnitInfo.displayName} ({
                props.unit.currentHealth}/{fullUnitInfo
                  .baseMaxHealth} <span><img
                src={'health.svg'}
                alt=""
                className={'tiny-hammer-icon'}
              /></span>)
            </p>
          </Col>
          <Col md={3}>
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
    isOwnTurn: state.game.isOwnTurn,
    selectedTilePosition: state.game.selectedTilePosition,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateCityMenuSupplementalData: (cityMenuSupplementalData) => dispatch(
        gameAC.setCityMenuSupplementalData(cityMenuSupplementalData)),
    updateCityMenuSupplementalView: (cityMenuSupplementalView) => dispatch(
        gameAC.setCityMenuSupplementalView(cityMenuSupplementalView)),
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
};

export default connect(mapStateToProps, mapDispatchToProps)(CommanderUnitItem);
