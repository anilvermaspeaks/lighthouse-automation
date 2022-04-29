const lighthouse = require('lighthouse');
// const chromeLauncher = require('chrome-launcher');
const puppeteer = require('puppeteer');
const config = require('./config');
const writeLocalFile = require('./writeDetailsToDir');
const validateAccessbilityWithTarget = require('./validateAccessbilityWithTarget');
const {appUrl, fileExtension, formFactor, categories} = config;


(async () => {
    //browser open config = {chromeFlags: ['--headless']}
  const browserFlag = {chromeFlags: ['--headless']};
  const chrome =  await puppeteer.launch({
    headless:true,
    ignoreDefaultArgs: ['--disable-extensions'],
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await chrome.newPage();
  const options = {logLevel: 'info',
   output: fileExtension, 
   onlyCategories: categories,
   port: (new URL(chrome.wsEndpoint())).port};
   const config = { extends: 'lighthouse:default', settings: {formFactor: formFactor, screenEmulation:{mobile:formFactor === 'mobile'}} }
   
   let runnerResult;
  try {
   runnerResult = await lighthouse(appUrl, options);
   processResultsData(runnerResult, fileExtension, options, chrome);
  }

  catch(err){
    console.log("....................... while running chrome", err)
      }

  try {
    await chrome.close();
    process.exitCode = 1;

  }
  catch(err){
console.log("....................... closing chrome", err)
  }

process.exitCode = 1;
//   }
})();


//process result data
async function processResultsData(results, runEnvironment, optionSet, chrome) {
  if (results.lhr.runtimeError) {
    return console.error(results.lhr.runtimeError.message);
  }
  await writeLocalFile(results, runEnvironment, optionSet);
  return validateAccessbilityWithTarget(results.lhr, optionSet, chrome);
}




