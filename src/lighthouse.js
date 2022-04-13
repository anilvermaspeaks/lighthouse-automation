const lighthouse = require('lighthouse');
const fs = require('fs');
const chromeLauncher = require('chrome-launcher');

const targetA11yScore =  95;
const appUrl = "http://localhost:4200";
const fileExtension = 'html'; //json or html
const formFactor = 'desktop' //mobile or desktop default
const categories = ['accessibility', 'seo']  //accessibility, best-practices, performance, pwa, seo

async function reportResults(results, runEnvironment, optionSet, chrome) {
    if (results.lhr.runtimeError) {
      return console.error(results.lhr.runtimeError.message);
    }
    await writeLocalFile(results, runEnvironment, optionSet);
    printResultsToTerminal(results.lhr, optionSet);
    return passOrFailA11y(results.lhr, optionSet, chrome);
  }

  function printResultsToTerminal(results) {
    const title = results.categories.accessibility.title;
    const score = results.categories.accessibility.score * 100;
    // console.log(`Options: ${optionSet.settings.emulatedFormFactor}\n`);
    console.log(`${title}: ${score}`);
    console.log('\n********************************');
  }

  function passOrFailA11y(results, optionSet, chrome) {
    const { formFactor } = optionSet;
    const accessibilityScore = results.categories.accessibility.score * 100;
    if (accessibilityScore) {
      if (formFactor === 'desktop') {
        if (accessibilityScore < targetA11yScore) {
          console.error(`Target accessibility score: ${targetA11yScore}, current accessibility score ${accessibilityScore}`);
          chrome.kill();
          process.exitCode = 1;
        }
      }
      if (formFactor === 'mobile') {
        if (accessibilityScore < targetA11yScore) {
          console.error(`Target accessibility score: ${targetA11yScore}, current accessibility score ${accessibilityScore}`);
          chrome.kill();
          process.exitCode = 1;
        }
      }
    }
  }
  
  function writeLocalFile(results, fileExtension='html') {
    if (results.report) {
        fs.mkdirSync('reports/lighthouse/', { recursive: true }, error => {
        if (error) console.error('error creating directory', error);
      });
       const data = results.report;
       const currentTime = new Date().toISOString().slice(0, 16);
    //  fs.writeFileSync(`reports/lighthouse/${currentTime}.${fileExtension}`, data.toString()); // for dynamic naming
    fs.writeFileSync(`reports/lighthouse/report.${fileExtension}`, data.toString())
    }
    return null;
  }


(async () => {
    //browser open config = {chromeFlags: ['--headless']}
  const browserFlag = {chromeFlags: ['--headless']};
  const chrome = await chromeLauncher.launch(browserFlag);
  const options = {logLevel: 'info',
   output: fileExtension, 
   onlyCategories: categories,
   port: chrome.port};
   const config = { extends: 'lighthouse:default', settings: {formFactor: formFactor, screenEmulation:{mobile:formFactor === 'mobile'}} }
   
   let runnerResult;
  try {
   runnerResult = await lighthouse(appUrl, options, config);
   reportResults(runnerResult, fileExtension, options, chrome);
  }

  catch(err){
    console.log("....................... while running chrome", err)
      }

  try {
    await chrome.kill();
    process.exitCode = 1;

  }
  catch(err){
console.log("....................... closing chrome", err)
  }

process.exitCode = 1;
//   }
})();





