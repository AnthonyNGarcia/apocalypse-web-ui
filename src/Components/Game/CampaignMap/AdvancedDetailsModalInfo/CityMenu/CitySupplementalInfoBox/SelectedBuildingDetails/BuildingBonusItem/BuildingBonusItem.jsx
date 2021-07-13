import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import Spinner from 'react-bootstrap/Spinner';
import buildingBonusLabelMaker from
  '../../../../../../../Utilities/buildingBonusLabelMaker';
import './BuildingBonusItem.css';

/**
 *
 * BuildingBonusItem JSDocs
 *
 * @param {Object} props passed from the parent component
 * @return {JSX} to render
 */
const BuildingBonusItem = (props) => {
  const [buildingLabel, setBuildingLabel] = useState(null);

  useEffect(() => {
    if (props.bonus) {
      setBuildingLabel(buildingBonusLabelMaker(props.bonus));
    }
  }, [props, props.bonus]);

  if (buildingLabel) {
    return (
      <React.Fragment>
        {buildingLabel}
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

BuildingBonusItem.propTypes = {
  bonus: PropTypes.any,
};

export default BuildingBonusItem;
