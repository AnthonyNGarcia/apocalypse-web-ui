import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import SelectedBuildingDetails from
  './SelectedBuildingDetails/SelectedBuildingDetails';
import SelectedUnitDetails from './SelectedUnitDetails/SelectedUnitDetails';
import SelectedCommanderDetails from
  './SelectedCommanderDetails/SelectedCommanderDetails';
import CITY_MENU_SUPPLEMENTAL_VIEWS from
  '../../../../../Utilities/cityMenuSupplementalViews';
import flattenObject from '../../../../../Utilities/flattenObjectValuesToArray';
import './CitySupplementalInfoBox.css';

/**
 *
 * CitySupplementalInfoBox JSDocs
 *
 * @param {Object} props passed from the parent component
 * @return {JSX} to render
 */
const CitySupplementalInfoBox = (props) => {
  return (
    <React.Fragment>
      {props.cityMenuSupplementalView ===
        CITY_MENU_SUPPLEMENTAL_VIEWS.BUILDING ?
        <SelectedBuildingDetails/> :
        props.cityMenuSupplementalView === CITY_MENU_SUPPLEMENTAL_VIEWS.UNIT ?
        <SelectedUnitDetails/> :
        props.cityMenuSupplementalView ===
        CITY_MENU_SUPPLEMENTAL_VIEWS.COMMANDER ?
        <SelectedCommanderDetails/> :
        props.cityMenuSupplementalView === CITY_MENU_SUPPLEMENTAL_VIEWS.NONE ?
        <p>Selected items will display more information here.</p> : null}
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    cityMenuSupplementalView: state.cityMenu.cityMenuSupplementalView,
  };
};

CitySupplementalInfoBox.propTypes = {
  cityMenuSupplementalView: PropTypes.oneOf(
      flattenObject(CITY_MENU_SUPPLEMENTAL_VIEWS)),
};

export default connect(mapStateToProps)(CitySupplementalInfoBox);

