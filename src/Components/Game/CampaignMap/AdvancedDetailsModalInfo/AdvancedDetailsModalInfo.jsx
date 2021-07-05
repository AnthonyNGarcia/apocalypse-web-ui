import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';
import flattenObject from '../../../Utilities/flattenObjectValuesToArray';
import CityMenu from './CityMenu/CityMenu';
import ADVANCED_DETAILS_MODAL_VIEW from
  '../../../Utilities/advancedDetailsModalViews';
import AttackCityWallsConfirmationDialog from
  './AttackCityWallsConfirmationDialog/AttackCityWallsConfirmationDialog';
import './AdvancedDetailsModalInfo.css';

/**
 *
 * AdvancedDetailsModal JSDocs
 *
 * @param {Object} props passed from the parent component
 * @return {JSX} to render
 */
const AdvancedDetailsModalInfo = (props) => {
  const [modal, setModal] = useState(null);

  useEffect(() => {
    switch (props.advancedDetailsModalView) {
      case ADVANCED_DETAILS_MODAL_VIEW.CITY_MENU:
        setModal(<CityMenu/>);
        break;
      case ADVANCED_DETAILS_MODAL_VIEW.ATTACK_CITY_WALLS_CONFIRMATION_DIALOG:
        setModal(<AttackCityWallsConfirmationDialog/>);
        break;
      default:
        setModal(null);
        break;
    }
  }, [props.advancedDetailsModalView]);

  if (modal) {
    return (
      <React.Fragment>
        <Modal.Header closeButton className='advanced-details-modal-header'>
          <Modal.Title>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modal}
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
    advancedDetailsModalView: state.game.advancedDetailsModalView,
  };
};

AdvancedDetailsModalInfo.propTypes = {
  advancedDetailsModalView: PropTypes.oneOf(
      flattenObject(ADVANCED_DETAILS_MODAL_VIEW)),
};

export default connect(mapStateToProps)(AdvancedDetailsModalInfo);

