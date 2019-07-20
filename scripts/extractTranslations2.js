"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Babel based translation extracter Mk.2
const babelParser = require("@babel/parser");
const babelTraverse = require("@babel/traverse");
const util = require("util");
const fs = require("fs");
const path = require("path");
const glob = require("glob");
const { resolve, relative } = path;
const { parse } = babelParser;
const { promisify } = util;
const { default: traverse } = babelTraverse;
const regUnplaceholdify = /^#####/;
const placeholdify = (key) => `#####${key}`;
const unplaceholdify = (key) => key.replace(regUnplaceholdify, '');
const stableCompare = (a, b) => (a === b ? 0 : unplaceholdify(a.toLowerCase()) > unplaceholdify(b.toLowerCase()) ? 1 : -1);
const MISSING_TRANSLATION = 'missing_translation';
const INDENT = '    ';
const isVerbose = process.argv.includes('--verbose');
const skipSort = process.argv.includes('--skip-sort');
const FilesLogic = {
    glob: promisify(glob),
    read: promisify(fs.readFile),
    readJson: async (filename) => JSON.parse(await FilesLogic.read(filename, { encoding: 'utf8' })),
    write: promisify(fs.writeFile),
    getJSFileList: () => FilesLogic.glob(resolve(__dirname, '../src/**/*.js')),
    getJSONFileList: () => FilesLogic.glob(resolve(__dirname, '../public/static/locales/**/translation.json')),
    scrapeStrings: async (filename, sourceStrings) => {
        try {
            const code = (await FilesLogic.read(filename)).toString('utf8');
            const ast = parse(code, {
                sourceType: 'module',
                plugins: ['jsx', 'classProperties']
            });
            traverse(ast, {
                CallExpression: function (astPath) {
                    const node = astPath.node;
                    if (node && NodesLogic.isTFunction(node)) {
                        const keys = NodesLogic.getArgumentText(node);
                        if (keys && keys.size) {
                            keys.forEach(key => sourceStrings.add(key));
                        }
                    }
                }
            });
        }
        catch (e) {
            console.error('ScrapeStrings Failed: ' + e.message);
        }
    },
    sortSourceStrings(sourceStrings) {
        const keys = Array.from(sourceStrings);
        keys.sort(stableCompare);
        sourceStrings.clear();
        keys.forEach(sourceStrings.add.bind(sourceStrings));
    },
    sortTranslatedStrings(translatedStrings) {
        const entries = Object.entries(translatedStrings);
        entries.sort(([a], [b]) => stableCompare(a, b));
        entries.forEach(([key]) => delete translatedStrings[key]);
        entries.forEach(([key, value]) => (translatedStrings[key] = value));
    },
    addStrings(translatedStrings, sourceStrings) {
        const result = [];
        sourceStrings.forEach(key => {
            if (!translatedStrings[key]) {
                const placeholderKey = placeholdify(key);
                if (!translatedStrings[placeholderKey]) {
                    translatedStrings[placeholderKey] = MISSING_TRANSLATION;
                    result.push(key);
                }
            }
        });
        return result;
    },
    deprecateStrings(translatedStrings, sourceStrings) {
        const result = [];
        Object.keys(translatedStrings).forEach(rawKey => {
            const key = unplaceholdify(rawKey);
            if (rawKey === key)
                return;
            if (!sourceStrings.has(key)) {
                delete translatedStrings[rawKey];
                result.push(key);
            }
        });
        return result;
    }
};
const NodesLogic = {
    isTFunction(node) {
        const { callee, arguments: args } = node;
        if (!(callee && args))
            return false;
        switch (callee.type) {
            case 'Identifier': {
                if (callee.name === 't')
                    return true;
                break;
            }
            case 'MemberExpression': {
                if (callee.property) {
                    const storage = new Set();
                    NodesLogic.digNode(callee.property, storage);
                    if (storage.has('t'))
                        return true;
                }
            }
        }
        return false;
    },
    getArgumentText(node) {
        const { arguments: args } = node;
        if (args.length !== 1) {
            throw new Error(`Argument count was not 1. Found: ${args.length}`);
        }
        const arg = args[0];
        if (arg.type === 'StringLiteral' || arg.type === 'Literal') {
            return new Set([arg.value]);
        }
        const storage = new Set();
        NodesLogic.digNode(args[0], storage);
        return storage;
    },
    digNode(node, storage) {
        //complex argument scrapper
        switch (node.type) {
            case 'ConditionalExpression': {
                NodesLogic.digNode(node.consequent, storage);
                NodesLogic.digNode(node.alternate, storage);
                break;
            }
            case 'Identifier': {
                storage.add(node.name);
                break;
            }
            case 'StringLiteral':
            case 'Literal': {
                storage.add(node.value);
                break;
            }
            default:
                console.log(node);
                throw new Error(`Unsupported t() usage found: ${node.type}\n ${NodesLogic.serializeLoc(node)}`);
        }
    },
    serializeLoc(node) {
        const { loc } = node;
        if (!loc)
            return '@(unknown position)';
        return `@line ${loc.start.line}:${loc.start.column}`;
    }
};
(async () => {
    const sourcefiles = await FilesLogic.getJSFileList();
    let sourceStrings = new Set();
    let lastT = 0;
    let count = 0;
    for (let file of sourcefiles) {
        count++;
        if (Date.now() - lastT > 200 || count === sourcefiles.length) {
            lastT = Date.now();
            console.log(` Processing [${count}/${sourcefiles.length}]`, relative(resolve(__dirname, '..'), file));
        }
        await FilesLogic.scrapeStrings(file, sourceStrings);
    }
    // if you want to see current status activate following line:
    // await FilesLogic.write('tmp.dbg.json', JSON.stringify(Array.from(sourceStrings), null, 1));
    if (!skipSort)
        FilesLogic.sortSourceStrings(sourceStrings);
    const jsonFiles = await FilesLogic.getJSONFileList();
    count = 0;
    for (let jsonFile of jsonFiles) {
        count++;
        const locale = jsonFile.match(/\/([^/]+)\/translation.json$/)[1];
        console.log(`Merging [${count}/${jsonFiles.length}] ${locale}`);
        const translatedStrings = await FilesLogic.readJson(jsonFile);
        if (!translatedStrings)
            throw new Error(`Failed to parse ${jsonFile}.`);
        const addResult = await FilesLogic.addStrings(translatedStrings, sourceStrings);
        const deprecateResult = await FilesLogic.deprecateStrings(translatedStrings, sourceStrings);
        if (!skipSort)
            FilesLogic.sortTranslatedStrings(translatedStrings);
        if (addResult.length) {
            console.log(` > Added ${addResult.length} strings`);
            if (isVerbose)
                console.log(INDENT + addResult.map(str => JSON.stringify(str)).join('\n' + INDENT));
        }
        if (deprecateResult.length) {
            console.log(` > Removed ${deprecateResult.length} untranslated dead strings`);
            if (isVerbose)
                console.log(INDENT + deprecateResult.map(str => JSON.stringify(str)).join('\n' + INDENT));
        }
        await FilesLogic.write(jsonFile, JSON.stringify(translatedStrings, null, 2), { encoding: 'utf-8' });
    }
    console.log('done.');
})();
