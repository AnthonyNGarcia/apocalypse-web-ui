import React from 'react';
import PropTypes from 'prop-types';
import EnemyGarrison from './EnemyGarrison/EnemyGarrison';
import EnemyMainArmy from './EnemyMainArmy/EnemyMainArmy';
import './EnemyArmyBoard.css';

/**
 *
 * EnemyArmyBoard JSDocs
 *
 * @param {Object} props passed from the parent component
 * @return {JSX} to render
 */
const EnemyArmyBoard = (props) => {
  return (
    <React.Fragment>
      {/* Dynamically map units to rows and columns based on unit positions */}
      {props.isGarrison ? (
        <EnemyGarrison/>
      ) : (
        <EnemyMainArmy/>
      )}
    </React.Fragment>
  );
};

EnemyArmyBoard.propTypes = {
  isGarrison: PropTypes.bool,
};

export default EnemyArmyBoard;
