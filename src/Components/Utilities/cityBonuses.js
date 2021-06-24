/**
 * ENUM file.
 */
;

const CITY_BONUSES = {
  GROWTH_BONUS: {
    enum: 'GROWTH_BONUS',
    prefix: 'Provides +',
    suffix: ' Growth',
  },
  PRODUCTION_BONUS: {
    enum: 'PRODUCTION_BONUS',
    prefix: 'Provides +',
    suffix: ' Production',
  },
  RESEARCH_BONUS: {
    enum: 'RESEARCH_BONUS',
    prefix: 'Provides +',
    suffix: ' Research',
  },
  FREE_UNIT_TRAINING: {
    enum: 'FREE_UNIT_TRAINING',
    prefix: 'Perpetually trains ',
    suffix: ' free unit in the queue while there is space.',
  },
  ARMY_SIZE_BONUS: {
    enum: 'ARMY_SIZE_BONUS',
    prefix: '+',
    suffix: ' to Max Army Size (stacks)',
  },
};

export default CITY_BONUSES;
