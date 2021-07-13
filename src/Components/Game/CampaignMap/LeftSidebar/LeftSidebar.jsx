import React from 'react';
import Row from 'react-bootstrap/Row';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import './LeftSidebar.css';
import PLAYER from '../../../Utilities/playerEnums';

/**
 *
 * LeftSidebar JSDocs
 *
 * @param {Object} props passed from the parent component
 * @return {JSX} to render
 */
const LeftSidebar = (props) => {
  return (
    <div className='left-sidebar-sizer'>
      <div className='astridium-count-container'>
        <Row noGutters>
          <p>Astridium Collected: {
            props.ownPlayerData.astridiumCollected}</p>
        </Row>
        <Row noGutters>
          <p>Current Astridium: {props.ownPlayerData.currentAstridium}</p>
        </Row>
      </div>
      <div className='scoreboard-container'>
        <Row noGutters style={{display: 'block'}}>
          <h3 className='scoreboard-title'>Scoreboard</h3>
          {props.playerOne.score >= props.playerTwo.score ? (
            <React.Fragment>
              <h4 className={props.ownPlayerNumber === PLAYER.ONE ?
              'leading own-scoreboard-label' : 'leading other-scoreboard-label'}
              >{props.playerOne.username} - {props.playerOne.score}</h4>
              <h4 className={props.ownPlayerNumber === PLAYER.TWO ?
              'trailing own-scoreboard-label' :
              'trailing other-scoreboard-label'}
              >{props.playerTwo.username} - {props.playerTwo.score}</h4>
            </React.Fragment>
          ) : (
             <React.Fragment>
               <h4 className={props.ownPlayerNumber === PLAYER.TWO ?
              'leading own-scoreboard-label' : 'leading other-scoreboard-label'}
               >{props.playerTwo.username} - {props.playerTwo.score}</h4>
               <h4 className={props.ownPlayerNumber === PLAYER.ONE ?
              'trailing own-scoreboard-label' :
              'trailing other-scoreboard-label'}
               >{props.playerOne.username} - {props.playerOne.score}</h4>
             </React.Fragment>
          )}
        </Row>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    playerOne: state.gamePlayer.playerOne,
    playerTwo: state.gamePlayer.playerTwo,
    ownPlayerData: state.gamePlayer.ownPlayerNumber === PLAYER.ONE ?
      state.gamePlayer.playerOne : state.gamePlayer.playerTwo,
    ownPlayerNumber: state.gamePlayer.ownPlayerNumber,
  };
};

LeftSidebar.propTypes = {
  playerOne: PropTypes.any,
  playerTwo: PropTypes.any,
  ownPlayerData: PropTypes.any,
  ownPlayerNumber: PropTypes.any,
};

export default connect(mapStateToProps)(LeftSidebar);

