const swig = require('swig');
const template = swig.compileFile(__dirname + '/../emailTemplate.html');
const glob = require("glob");
const emailData = {};

/* structure
 {scripts:[
 suite:{ name:"", pass:true|false}
 ]}
 */
function parse(inputDir, callback) {
    let resultToBeEmailed = {};
    glob(inputDir + "/**/*.json", function (err, resultJSONFiles) {
        if (resultJSONFiles.length === 0) {
            console.log("No reports found");
            process.exit(0);
        }
        resultJSONFiles.forEach(function (resultJSON) {
            const resultData = require(resultJSON);
            if (!resultToBeEmailed.hasOwnProperty(resultData.group)) {
                resultToBeEmailed[resultData.group] = {tests: []};
            }
            resultToBeEmailed[resultData.group].tests = resultToBeEmailed[resultData.group].tests.concat(getTests(resultData));
        });
        callback(resultToBeEmailed);
    });
}

function getTests(rawResults) {
    return Object.keys(rawResults.results.modules).map(function (currentModule) {
        console.log(currentModule);
        const testName = currentModule.replace(/\//g, ".") + "-" + rawResults.results.environment;
        return parseTest(rawResults.results.modules[currentModule], testName);
    });
}

function parseTest(rawTest, testName) {
    return {
        name: testName,
        passed: isPassed(rawTest)
    }
}

function isPassed(resultObject) {
    return !(resultObject.failures > 0 || resultObject.errors > 0)
}


module.exports = parse;

