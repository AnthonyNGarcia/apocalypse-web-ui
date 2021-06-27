import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ProductionTab from './ProductionTab/ProductionTab';
import ArmyTab from './ArmyTab/ArmyTab';
import CommanderTab from './CommanderTab/CommanderTab';
import cityMenuAC from
  '../../../../../../Redux/actionCreators/cityMenuActionCreators';
import CITY_MENU_SUPPLEMENTAL_VIEWS from
  '../../../../../Utilities/cityMenuSupplementalViews';
import CITY_MENU_TAB from '../../../../../Utilities/cityMenuTabs';
import './CityInteractiveTabMenu.css';

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
    props.updateCityMenuTab(CITY_MENU_TAB.PRODUCTION);
  };

  const navigateToArmyTab = (e) => {
    e.preventDefault();
    cleanupCityView();
    props.updateCityMenuTab(CITY_MENU_TAB.ARMY);
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
            {props.cityMenuTab === CITY_MENU_TAB.PRODUCTION ?
          <ProductionTab/> :
          props.cityMenuTab === CITY_MENU_TAB.ARMY ?
          <ArmyTab/> :
          props.cityMenuTab === CITY_MENU_TAB.COMMANDER ?
          <CommanderTab/> :
          'Oops! An invalid City Menu Tab was Rendered!'}
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    cityMenuTab: state.cityMenu.cityMenuTab,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateCityMenuTab: (cityMenuTab) => dispatch(
        cityMenuAC.setCityMenuTab(cityMenuTab)),
    clearCityMenuSupplementalData: () => dispatch(
        cityMenuAC.setCityMenuSupplementalData({})),
    clearCityMenuSupplementalView: () => dispatch(
        cityMenuAC.setCityMenuSupplementalView(
            CITY_MENU_SUPPLEMENTAL_VIEWS.NONE)),
  };
};

CityInteractiveTabMenu.propTypes = {
  cityMenuTab: PropTypes.any,
  updateCityMenuTab: PropTypes.func,
  clearCityMenuSupplementalData: PropTypes.func,
  clearCityMenuSupplementalView: PropTypes.func,
};

export default connect(mapStateToProps,
    mapDispatchToProps)(CityInteractiveTabMenu);
