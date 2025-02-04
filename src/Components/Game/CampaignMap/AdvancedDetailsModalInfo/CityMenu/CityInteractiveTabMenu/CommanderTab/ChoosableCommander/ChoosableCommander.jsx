import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';
import Spinner from 'react-bootstrap/esm/Spinner';
import CITY_MENU_SUPPLEMENTAL_VIEWS from
  '../../../../../../../Utilities/cityMenuSupplementalViews';
import cityMenuAC from
  '../../../../../../../../Redux/actionCreators/cityMenuActionCreators';
import axios from 'axios';
import apiEndpoints from '../../../../../../../Utilities/apiEndpoints';
import PLAYER from '../../../../../../../Utilities/playerEnums';
import './ChoosableCommander.css';

/**
 *
 * ChoosableCommander JSDocs
 *
 * @param {Object} props passed from the parent component
 * @return {JSX} to render
 */
const ChoosableCommander = (props) => {
  const [thisCommander, setCommander] = useState(null);

  useEffect(() => {
    if (props.isRecovering) {
      if (props.commander && props.ownPlayerData) {
        commanderSearch: for (let i = 0; i < props.ownPlayerData
            .fallenCommanders.length; i++) {
          const fallenCommander = props.ownPlayerData.fallenCommanders[i];
          if (props.allCommanders[fallenCommander.commanderType].displayName ===
            props.allCommanders[props.commander.commanderType].displayName) {
            setCommander(fallenCommander);
            break commanderSearch;
          }
        }
      }
    } else {
      if (props.commander && props.ownPlayerData) {
        setCommander(props.commander);
      }
    }
  }, [props, props.commander, props.ownPlayerData]);

  const viewCommanderHandler = (e) => {
    e.preventDefault();
    props.updateCityMenuSupplementalView(
        CITY_MENU_SUPPLEMENTAL_VIEWS.COMMANDER);
    props.updateCityMenuSupplementalData(props.commander);
  };

  const spawnCommanderHandler = (e) => {
    e.preventDefault();
    try {
      let matchingCommanderIndex = props.commanderIndex;
      if (props.isRecovering) {
        matchingCommanderIndex = -1;
        commanderSearch: for (let i = 0;
          i < props.ownPlayerData.fallenCommanders.length; i++) {
          const fallenCommanderDisplayName =
            // eslint-disable-next-line max-len
            props.allCommanders[props.ownPlayerData.fallenCommanders[i].commanderType].displayName;
          if (fallenCommanderDisplayName ===
            props.allCommanders[props.commander.commanderType].displayName) {
            matchingCommanderIndex = i;
            break commanderSearch;
          }
        }
        if (matchingCommanderIndex < 0) {
          console.warn('Couldn\'t find the fallen commander!');
        }
      }
      const request = {
        gameId: props.gameId,
        cityTilePosition: props.selectedTilePosition,
        commanderIndex: matchingCommanderIndex,
        revivingFallenCommander: props.isRecovering ? true : false,
      };
      axios.post(apiEndpoints.cityController +'/spawn-commander', request);
    } catch (e) {
      console.warn('Oops! There was an error trying to choose ' +
        'a commander to spawn!');
      console.warn(e);
    }
  };

  if (thisCommander) {
    return (
      <div className='unit-option-container'>
        <Row onClick={(e) => viewCommanderHandler(e)}
          className='vertically-center center-text'
          style={{margin: 'auto'}}>
          <Col md={8}>
            {props.allCommanders[thisCommander.commanderType].displayName} ({
                (props.isRecovering &&
                  thisCommander.turnsUntilRecovered > 0) ?
                 <span>{thisCommander.turnsUntilRecovered} <img
                   src={'timer.svg'}
                   alt=""
                   className={'really-tiny-timer-icon'}
                 /></span> : 'READY'})
          </Col>
          <Col md={4}>
            <Button
              variant='dark'
              onClick={spawnCommanderHandler}
              disabled={!props.isOwnTurn || props.selectedTile.army ||
              (props.isRecovering && thisCommander
                  .turnsUntilRecovered > 0)}>
              {'SELECT'}
            </Button>
          </Col>
        </Row>
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
    gameId: state.game.gameId,
    allUnits: state.game.gameConstants.allUnits,
    isOwnTurn: state.gamePlayer.ownPlayerNumber ===
      state.gamePlayer.playerWhoseTurnItIs,
    selectedTilePosition: state.gameBoardView.selectedTilePosition,
    selectedTile: state.gameBoardView.gameBoard[
        state.gameBoardView.selectedTilePosition],
    ownPlayerData: state.gamePlayer.ownPlayerNumber === PLAYER.ONE ?
      state.gamePlayer.playerOne : state.gamePlayer.playerTwo,
    allCommanders: state.game.gameConstants.allCommanders,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateCityMenuSupplementalData: (cityMenuSupplementalData) => dispatch(
        cityMenuAC.setCityMenuSupplementalData(cityMenuSupplementalData)),
    updateCityMenuSupplementalView: (cityMenuSupplementalView) => dispatch(
        cityMenuAC.setCityMenuSupplementalView(cityMenuSupplementalView)),
  };
};

ChoosableCommander.propTypes = {
  commander: PropTypes.object,
  commanderIndex: PropTypes.number,
  gameId: PropTypes.string,
  isOwnTurn: PropTypes.bool,
  updateCityMenuSupplementalData: PropTypes.func,
  updateCityMenuSupplementalView: PropTypes.func,
  selectedTilePosition: PropTypes.number,
  ownPlayerData: PropTypes.object,
  selectedTile: PropTypes.object,
  isRecovering: PropTypes.bool,
  allCommanders: PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(ChoosableCommander);
