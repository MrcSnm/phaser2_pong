const fs = require("fs");
const path = require("path");

/**
 * @callback fsRecursionCallback
 * @param {String} file - The file being iterated
 */


/**
 * Range iteration function for avoiding useless alocation
 * @param {string} dirName 
 * @param {fsRecursionCallback} handle
 */
function recursedirSync(dirName, handle)
{
    if(!fs.existsSync(dirName))
        throw new Error("Directory named "+dirName+" does not exists");
    
    for(const folder of fs.readdirSync(dirName))
    {
        const newDir = path.join(dirName, folder);
        const stats = fs.statSync(newDir);
        if(stats)
        {
            if(stats.isDirectory())
            {
                recursedirSync(newDir, handle);
            }
            else
            {
                handle(newDir);
            }
        }
    }
}

/**
 * 
 * @param {string} sourceDir 
 * @param {string} outputDir 
 * @param {boolean} shouldLogCopy
 */
function copyDirSync(sourceDir, outputDir, shouldLogCopy)
{
    console.log("Copy operation: ");
    recursedirSync(sourceDir, (filePath) =>
    {
        const outputPath = path.join(outputDir, filePath);
        if(shouldLogCopy)
            console.log("\t", filePath, "->", outputPath);
        fs.cpSync(filePath, outputPath);
    });
}

if(!fs.existsSync("dist"))
    fs.mkdirSync("dist");

///Copy developer maintained files

copyDirSync("assets", "dist", true);
fs.copyFileSync("index.html", "dist/index.html");

///Copy phaser
const phaserMinifiedPath = "node_modules/phaser-ce/build/phaser.min.js";
if(!fs.existsSync(phaserMinifiedPath))
    throw new Error("Missing node module phaser-ce, maybe you forgot to use `npm i`?");
fs.copyFileSync(phaserMinifiedPath, "dist/lib/phaser.min.js");