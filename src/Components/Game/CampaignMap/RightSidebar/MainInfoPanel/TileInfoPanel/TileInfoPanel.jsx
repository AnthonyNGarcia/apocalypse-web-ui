import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import TERRAIN_STATIC_TEXT from '../../../../../Utilities/terrainStaticText';
import './TileInfoPanel.css';

/**
 *
 * TileInfoPanel JSDocs
 *
 * @param {Object} props passed from the parent component
 * @return {JSX} to render
 */
const TileInfoPanel = (props) => {
  const [tileImprovement, setTileImprovement] = useState(null);
  const [asteroid, setAsteroid] = useState(null);
  const [terrainInfo, setTerrainInfo] = useState(null);
  useEffect(() => {
    if (props.selectedTileData && props.selectedTileData.tileImprovement) {
      setTileImprovement((
        <Row>
          <Col>
            <p>Tile Improvement: </p>
          </Col>
          <Col>
            <p>{props.selectedTileData.tileImprovement}</p>
          </Col>
        </Row>
      ));
    } else {
      setTileImprovement((
        <Row>
          <p>There is no tile improvement on this tile.</p>
        </Row>
      ));
    }

    if (props.selectedTileData && props.selectedTileData.asteroid) {
      setAsteroid((
        <Row>
          <p>This tile has been struck by a mysterious asteroid!</p>
          <p>Explore this tile for a random event... if you dare!</p>
        </Row>
      ));
    } else {
      setAsteroid(null);
    }

    const terrainName =
      TERRAIN_STATIC_TEXT[props.selectedTileData.terrainType].name;
    const terrainDescription =
      TERRAIN_STATIC_TEXT[props.selectedTileData.terrainType].description;
    setTerrainInfo((
      <React.Fragment>
        <Row>
          <Col>
            <p>Terrain:</p>
          </Col>
          <Col>
            <p>{terrainName}</p></Col>
        </Row>
        <Row>
          <p>{terrainDescription}</p>
        </Row>
      </React.Fragment>
    ));
  }, [props.selectedTileData]);

  return (
    <React.Fragment>
      <Container>
        {terrainInfo}
        {tileImprovement}
        {asteroid}
      </Container>
    </React.Fragment>
  );
};

const getTileDataFromState = (state) => {
  const selectedTilePosition = state.gameBoardView.selectedTilePosition;
  const gameBoard = state.gameBoardView.gameBoard;
  if (!selectedTilePosition || selectedTilePosition < 0) {
    return null;
  }
  if (!gameBoard) {
    return null;
  }
  if (selectedTilePosition >= gameBoard.length) {
    return null;
  }
  return gameBoard[selectedTilePosition];
};

const mapStateToProps = (state) => {
  return {
    selectedTileData: getTileDataFromState(state),
  };
};

TileInfoPanel.propTypes = {
  selectedTileData: PropTypes.any,
};

export default connect(mapStateToProps)(TileInfoPanel);
