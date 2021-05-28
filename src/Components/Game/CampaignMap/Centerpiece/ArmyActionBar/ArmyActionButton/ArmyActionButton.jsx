import React from 'react';
import Button from 'react-bootstrap/Button';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import gameAC from '../../../../../../Redux/actionCreators/gameActionCreators';
import ARMY_ACTION_ENUMS from '../../../../../Utilities/armyActionEnums';
import tileHighlightManager from
  '../../../../../Utilities/tileHighlightManager';
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
    props.updateActionBarTooltip('Select an Army to get started.');
  };

  const initiateActionHandler = () => {
    switch (props.actionData.enum) {
      case ARMY_ACTION_ENUMS.MOVE:
        if (props.isMovingArmy) {
          // props.updateIsMovingArmy(false);
          tileHighlightManager.unhighlightAllTiles();
        } else {
          props.updateIsMovingArmy(true);
          tileHighlightManager.
              highlightAvailableMoveTiles(props.selectedTilePosition);
        }
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
    isMovingArmy: state.game.isMovingArmy,
    selectedTilePosition: state.game.selectedTilePosition,
    isOwnTurn: state.game.isOwnTurn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateActionBarTooltip: (tooltip) => dispatch(
        gameAC.setActionBarTooltip(tooltip)),
    updateIsMovingArmy: (isMovingArmy) => dispatch(
        gameAC.setIsMovingArmy(isMovingArmy)),
  };
};

ArmyActionButton.propTypes = {
  actionData: PropTypes.any,
  isMovingArmy: PropTypes.bool,
  updateActionBarTooltip: PropTypes.func,
  updateIsMovingArmy: PropTypes.func,
  selectedTilePosition: PropTypes.number,
  isOwnTurn: PropTypes.bool,
  tapped: PropTypes.bool,
};

export default connect(mapStateToProps, mapDispatchToProps)(ArmyActionButton);
