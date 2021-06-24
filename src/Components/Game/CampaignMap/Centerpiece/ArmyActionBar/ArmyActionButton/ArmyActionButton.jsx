import React from 'react';
import Button from 'react-bootstrap/Button';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import ARMY_ACTION_ENUMS from '../../../../../Utilities/armyActionRequestTypes';
import tileHighlightManager from
  '../../../../../Utilities/tileHighlightManager';
import axios from 'axios';
import apiEndpoints from '../../../../../Utilities/apiEndpoints';
import './ArmyActionButton.css';

/**
 *
 * ArmyActionButton JSDocs
 *
 * @param {Object} props passed from the parent component
 * @return {JSX} to render
 */
const ArmyActionButton = (props) => {
  const showActionTooltip = () => {
    props.updateActionBarTooltip(props.actionData.tooltip);
  };

  const hideActionTooltip = () => {
    props.updateActionBarTooltip('Select an Army or City to get started.');
  };

  const initiateActionHandler = async () => {
    switch (props.actionData.enum) {
      case ARMY_ACTION_ENUMS.CAMP:
        tileHighlightManager.unhighlightAllTiles();
        hideActionTooltip();
        const request = {
          primaryArmyActionType: 'FORTIFY',
          primaryArmyInitialTile: props.gameBoard[props.selectedTilePosition],
          secondaryTilePosition: -1,
        };
        axios.post(apiEndpoints.armyController + '/action', request);
        break;
      default:
        console.log('Oops! An Invalid army action was evaluated.');
    }
  };

  return (
    <React.Fragment>
      <Button onMouseEnter={showActionTooltip}
        onMouseLeave={hideActionTooltip}
        onClick={initiateActionHandler}
        disabled={props.tapped}>{props.actionData.name}</Button>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    selectedTilePosition: state.gameBoardView.selectedTilePosition,
    gameBoard: state.gameBoardView.gameBoard,
    ownUsername: state.general.ownUsername,
    gameId: state.game.gameId,
  };
};

ArmyActionButton.propTypes = {
  actionData: PropTypes.any,
  updateActionBarTooltip: PropTypes.func,
  selectedTilePosition: PropTypes.number,
  tapped: PropTypes.bool,
  gameBoard: PropTypes.any,
  ownUsername: PropTypes.string,
  gameId: PropTypes.string,
};

export default connect(mapStateToProps)(ArmyActionButton);
