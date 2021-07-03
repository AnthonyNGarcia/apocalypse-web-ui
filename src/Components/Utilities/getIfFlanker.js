/**
 * Utility method to abstract away the logic of checking if a unit is a flanker
 */

const getIfFlanker = (unit) => {
  const unitPassiveAbilities = unit.passiveAbilities;
  const flanker = unitPassiveAbilities.filter((passiveAbility) =>
    passiveAbility.passiveAbilityType === 'FLANKER');
  if (flanker && flanker.length > 0) {
    return true;
  } else {
    return false;
  }
};

export default getIfFlanker;
