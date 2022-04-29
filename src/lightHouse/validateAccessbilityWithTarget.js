const config = require('./config');
const {targetA11yScore, formFactor} = config;

 module.exports = function validateAccessbilityWithTarget(results, _, chrome) {
    const accessibilityScore = results.categories.accessibility.score * 100;
    if (accessibilityScore) {
      if (formFactor === 'desktop') {
        if (accessibilityScore < targetA11yScore) {
          console.error(`Target accessibility score: ${targetA11yScore}, current accessibility score ${accessibilityScore}`);
          chrome.close();
          // process.exitCode = 1;
        }
      }
      if (formFactor === 'mobile') {
        if (accessibilityScore < targetA11yScore) {
          console.error(`Target accessibility score: ${targetA11yScore}, current accessibility score ${accessibilityScore}`);
          chrome.close();
          // process.exitCode = 1;
        }
      }
    }
  }
