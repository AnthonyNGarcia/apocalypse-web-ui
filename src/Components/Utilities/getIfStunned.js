/**
 * Utility method to abstract away the logic of checking if a unit is stunned
 */

const getIfStunned = (unit) => {
  const unitDebuffs = unit.currentDebuffs;
  const stunned = unitDebuffs.filter((debuff) =>
    debuff.debuffType === 'STUNNED');
  if (stunned && stunned.length > 0) {
    return true;
  } else {
    return false;
  }
};

export default getIfStunned;
