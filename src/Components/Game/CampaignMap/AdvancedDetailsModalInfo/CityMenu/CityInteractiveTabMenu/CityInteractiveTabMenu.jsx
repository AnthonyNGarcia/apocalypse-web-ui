import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ProductionTab from './ProductionTab/ProductionTab';
import ArmyTab from './ArmyTab/ArmyTab';
import gameAC from '../../../../../../Redux/actionCreators/gameActionCreators';
import './CityInteractiveTabMenu.css';
import CITY_MENU_SUPPLEMENTAL_VIEWS from
  '../../../../../Utilities/cityMenuSupplementalViews';

/**
 *
 * CityInteractiveTabMenu JSDocs
 *
 * @param {Object} props passed from the parent component
 * @return {JSX} to render
 */
const CityInteractiveTabMenu = (props) => {
  const cleanupCityView = () => {
    props.clearCityMenuSupplementalData();
    props.clearCityMenuSupplementalView();
  };

  const navigateToProductionTab = (e) => {
    e.preventDefault();
    cleanupCityView();
    props.updateCityShowingProductionTab(true);
  };

  const navigateToArmyTab = (e) => {
    e.preventDefault();
    cleanupCityView();
    props.updateCityShowingProductionTab(false);
  };

  return (
    <React.Fragment>
      <div style={{width: '50vw'}}>
        <Container>
          {/* First row are the headers */}
          <Row>
            {/* First col is for Production tab */}
            <Col>
              <Button
                variant='outline-primary'
                style={{width: '100%'}}
                onClick={navigateToProductionTab}>Production</Button>
            </Col>
            {/* Second col is for Army tab */}
            <Col>
              <Button variant='outline-primary'
                style={{width: '100%'}}
                onClick={navigateToArmyTab}>Army</Button>
            </Col>
          </Row>
          {/* Second row contains the appropriate tab body */}
          <Row>
            {props.cityShowingProductionTab ?
          <ProductionTab
            finalProduction={props.finalProduction}
            city={{...props.city}}/> :
          <ArmyTab/>}
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    cityShowingProductionTab: state.game.cityShowingProductionTab,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateCityShowingProductionTab: (cityShowingProductionTab) => dispatch(
        gameAC.setCityShowingProductionTab(cityShowingProductionTab)),
    clearCityMenuSupplementalData: () => dispatch(
        gameAC.setCityMenuSupplementalData({})),
    clearCityMenuSupplementalView: () => dispatch(
        gameAC.setCityMenuSupplementalView(CITY_MENU_SUPPLEMENTAL_VIEWS.NONE)),
  };
};

CityInteractiveTabMenu.propTypes = {
  cityShowingProductionTab: PropTypes.bool,
  updateCityShowingProductionTab: PropTypes.func,
  finalProduction: PropTypes.number,
  city: PropTypes.any,
  clearCityMenuSupplementalData: PropTypes.func,
  clearCityMenuSupplementalView: PropTypes.func,
};

export default connect(mapStateToProps,
    mapDispatchToProps)(CityInteractiveTabMenu);
