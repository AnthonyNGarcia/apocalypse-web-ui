import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import CityDetailsSidebar from './CityDetailsSidebar/CityDetailsSidebar';
import CitySupplementalInfoBox from
  './CitySupplementalInfoBox/CitySupplementalInfoBox';
import CityInteractiveTabMenu from
  './CityInteractiveTabMenu/CityInteractiveTabMenu';
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
  if (props.selectedCity) {
    return (
      <React.Fragment>
        {/* One big row to start making columns */}
        <Row>
          {/* First column is left sidebar, containing basic city info */}
          <Col md={4}>
            <CityDetailsSidebar/>
          </Col>
          {/* Second column is the interactive tab menu
          and supplemental info box */}
          <Col md={8}>
            {/* First row is for interactive tab menu */}
            <Row>
              <CityInteractiveTabMenu/>
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
    ownPlayerNumber: state.gamePlayer.ownPlayerNumber,
    playerOne: state.gamePlayer.playerOne,
    playerTwo: state.gamePlayer.playerTwo,
    selectedCity: state.gameBoardView.gameBoard[
        state.gameBoardView.selectedTilePosition].city,
  };
};

CityMenu.propTypes = {
  ownPlayerNumber: PropTypes.string,
  playerOne: PropTypes.any,
  playerTwo: PropTypes.any,
  selectedCity: PropTypes.any,
};

export default connect(mapStateToProps)(CityMenu);
