import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {Scrollbars} from 'react-custom-scrollbars-2';
import AvailableBuildingItem from
  './AvailableBuildingItem/AvailableBuildingItem';
import './ProductionTab.css';

/**
 *
 * ProductionTab JSDocs
 *
 * @param {Object} props passed from the parent component
 * @return {JSX} to render
 */
const ProductionTab = (props) => {
  return (
    <React.Fragment>
      <Container>
        {/* First row is for section headers*/}
        <Row>
          {/* First col is for available buildings to construct */}
          <Col>
            <h5>Available Buildings to Construct</h5>
          </Col>
          {/* Second col is for available units to train */}
          <Col>
            <h5>Available Units to Train</h5>
          </Col>
        </Row>
        {/* Second row contains the bodies of each subsection */}
        <Row>
          {/* First col contains the scrollable list of buildings which
          can be built in this city (add faded out locked buildings later) */}
          <Col>
            <Scrollbars style={{height: '30vh', width: '50%'}}>
              {props.mainPanelData.constructibleBuildings &&
              props.mainPanelData.constructibleBuildings.length > 0 ?
              props.mainPanelData.constructibleBuildings
                  .map((bldg, index) => (
                    <React.Fragment key={index}>
                      <AvailableBuildingItem
                        key={index}
                        bldg={{...bldg}}
                        finalProduction={props.finalProduction}
                        city={{...props.city}}/>
                    </React.Fragment>
                  )) : (
                <React.Fragment>
                  ---
                </React.Fragment>
              )}
            </Scrollbars>
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    mainPanelData: state.game.mainPanelData,
  };
};

ProductionTab.propTypes = {
  mainPanelData: PropTypes.any,
  finalProduction: PropTypes.number,
  city: PropTypes.any,
};

export default connect(mapStateToProps)(ProductionTab);
