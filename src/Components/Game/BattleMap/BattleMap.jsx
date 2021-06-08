import React from 'react';
import Col from 'react-bootstrap/Col';
import BattleSidebar from './BattleSidebar/BattleSidebar';
import ArmyBoards from './ArmyBoards/ArmyBoards';
import './BattleMap.css';

/**
 *
 * BattleMap JSDocs
 *
 * @param {Object} props passed from the parent component
 * @return {JSX} to render
 */
const BattleMap = (props) => {
  return (
    <React.Fragment>
      {/* First col contains the boards */}
      <Col md={8}>
        <ArmyBoards/>
      </Col>
      {/* Second col contains the right sidebar */}
      <Col md={4}>
        <BattleSidebar/>
      </Col>
    </React.Fragment>
  );
};

export default BattleMap;
