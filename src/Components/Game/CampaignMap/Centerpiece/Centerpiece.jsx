import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import GameBoard from './GameBoard/GameBoard';
import ArmyActionBar from './ArmyActionBar/ArmyActionBar';
import MainPromptButton from './MainPromptButton/MainPromptButton';
import './Centerpiece.css';

/**
 *
 * Centerpiece JSDocs
 *
 * @param {Object} props passed from the parent component
 * @return {JSX} to render
 */
const Centerpiece = (props) => {
  return (
    <React.Fragment>
      <h5>Centerpiece Component</h5>
      <Container>
        <Row>
          <GameBoard/>
        </Row>
        <Row>
          <ArmyActionBar/>
        </Row>
        <Row>
          <MainPromptButton/>
        </Row>
      </Container>
    </React.Fragment>
  );
};

export default Centerpiece;
