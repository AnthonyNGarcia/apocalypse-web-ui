import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import {Honeycomb, Hexagon} from 'react-honeycomb';
import PropTypes from 'prop-types';
import './GameBoard.css';
import '../../../../Utilities/honeycombStyling.css';

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
      const renderFunction = (item) => (
        <Hexagon>
          <img
            src={item.terrainType + '.jpg'}
            alt=""
            className="heximage"/>
        </Hexagon>
      );

      setFullHoneycombConfigs({...props.baseHoneycombConfigs,
        items: props.gameBoard, renderItem: renderFunction});
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

GameBoard.propTypes = {
  gameBoard: PropTypes.array,
  baseHoneycombConfigs: PropTypes.any,
};

export default connect(mapStateToProps)(GameBoard);
