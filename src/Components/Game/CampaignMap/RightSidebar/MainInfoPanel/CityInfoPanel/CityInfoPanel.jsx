import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import cityMenuAC from
  '../../../../../../Redux/actionCreators/cityMenuActionCreators';
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
      console.warn('Oops! Couldn\'t identify own player number/data!');
    }
  }, [props]);

  if (ownPlayerData) {
    return (
      <React.Fragment>
        <Container>
          {props.ownPlayerNumber === props.selectedCity.owner ?
          <React.Fragment>
            <Row className='center-text'>
              <h2>{props.selectedCity.name}</h2>
            </Row>
            <Row className='center-text'>
              <h5>Tier {props.selectedCity.tier} City</h5>
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
                  {props.selectedCity.totalBuildingProduction}
                </Row>
                <Row>
                  {props.selectedCity.totalResearch}
                </Row>
                <Row>
                  {props.selectedCity.currentGrowthStockpile}/250 (+{
                    props.selectedCity.totalGrowth
                  })
                </Row>
              </Col>
            </Row>
            <Row className='center-text'>
              <Button variant="primary"
                onClick={showCityMenuHandler}>Show City Menu</Button>
            </Row>
          </React.Fragment> :
             <React.Fragment>
               <Row className='center-text enemy-entity'>
                 <h2>{props.selectedCity.name}</h2>
               </Row>
               <Row className='center-text enemy-entity'>
                 <h5>Tier {props.selectedCity.tier} City</h5>
               </Row>
               <Row className='center-text enemy-entity'>
                 <p>This is an enemy City.</p>
               </Row>
             </React.Fragment>}
          <Row>
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
    selectedCity: state.gameBoardView.gameBoard[
        state.gameBoardView.selectedTilePosition].city,
    playerOne: state.gamePlayer.playerOne,
    playerTwo: state.gamePlayer.playerTwo,
    ownPlayerNumber: state.gamePlayer.ownPlayerNumber,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateShowCityModalInfo: (showCityModalInfo) => dispatch(
        cityMenuAC.setShowCityModalInfo(showCityModalInfo)),
  };
};

CityInfoPanel.propTypes = {
  selectedCity: PropTypes.any,
  playerOne: PropTypes.any,
  playerTwo: PropTypes.any,
  ownPlayerNumber: PropTypes.string,
};

export default connect(mapStateToProps, mapDispatchToProps)(CityInfoPanel);
