import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import gameAC from
  '../../../../../../Redux/actionCreators/gameActionCreators';
import PLAYER from '../../../../../Utilities/playerEnums';
import ADVANCED_DETAILS_MODAL_VIEW from
  '../../../../../Utilities/advancedDetailsModalViews';
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
    props.updateAdvancedDetailsModalView(ADVANCED_DETAILS_MODAL_VIEW.CITY_MENU);
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

  if (ownPlayerData && props.selectedCity) {
    return (
      <React.Fragment>
        {props.ownPlayerNumber === props.selectedCity.owner ?
          <React.Fragment>
            <Row className='center-text own-city-entity'>
              <div>
                <h2>{props.selectedCity.name}</h2>
                <h5>{props.selectedCity.scorchedEarth ? (
                      <span>Scorched ({props.selectedCity
                          .turnsRemainingForScorchedEarth} <span><img
                        src={'timer.svg'}
                        alt=""
                        className={'tiny-white-timer-icon'}
                      /></span>)</span>
                    ) : null}</h5>
                <h5>{props.selectedCity.wallsDestroyed ? (
                      <span>Walls Destroyed ({props.selectedCity
                          .turnsRemainingForDestroyedWalls} <span><img
                        src={'timer.svg'}
                        alt=""
                        className={'tiny-white-timer-icon'}
                      /></span>)</span>
                    ) : null}</h5>
                <h5>{props.selectedCity.isDevastated ? (
                      <span>Devastated ({props.selectedCity
                          .turnsRemainingForDevastation} <span><img
                        src={'timer.svg'}
                        alt=""
                        className={'tiny-white-timer-icon'}
                      /></span>)</span>
                    ) : null}</h5>
              </div>
            </Row>
            <Row className='center-text own-city-entity'>
              <h5>Tier {props.selectedCity.tier} City</h5>
            </Row>
            <Row className='center-text own-city-entity'>
              <Col xs={6}>
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
              <Col xs={6}>
                <Row>
                  {props.selectedCity.totalBuildingProduction}
                </Row>
                <Row>
                  {props.selectedCity.totalResearch}
                </Row>
                <Row>
                  {props.selectedCity.currentGrowthStockpile}/{
                    props.selectedCity.growthToNextTier} (+{
                    props.selectedCity.totalGrowth
                  })
                </Row>
              </Col>
            </Row>
            <Row className='center-text'>
              <Button variant="primary"
                disabled={props.selectedCity.isDevastated}
                onClick={showCityMenuHandler}>Show City Menu</Button>
            </Row>
          </React.Fragment> :
             <React.Fragment>
               <Row className='center-text enemy-entity'>
                 <div>
                   <h2>{props.selectedCity.name}</h2>
                   <h5>{props.selectedCity.scorchedEarth ? (
                      <span>Scorched ({props.selectedCity
                          .turnsRemainingForScorchedEarth} <span><img
                        src={'timer.svg'}
                        alt=""
                        className={'tiny-white-timer-icon'}
                      /></span>)</span>
                    ) : null}</h5>
                   <h5>{props.selectedCity.wallsDestroyed ? (
                      <span>Walls Destroyed ({props.selectedCity
                          .turnsRemainingForDestroyedWalls} <span><img
                        src={'timer.svg'}
                        alt=""
                        className={'tiny-white-timer-icon'}
                      /></span>)</span>
                    ) : null}</h5>
                   <h5>{props.selectedCity.isDevastated ? (
                      <span>Devastated ({props.selectedCity
                          .turnsRemainingForDevastation} <span><img
                        src={'timer.svg'}
                        alt=""
                        className={'tiny-white-timer-icon'}
                      /></span>)</span>
                    ) : null}</h5>
                 </div>
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
    updateAdvancedDetailsModalView: (view) => dispatch(
        gameAC.setAdvancedDetailsModalView(view)),
  };
};

CityInfoPanel.propTypes = {
  selectedCity: PropTypes.any,
  playerOne: PropTypes.any,
  playerTwo: PropTypes.any,
  ownPlayerNumber: PropTypes.string,
  updateAdvancedDetailsModalView: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(CityInfoPanel);
