import React, {useState, useEffect} from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import BattleSidebar from './BattleSidebar/BattleSidebar';
import ArmyBoards from './ArmyBoards/ArmyBoards';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import PLAYER from '../../Utilities/playerEnums';
import flattenObject from '../../Utilities/flattenObjectValuesToArray';
import Spinner from 'react-bootstrap/esm/Spinner';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import Button from 'react-bootstrap/Button';
import UNIT_CLASSES from '../../Utilities/unitClasses';
import './BattleMap.css';

/**
 *
 * BattleMap JSDocs
 *
 * @param {Object} props passed from the parent component
 * @return {JSX} to render
 */
const BattleMap = (props) => {
  const [playerWhoseTurnItIs, setPlayerWhoseTurnItIs] = useState(null);

  const popover = (
    <Popover id="popover-basic">
      <Popover.Title as="h3">Defender Ambushing!</Popover.Title>
      <Popover.Content>
      The defending army of this tile has pulled off an <strong>ambush</strong>!
        <br></br>
        {'For the first round of battle, all ambushing units will go first' +
      '- no alternating! After the first round, combat resumes to normal, ' +
      'with the exception that the ambushing army has priority on going ' +
      'first for each unit class.'}
      </Popover.Content>
    </Popover>
  );

  const ambushTitle = (
    <OverlayTrigger trigger="click" placement="bottom" overlay={popover}>
      <Button variant="danger" className='ambush-title'>AMBUSH!!</Button>
    </OverlayTrigger>
  );

  useEffect(() => {
    if (props.battleData) {
      setPlayerWhoseTurnItIs(props.battleData.playerWhoseTurnItIs);
    }
  }, [props]);
  console.log(playerWhoseTurnItIs);
  if (props.battleData) {
    return (
      <React.Fragment>
        {/* First row shows the players and the unit phase */}
        <Row style={{width: '100vw', height: '10vh', minHeight: '10vh'}}>
          <Col className={(playerWhoseTurnItIs === PLAYER.ONE ?
                'active-turn center-text player-label' :
                'inactive-turn center-text player-label') + (
                  props.ownPlayerNumber === PLAYER.ONE ? ' own-player-label' :
                  ' other-player-label')}>
            <h4>{props.playerOneUsername}</h4>
          </Col>
          <Col>
            {props.battleData.defenderPulledOffAmbush ?
            ambushTitle : null}
            {props.showEnemyArmyInBattle ? (
              <h4 className='current-unit-class-title'>{UNIT_CLASSES[
                  props.battleData.currentUnitClassPhase].displayName}</h4>
            ) : (
              <h4 className='current-unit-class-title'>Army Setup Stage</h4>
            )}
            <p className="center-text">Round: {props.battleData.round}</p>
          </Col>
          <Col className={(playerWhoseTurnItIs === PLAYER.TWO ?
                'active-turn center-text player-label' :
                'inactive-turn center-text player-label') + (
                  props.ownPlayerNumber === PLAYER.TWO ? ' own-player-label' :
                  ' other-player-label')}>
            <h4>{props.playerTwoUsername}</h4>
          </Col>
        </Row>
        {/* Second row shoes the army boards and sidebar */}
        <Row style={{width: '100vw', paddingTop: '2vh'}}>
          {/* First col contains the boards */}
          <Col md={8}>
            <ArmyBoards/>
          </Col>
          {/* Second col contains the right sidebar */}
          <Col md={4} style={{paddingLeft: '2vw'}}>
            <BattleSidebar/>
          </Col>
        </Row>
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
    showCityModalInfo: state.cityMenu.showCityModalInfo,
    showResearchModalInfo: state.cityMenu.showResearchModalInfo,
    playerOneUsername: state.gamePlayer.playerOne ?
      state.gamePlayer.playerOne.username : 'error',
    playerTwoUsername: state.gamePlayer.playerTwo ?
      state.gamePlayer.playerTwo.username : 'error',
    ownPlayerNumber: state.gamePlayer.ownPlayerNumber,
    battleData: state.battleView.battleData,
    showEnemyArmyInBattle: state.battleView.showEnemyArmyInBattle,
  };
};

BattleMap.propTypes = {
  showCityModalInfo: PropTypes.bool,
  showResearchModalInfo: PropTypes.bool,
  updateShowCityModalInfo: PropTypes.func,
  updateShowResearchModalInfo: PropTypes.func,
  updateCityMenuSupplementalView: PropTypes.func,
  updateCityMenuSupplementalData: PropTypes.func,
  playerOneUsername: PropTypes.string,
  playerTwoUsername: PropTypes.string,
  ownPlayerNumber: PropTypes.oneOf(flattenObject(PLAYER)),
  battleData: PropTypes.any,
  showEnemyArmyInBattle: PropTypes.bool,
};

export default connect(mapStateToProps)(BattleMap);
