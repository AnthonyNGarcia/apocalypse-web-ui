/**
 * Utility method to abstract away the logic of checking if a unit is Invisible
 */

const getIfInvisible = (unit) => {
  const unitPassiveAbilities = unit.passiveAbilities;
  const invisible = unitPassiveAbilities.filter((passiveAbility) =>
    passiveAbility.passiveAbilityType === 'INVISIBLE');
  if (invisible && invisible.length > 0) {
    return true;
  } else {
    return false;
  }
};

export default getIfInvisible;
