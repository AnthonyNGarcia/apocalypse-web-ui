import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import EnemyArmyBoard from './EnemyArmyBoard/EnemyArmyBoard';
import OwnArmyBoard from './OwnArmyBoard/OwnArmyBoard';
import './ArmyBoards.css';

/**
 *
 * ArmyBoards JSDocs
 *
 * @param {Object} props passed from the parent component
 * @return {JSX} to render
 */
const ArmyBoards = (props) => {
  return (
    <React.Fragment>
      {/* First Row is for enemy Player Name*/}
      <Row>
        [Enemy Player Name]
      </Row>
      {/* Second Row for the Enemy Army Information */}
      <Row>
        {/* First Col is for Enemy Main Army */}
        <Col md={8}>
          {/* First Row is for Main Army Commander Name */}
          <Row>
            [Enemy Main Commander Name]
          </Row>
          {/* Second Row is for the Enemy Main Army Board */}
          <Row>
            <EnemyArmyBoard/>
          </Row>
        </Col>
        {/* Second Col is for Enemy Garrison Army (if any) */}
        <Col nd={4}>
          {/* First Row is for City Garrison Name */}
          <Row>
            [Potential Enemy City Garrison Pending]
          </Row>
          {/* Second Row is for City Garrison Units */}
          <Row>
            <EnemyArmyBoard isGarrison/>
          </Row>
        </Col>
      </Row>
      {/* Third Row for Own Army Information */}
      <Row>
        {/* First Col for Own Main Army */}
        <Col>
          {/* First Row is for own Main Army Units */}
          <Row>
            <OwnArmyBoard/>
          </Row>
          {/* Second Row is for own Main Army Commander Name */}
          <Row>
            [Own Main Commander Name]
          </Row>
        </Col>
        {/* Second Col for Own Garrison Army (if any) */}
        <Col>
          {/* First Row is for City Garrison units */}
          <Row>
            <OwnArmyBoard isGarrison/>
          </Row>
          {/* Second Row is for City Garrison Name */}
          <Row>
            [Potential Own City Garrison Pending]
          </Row>
        </Col>
        <OwnArmyBoard/>
      </Row>
      {/* Fourth Row for Own Player Name */}
      <Row>
        [Own Player Name]
      </Row>
    </React.Fragment>
  );
};

export default ArmyBoards;
