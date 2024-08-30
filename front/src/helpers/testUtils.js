export const wrapTestCaseLogError = (testFn, errMsg) => {
  try {
    testFn();
  } catch (e) {
    console.log(errMsg);
    throw e;
  }
};
