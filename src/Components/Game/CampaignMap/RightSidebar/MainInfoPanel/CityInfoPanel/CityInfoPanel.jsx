import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import gameAC from '../../../../../../Redux/actionCreators/gameActionCreators';
import PLAYER from '../../../../../Utilities/playerEnums';
import './CityInfoPanel.css';

/**
 *
 * CityInfoPanel JSDocs
 *
 * @param {Object} props passed from the parent component
 * @return {JSX} to render
 */
const CityInfoPanel = (props) => {
  const [ownPlayerData, setOwnPlayerData] = useState();

  const showCityMenuHandler = (e) => {
    e.preventDefault();
    props.updateShowCityModalInfo(true);
  };

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
          <Row>
            {props.ownPlayerNumber === props.mainPanelData.owner ?
            <Button variant="primary"
              onClick={showCityMenuHandler}>Show City Menu</Button> : null}
          </Row>
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
    mainPanelData: state.game.mainPanelData,
    playerOne: state.game.playerOne,
    playerTwo: state.game.playerTwo,
    ownPlayerNumber: state.game.ownPlayerNumber,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateShowCityModalInfo: (showCityModalInfo) => dispatch(
        gameAC.setShowCityModalInfo(showCityModalInfo)),
  };
};

CityInfoPanel.propTypes = {
  mainPanelData: PropTypes.any,
  playerOne: PropTypes.any,
  playerTwo: PropTypes.any,
  ownPlayerNumber: PropTypes.string,
};

export default connect(mapStateToProps, mapDispatchToProps)(CityInfoPanel);
