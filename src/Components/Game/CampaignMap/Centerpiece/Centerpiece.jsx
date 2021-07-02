import React from 'react';
import Row from 'react-bootstrap/Row';
import GameBoard from './GameBoard/GameBoard';
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
      <Row noGutters className='game-board-container center-text'>
        <GameBoard/>
      </Row>
      <Row noGutters>
        <MainPromptButton/>
      </Row>
    </React.Fragment>
  );
};

export default Centerpiece;
