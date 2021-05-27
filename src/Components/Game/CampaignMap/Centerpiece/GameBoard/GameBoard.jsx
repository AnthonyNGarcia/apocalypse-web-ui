import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import {Honeycomb, Hexagon} from 'react-honeycomb';
import PropTypes from 'prop-types';
import MAIN_PANEL_VIEWS from '../../../../Utilities/gameMainPanelViews';
import gameAC from '../../../../../Redux/actionCreators/gameActionCreators';
import './GameBoard.css';

/**
 *
 * GameBoard JSDocs
 *
 * @param {Object} props passed from the parent component
 * @return {JSX} to render
 */
const GameBoard = (props) => {
  const [initialized, setInitialized] = useState(false);
  const [fullHoneycombConfigs, setFullHoneycombConfigs] = useState(null);
  useEffect(() => {
    if (!initialized) {
    // USE EFFECT SCOPED FUNCTIONS DEFINED HERE
      const getTileData = (tile) => {
        return {
          position: tile.position,
          terrainType: tile.terrainType,
          tileImprovement: tile.tileImprovement,
          hasAsteroid: tile.hasAsteroid,
        };
      };

      const tileClicked = async (e, item) => {
        e.preventDefault();
        if (item.army) {
          props.updateMainPanelView(MAIN_PANEL_VIEWS.ARMY_INFO);
          props.updateMainPanelData(item.army);
        } else {
          props.updateMainPanelView(MAIN_PANEL_VIEWS.TILE_INFO);
          props.updateMainPanelData(getTileData(item));
        }
      };

      const renderTile = (item) => {
        let army = null;
        const city = null;
        if (item.army) {
          army = (
            <img
              src={'army.jpg'}
              alt=""
              className="army-icon"
              onClick={(e) => tileClicked(e, item)}
            />
          );
        }
        return (
          <Hexagon>
            <img
              src={item.terrainType + '.jpg'}
              alt=""
              className="heximage"
              onClick={army === null && city === null ?
                (e) => tileClicked(e, item) : null}/>
            {army ? army : null}
            {city ? city : null}
          </Hexagon>
        );
      };

      // ACTUAL USE EFFECT LOGIC STARTS HERE
      setFullHoneycombConfigs({...props.baseHoneycombConfigs,
        items: props.gameBoard, renderItem: renderTile});
      setInitialized(true);
    } else {
      setFullHoneycombConfigs( (prevState) => {
        return {...prevState, items: props.gameBoard};
      });
    }
  }, [props.gameBoard]);

  return (
    <React.Fragment>
      <h5>Game Board</h5>
      {fullHoneycombConfigs ? <Honeycomb {...fullHoneycombConfigs}/> : null }
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    gameBoard: state.game.gameBoard,
    baseHoneycombConfigs: state.game.honeycombConfigs,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateMainPanelView: (view) => dispatch(
        gameAC.setMainPanelView(view)),
    updateMainPanelData: (data) => dispatch(
        gameAC.setMainPanelData(data)),
    updateSupplementalPanelView: (view) => dispatch(
        gameAC.setSupplementalPanelView(view)),
    updateSupplementalPanelData: (data) => dispatch(
        gameAC.setSupplementalPanelData(data)),
  };
};

GameBoard.propTypes = {
  gameBoard: PropTypes.array,
  baseHoneycombConfigs: PropTypes.any,
  updateMainPanelView: PropTypes.func,
  updateMainPanelData: PropTypes.func,
  updateSupplementalPanelView: PropTypes.func,
  updateSupplementalPanelData: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(GameBoard);
