import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import CityDetailsSidebar from './CityDetailsSidebar/CityDetailsSidebar';
import CitySupplementalInfoBox from
  './CitySupplementalInfoBox/CitySupplementalInfoBox';
import CityInteractiveTabMenu from
  './CityInteractiveTabMenu/CityInteractiveTabMenu';
import './CityMenu.css';

/**
 *
 * CityMenu JSDocs
 *
 * @param {Object} props passed from the parent component
 * @return {JSX} to render
 */
const CityMenu = (props) => {
  return (
    <React.Fragment>
      <Container>
        {/* One big row to start making columns */}
        <Row>
          {/* First column is left sidebar of the city menu, containing info */}
          <Col>
            <CityDetailsSidebar/>
          </Col>
          {/* Second column is the interactive tab menu
          and supplemental info box */}
          <Col>
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
      </Container>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    mainPanelData: state.game.mainPanelData,
  };
};

CityMenu.propTypes = {
  mainPanelData: PropTypes.any,
};

export default connect(mapStateToProps)(CityMenu);
