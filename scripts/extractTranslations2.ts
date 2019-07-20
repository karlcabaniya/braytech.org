// Babel based translation extracter Mk.2
import * as babelParser from '@babel/parser';
import * as babelTraverse from '@babel/traverse';
import * as util from 'util';
import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';

const { resolve, relative } = path;
const { parse } = babelParser;
const { promisify } = util;
const { default: traverse } = babelTraverse;

type SourceStrings = Set<string>;
type TranslatedStrings = Record<string, string>;
const regUnplaceholdify = /^#####/;
const placeholdify = (key: string) => `#####${key}`;
const unplaceholdify = (key: string) => key.replace(regUnplaceholdify, '');
const MISSING_TRANSLATION = 'missing_translation';
const INDENT = '    ';

const FilesLogic = {
  read: promisify(fs.readFile),
  readJson: async (filename: string): Promise<TranslatedStrings> => JSON.parse(await FilesLogic.read(filename, { encoding: 'utf8' })),
  write: promisify(fs.writeFile),
  getJSFileList: async (): Promise<string[]> => promisify(glob)(resolve(__dirname, '../src/**/*.js')),
  getJSONFileList: async (): Promise<string[]> => promisify(glob)(resolve(__dirname, '../public/static/locales/**/translation.json')),

  scrapeStrings: async (filename: string, sourceStrings: SourceStrings) => {
    try {
      const code = (await FilesLogic.read(filename)).toString('utf8');
      const ast = parse(code, {
        sourceType: 'module',
        plugins: ['jsx', 'classProperties']
      });

      traverse(ast, {
        CallExpression: function(astPath) {
          const node = astPath.node;
          if (node && NodesLogic.isTFunction(node)) {
            const keys = NodesLogic.getArgumentText(node);
            if (keys && keys.size) {
              keys.forEach(key => sourceStrings.add(key));
            }
          }
        }
      });
    } catch (e) {
      console.error('ScrapeStrings Failed: ' + e.message);
    }
  },

  addStrings(translatedStrings: TranslatedStrings, sourceStrings: SourceStrings): string[] {
    const result: string[] = [];
    sourceStrings.forEach(key => {
      if (!translatedStrings[key]) {
        const placeholderKey = placeholdify(key);
        translatedStrings[placeholderKey] = MISSING_TRANSLATION;
        result.push(key);
      }
    });
    return result;
  },

  deprecateStrings(translatedStrings: TranslatedStrings, sourceStrings: SourceStrings): string[] {
    const result: string[] = [];
    Object.keys(translatedStrings).forEach(rawKey => {
      const key = unplaceholdify(rawKey);
      if (rawKey === key) return;
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
    if (!(callee && args)) return false;
    switch (callee.type) {
      case 'Identifier': {
        if (callee.name === 't') return true;
        break;
      }
      case 'MemberExpression': {
        if (callee.property) {
          const storage = new Set<string>();
          NodesLogic.digNode(callee.property, storage);
          if (storage.has('t')) return true;
        }
      }
    }
    return false;
  },

  getArgumentText(node): Set<string> | false {
    const { arguments: args } = node;
    if (args.length === 1) {
      const arg = args[0];
      if (arg.type === 'StringLiteral' || arg.type === 'Literal') {
        return new Set([arg.value]);
      }

      const storage = new Set<string>();
      NodesLogic.digNode(args[0], storage);
      return storage;
    } else {
      throw new Error(`Argument count was not 1. Found: ${args.length}`);
    }
    return false;
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
    if (!loc) return '@(unknown position)';
    return `@line ${loc.start.line}:${loc.start.column}`;
  }
};

(async () => {
  const sourcefiles = await FilesLogic.getJSFileList();
  let sourceStrings: SourceStrings = new Set();
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

  const jsonFiles = await FilesLogic.getJSONFileList();
  count = 0;
  for (let jsonFile of jsonFiles) {
    count++;
    const locale = jsonFile.match(/\/([^/]+)\/translation.json$/)[1];
    console.log(` Merging [${count}/${jsonFiles.length}] ${locale}`);
    const translatedStrings = await FilesLogic.readJson(jsonFile);
    if (!translatedStrings) throw new Error(`Failed to parse ${jsonFile}.`);
    const addResult = await FilesLogic.addStrings(translatedStrings, sourceStrings);
    const deprecateResult = await FilesLogic.deprecateStrings(translatedStrings, sourceStrings);

    if (addResult.length) {
      console.log(` > Added ${addResult.length} strings`);
      console.log(INDENT + addResult.map(str => JSON.stringify(str)).join('\n' + INDENT));
    }

    if (deprecateResult.length) {
      console.log(` > Removed ${deprecateResult.length} untranslated dead strings`);
      console.log(INDENT + deprecateResult.map(str => JSON.stringify(str)).join('\n' + INDENT));
    }
    await FilesLogic.write(jsonFile, JSON.stringify(translatedStrings, null, 2), { encoding: 'utf-8' });
  }

  console.log('done.');
  //   console.dir(sourceStrings);
})();
