const fs = require('fs');
// const plantuml = require('node-plantuml');

if (process.argv.length <= 2) {
    console.log("Usage: " + __filename + " path/to/directory");
    process.exit(-1);
}

let path = process.argv[2];
let output = '';
// let gen = plantuml.generate("input-file");
// gen.out.pipe(fs.createWriteStream("output-file.png"));

fs.readdir(path, function(err, files) {
    files.forEach(file => {
        readStats(path + file);
    });
});

function readStats(pathToFile) {
    fs.stat(pathToFile, function(err, stats) {
        if (stats && stats.isFile()) {
            readFile(pathToFile);
        }
    });
}

function readFile(pathToFile) {
    fs.readFile(pathToFile, 'utf8', function(err, contents) {
        if (err) {
            // console.warn(err);
            return;
        }
        output += pathToFile + '<---';
        let re = /extend:.+\'(.*)\',/i;
        let extend = contents.match(re);
        if (extend && extend[1]){
            let pathExtend = parseExtend(extend[1]);
            if (pathExtend) {
                readStats(path + pathExtend);
            } else {
                output += extend[1] + '\n';
            }
            console.log(output);
        }
    });
}

function parseExtend(extend) {
    let path = extend.split('.');
    if (path[0] === 'Acronis') {
        path[0] = '/app';
        return path.join('/');
    }
    return null;
}