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
import UncloseableModalInfo from
  './UncloseableModalInfo/UncloseableModalInfo';
import cityMenuAC from '../../../Redux/actionCreators/cityMenuActionCreators';
import gameAC from '../../../Redux/actionCreators/gameActionCreators';
import Modal from 'react-bootstrap/Modal';
import CITY_MENU_SUPPLEMENTAL_VIEWS from
  '../../Utilities/cityMenuSupplementalViews';
import PLAYER from '../../Utilities/playerEnums';
import flattenObject from '../../Utilities/flattenObjectValuesToArray';
import UNCLOSEABLE_MODAL_VIEW from '../../Utilities/uncloseableModalView';
import ADVANCED_DETAILS_MODAL_VIEW from
  '../../Utilities/advancedDetailsModalViews';
import cityWallsBattleAC from
  '../../../Redux/actionCreators/cityWallsBattleActionCreators';
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
    props.updateCityMenuSupplementalData({});
    props.updateCityMenuSupplementalView(CITY_MENU_SUPPLEMENTAL_VIEWS.NONE);
    props.updateAdvancedDetailsModalView(ADVANCED_DETAILS_MODAL_VIEW.NONE);
    props.clearCityWallsBattleReducer();
  };

  return (
    <React.Fragment>
      <Modal show={props.advancedDetailsModalView !==
      ADVANCED_DETAILS_MODAL_VIEW.NONE}
      onHide={closeAdvancedDetailsModal} size="xl"
      className='advanced-details-modal-custom-background'>
        <AdvancedDetailsModalInfo/>
      </Modal>
      <Modal show={props.uncloseableModalView !== UNCLOSEABLE_MODAL_VIEW.NONE}
        size="xl"
        onHide={() => console.log('Can\'t close this modal!')}
        className='uncloseable-modal-custom-background'>
        <UncloseableModalInfo/>
      </Modal>
      <div className='player-labels-container center-text'>
        <Row noGutters>
          <Col
            className={props.playerWhoseTurnItIs === PLAYER.ONE ?
              'game-board-active-turn center-text game-board-player-label' :
              'game-board-inactive-turn center-text game-board-player-label'}>
            <h3 className={props.ownPlayerNumber === PLAYER.ONE ?
          'game-board-own-player-label' : 'game-board-other-player-label'}>
              {props.playerOneUsername}</h3>
          </Col>
          <Col className='center-text round-counter'>
            <h5>Round: {props.round}</h5>
          </Col>
          <Col
            className={props.playerWhoseTurnItIs === PLAYER.TWO ?
              'game-board-active-turn center-text game-board-player-label' :
              'game-board-inactive-turn center-text game-board-player-label'}>
            <h3 className={props.ownPlayerNumber === PLAYER.TWO ?
          'game-board-own-player-label' : 'game-board-other-player-label'}>
              {props.playerTwoUsername}</h3>
          </Col>
        </Row>
      </div>
      <div className='campaign-map-container'>
        <Row noGutters>
          <Col className='left-sidebar-container'>
            <LeftSidebar/>
          </Col>
          <Col className='centerpiece-container'>
            <Centerpiece/>
          </Col>
          <Col className='right-sidebar-container'>
            <RightSidebar/>
          </Col>
        </Row>
      </div>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    playerOneUsername: state.gamePlayer.playerOne ?
      state.gamePlayer.playerOne.username : 'error',
    playerTwoUsername: state.gamePlayer.playerTwo ?
      state.gamePlayer.playerTwo.username : 'error',
    playerWhoseTurnItIs: state.gamePlayer.playerWhoseTurnItIs,
    ownPlayerNumber: state.gamePlayer.ownPlayerNumber,
    round: state.game.gameRound,
    uncloseableModalView: state.gameBoardView.uncloseableModalView,
    advancedDetailsModalView: state.game.advancedDetailsModalView,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateCityMenuSupplementalView: (view) => dispatch(
        cityMenuAC.setCityMenuSupplementalView(view)),
    updateCityMenuSupplementalData: (data) => dispatch(
        cityMenuAC.setCityMenuSupplementalData(data)),
    updateAdvancedDetailsModalView: (view) => dispatch(
        gameAC.setAdvancedDetailsModalView(view)),
    clearCityWallsBattleReducer: () => dispatch(
        cityWallsBattleAC.clearCityWallsBattleReducer()),
  };
};

CampaignMap.propTypes = {
  updateCityMenuSupplementalView: PropTypes.func,
  updateCityMenuSupplementalData: PropTypes.func,
  playerOneUsername: PropTypes.string,
  playerTwoUsername: PropTypes.string,
  playerWhoseTurnItIs: PropTypes.oneOf(flattenObject(PLAYER)),
  ownPlayerNumber: PropTypes.oneOf(flattenObject(PLAYER)),
  round: PropTypes.number,
  uncloseableModalView: PropTypes.oneOf(flattenObject(UNCLOSEABLE_MODAL_VIEW)),
  advancedDetailsModalView: PropTypes.oneOf(
      flattenObject(ADVANCED_DETAILS_MODAL_VIEW)),
  updateAdvancedDetailsModalView: PropTypes.func,
  clearCityWallsBattleReducer: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(CampaignMap);
