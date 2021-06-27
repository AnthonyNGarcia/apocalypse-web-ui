import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {Scrollbars} from 'react-custom-scrollbars-2';
import ChoosableCommander from './ChoosableCommander/ChoosableCommander';
import PLAYER from '../../../../../../Utilities/playerEnums';
import './CommanderTab.css';

/**
 *
 * CommanderTab JSDocs
 *
 * @param {Object} props passed from the parent component
 * @return {JSX} to render
 */
const CommanderTab = (props) => {
  return (
    <React.Fragment>
      {/* First col is for selecting a new Commander*/}
      <Col>
        {/* First row is the header */}
        <Row>
          <h5 style={{'margin': 'auto'}}>
            Choose New Commander
          </h5>
        </Row>
        {/* Second row is the scrollbar */}
        <Row>
          <Scrollbars style={{height: '30vh', width: '95%'}}>
            {props.selectedCity.commanderPool &&
              props.selectedCity.commanderPool.length > 0 ?
              props.selectedCity.commanderPool
                  .map((commander, index) => (
                    <React.Fragment key={commander.commanderInfo.displayName}>
                      <ChoosableCommander
                        commander={{...commander}}
                        commanderIndex={index}/>
                    </React.Fragment>
                  )) : (
                <React.Fragment>
                  {'No commanders have yet risen to the challenge! ' +
                  'The commander pool will update in ' +
                  props.selectedCity.turnsUntilCommanderPoolRefreshes +
                  ' turns.'}
                </React.Fragment>
              )}
          </Scrollbars>
        </Row>
      </Col>
      {/* Second col is for Reviving the existing Commander*/}
      <Col >
        {/* First row is the header */}
        <Row>
          <h5 style={{'margin': 'auto'}}>
            Revive Fallen Commander
          </h5>
        </Row>
        {/* Second row is the scrollbar */}
        <Row>
          <Scrollbars style={{height: '30vh', width: '95%'}}>
            {props.ownPlayerData &&
              props.ownPlayerData.fallenCommanders &&
              props.ownPlayerData.fallenCommanders.length > 0 ?
              props.ownPlayerData.fallenCommanders
                  .map((commander, index) => (
                    <React.Fragment key={commander.commanderInfo.displayName}>
                      <ChoosableCommander
                        commander={{...commander}}
                        commanderIndex={index}
                        isRecovering/>
                    </React.Fragment>
                  )) : (
                <React.Fragment>
                  {'There are no Fallen Commanders to revive and assign ' +
                  'to this City.'}
                </React.Fragment>
              )}
          </Scrollbars>
        </Row>
      </Col>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    selectedCity: {...state.gameBoardView.gameBoard[
        state.gameBoardView.selectedTilePosition].city},
    ownPlayerData: state.gamePlayer.ownPlayerNumber === PLAYER.ONE ?
      state.gamePlayer.playerOne : state.gamePlayer.playerTwo,
  };
};

CommanderTab.propTypes = {
  selectedCity: PropTypes.any,
  ownPlayerData: PropTypes.any,
};

export default connect(mapStateToProps)(CommanderTab);
