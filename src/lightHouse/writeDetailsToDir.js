const fs = require('fs');

module.exports = function writeLocalFile(results, fileExtension='html') {
    if (results.report) {
        fs.mkdirSync('reports/lighthouse/', { recursive: true }, error => {
        if (error) console.error('error creating directory', error);
      });
       const data = results.report;
    //    const currentTime = new Date().toISOString().slice(0, 16);
    //    const title = results.categories.accessibility.title;
    //    const score = results.categories.accessibility.score * 100;
    //  fs.writeFileSync(`reports/lighthouse/${currentTime}.${fileExtension}`, data.toString()); // for dynamic naming
    fs.writeFileSync(`reports/lighthouse/report.${fileExtension}`, data.toString())
    }
    return null;
  }
