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
        <Row style={{width: '100vw', height: '12vh', minHeight: '12vh'}}>
          <Col className={(playerWhoseTurnItIs === PLAYER.ONE ?
                'active-turn center-text player-label' :
                'inactive-turn center-text player-label') + (
                  props.ownPlayerNumber === PLAYER.ONE ? ' own-player-label' :
                  ' other-player-label')}>
            <h3>{props.playerOneUsername}</h3>
          </Col>
          <Col>
            {props.showEnemyArmyInBattle ? (
              <h1 className='current-unit-class-title'>{UNIT_CLASSES[
                  props.battleData.currentUnitClassPhase].displayName}</h1>
            ) : (
              <h1 className='current-unit-class-title'>Army Setup</h1>
            )}
          </Col>
          <Col className={(playerWhoseTurnItIs === PLAYER.TWO ?
                'active-turn center-text player-label' :
                'inactive-turn center-text player-label') + (
                  props.ownPlayerNumber === PLAYER.TWO ? ' own-player-label' :
                  ' other-player-label')}>
            <h3>{props.playerTwoUsername}</h3>
          </Col>
        </Row>
        {/* Second row shoes the army boards and sidebar */}
        <Row style={{width: '100vw'}}>
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
    showCityModalInfo: state.game.showCityModalInfo,
    showResearchModalInfo: state.game.showResearchModalInfo,
    playerOneUsername: state.game.playerOne ?
      state.game.playerOne.username : 'error',
    playerTwoUsername: state.game.playerTwo ?
      state.game.playerTwo.username : 'error',
    ownPlayerNumber: state.game.ownPlayerNumber,
    battleData: state.game.battleData,
    showEnemyArmyInBattle: state.game.showEnemyArmyInBattle,
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
