/**
 * Utility method to abstract away the logic of checking if a unit is
 * constricted
 */

const getIfConstricted = (unit) => {
  const unitDebuffs = unit.currentDebuffs;
  const constricted = unitDebuffs.filter((debuff) =>
    debuff.debuffType === 'CONSTRICTED');
  if (constricted && constricted.length > 0) {
    return true;
  } else {
    return false;
  }
};

export default getIfConstricted;
