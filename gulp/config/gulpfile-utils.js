import {readdirSync as read, statSync as stat, existsSync as exists} from 'fs';
import _ from 'lodash';
import path, {join} from 'path';
import yargs from 'yargs';
import gulp from 'gulp';
import pluginFn from 'gulp-load-plugins';
import config from './';

var argv = yargs
            .usage('Usage: $0 <gulp> $1 <gulp_task> [-e <environment> -f <file_to_test>]')
            .alias('e', 'env')
            .alias('f', 'file')
            .argv;

var args = Object.keys(argv);
var cliConfig = args.reduce((o, arg, i) => {
  let val = argv[arg];

  if(arg === 'env') {
    val = val.toUpperCase();
    arg = arg.toUpperCase();
  }

  if(arg.length > 1 && !/\$/.test(arg)) {
    o[arg] = val;
  }


  if(i === args.length - 1 && !_.has(argv, 'env')) {
    o.ENV = 'DEV';
  }
  return o;
}, {});

const plugins = pluginFn({
  pattern: ['gulp-*', 'gulp.*', 'browser-sync'],
  lazy: false
});
const envConfig = config(cliConfig);
const tasksDir = join(process.cwd(), 'gulp/tasks');

/**
 * Load all gulp task functions to access on the `tasksMap` Object. Passes
 * the `gulp` object, all plugins with `gulp-` prefix in `package.json` and
 * the entire `config` object from `./gulp/config` for access into gulp task
 * callback functions.
 */
var getTask = (taskPath) => {
  return require(taskPath)(gulp, plugins, envConfig);
};

var dashToCamel = (str) => {
  if(!~str.indexOf('-')) return str;
  return str.split('-').map((item, i) => {
    if(i) {
      item = item.charAt(0).toUpperCase() + item.slice(1);
    }
    return item;
  }).join('');
};

/**
 * Creates an object with keys corresponding to the Gulp task name and
 * values corresponding to the callback function passed as the second
 * argument to `gulp.task`
 */
var tasksMap = read(tasksDir).reduce( (o, name) => {
  let taskPath = join(tasksDir, name);
  let isDir = stat(taskPath).isDirectory();
  var taskName;
  if( isDir ) {
    if( !exists(join(taskPath, 'index.js')) ) {
      throw new Error(`task ${name} directory must have filename index.js`);
    }
    taskName = name;
  } else {
    taskName = path.basename(name, '.js');
  }
  o[ dashToCamel(taskName) ] = getTask(taskPath);
  return o;
}, {});

export default tasksMap;
export var {ENV} = cliConfig;
