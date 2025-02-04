import React from 'react';
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
  const ambushPopover = (
    <Popover id="ambush-popover">
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
    <div className='battle-view-ambush-title-container'>
      <OverlayTrigger trigger="click" placement="bottom"
        overlay={ambushPopover}>
        <Button variant="danger"
          className='battle-view-ambush-title'>AMBUSH!!</Button>
      </OverlayTrigger>
    </div>
  );

  const outsideCityWallsPopover = (
    <Popover id="outside-city-walls-popover">
      <Popover.Title as="h3">Outside the City Walls</Popover.Title>
      <Popover.Content>
      The owner of this City has sallied forth <strong>
        Outside the City Walls</strong>!
        <br></br>
        {'This will be a standard battle with the Attacker going first as ' +
      'usual. The Defender that is sallying out, however, will not be able ' +
      'to retreat! They must fight to the death to protect their City. If ' +
      'the defenders perish, then the City will be scorched from the ' +
      'outside, crippling it severely, and paving the way for the Attackers ' +
      'to proceed further towards the City Walls.'}
      </Popover.Content>
    </Popover>
  );

  const outsideCityWallsTitle = (
    <div className='battle-view-outside-city-walls-title-container'>
      <OverlayTrigger trigger="click" placement="bottom"
        overlay={outsideCityWallsPopover}>
        <Button variant="danger"
          className='battle-view-outside-city-walls-title'>
          Outside City Walls
        </Button>
      </OverlayTrigger>
    </div>
  );

  const cityWallsPopover = (
    <Popover id="city-walls-popover">
      <Popover.Title as="h3">City Walls Battle</Popover.Title>
      <Popover.Content>
      This city is under siege at the <strong>City Walls</strong>!
        <br></br>
        {'This will be a standard battle with the Attacker going first as ' +
      'usual. The Defender\'s City Garrison at the City Walls, however, ' +
      'will not be able to retreat! They must fight to the death to protect ' +
      'their City from the invaders! If the defenders perish, then the City ' +
      'Walls will be destroyed, preventing the City Garrison from recovering ' +
      'for some time, and paving the way for the Attackers to proceed ' +
      'further towards the City Courtyard, ultimately capturing the City! '}
        <br></br>
        {'NOTE: If there are no Defending Army Units or Unassigned Units in ' +
      'this City for a last-ditch City Courtyard Battle, then a victorious ' +
      'Attacker will instantly capture this City!'}
      </Popover.Content>
    </Popover>
  );

  const cityWallsTitle = (
    <div className='battle-view-city-walls-title-container'>
      <OverlayTrigger trigger="click" placement="bottom"
        overlay={cityWallsPopover}>
        <Button variant="danger"
          className='battle-view-city-walls-title'>
          City Walls
        </Button>
      </OverlayTrigger>
    </div>
  );

  const cityCourtyardPopover = (
    <Popover id="city-courtyard-popover">
      <Popover.Title as="h3">City Courtyard Battle</Popover.Title>
      <Popover.Content>
      This city is under attack at the <strong>City Courtyard</strong>!
        <br></br>
        {'This will be a standard battle with the Attacker going first as ' +
      'usual. The Defender\'s Last Defenders in the City Courtyard, however, ' +
      'will not be able to retreat! They must fight to the death to protect ' +
      'their City from the invaders! If the defenders perish, then the City ' +
      'will be captured by the attackers! '}
      </Popover.Content>
    </Popover>
  );

  const cityCourtyardTitle = (
    <div className='battle-view-city-courtyard-title-container'>
      <OverlayTrigger trigger="click" placement="bottom"
        overlay={cityCourtyardPopover}>
        <Button variant="danger"
          className='battle-view-city-courtyard-title'>
          City Courtyard
        </Button>
      </OverlayTrigger>
    </div>
  );

  if (props.battleData) {
    return (
      <div className='battle-view-container'>
        {/* First row shows the players and the unit phase */}
        <div className='battle-view-player-labels-container center-text'>
          <Row noGutters>
            <Col
              className={props.playerWhoseTurnItIs === PLAYER.ONE ?
              'battle-view-active-turn center-text battle-view-player-label' :
              'battle-view-inactive-turn center-text battle-view-player-label'}>
              <h3 className={props.ownPlayerNumber === PLAYER.ONE ?
          'battle-view-own-player-label' : 'battle-view-other-player-label'}>
                {props.playerOneUsername}</h3>
              {props.battleData.defenderPulledOffAmbush &&
                props.battleData.defendingArmy.owner === PLAYER.ONE ?
                ambushTitle : null}
              {props.battleData.battleType ===
                'ATTACKING_CITY_OUTSIDE_WALLS' &&
                props.battleData.defendingArmy.owner === PLAYER.ONE ?
                outsideCityWallsTitle : null}
              {props.battleData.battleType ===
                'ATTACKING_CITY_WALLS' &&
                props.battleData.defendingArmy.owner === PLAYER.ONE ?
                cityWallsTitle : null}
              {props.battleData.battleType ===
                'ATTACKING_CITY_COURTYARD' &&
                props.battleData.defendingArmy.owner === PLAYER.ONE ?
                cityCourtyardTitle : null}
            </Col>
            <Col>
              <div className='battle-view-class-round-label'>
                <Row noGutters>
                  {props.showEnemyArmyInBattle ? (
                    <h6 className='current-unit-class-title'>{UNIT_CLASSES[
                        props.battleData.currentUnitClassPhase].displayName}
                    </h6>
                  ) : (
                    <h6 className='current-unit-class-title'>
                      Army Setup Stage
                    </h6>
                  )}
                </Row>
                <Row noGutters>
                  <p className='battle-view-round-counter'>
                    Round: {props.battleData.round}
                  </p>
                </Row>
              </div>
            </Col>
            <Col
              className={props.playerWhoseTurnItIs === PLAYER.TWO ?
              'battle-view-active-turn center-text battle-view-player-label' :
              'battle-view-inactive-turn center-text battle-view-player-label'}>
              {props.battleData.defenderPulledOffAmbush &&
                props.battleData.defendingArmy.owner === PLAYER.TWO ?
                ambushTitle : null}
              {props.battleData.battleType ===
                'ATTACKING_CITY_OUTSIDE_WALLS' &&
                props.battleData.defendingArmy.owner === PLAYER.TWO ?
                outsideCityWallsTitle : null}
              {props.battleData.battleType ===
                'ATTACKING_CITY_WALLS' &&
                props.battleData.defendingArmy.owner === PLAYER.TWO ?
                cityWallsTitle : null}
              {props.battleData.battleType ===
                'ATTACKING_CITY_COURTYARD' &&
                props.battleData.defendingArmy.owner === PLAYER.TWO ?
                cityCourtyardTitle : null}
              <h3 className={props.ownPlayerNumber === PLAYER.TWO ?
          'battle-view-own-player-label' : 'battle-view-other-player-label'}>
                {props.playerTwoUsername}</h3>
            </Col>
          </Row>
        </div>
        {/* Second row shoes the army boards and sidebar */}
        <div className=
          'battle-view-army-boards-and-sidebar-container'>
          <Row noGutters>
            {/* First col contains the boards */}
            <Col md={8}>
              <ArmyBoards/>
            </Col>
            {/* Second col contains the right sidebar */}
            <Col md={4} style={{paddingLeft: '2vw'}}>
              <BattleSidebar/>
            </Col>
          </Row>
        </div>
      </div>
    );
  } else {
    return (
      <div className='battle-view-container'>
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </div>
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
    playerWhoseTurnItIs: state.battleView.battleData ?
    state.battleView.battleData.playerWhoseTurnItIs : 'NO BATTLE DATA',
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
