import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import LeftSidebar from './LeftSidebar/LeftSidebar';
import Centerpiece from './Centerpiece/Centerpiece';
import RightSidebar from './RightSidebar/RightSidebar';
import AdvancedDetailsModalInfo from
  './AdvancedDetailsModalInfo/AdvancedDetailsModalInfo';
import gameAC from '../../../Redux/actionCreators/gameActionCreators';
import Modal from 'react-bootstrap/Modal';
import './CampaignMap.css';

/**
 *
 * CampaignMap JSDocs
 *
 * @param {Object} props passed from the parent component
 * @return {JSX} to render
 */
const CampaignMap = (props) => {
  const closeAdvancedDetailsModal = () => {
    props.updateShowCityModalInfo(false);
    props.updateShowResearchModalInfo(false);
  };

  return (
    <React.Fragment>
      <Modal show={props.showCityModalInfo || props.showResearchModalInfo}
        onHide={closeAdvancedDetailsModal} size="xl"
        dialogClassName='modal-dialog-custom-sizing'>
        <AdvancedDetailsModalInfo/>
      </Modal>
      <div className='campaign-map-container'>
        <Row>
          <Col>
            <LeftSidebar className='left-sidebar'/>
          </Col>
          <Col>
            <Centerpiece className='centerpiece'/>
          </Col>
          <Col>
            <RightSidebar className='right-sidebar'/>
          </Col>
        </Row>
      </div>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    showCityModalInfo: state.game.showCityModalInfo,
    showResearchModalInfo: state.game.showResearchModalInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateShowCityModalInfo: (showCityModalInfo) => dispatch(
        gameAC.setShowCityModalInfo(showCityModalInfo)),
    updateShowResearchModalInfo: (showResearchModalInfo) => dispatch(
        gameAC.setShowResearchModalInfo(showResearchModalInfo)),
  };
};

CampaignMap.propTypes = {
  showCityModalInfo: PropTypes.bool,
  showResearchModalInfo: PropTypes.bool,
  updateShowCityModalInfo: PropTypes.func,
  updateShowResearchModalInfo: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(CampaignMap);
