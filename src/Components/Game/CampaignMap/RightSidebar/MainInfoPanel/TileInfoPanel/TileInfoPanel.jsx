import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
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
      setTileImprovement(null);
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

    let terrainName;
    let terrainDescription;
    let growthBonusLabel;
    let productionBonusLabel;
    let researchBonusLabel;

    const generateGrowthBonusLabel = (fullTerrainData) => {
      if (fullTerrainData.flatGrowthBonusToOccupyingCity > 0 ||
          fullTerrainData.flatGrowthBonusToAdjacentCity > 0 ||
          fullTerrainData.percentGrowthBonusToAdjacentCity > 0 ||
          fullTerrainData.percentGrowthBonusToOccupyingCity > 0) {
        // We have at least some kind of growth bonus, so prepare a label
        let occupyGrowthBonus = '-';
        if (fullTerrainData.flatGrowthBonusToOccupyingCity > 0 &&
            fullTerrainData.percentGrowthBonusToOccupyingCity <= 0) {
          // We have a flat growth bonus to occupying, but no percent
          occupyGrowthBonus = '+' + fullTerrainData
              .flatGrowthBonusToOccupyingCity;
        } else if (
          fullTerrainData.flatGrowthBonusToOccupyingCity <= 0 &&
          fullTerrainData.percentGrowthBonusToOccupyingCity > 0) {
          // We have a percent growth bonus to occupying, but no flat
          occupyGrowthBonus = '+' + fullTerrainData
              .percentGrowthBonusToOccupyingCity + '%';
        } else if (
          fullTerrainData.flatGrowthBonusToOccupyingCity > 0 &&
          fullTerrainData.percentGrowthBonusToOccupyingCity > 0) {
          // We have both a flat and percent growth bonus to occupying
          occupyGrowthBonus = '+' + fullTerrainData
              .flatGrowthBonusToOccupyingCity + ', +' + fullTerrainData
              .percentGrowthBonusToOccupyingCity + '%';
        }
        let adjacentGrowthBonus = '';
        if (fullTerrainData.flatGrowthBonusToAdjacentCity > 0 &&
            fullTerrainData.percentGrowthBonusToAdjacentCity <= 0) {
          // We have a flat growth bonus to adjacency, but no percent
          adjacentGrowthBonus = '+' + fullTerrainData
              .flatGrowthBonusToAdjacentCity;
        } else if (
          fullTerrainData.flatGrowthBonusToAdjacentCity <= 0 &&
          fullTerrainData.percentGrowthBonusToAdjacentCity > 0) {
          // We have a percent growth bonus to adjacency, but no flat
          adjacentGrowthBonus = '+' + fullTerrainData
              .percentGrowthBonusToAdjacentCity + '%';
        } else if (
          fullTerrainData.flatGrowthBonusToAdjacentCity > 0 &&
          fullTerrainData.percentGrowthBonusToAdjacentCity > 0) {
          // We have both a flat and percent growth bonus to adjacency
          adjacentGrowthBonus = '+' + fullTerrainData
              .flatGrowthBonusToAdjacentCity + ', +' + fullTerrainData
              .percentGrowthBonusToAdjacentCity + '%';
        }
        return occupyGrowthBonus + ' | ' + adjacentGrowthBonus;
      } else {
        return null;
      }
    };

    const generateProductionBonusLabel = (fullTerrainData) => {
      if (fullTerrainData.flatProductionBonusToOccupyingCity > 0 ||
          fullTerrainData.flatProductionBonusToAdjacentCity > 0 ||
          fullTerrainData.percentProductionBonusToOccupyingCity > 0 ||
          fullTerrainData.percentProductionBonusToAdjacentCity > 0) {
        // We have at least some kind of production bonus, so prepare a label
        let occupyProductionBonus = '-';
        if (fullTerrainData.flatProductionBonusToOccupyingCity > 0 &&
            fullTerrainData.percentProductionBonusToOccupyingCity <= 0) {
          // We have a flat production bonus to occupying, but no percent
          occupyProductionBonus = '+' + fullTerrainData
              .flatProductionBonusToOccupyingCity;
        } else if (
          fullTerrainData.flatProductionBonusToOccupyingCity <= 0 &&
          fullTerrainData.percentProductionBonusToOccupyingCity > 0) {
          // We have a percent production bonus to occupying, but no flat
          occupyProductionBonus = '+' + fullTerrainData
              .percentProductionBonusToOccupyingCity + '%';
        } else if (
          fullTerrainData.flatProductionBonusToOccupyingCity > 0 &&
          fullTerrainData.percentProductionBonusToOccupyingCity > 0) {
          // We have both a flat and percent production bonus to occupying
          occupyProductionBonus = '+' + fullTerrainData
              .flatProductionBonusToOccupyingCity + ', +' + fullTerrainData
              .percentProductionBonusToOccupyingCity + '%';
        }
        let adjacentProductionBonus = '';
        if (fullTerrainData.flatProductionBonusToAdjacentCity > 0 &&
            fullTerrainData.percentProductionBonusToAdjacentCity <= 0) {
          // We have a flat production bonus to adjacency, but no percent
          adjacentProductionBonus = '+' + fullTerrainData
              .flatProductionBonusToAdjacentCity;
        } else if (
          fullTerrainData.flatProductionBonusToAdjacentCity <= 0 &&
          fullTerrainData.percentProductionBonusToAdjacentCity > 0) {
          // We have a percent production bonus to adjacency, but no flat
          adjacentProductionBonus = '+' + fullTerrainData
              .percentProductionBonusToAdjacentCity + '%';
        } else if (
          fullTerrainData.flatProductionBonusToAdjacentCity > 0 &&
          fullTerrainData.percentProductionBonusToAdjacentCity > 0) {
          // We have both a flat and percent production bonus to adjacency
          adjacentProductionBonus = '+' + fullTerrainData
              .flatProductionBonusToAdjacentCity + ', +' + fullTerrainData
              .percentProductionBonusToAdjacentCity + '%';
        }
        return occupyProductionBonus + ' | ' + adjacentProductionBonus;
      } else {
        return null;
      }
    };

    const generateResearchBonusLabel = (fullTerrainData) => {
      if (fullTerrainData.flatResearchBonusToOccupyingCity > 0 ||
          fullTerrainData.flatResearchBonusToAdjacentCity > 0 ||
          fullTerrainData.percentResearchBonusToOccupyingCity > 0 ||
          fullTerrainData.percentResearchBonusToAdjacentCity > 0) {
        // We have at least some kind of production bonus, so prepare a label
        let occupyResearchBonus = '-';
        if (fullTerrainData.flatResearchBonusToOccupyingCity > 0 &&
            fullTerrainData.percentResearchBonusToOccupyingCity <= 0) {
          // We have a flat production bonus to occupying, but no percent
          occupyResearchBonus = '+' + fullTerrainData
              .flatResearchBonusToOccupyingCity;
        } else if (
          fullTerrainData.flatResearchBonusToOccupyingCity <= 0 &&
          fullTerrainData.percentResearchBonusToOccupyingCity > 0) {
          // We have a percent production bonus to occupying, but no flat
          occupyResearchBonus = '+' + fullTerrainData
              .percentResearchBonusToOccupyingCity + '%';
        } else if (
          fullTerrainData.flatResearchBonusToOccupyingCity > 0 &&
          fullTerrainData.percentResearchBonusToOccupyingCity > 0) {
          // We have both a flat and percent production bonus to occupying
          occupyResearchBonus = '+' + fullTerrainData
              .flatResearchBonusToOccupyingCity + ', +' + fullTerrainData
              .percentResearchBonusToOccupyingCity + '%';
        }
        let adjacentResearchBonus = '';
        if (fullTerrainData.flatResearchBonusToAdjacentCity > 0 &&
            fullTerrainData.percentResearchBonusToAdjacentCity <= 0) {
          // We have a flat production bonus to adjacency, but no percent
          adjacentResearchBonus = '+' + fullTerrainData
              .flatResearchBonusToAdjacentCity;
        } else if (
          fullTerrainData.flatResearchBonusToAdjacentCity <= 0 &&
          fullTerrainData.percentResearchBonusToAdjacentCity > 0) {
          // We have a percent production bonus to adjacency, but no flat
          adjacentResearchBonus = '+' + fullTerrainData
              .percentResearchBonusToAdjacentCity + '%';
        } else if (
          fullTerrainData.flatResearchBonusToAdjacentCity > 0 &&
          fullTerrainData.percentResearchBonusToAdjacentCity > 0) {
          // We have both a flat and percent production bonus to adjacency
          adjacentResearchBonus = '+' + fullTerrainData
              .flatResearchBonusToAdjacentCity + ', +' + fullTerrainData
              .percentResearchBonusToAdjacentCity + '%';
        }
        return occupyResearchBonus + ' | ' + adjacentResearchBonus;
      } else {
        return null;
      }
    };

    if (props.fullTerrainData) {
      terrainName = props.fullTerrainData.displayName;
      terrainDescription = props.fullTerrainData.description;
      growthBonusLabel = generateGrowthBonusLabel(props.fullTerrainData);
      productionBonusLabel = generateProductionBonusLabel(
          props.fullTerrainData);
      researchBonusLabel = generateResearchBonusLabel(props.fullTerrainData);
    }

    setTerrainInfo((
      <React.Fragment>
        <Row className='center-text'>
          <h3>{terrainName}</h3>
        </Row>
        <Row>
          <p>{terrainDescription}</p>
        </Row>
        <Row className='center-text'>
          <h5>Yield Bonuses to City</h5>
        </Row>
        <Row className='center-text'>
          <h5>(On | Adjacent)</h5>
        </Row>
        {growthBonusLabel || productionBonusLabel || researchBonusLabel ? (
          <React.Fragment>
            {growthBonusLabel ? (
           <Row>
             <Col xs={4}>
          Growth:
             </Col>
             <Col xs={8}>
               {growthBonusLabel}
             </Col>
           </Row>
        ): null}
            {productionBonusLabel ? (
           <Row>
             <Col xs={4}>
          Production:
             </Col>
             <Col xs={8}>
               {productionBonusLabel}
             </Col>
           </Row>
        ): null}
            {researchBonusLabel ? (
           <Row>
             <Col xs={4}>
          Research:
             </Col>
             <Col xs={8}>
               {researchBonusLabel}
             </Col>
           </Row>
        ): null}
          </React.Fragment>
        ) : (
          <React.Fragment>
            None!
          </React.Fragment>
        )
        }
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
  if (selectedTilePosition < 0) {
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

const getTerrainDataFromState = (state) => {
  const selectedTilePosition = state.gameBoardView.selectedTilePosition;
  const gameBoard = state.gameBoardView.gameBoard;
  if (selectedTilePosition < 0) {
    return null;
  }
  if (!gameBoard) {
    return null;
  }
  if (selectedTilePosition >= gameBoard.length) {
    return null;
  }
  const selectedTile = gameBoard[selectedTilePosition];
  if (!selectedTile) {
    return null;
  }
  const terrainType = selectedTile.terrainType;
  if (!terrainType) {
    return null;
  }
  const fullTerrainData = state.game.gameConstants.allTerrains[terrainType];
  return fullTerrainData;
};

const mapStateToProps = (state) => {
  return {
    selectedTileData: getTileDataFromState(state),
    fullTerrainData: getTerrainDataFromState(state),
  };
};

TileInfoPanel.propTypes = {
  selectedTileData: PropTypes.any,
  fullTerrainData: PropTypes.any,
};

export default connect(mapStateToProps)(TileInfoPanel);
