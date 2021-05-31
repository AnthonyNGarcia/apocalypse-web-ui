import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import CityDetailsSidebar from './CityDetailsSidebar/CityDetailsSidebar';
import CitySupplementalInfoBox from
  './CitySupplementalInfoBox/CitySupplementalInfoBox';
import CityInteractiveTabMenu from
  './CityInteractiveTabMenu/CityInteractiveTabMenu';
import PLAYER from '../../../../Utilities/playerEnums';
import Spinner from 'react-bootstrap/esm/Spinner';
import './CityMenu.css';

/**
 *
 * CityMenu JSDocs
 *
 * @param {Object} props passed from the parent component
 * @return {JSX} to render
 */
const CityMenu = (props) => {
  const [finalProduction, setFinalProduction] = useState(0);
  const [finalGrowth, setFinalGrowth] = useState(0);
  const [finalResearch, setFinalResearch] = useState(0);
  const [cityBeingInspected, setCityBeingInspected] = useState(null);

  useEffect(() => {
    // Identify own player data
    let ownData;
    if (props.ownPlayerNumber === PLAYER.ONE) {
      ownData = props.playerOne;
    } else if (props.ownPlayerNumber === PLAYER.TWO) {
      ownData = props.playerTwo;
    } else {
      console.warn('Oops! Couldn\'t identify own player number/data!');
    }
    // Set city being inspected
    const city = props.gameBoard[props.selectedTilePosition].city;
    setCityBeingInspected(city);
    // Calculate production
    const calculatedProduction = (city.baseProduction +
      ownData.flatGlobalProductionBonus) *
      ((100 + city.percentProductionBonus +
        ownData.percentGlobalProductionBonus) / 100);
    setFinalProduction(calculatedProduction);
    // Calculate research
    const calculatedResearch = (city.baseResearch +
      ownData.flatGlobalResearchBonus) *
      ((100 + city.percentResearchBonus +
        ownData.percentGlobalResearchBonus) / 100);
    setFinalResearch(calculatedResearch);
    // Calculate growth
    const calculatedGrowth = (city.baseGrowth +
      ownData.flatGlobalGrowthBonus) *
      ((100 + city.percentGrowthBonus +
        ownData.percentGlobalGrowthBonus) / 100);
    setFinalGrowth(calculatedGrowth);
  }, [props]);

  if (cityBeingInspected) {
    return (
      <React.Fragment>
        {/* One big row to start making columns */}
        <Row>
          {/* First column is left sidebar, containing basic city info */}
          <Col md={4}>
            <CityDetailsSidebar
              finalProduction={finalProduction}
              finalGrowth={finalGrowth}
              finalResearch={finalResearch}
              city={cityBeingInspected}/>
          </Col>
          {/* Second column is the interactive tab menu
          and supplemental info box */}
          <Col md={8}>
            {/* First row is for interactive tab menu */}
            <Row>
              <CityInteractiveTabMenu
                finalProduction={finalProduction}
                city={{...cityBeingInspected}}/>
            </Row>
            {/* Second row is for supplemental info box */}
            <Row>
              <CitySupplementalInfoBox/>
            </Row>
          </Col>
        </Row>
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
    ownPlayerNumber: state.game.ownPlayerNumber,
    playerOne: state.game.playerOne,
    playerTwo: state.game.playerTwo,
    selectedTilePosition: state.game.selectedTilePosition,
    gameBoard: state.game.gameBoard,
  };
};

CityMenu.propTypes = {
  ownPlayerNumber: PropTypes.string,
  playerOne: PropTypes.any,
  playerTwo: PropTypes.any,
  selectedTilePosition: PropTypes.number,
  gameBoard: PropTypes.any,
};

export default connect(mapStateToProps)(CityMenu);
