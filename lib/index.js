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
            resultToBeEmailed[resultData.group].tests.push(parseTest(resultData));
        });
        console.log(resultToBeEmailed);
        callback(resultToBeEmailed);
    });
}

function parseTest(rawTest) {
    let testName = Object.keys(rawTest.results.modules)[0].replace(/\//g,".")
    return {
        name: testName,
        passed: isPassed(rawTest.results)
    }
}

function isPassed(resultObject) {
    return !(resultObject.failed > 0 || resultObject.errors > 0)
}


module.exports = parse;

