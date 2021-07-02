import React from 'react';
import Row from 'react-bootstrap/Row';
import MainInfoPanel from './MainInfoPanel/MainInfoPanel';
import SupplementalInfoPanel from
  './SupplementalInfoPanel/SupplementalInfoPanel';
// import ArmyActionBar from '../Centerpiece/ArmyActionBar/ArmyActionBar';
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
    <div className='right-sidebar-sizer'>
      <Row noGutters>
        <MainInfoPanel/>
      </Row>
      <Row noGutters>
        <SupplementalInfoPanel/>
      </Row>
    </div>
  );
};

export default RightSidebar;
