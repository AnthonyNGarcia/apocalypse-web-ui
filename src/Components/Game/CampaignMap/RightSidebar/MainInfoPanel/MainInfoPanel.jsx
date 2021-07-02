import React from 'react';
import ArmyInfoPanel from './ArmyInfoPanel/ArmyInfoPanel';
import CityInfoPanel from './CityInfoPanel/CityInfoPanel';
import TileInfoPanel from './TileInfoPanel/TileInfoPanel';
import SettlerInfoPanel from './SettlerInfoPanel/SettlerInfoPanel';
import MAIN_PANEL_VIEWS from '../../../../Utilities/gameMainPanelViews';
import flattenObject from '../../../../Utilities/flattenObjectValuesToArray';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import './MainInfoPanel.css';

/**
 *
 * MainInfoPanel JSDocs
 *
 * @param {Object} props passed from the parent component
 * @return {JSX} to render
 */
const MainInfoPanel = (props) => {
  return (
    <div className='main-info-panel-container'>
      {props.mainPanelView === MAIN_PANEL_VIEWS.ARMY_INFO ?
        <ArmyInfoPanel/> :
        props.mainPanelView === MAIN_PANEL_VIEWS.CITY_INFO ?
        <CityInfoPanel/> :
        props.mainPanelView === MAIN_PANEL_VIEWS.TILE_INFO ?
        <TileInfoPanel/> :
        props.mainPanelView === MAIN_PANEL_VIEWS.SETTLER_INFO ?
        <SettlerInfoPanel/> :
        props.mainPanelView === MAIN_PANEL_VIEWS.NONE ?
        <p>Nothing to view. Select a unit or tile for details.</p> :
        <p>Oops! An Invalid main panel view was rendered</p>}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    mainPanelView: state.gameBoardView.mainPanelView,
  };
};

MainInfoPanel.propTypes = {
  mainPanelView: PropTypes.oneOf(flattenObject(MAIN_PANEL_VIEWS)),
};

export default connect(mapStateToProps)(MainInfoPanel);
