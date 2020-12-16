
const { promisify } = require("util");
const { resolve } = require("path");
const fs = require("fs");
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const readFile = promisify(fs.readFile);

async function getFiles(directory) {
    const subdirectories = await readdir(directory);

    await Promise.all(
        subdirectories.map(async (subdirectory) => {
            const res = resolve(directory, subdirectory);

            if ((await stat(res)).isDirectory()) {
                return getFiles(res);
            } else {
                return readFile(res, "utf8", function (err, data) {
                    if (err) throw err;
                    if (data.toString().match(/todo/i)) {
                        console.log(res);
                    }
                });
            }
        })
    );
}

function runScript() {
    if (process.argv.length > 2) {
        getFiles(process.argv[2]);
    } else {
        console.error("please enter relative or absolute path of directory as argument");
    }
}

runScript();

