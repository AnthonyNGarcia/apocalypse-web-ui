import React from 'react';
import PropTypes from 'prop-types';
import './OwnArmyBoard.css';

/**
 *
 * OwnArmyBoard JSDocs
 *
 * @param {Object} props passed from the parent component
 * @return {JSX} to render
 */
const OwnArmyBoard = (props) => {
  return (
    <React.Fragment>
      {/* Dynamically map units to rows and columns based on unit positions */}
      [Own Army Board]
      {props.isGarrison ? (
        <p>Own Army Units Pending</p>
      ) : (
        <p>Own Garrison Units Pending</p>
      )}
    </React.Fragment>
  );
};

OwnArmyBoard.propTypes = {
  isGarrison: PropTypes.bool,
};

export default OwnArmyBoard;
