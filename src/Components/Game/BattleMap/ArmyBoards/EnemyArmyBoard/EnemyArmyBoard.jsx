import React from 'react';
import PropTypes from 'prop-types';
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
      [Enemy Army Board]
      {props.isGarrison ? (
        <p>Enemy Army Units Pending</p>
      ) : (
        <p>Enemy Garrison Units Pending</p>
      )}
    </React.Fragment>
  );
};

EnemyArmyBoard.propTypes = {
  isGarrison: PropTypes.bool,
};

export default EnemyArmyBoard;