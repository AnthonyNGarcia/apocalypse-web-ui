import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import LeftSidebar from './LeftSidebar/LeftSidebar';
import Centerpiece from './Centerpiece/Centerpiece';
import RightSidebar from './RightSidebar/RightSidebar';
import './CampaignMap.css';

/**
 *
 * CampaignMap JSDocs
 *
 * @param {Object} props passed from the parent component
 * @return {JSX} to render
 */
const CampaignMap = (props) => {
  return (
    <React.Fragment>
      <h3>Campaign Map Component</h3>
      <Container>
        <Row>
          <Col>
            <LeftSidebar/>
          </Col>
          <Col>
            <Centerpiece/>
          </Col>
          <Col>
            <RightSidebar/>
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  );
};

export default CampaignMap;
