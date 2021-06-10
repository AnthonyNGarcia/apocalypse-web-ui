import React from 'react';
import PropTypes from 'prop-types';
import OwnGarrison from './OwnGarrison/OwnGarrison';
import OwnMainArmy from './OwnMainArmy/OwnMainArmy';
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
      {props.isGarrison ? (
        <OwnGarrison/>
      ) : (
        <OwnMainArmy/>
      )}
    </React.Fragment>
  );
};

OwnArmyBoard.propTypes = {
  isGarrison: PropTypes.bool,
};

export default OwnArmyBoard;
