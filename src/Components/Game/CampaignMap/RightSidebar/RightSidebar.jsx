import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import MainInfoPanel from './MainInfoPanel/MainInfoPanel';
import SupplementalInfoPanel from
  './SupplementalInfoPanel/SupplementalInfoPanel';
import './RightSidebar.css';

/**
 *
 * RightSidebar JSDocs
 *
 * @param {Object} props passed from the parent component
 * @return {JSX} to render
 */
const RightSidebar = (props) => {
  return (
    <React.Fragment>
      <Container>
        <Row>
          <MainInfoPanel/>
        </Row>
        <Row>
          <SupplementalInfoPanel/>
        </Row>
      </Container>
    </React.Fragment>
  );
};

export default RightSidebar;
