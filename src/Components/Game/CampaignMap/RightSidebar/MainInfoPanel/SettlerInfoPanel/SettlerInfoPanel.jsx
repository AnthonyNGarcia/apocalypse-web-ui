import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import './SettlerInfoPanel.css';

/**
 *
 * SettlerInfoPanel JSDocs
 *
 * @param {Object} props passed from the parent component
 * @return {JSX} to render
 */
const SettlerInfoPanel = (props) => {
  if (props.selectedSettler) {
    return (
      <React.Fragment>
        <Container>
          {props.ownPlayerNumber === props.selectedSettler.owner ?
        <React.Fragment>
          <Row className='center-text'>
            <h2>{props.allFactions[props.selectedSettler.factionType]
                .unitAdjective} Settler</h2>
          </Row>
          <Row>
            <p>
              {'This unit can be used to create new Cities! However, ' +
              ' it will be killed immediately if captured by an enemy!'}
            </p>
          </Row>
        </React.Fragment> :
        <React.Fragment>
          <Row className='center-text enemy-entity'>
            <h2>{props.allFactions[props.selectedSettler.factionType]
                .unitAdjective} Settler</h2>
          </Row>
          <Row className='center-text enemy-entity'>
            {'This is an enemy Settler. You should capture and destroy ' +
            'it with an army before it creates a new enemy City!'}
          </Row>
        </React.Fragment>}
        </Container>
      </React.Fragment>
    );
  } else {
    return (
      <React.Fragment>
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </React.Fragment>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    selectedSettler: state.gameBoardView.gameBoard[
        state.gameBoardView.selectedTilePosition].settler,
    ownPlayerNumber: state.gamePlayer.ownPlayerNumber,
    allFactions: state.game.gameConstants.allFactions,
  };
};

SettlerInfoPanel.propTypes = {
  selectedSettler: PropTypes.any,
  ownPlayerNumber: PropTypes.any,
  allFactions: PropTypes.any,
};

export default connect(mapStateToProps)(SettlerInfoPanel);
