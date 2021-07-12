/**
 * Utility method to abstract away the logic of checking if a unit is stunned
 */

const getIfPermastunned = (unit) => {
  const unitDebuffs = unit.currentDebuffs;
  const permastunned = unitDebuffs.filter((debuff) =>
    debuff.debuffType === 'PERMASTUNNED');
  if (permastunned && permastunned.length > 0) {
    return true;
  } else {
    return false;
  }
};

export default getIfPermastunned;
