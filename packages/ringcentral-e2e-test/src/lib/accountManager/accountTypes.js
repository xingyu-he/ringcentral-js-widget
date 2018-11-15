const accountTypes = {
  CM_RC_US: 'rc_us_common',
  CM_RC_EU: 'rc_eu_common',
  CM_RC_UK: 'rc_uk_common',
  CM_RC_CA: 'rc_ca_common',
  SF_RC_EU: 'rc_eu_sfentity',
  SF_RC_US: 'rc_us_sfentity',
  SF_RC_UK: 'rc_uk_sfentity',
  SF_RC_CA: 'rc_ca_sfentity',
  CM_BT: 'bt_common',
  CM_ATT: 'att_common',
  CM_TELUS: 'telus_common'
};
const accounts = Object.keys(accountTypes);

export {
  accountTypes as default,
  accounts,
};
