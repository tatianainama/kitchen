import nextJest from 'next/jest';

const createJestConfig = nextJest({
  dir: './'
});

export default createJestConfig({
  clearMocks: true,
  rootDir: './',
  testMatch: ['**/*.spec.ts'],
  moduleNameMapper: {
    '@/utils/(.*)': '<rootDir>/utils/$1',
    '@/lib/(.*)': '<rootDir>/lib/$1'
  }
});
