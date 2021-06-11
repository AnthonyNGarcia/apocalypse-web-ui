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
import './OwnMainArmy.css';

/**
 *
 * OwnMainArmy JSDocs
 *
 * @param {Object} props passed from the parent component
 * @return {JSX} to render
 */
const OwnMainArmy = (props) => {
  const [ownArmy, setOwnArmy] = useState(null);

  useEffect(() => {
    if (props.battleData) {
      const attackingArmy = props.battleData.attackingArmy;
      const defendingArmy = props.battleData.defendingArmy;
      if (attackingArmy.owner === props.ownPlayerNumber) {
        setOwnArmy(attackingArmy);
      } else {
        setOwnArmy(defendingArmy);
      }
    }
  }, [props]);

  if (props.battleData && ownArmy) {
    return (
      <React.Fragment>
        <Container fluid className='own-army-container'>
          {/* First dynamically generate the correct number of rows */}
          {[...Array(ownArmy.armyGrid.maxRows + 1).keys()]
              .map((row) => (
                <React.Fragment key={row}>
                  <Row noGutters>
                    {/* Now generate the correct number of positions */}
                    {[...Array(ownArmy.armyGrid.maxPositions + 1).keys()]
                        .map((position) => (
                          <React.Fragment key={'' + row + '-' + position}>
                            <Col className='army-unit-wrapper'>
                              {/* Now render the unit at this row+pos*/}
                              <ArmyUnit ownUnit
                                unit={ownArmy.units[
                                    getIndexFromRowPosition(
                                        ownArmy.armyGrid, row, position)]}
                                unitIndex={getIndexFromRowPosition(
                                    ownArmy.armyGrid, row, position)}
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
    ownPlayerNumber: state.game.ownPlayerNumber,
  };
};

OwnMainArmy.propTypes = {
  battleData: PropTypes.any,
  ownPlayerNumber: PropTypes.string,
};

export default connect(mapStateToProps)(OwnMainArmy);
