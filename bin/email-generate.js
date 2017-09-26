#!/usr/bin/env node
const program = require('commander');
const package = require("../package.json");
var swig = require('swig');
var template = swig.compileFile(__dirname + '/../emailTemplate.html');
fs = require('fs');

program
    .version(package.version)
    .option('-p, --project [name]', 'Name of the project')
    .option('-i, --input [resultsdir]', 'Results directory', '/resultJSON')
    .option('-o, --output [type]', 'Output html path [dir]', process.cwd() + "/emailableReport.html").
    parse(process.argv);
if (program.input && program.project) {
    require("../lib/index")(process.cwd() + program.input, function (result, error) {
        fs.writeFile(program.output, template({"result": result}), function (err) {
            if (err) {
                return console.log(err);
                process.exit(1);
            } else {
                process.exit(0);
            }
        });
    });
} else {
    throw new Error("Please provide mandatory params project and input.")
}