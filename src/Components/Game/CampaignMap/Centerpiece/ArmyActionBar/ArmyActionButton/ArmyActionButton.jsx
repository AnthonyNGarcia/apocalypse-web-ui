import React from 'react';
import Button from 'react-bootstrap/Button';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import gameAC from '../../../../../../Redux/actionCreators/gameActionCreators';
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
          primaryArmyAction: 'CAMP',
          primaryArmyInitialTile: props.gameBoard[props.selectedTilePosition],
        };
        await props.updateAwaitingServerConfirmation(true);
        axios.post(apiEndpoints.gameController + '/in-memory-army-action/' +
        props.gameId, request);
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
    selectedTilePosition: state.game.selectedTilePosition,
    gameBoard: state.game.gameBoard,
    ownUsername: state.general.ownUsername,
    gameId: state.game.gameId,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateActionBarTooltip: (tooltip) => dispatch(
        gameAC.setActionBarTooltip(tooltip)),
    updateAwaitingServerConfirmation: (awaitingServerConfirmation) => dispatch(
        gameAC.setAwaitingServerConfirmation(awaitingServerConfirmation)),
  };
};

ArmyActionButton.propTypes = {
  actionData: PropTypes.any,
  updateActionBarTooltip: PropTypes.func,
  selectedTilePosition: PropTypes.number,
  tapped: PropTypes.bool,
  gameBoard: PropTypes.any,
  ownUsername: PropTypes.string,
  updateAwaitingServerConfirmation: PropTypes.func,
  gameId: PropTypes.string,
};

export default connect(mapStateToProps, mapDispatchToProps)(ArmyActionButton);
