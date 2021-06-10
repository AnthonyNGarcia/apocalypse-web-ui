import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Spinner from 'react-bootstrap/esm/Spinner';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ArmyUnit from '../../ArmyUnit/ArmyUnit';
import getIndexFromRowPosition from
  '../../../../../Utilities/getIndexFromRowPosition';
import './EnemyMainArmy.css';

/**
 *
 * EnemyMainArmy JSDocs
 *
 * @param {Object} props passed from the parent component
 * @return {JSX} to render
 */
const EnemyMainArmy = (props) => {
  const [enemyArmy, setEnemyArmy] = useState(null);

  useEffect(() => {
    if (props.battleData) {
      const attackingArmy = props.battleData.attackingArmy;
      const defendingArmy = props.battleData.defendingArmy;
      if (attackingArmy.owner === props.ownPlayerNumber) {
        setEnemyArmy(defendingArmy);
      } else {
        setEnemyArmy(attackingArmy);
      }
    }
  }, [props]);

  if (props.battleData && enemyArmy) {
    return (
      <React.Fragment>
        <Container fluid className='enemy-army-container'>
          {/* First dynamically generate the correct number of rows */}
          {Array.from(Array(enemyArmy.armyGrid.maxRows).keys()).reverse()
              .map((row) => (
                <React.Fragment key={row}>
                  <Row noGutters>
                    {/* Now generate the correct number of positions */}
                    {Array.from(Array(enemyArmy.armyGrid.maxPositions).keys())
                        .map((position) => (
                          <React.Fragment key={'' + row + '-' + position}>
                            <Col className='army-unit-wrapper'>
                              {/* Now render the unit at this row+pos*/}
                              <ArmyUnit
                                unit={enemyArmy.units[
                                    getIndexFromRowPosition(
                                        enemyArmy.armyGrid, row, position)]}
                              />
                            </Col>
                          </React.Fragment>
                        ))}
                  </Row>
                </React.Fragment>
              ))}
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
    battleData: state.game.battleData,
    allUnits: state.game.gameConstants.allUnits,
    ownPlayerNumber: state.game.ownPlayerNumber,
  };
};

EnemyMainArmy.propTypes = {
  battleData: PropTypes.any,
  allUnits: PropTypes.any,
  ownPlayerNumber: PropTypes.string,
};

export default connect(mapStateToProps)(EnemyMainArmy);
