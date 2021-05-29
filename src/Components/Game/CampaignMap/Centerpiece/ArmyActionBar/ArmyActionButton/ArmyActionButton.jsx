import React, {useRef} from 'react';
import Button from 'react-bootstrap/Button';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import gameAC from '../../../../../../Redux/actionCreators/gameActionCreators';
import ARMY_ACTION_ENUMS from '../../../../../Utilities/armyActionEnums';
import tileHighlightManager from
  '../../../../../Utilities/tileHighlightManager';
import sendWebsocketMessage from
  '../../../../../Utilities/sendWebsocketMessage';
import AbstractedWebsocket from '../../../../../Utilities/AbstractedWebsocket';
import './ArmyActionButton.css';

/**
 *
 * ArmyActionButton JSDocs
 *
 * @param {Object} props passed from the parent component
 * @return {JSX} to render
 */
const ArmyActionButton = (props) => {
  const websocket = useRef(null);

  const showActionTooltip = () => {
    props.updateActionBarTooltip(props.actionData.tooltip);
  };

  const hideActionTooltip = () => {
    props.updateActionBarTooltip('Select an Army or City to get started.');
  };

  const initiateActionHandler = async () => {
    switch (props.actionData.enum) {
      case ARMY_ACTION_ENUMS.CAMP:
        const gameBoardCopy = await JSON.parse(
            JSON.stringify(await props.gameBoard));
        const selectedArmy = gameBoardCopy[props.selectedTilePosition].army;
        selectedArmy.remainingActions = 0;
        selectedArmy.armyStance = ARMY_ACTION_ENUMS.CAMP;
        const cleanedGameBoard = await tileHighlightManager
            .unhighlightAllTiles(gameBoardCopy);
        const message = {
          primaryPlayerUsername: props.ownUsername,
          secondaryPlayerUsername: null,
          gameBoard: cleanedGameBoard,
        };
        hideActionTooltip();
        await props.updateAwaitingServerConfirmation(true);
        sendWebsocketMessage(websocket,
            '/socket-game/board/' + props.gameId, message);
        break;
      default:
        console.log('Oops! An Invalid army action was evaluated.');
    }
  };

  return (
    <React.Fragment>
      <AbstractedWebsocket topics={[]}
        onReceiveMessage={() =>{}} ref={websocket}/>
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
