import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Spinner from 'react-bootstrap/esm/Spinner';
import './PlayerDataSection.css';

/**
 *
 * PlayerDataSection JSDocs
 *
 * @param {Object} props passed from the parent component
 * @return {JSX} to render
 */
const PlayerDataSection = (props) => {
  if (props.playerData) {
    return (
      <div>
        <h5>{props.playerData.username} - {
          props.allFactions[props.playerData
              .factionType].displayName}</h5>
        <p>Peak Score: {props.playerData.peakScore}</p>
        <p>Ending Score: {props.playerData.score}</p>
        <p>Astridium Collected: {props.playerData
            .astridiumCollected}</p>
        <p>Unspent Astridium: {props.playerData.currentAstridium}</p>
        <p>Peak Army Size: {props.playerData.peakBaseArmySize}</p>
        <p>Researches Completed: {props.playerData
            .completedResearches.length}</p>
      </div>
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
    allFactions: state.game.gameConstants.allFactions,
  };
};

PlayerDataSection.propTypes = {
  playerData: PropTypes.object,
  allFactions: PropTypes.any,
};

export default connect(mapStateToProps)(PlayerDataSection);
