import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import flattenObject from '../../../Utilities/flattenObjectValuesToArray';
import UNCLOSEABLE_MODAL_VIEW from '../../../Utilities/uncloseableModalView';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';
import OutsideCityWallsBattlePrepMenu from
  './OutsideCityWallsBattlePrepMenu/OutsideCityWallsBattlePrepMenu';
import PlayerWonGameModal from './PlayerWonGameModal/PlayerWonGameModal';
import './UncloseableModalInfo.css';

/**
 *
 * UncloseableModalInfo JSDocs
 *
 * @param {Object} props passed from the parent component
 * @return {JSX} to render
 */
const UncloseableModalInfo = (props) => {
  if (props.uncloseableModalView ===
      UNCLOSEABLE_MODAL_VIEW.OUTSIDE_CITY_WALLS_BATTLE_PREP) {
    return (
      <React.Fragment>
        <Modal.Body>
          <OutsideCityWallsBattlePrepMenu/>
        </Modal.Body>
      </React.Fragment>
    );
  } if (props.uncloseableModalView ===
      UNCLOSEABLE_MODAL_VIEW.PLAYER_WON_GAME) {
    return (
      <React.Fragment>
        <Modal.Body>
          <PlayerWonGameModal/>
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
    uncloseableModalView: state.gameBoardView.uncloseableModalView,
  };
};

UncloseableModalInfo.propTypes = {
  uncloseableModalView: PropTypes.oneOf(flattenObject(UNCLOSEABLE_MODAL_VIEW)),
};

export default connect(mapStateToProps)(UncloseableModalInfo);

