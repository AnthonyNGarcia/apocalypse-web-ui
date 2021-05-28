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
      <Container className='campaign-map-container'>
        <Row>
          <Col>
            <LeftSidebar className='left-sidebar'/>
          </Col>
          <Col>
            <Centerpiece className='centerpiece'/>
          </Col>
          <Col>
            <RightSidebar className='right-sidebar'/>
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  );
};

export default CampaignMap;
