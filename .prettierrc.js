const manifoldConfig = require('@manifoldxyz/lint-configs/prettier');

// @TODO: port back endOfline and htmlWhitespaceSensitivity to manifoldConfig
module.exports = {
  ...manifoldConfig,
  endOfLine: 'lf',
  htmlWhitespaceSensitivity: 'strict',
};
