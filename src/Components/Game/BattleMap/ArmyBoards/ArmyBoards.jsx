import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Spinner from 'react-bootstrap/esm/Spinner';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import EnemyArmyBoard from './EnemyArmyBoard/EnemyArmyBoard';
import OwnArmyBoard from './OwnArmyBoard/OwnArmyBoard';
import PLAYER from '../../../Utilities/playerEnums';
import './ArmyBoards.css';

/**
 *
 * ArmyBoards JSDocs
 *
 * @param {Object} props passed from the parent component
 * @return {JSX} to render
 */
const ArmyBoards = (props) => {
  const [ownArmy, setOwnArmy] = useState(null);
  const [enemyArmy, setEnemyArmy] = useState(null);

  useEffect(() => {
    if (props.battleData) {
      const attackingArmy = props.battleData.attackingArmy;
      const defendingArmy = props.battleData.defendingArmy;
      if (attackingArmy.owner === props.ownPlayerNumber) {
        setOwnArmy(attackingArmy);
        setEnemyArmy(defendingArmy);
      } else {
        setOwnArmy(defendingArmy);
        setEnemyArmy(attackingArmy);
      }
    }
  }, [props]);

  if (props.battleData && ownArmy && enemyArmy) {
    return (
      <React.Fragment>
        {/* First Row for the Enemy Army Information */}
        <Row>
          {/* First Col is for Enemy Main Army */}
          <Col md={12}>
            {/* First Row is for Main Army Commander Name */}
            <Row>
              <h2 className='enemy-entity-title'>{
                enemyArmy.commander.commanderInfo.displayName}</h2>
            </Row>
            {/* Second Row is for the Enemy Main Army Board */}
            <Row>
              <EnemyArmyBoard/>
            </Row>
          </Col>
          {/* Second Col is for Enemy Garrison Army (if any) */}
          {true ? null :
          <Col nd={4}>
            {/* First Row is for City Garrison Name */}
            <Row>
            </Row>
            {/* Second Row is for City Garrison Units */}
            <Row>
              <EnemyArmyBoard isGarrison/>
            </Row>
          </Col>
          }
        </Row>
        {/* Second Row for Own Army Information */}
        <Row>
          {/* First Col for Own Main Army */}
          <Col md={12}>
            {/* First Row is for own Main Army Units */}
            <Row>
              <OwnArmyBoard/>
            </Row>
            {/* Second Row is for own Main Army Commander Name */}
            <Row>
              <h2 className='own-entity-title'>{
                ownArmy.commander.commanderInfo.displayName}</h2>
            </Row>
          </Col>
          {/* Second Col for Own Garrison Army (if any) */}
          {true ? null :
          <Col>
            {/* First Row is for City Garrison units */}
            <Row>
              <OwnArmyBoard isGarrison/>
            </Row>
            {/* Second Row is for City Garrison Name */}
            <Row>
            </Row>
          </Col>
          }
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
const mapStateToProps = (state) => {
  return {
    ownUsername: state.gamePlayer.ownPlayerNumber === PLAYER.ONE ?
      state.gamePlayer.playerOne.username :
      state.gamePlayer.playerTwo.username,
    enemyUsername: state.gamePlayer.ownPlayerNumber === PLAYER.ONE ?
      state.gamePlayer.playerTwo.username :
      state.gamePlayer.playerOne.username,
    battleData: state.battleView.battleData,
    ownPlayerNumber: state.gamePlayer.ownPlayerNumber,
  };
};

ArmyBoards.propTypes = {
  ownUsername: PropTypes.string,
  enemyUsername: PropTypes.string,
  battleData: PropTypes.any,
  ownPlayerNumber: PropTypes.string,
};

export default connect(mapStateToProps)(ArmyBoards);
