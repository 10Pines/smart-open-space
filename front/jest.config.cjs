module.exports = {
  transform: {
    '.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
    '^.+\\.js$': 'babel-jest',
  },
  moduleNameMapper: {
    '#assets(.*)$': '<rootDir>/src/assets/$1',
    '#helpers(.*)$': '<rootDir>/src/helpers/$1',
    '#api(.*)$': '<rootDir>/src/helpers/api/$1',
    '#shared(.*)$': '<rootDir>/src/shared/$1',
    '^.+.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
};
