// Import the required npm packages
const fs = require("fs");
const lighthouse = require("lighthouse");
const chromeLauncher = require("chrome-launcher");

// Read the csv file and store the
// urls in an array
const array = fs.readFileSync("urls.csv").toString().split("\n");
const reportFile = "lhreport.csv";

// const array = ['/']

// Declare a resultant array to store
// the generated scores and initialize
// it with headings
let result = [];
let processedItems = 0;
if (!fs.existsSync(reportFile)) {
    result.push("URL, Gatsby_URL, Mobile_Performance, Mobile_Accessibility, Mobile_Best_Practices, Mobile_SEO, Desktop_Performance, Desktop_Accessibility, Desktop_Best_Practices, Desktop_SEO" +
        ", Gatsby_Mobile_Performance, Gatsby_Mobile_Accessibility, Gatsby_Mobile_Best_Practices, Gatsby_Mobile_SEO, Gatsby_Desktop_Performance, Gatsby_Desktop_Accessibility, Gatsby_Desktop_Best_Practices, Gatsby_Desktop_SEO"
    );
} else {
    processedItems = fs.readFileSync(reportFile).toString().split('\n').length - 2;
    if (processedItems < 0) {
        result.push("URL, Gatsby_URL, Mobile_Performance, Mobile_Accessibility, Mobile_Best_Practices, Mobile_SEO, Desktop_Performance, Desktop_Accessibility, Desktop_Best_Practices, Desktop_SEO" +
            ", Gatsby_Mobile_Performance, Gatsby_Mobile_Accessibility, Gatsby_Mobile_Best_Practices, Gatsby_Mobile_SEO, Gatsby_Desktop_Performance, Gatsby_Desktop_Accessibility, Gatsby_Desktop_Best_Practices, Gatsby_Desktop_SEO"
        );
        processedItems = 0;
    }
}

// The async await is used to ensure
// non-blocking code execution
(async () => {
    const chrome = await chromeLauncher
        .launch({chromeFlags: ["--headless"]})

    processedItems = processedItems % array.length;
    console.log(`starting from file ${processedItems}`)

    // Declaring an object to specify score
    // for what audits, categories and type
    // of output that needs to be generated
    const options = {
        logLevel: "error",
        output: "html",
        onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
        audits: [
            "first-meaningful-paint",
            "first-cpu-idle",
            "byte-efficiency/uses-optimized-images",
        ],
        port: chrome.port,
        strategy: 'mobile',
        formFactor: 'mobile'
    };

    // Traversing through each URL
    for (let i = processedItems; i < array.length; ++i) {

        // Separate strategy for Mobile
        // and Desktop view
        for (let x = 0; x < 4; x++) {
            let configuration = "";

            if (x === 0 || x === 2) {
              options.strategy = "mobile";
              options.screenEmulation = {
                mobile: true,
                width: 360,
                height: 640,
                // Moto G4 is really 3, but a higher value here works against
                // our perf recommendations.
                // https://github.com/GoogleChrome/lighthouse/issues/10741#issuecomment-626903508
                deviceScaleFactor: 2.625,
                disabled: false,
              };
            }
            else {
              options.strategy = "desktop";
              options.screenEmulation = {
                mobile: false,
                width: 1350,
                height: 940,
                deviceScaleFactor: 1,
                disabled: false
              };
            }

          options.formFactor = options.strategy;

            let url = array[i]
            if (x < 2) {
                url = 'https://sellusyourjewelry.com' + url
            } else {
                url = 'https://app.sellusyourjewelry.com' + url
            }

            console.log(`Processing ${url} - ${options.strategy}`)

            const runnerResult = await lighthouse(url, options);

            // Current report
            const reportCsv = runnerResult.report;

            fs.writeFileSync(`test/${array[i].replace(/\//g, '')}-${x < 2 ? 'wp' : 'gatsby'}-${options.strategy}.html`,
                reportCsv);

            // URL to be put only for first iteration
            // (mobile and not separately for desktop)
            if (x === 0) {
                result.push("\n" + runnerResult.lhr.finalUrl);
                result.push('https://app.sellusyourjewelry.com' + array[i]);
            }

            // If score can't be determined, NA is
            // put in the corresponding field.
            if (runnerResult.lhr.categories.performance.score) {
                result.push(runnerResult.lhr
                    .categories.performance.score * 100)
            } else {
                result.push("NA")
            }

            if (runnerResult.lhr.categories.accessibility.score) {
                result.push(runnerResult.lhr
                    .categories.accessibility.score * 100)
            } else {
                result.push("NA");
            }

            if (runnerResult.lhr.categories["best-practices"].score) {
                result.push(runnerResult.lhr
                    .categories["best-practices"].score * 100)
            } else {
                result.push("NA");
            }

            if (runnerResult.lhr.categories.seo.score) {
                result.push(runnerResult.lhr
                    .categories.seo.score * 100)
            } else {
                result.push("NA");
            }
        }
        fs.appendFileSync(reportFile, result.join(','));
        result = []
    }

    // Append the result in a report.csv
    // file and end the program
    // fs.appendFileSync("lhreport.csv", result.join(','));
    await chrome.kill();
})();