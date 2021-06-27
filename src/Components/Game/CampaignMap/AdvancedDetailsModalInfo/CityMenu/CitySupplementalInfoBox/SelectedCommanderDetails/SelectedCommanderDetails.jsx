import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Spinner from 'react-bootstrap/Spinner';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FACTIONS from '../../../../../../Utilities/factions';
import PLAYER from '../../../../../../Utilities/playerEnums';
import './SelectedCommanderDetails.css';

/**
 *
 * SelectedCommanderDetails JSDocs
 *
 * @param {Object} props passed from the parent component
 * @return {JSX} to render
 */
const SelectedCommanderDetails = (props) => {
  if (props.commander && props.ownFactionType) {
    return (
      <React.Fragment>
        <Row style={{marginTop: '4vh', width: '100%'}} noGutters>
          {/* First col is the image */}
          <Col md={3} style={{paddingRight: '2vw'}}>
            {props.ownFactionType === FACTIONS.HUMANS.NAME ? (
              <img
                src={'HUMAN_ARMY.svg'}
                alt=""
                className='commander-image own-army'
              />
            ) : (
              <img
                src={'INSECT_ARMY.svg'}
                alt=""
                className='commander-image own-army'
              />
            )};
          </Col>
          {/* Second col is the commander info */}
          <Col md={9} style={{paddingRight: '2vw'}}>
            <Row>
              <h5>{props.commander.commanderInfo.displayName}</h5>
            </Row>
            <Row>
              {props.commander.commanderInfo.description}
            </Row>
          </Col>
        </Row>
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

const getOwnFactionTypeFromState = (state) => {
  const ownPlayerNumber = state.gamePlayer.ownPlayerNumber;
  const ownPlayerData = ownPlayerNumber === PLAYER.ONE ?
    state.gamePlayer.playerOne : state.gamePlayer.playerTwo;
  return ownPlayerData.factionType;
};

const mapStateToProps = (state) => {
  return {
    commander: state.cityMenu.cityMenuSupplementalData,
    ownFactionType: getOwnFactionTypeFromState(state),
  };
};

SelectedCommanderDetails.propTypes = {
  commander: PropTypes.any,
  ownFactionType: PropTypes.any,
};

export default connect(mapStateToProps)(SelectedCommanderDetails);
