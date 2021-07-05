import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import PropTypes from 'prop-types';
import Spinner from 'react-bootstrap/esm/Spinner';
import './AttackingForceUnitItem.css';

/**
 *
 * AttackingForceUnitItem
 * JSDocs
 *
 * @param {Object} props passed from the parent component
 * @return {JSX} to render
 */
const AttackingForceUnitItem = (props) => {
  const [fullUnitInfo, setFullUnitInfo] = useState(null);

  useEffect( () => {
    if (props.unit && props.unit.unitType) {
      const freshFullUnitInfo = props.allUnits[props.unit.unitType];
      setFullUnitInfo(freshFullUnitInfo);
    }
  }, [props]);

  if (fullUnitInfo) {
    return (
      <div className='outside-city-walls-attacking-unit-container'>
        <Row noGutters>
          <Col md={4}>
            <img
              src={props.unit.unitType + '_ICON.svg'}
              onError={(e)=>e.target.src='shield.svg'}
              alt=""
              className='outside-city-walls-attacking-unit-icon'/>
          </Col>
          <Col md={8}>
            {fullUnitInfo.displayName} ({
              props.unit.currentHealth}/{props.unit
                .maxHealth} <span><img
              src={'health.svg'}
              alt=""
              className={'outside-city-walls-attacking-unit-tiny-health-icon'}
            /></span>)
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
  };
};

AttackingForceUnitItem.propTypes = {
  unit: PropTypes.any,
  allUnits: PropTypes.any,
};

export default connect(mapStateToProps)(AttackingForceUnitItem);

