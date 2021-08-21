const {
  compilerOptions
} = require('./tsconfig');

const {
  resolve
} = require('path');


module.exports = {
  moduleNameMapper: {
    '^@lib/(.*)$': resolve(__dirname, './lib/$1'),
    '^types/(.*)$': resolve(__dirname, './types/$1'),
  },
};
