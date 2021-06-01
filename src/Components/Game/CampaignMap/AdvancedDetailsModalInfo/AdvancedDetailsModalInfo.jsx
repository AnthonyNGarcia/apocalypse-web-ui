import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import flattenObject from '../../../Utilities/flattenObjectValuesToArray';
import MAIN_PANEL_VIEWS from '../../../Utilities/gameMainPanelViews';
import CityMenu from './CityMenu/CityMenu';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';
import './AdvancedDetailsModalInfo.css';

/**
 *
 * AdvancedDetailsModal JSDocs
 *
 * @param {Object} props passed from the parent component
 * @return {JSX} to render
 */
const AdvancedDetailsModalInfo = (props) => {
  if (props.mainPanelData) {
    return (
      <React.Fragment>
        <Modal.Header closeButton>
          <Modal.Title>
            {props.mainPanelData.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CityMenu/>
        </Modal.Body>
      </React.Fragment>
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
    mainPanelData: state.game.mainPanelData,
    mainPanelView: state.game.mainPanelView,
  };
};

AdvancedDetailsModalInfo.propTypes = {
  mainPanelData: PropTypes.any,
  mainPanelView: PropTypes.oneOf(flattenObject(MAIN_PANEL_VIEWS)),
};

export default connect(mapStateToProps)(AdvancedDetailsModalInfo);
