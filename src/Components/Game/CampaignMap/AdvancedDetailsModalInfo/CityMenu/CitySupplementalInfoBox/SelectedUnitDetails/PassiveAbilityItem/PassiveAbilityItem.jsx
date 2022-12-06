import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Spinner from 'react-bootstrap/Spinner';
import PASSIVE_ABILITIES from '../../../../../../../Utilities/passiveAbilities';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
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
  const [passiveAbilityDescription, setPassiveAbilityDescription] = useState(null);

  useEffect(() => {
    if (props.passiveAbility) {
      const passiveAbilityType = props.passiveAbility.passiveAbilityType;
      const labelMaker = PASSIVE_ABILITIES[passiveAbilityType];

      let label = (labelMaker.displayName) ? labelMaker.displayName :
                  labelMaker.prefix + props.passiveAbility.value + labelMaker.suffix;

      if (!props.passiveAbility.isEnabled) {
        label += ' (DISABLED)';
      }
      if (props.passiveAbility.removeAfterBattle) {
        label += ' (BATTLE)';
      }

      const fullPassiveAbilityData = props.allPassiveAbilities[passiveAbilityType];
      const descriptionFragments = fullPassiveAbilityData.descriptionFragments;
      let description;
      if (descriptionFragments) {
        description = descriptionFragments[0];
        if (descriptionFragments.length == 2) {
          description += props.passiveAbility.value;
          description += descriptionFragments[1];
        }
      } else {
        description = 'No Description Available.';
      }

      setPassiveAbilityLabel(label);
      setPassiveAbilityDescription(description);
    }
  }, [props]);

  if (passiveAbilityLabel && passiveAbilityDescription) {
    return (
      <React.Fragment>
        <OverlayTrigger
          key={passiveAbilityLabel}
          placement={'bottom'}
          overlay={
            <Tooltip id={`tooltip-${passiveAbilityLabel}`}>
              {passiveAbilityDescription}
            </Tooltip>
          }>
          <Button variant="secondary">{passiveAbilityLabel}</Button>
        </OverlayTrigger>
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
    allPassiveAbilities: state.game.gameConstants.allPassiveAbilities,
  };
};

PassiveAbilityItem.propTypes = {
  passiveAbility: PropTypes.any,
};

export default connect(mapStateToProps)(PassiveAbilityItem);
