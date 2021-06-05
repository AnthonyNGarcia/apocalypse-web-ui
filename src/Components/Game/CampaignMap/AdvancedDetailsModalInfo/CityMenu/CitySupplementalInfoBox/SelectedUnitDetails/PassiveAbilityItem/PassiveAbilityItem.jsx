import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import Spinner from 'react-bootstrap/Spinner';
import PASSIVE_ABILITIES from '../../../../../../../Utilities/passiveAbilities';
import './PassiveAbilityItem.css';

/**
 *
 * PassiveAbilityItem JSDocs
 *
 * @param {Object} props passed from the parent component
 * @return {JSX} to render
 */
const PassiveAbilityItem = (props) => {
  const [passiveAbilityLabel, setPassiveAbilityLabel] = useState(null);

  useEffect(() => {
    if (props.passiveAbility) {
      const labelMaker =
        PASSIVE_ABILITIES[props.passiveAbility.passiveAbilityType];
      let label;
      if (labelMaker.displayName) {
        label = labelMaker.displayName;
      } else {
        label = labelMaker.prefix + props.passiveAbility.value +
          labelMaker.suffix;
      }
      setPassiveAbilityLabel(label);
    }
  }, [props]);

  if (passiveAbilityLabel) {
    return (
      <React.Fragment>
        {passiveAbilityLabel}
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

PassiveAbilityItem.propTypes = {
  passiveAbility: PropTypes.any,
};

export default PassiveAbilityItem;
