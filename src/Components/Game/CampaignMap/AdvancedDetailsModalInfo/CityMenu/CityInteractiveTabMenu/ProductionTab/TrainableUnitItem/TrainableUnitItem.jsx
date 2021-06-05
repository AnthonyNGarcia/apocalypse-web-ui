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
import './TrainableUnitItem.css';

/**
 *
 * TrainableUnitItem JSDocs
 *
 * @param {Object} props passed from the parent component
 * @return {JSX} to render
 */
const TrainableUnitItem = (props) => {
  const [fullUnitInfo, setFullUnitInfo] = useState(null);

  useEffect(() => {
    if (props.unitType) {
      setFullUnitInfo(props.allUnits[props.unitType]);
    }
  }, [props]);

  const viewUnitHandler = (e) => {
    e.preventDefault();
    props.updateCityMenuSupplementalView(CITY_MENU_SUPPLEMENTAL_VIEWS.UNIT);
    props.updateCityMenuSupplementalData(props.unitType);
  };

  const addUnitHandler = (e) => {
    e.preventDefault();
  };

  if (props.unitType && fullUnitInfo) {
    return (
      <div className='unit-option-container'>
        <Row onClick={(e) => viewUnitHandler(e)} className='vertically-center'>
          <Col md={2}>
            <img
              src={fullUnitInfo.unitType + '_ICON.svg'}
              onError={(e)=>{
                if (errorflag) {
                  errorflag=false; e.target.src='shield.png';
                }
              }}
              alt=""
              className='unit-icon'/>
          </Col>
          <Col md={7}>
            <p>
              {fullUnitInfo.displayName} ({
                fullUnitInfo.productionCost} <span><img
                src={'hammer.png'}
                alt=""
                className={'really-tiny-hammer-icon'}
              /></span>, {fullUnitInfo.turnsToTrain} <span><img
                src={'timer.png'}
                alt=""
                className={'really-tiny-timer-icon'}
              /></span>)
            </p>
          </Col>
          <Col md={3}>
            <Button
              variant='primary'
              onClick={addUnitHandler}
              disabled={!props.isOwnTurn}>
                +
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
    allUnits: state.game.gameConstants.allUnits,
    isOwnTurn: state.game.isOwnTurn,
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

TrainableUnitItem.propTypes = {
  allUnits: PropTypes.any,
  isOwnTurn: PropTypes.bool,
  unitType: PropTypes.string,
  updateCityMenuSupplementalData: PropTypes.func,
  updateCityMenuSupplementalView: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(TrainableUnitItem);
