import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import apiEndpoints from '../../../../../Utilities/apiEndpoints';
import gameBoardViewAC from
  '../../../../../../Redux/actionCreators/gameBoardViewActionCreators';
import tileHighlightManager from
  '../../../../../Utilities/tileHighlightManager';
import './SettlerInfoPanel.css';

/**
 *
 * SettlerInfoPanel JSDocs
 *
 * @param {Object} props passed from the parent component
 * @return {JSX} to render
 */
const SettlerInfoPanel = (props) => {
  const settleCityHandler = (e) => {
    e.preventDefault();
    props.updateIsMovingSettler(false);
    tileHighlightManager.unhighlightAllTiles();
    try {
      const request = {
        gameId: props.gameId,
        primaryTilePosition: props.selectedTilePosition,
      };
      axios.post(
          apiEndpoints.settlerController + '/settle', request);
    } catch (error) {
      console.warn('Failed to settle city!');
      console.warn(error);
    }
  };

  if (props.selectedSettler) {
    return (
      <React.Fragment>
        <Container>
          {props.ownPlayerNumber === props.selectedSettler.owner ?
        <React.Fragment>
          <Row className='center-text'>
            <h2>{props.allFactions[props.selectedSettler.factionType]
                .unitAdjective} Settler</h2>
          </Row>
          <Row>
            <p>
              {'This unit can be used to create new Cities! However, ' +
              ' it will be killed immediately if captured by an enemy!'}
            </p>
          </Row>
          <Row>
            <Button
              disabled={props.selectedSettler.remainingActions <= 0 ||
                !props.selectedSettler.canSettleCity ||
                props.isOwnTurn == false}
              onClick={settleCityHandler}>
            Settle City
            </Button>
          </Row>
        </React.Fragment> :
        <React.Fragment>
          <Row className='center-text enemy-entity'>
            <h2>{props.allFactions[props.selectedSettler.factionType]
                .unitAdjective} Settler</h2>
          </Row>
          <Row className='center-text enemy-entity'>
            {'This is an enemy Settler. You should capture and destroy ' +
            'it with an army before it creates a new enemy City!'}
          </Row>
        </React.Fragment>}
        </Container>
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
    gameId: state.game.gameId,
    selectedTilePosition: state.gameBoardView.selectedTilePosition,
    selectedSettler: state.gameBoardView.gameBoard[
        state.gameBoardView.selectedTilePosition].settler,
    ownPlayerNumber: state.gamePlayer.ownPlayerNumber,
    allFactions: state.game.gameConstants.allFactions,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateIsMovingSettler: (isMovingSettler) => dispatch(
        gameBoardViewAC.setIsMovingSettler(isMovingSettler)),
  };
};

SettlerInfoPanel.propTypes = {
  gameId: PropTypes.string,
  selectedSettler: PropTypes.any,
  ownPlayerNumber: PropTypes.any,
  allFactions: PropTypes.any,
  updateIsMovingSettler: PropTypes.func,
  selectedTilePosition: PropTypes.number,
};

export default connect(mapStateToProps, mapDispatchToProps)(SettlerInfoPanel);
