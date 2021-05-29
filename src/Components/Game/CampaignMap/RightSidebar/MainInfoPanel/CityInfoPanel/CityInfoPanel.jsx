import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './CityInfoPanel.css';
import PLAYER from '../../../../../Utilities/playerEnums';

/**
 *
 * CityInfoPanel JSDocs
 *
 * @param {Object} props passed from the parent component
 * @return {JSX} to render
 */
const CityInfoPanel = (props) => {
  const [ownPlayerData, setOwnPlayerData] = useState();
  useEffect(() => {
    if (props.ownPlayerNumber === PLAYER.ONE) {
      setOwnPlayerData(props.playerOne);
    } else if (props.ownPlayerNumber === PLAYER.TWO) {
      setOwnPlayerData(props.playerTwo);
    } else {
      console.log('Oops! Couldn\'t identify own player number/data!');
    }
  }, [props]);
  if (ownPlayerData) {
    return (
      <React.Fragment>
        <Container>
          <Row className='center-text'>
            <footer>{props.mainPanelData.name}</footer>
          </Row>
          <Row className='center-text'>
          Tier {props.mainPanelData.tier} City
          </Row>
          <Row className='center-text'>
            <Col xs={8}>
              <Row>
              Production:
              </Row>
              <Row>
              Research:
              </Row>
              <Row>
              Growth:
              </Row>
            </Col>
            <Col xs={4}>
              <Row>
                {(
                  props.mainPanelData.baseProduction +
                ownPlayerData.flatGlobalProductionBonus
                ) *
              (
                (
                  100 + props.mainPanelData.percentProductionBonus +
                  ownPlayerData.percentGlobalProductionBonus
                ) / 100
              )}
              </Row>
              <Row>
                {(
                  props.mainPanelData.baseResearch +
                ownPlayerData.flatGlobalResearchBonus
                ) *
              (
                (
                  100 + props.mainPanelData.percentResearchBonus +
                  ownPlayerData.percentGlobalResearchBonus
                ) / 100
              )}
              </Row>
              <Row>
                {props.mainPanelData.currentGrowthStockpile}/200 (+{(
                  props.mainPanelData.baseGrowth +
                ownPlayerData.flatGlobalGrowthBonus
                ) *
              (
                (
                  100 + props.mainPanelData.percentGrowthBonus +
                  ownPlayerData.percentGlobalGrowthBonus
                ) / 100
              )})
              </Row>
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    );
  } else {
    return (
      <React.Fragment>
        City Panel View loading...
      </React.Fragment>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    mainPanelData: state.game.mainPanelData,
    allBuildingsConstants: state.game.gameConstants.allBuildings,
    playerOne: state.game.playerOne,
    playerTwo: state.game.playerTwo,
    ownPlayerNumber: state.game.ownPlayerNumber,
  };
};

CityInfoPanel.propTypes = {
  mainPanelData: PropTypes.any,
  allBuildingsConstants: PropTypes.any,
  playerOne: PropTypes.any,
  playerTwo: PropTypes.any,
  ownPlayerNumber: PropTypes.string,
};

export default connect(mapStateToProps)(CityInfoPanel);
