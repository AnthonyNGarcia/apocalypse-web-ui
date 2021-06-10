import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';
import './ArmyUnit.css';

/**
 *
 * ArmyUnit JSDocs
 *
 * @param {Object} props passed from the parent component
 * @return {JSX} to render
 */
const ArmyUnit = (props) => {
  const [fullUnitInfo, setFullUnitInfo] = useState(null);

  useEffect( () => {
    if (props.unit && props.unit.unitType) {
      const freshFullUnitInfo = props.allUnits[props.unit.unitType];
      setFullUnitInfo(freshFullUnitInfo);
    }
  }, [props]);

  if (props.unit && fullUnitInfo) {
    return (
      <React.Fragment>
        {/* First row is the unit image */}
        <Row style={{height: '4vh'}} noGutters>
          <img
            src={props.unit.unitType + '_ICON.svg'}
            onError={(e)=>e.target.src='shield.png'}
            alt=""
            className={props.ownUnit ? 'army-unit-image own-unit-image' :
             'army-unit-image enemy-unit-image'}/>
        </Row>
        {/* Second row is the unit name + health */}
        <Row style={{height: '2vh'}} noGutters>
          <p className='unit-label'>
            {
              props.unit.currentHealth}/{fullUnitInfo
                .baseMaxHealth} <span><img
              src={'health.svg'}
              alt=""
              className={'tiny-hammer-icon'}
            /></span>
          </p>
        </Row>
      </React.Fragment>
    );
  } else {
    return null;
  }
};

const mapStateToProps = (state) => {
  return {
    allUnits: state.game.gameConstants.allUnits,
  };
};

ArmyUnit.propTypes = {
  unit: PropTypes.any,
  allUnits: PropTypes.any,
  ownUnit: PropTypes.bool,
};

export default connect(mapStateToProps)(ArmyUnit);
