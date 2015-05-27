/* compiled with quickstart@1.1.4 */(function (main, modules) {
  'use strict';
  var cache = require.cache = {};
  function require(id) {
    var module = cache[id];
    if (!module) {
      var moduleFn = modules[id];
      if (!moduleFn)
        throw new Error('module ' + id + ' not found');
      module = cache[id] = {};
      var exports = module.exports = {};
      moduleFn.call(exports, require, module, exports, window);
    }
    return module.exports;
  }
  require.resolve = function (resolved) {
    return resolved;
  };
  require.node = function () {
    return {};
  };
  require(main);
}('./@app.js', {
  './@config.json': function (require, module, exports, global) {
    module.exports = {
      'main': './',
      'runtimeData': '/*\nBrowser runtime\n*/\'use strict\';\n/* global main, modules, -require, -module, -exports, -global */\n\nvar cache = require.cache = {};\n\nfunction require(id) {\n  var module = cache[id];\n  if (!module) {\n    var moduleFn = modules[id];\n    if (!moduleFn) throw new Error(\'module \' + id + \' not found\');\n    module = cache[id] = {};\n    var exports = module.exports = {};\n    moduleFn.call(exports, require, module, exports, window);\n  }\n  return module.exports;\n}\n\nrequire.resolve = function(resolved) {\n  return resolved;\n};\n\nrequire.node = function() {\n  return {};\n};\n\nrequire(main);\n',
      'runtimePath': './node_modules/quickstart/runtime/browser.js',
      'sourceMap': true,
      'parsers': {},
      'transforms': []
    };
  },
  './@app.js': function (require, module, exports, global) {
    'use strict';
    var quickstart = require('./node_modules/quickstart/browser.js');
    var config = require('./@config.json');
    quickstart(config);
  },
  './node_modules/quickstart/browser.js': function (require, module, exports, global) {
    'use strict';
    var pathogen = require('./node_modules/quickstart/node_modules/pathogen/index.js');
    var escodegen = require('./node_modules/quickstart/node_modules/escodegen/escodegen.js');
    var esprima = require('./node_modules/quickstart/node_modules/esprima/esprima.js');
    var forEach = require('./node_modules/quickstart/node_modules/mout/array/forEach.js');
    var forIn = require('./node_modules/quickstart/node_modules/mout/object/forIn.js');
    var map = require('./node_modules/quickstart/node_modules/mout/object/map.js');
    var QuickStart = require('./node_modules/quickstart/lib/quickstart.js');
    var program = require('./node_modules/quickstart/util/program.js');
    var Messages = require('./node_modules/quickstart/util/messages.js');
    var version = require('./node_modules/quickstart/package.json').version;
    var noop = function () {
    };
    if (!global.console)
      global.console = {};
    if (!console.log)
      console.log = noop;
    if (!console.warn)
      console.warn = console.log;
    if (!console.error)
      console.error = console.log;
    if (!console.group)
      console.group = console.log;
    if (!console.groupCollapsed)
      console.groupCollapsed = console.group;
    if (!console.groupEnd)
      console.groupEnd = noop;
    var root = pathogen.cwd();
    var theme = {
      red: 'color: #d44;',
      green: 'color: #6b4;',
      blue: 'color: #49d;',
      yellow: 'color: #f90;',
      grey: 'color: #666;',
      greyBright: 'color: #999;',
      bold: 'font-weight: bold;'
    };
    var format = function (type, statement) {
      if (type === 'group' || type === 'groupCollapsed') {
        var color;
        if (/warning/i.test(statement)) {
          color = theme.yellow + theme.bold;
        } else if (/error/i.test(statement)) {
          color = theme.red + theme.bold;
        } else {
          color = theme.grey + theme.bold;
        }
        console[type]('%c' + statement, color);
        return;
      }
      if (type === 'groupEnd') {
        console.groupEnd();
        return;
      }
      var message, source, line, column, id;
      message = statement.message;
      var colors = [theme.grey];
      id = statement.id;
      source = statement.source;
      line = statement.line;
      column = statement.column;
      if (source != null) {
        source = ' %c' + location.origin + pathogen.resolve(root, source);
        if (line != null) {
          source += ':' + line;
          if (column != null) {
            source += ':' + column;
          }
        }
        message += source;
        colors.push(theme.green);
      }
      message = '%c' + id + ': %c' + message;
      switch (type) {
      case 'error':
        colors.unshift(theme.red);
        console.error.apply(console, [message].concat(colors));
        break;
      case 'warn':
        colors.unshift(theme.yellow);
        console.warn.apply(console, [message].concat(colors));
        break;
      case 'time':
        colors.unshift(theme.blue);
        console.log.apply(console, [message].concat(colors));
        break;
      default:
        colors.unshift(theme.grey);
        console.log.apply(console, [message].concat(colors));
        break;
      }
    };
    function generate(module) {
      var sourceURL = '\n//# sourceURL=';
      var output = escodegen.generate(module.ast, {
        format: {
          indent: { style: '  ' },
          quotes: 'single'
        }
      });
      output += sourceURL + module.path.substr(2);
      return new Function('require', 'module', 'exports', 'global', output);
    }
    module.exports = function (config) {
      var parsers = {};
      var transforms = [];
      forIn(config.parsers, function (id, ext) {
        var parser = require(id);
        parsers[ext] = parser;
      });
      forEach(config.transforms, function (id) {
        var transform = require(id);
        transforms.push(transform);
      });
      var messages = new Messages();
      var compilation = messages.group('Compilation');
      compilation.time('time');
      var quickstart = new QuickStart({
        messages: messages,
        parsers: parsers,
        transforms: transforms,
        loc: !!config.sourceMap,
        defaultPath: config.defaultPath,
        root: root
      });
      console.group('%cQuick%cStart ' + '%cv' + version, theme.red, theme.grey, theme.greyBright);
      console.groupCollapsed('%cXMLHttpRequests', theme.grey + theme.bold);
      var modules = quickstart.modules;
      var runtimeData = config.runtimeData;
      var runtimePath = config.runtimePath;
      return quickstart.require(root, config.main).then(function (id) {
        console.groupEnd();
        var done;
        if (config.sourceMap) {
          compilation.log({
            id: 'sourceMap',
            message: 'embedded'
          });
          var runtimeTree = esprima.parse(runtimeData, {
            loc: true,
            source: runtimePath
          });
          var tree = program(id, modules, runtimeTree);
          var sourceMappingURL = '\n//# sourceMappingURL=data:application/json;base64,';
          var output = escodegen.generate(tree, {
            format: {
              indent: { style: '  ' },
              quotes: 'single'
            },
            sourceMap: true,
            sourceMapRoot: location.origin + root,
            sourceMapWithCode: true
          });
          var source = output.code + sourceMappingURL + btoa(JSON.stringify(output.map));
          done = function () {
            return global.eval(source);
          };
        } else {
          var sourceURL = '\n//# sourceURL=';
          var evaluated = map(modules, generate);
          var runtimeFn = new Function('main', 'modules', runtimeData + sourceURL + runtimePath.substr(2));
          done = function () {
            return runtimeFn(id, evaluated);
          };
        }
        compilation.timeEnd('time', 'compiled in', true, true);
        messages.print(format).reset();
        console.groupEnd();
        setTimeout(function () {
          done();
        }, 1);
      }).catch(function (error) {
        console.groupEnd();
        messages.print(format).reset();
        console.groupEnd();
        setTimeout(function () {
          throw error;
        }, 1);
      });
    };
  },
  './node_modules/quickstart/package.json': function (require, module, exports, global) {
    module.exports = {
      'name': 'quickstart',
      'version': '1.1.4',
      'description': 'CommonJS module compiler for node.js and browsers',
      'main': './main.js',
      'browser': {
        './main': './browser',
        'assert': 'assert',
        'buffer': 'buffer',
        'console': 'console-browserify',
        'constants': 'constants-browserify',
        'crypto': 'crypto-browserify',
        'domain': 'domain-browser',
        'events': 'events',
        'http': 'http-browserify',
        'https': 'https-browserify',
        'os': 'os-browserify/browser',
        'path': 'path-browserify',
        'punycode': 'punycode',
        'querystring': 'querystring-es3',
        'stream': 'stream-browserify',
        '_stream_duplex': 'readable-stream/duplex',
        '_stream_passthrough': 'readable-stream/passthrough',
        '_stream_readable': 'readable-stream/readable',
        '_stream_transform': 'readable-stream/transform',
        '_stream_writable': 'readable-stream/writable',
        'string_decoder': 'string_decoder',
        'sys': 'util',
        'timers': 'timers-browserify',
        'tty': 'tty-browserify',
        'url': 'url',
        'util': 'util',
        'vm': 'vm-browserify',
        'zlib': 'browserify-zlib'
      },
      'bin': { 'quickstart': './bin/quickstart' },
      'scripts': { 'test': 'istanbul cover _mocha test -- -R spec' },
      'dependencies': {
        'promise': '~5.0.0',
        'prime': '^0.4.2',
        'agent': '^0.2.0',
        'pathogen': '^0.1.5',
        'mout': '^0.9.1',
        'esprima': '~1.2.1',
        'escodegen': '^1.3.2',
        'estraverse': '~1.5.0',
        'escope': '~1.0.1',
        'esmangle': '~1.0.1',
        'microseconds': '^0.1.0',
        'cli-color': '~0.3.2',
        'require-relative': '^0.8.7',
        'minimist': '~0.1.0',
        'util': '~0.10.3',
        'assert': '~1.1.1',
        'url': '~0.10.1',
        'path-browserify': '0.0.0',
        'buffer': '~2.3.0',
        'https-browserify': '0.0.0',
        'tty-browserify': '0.0.0',
        'constants-browserify': '0.0.1',
        'os-browserify': '~0.1.2',
        'string_decoder': '~0.10.25-1',
        'domain-browser': '~1.1.1',
        'querystring-es3': '~0.2.1-0',
        'punycode': '~1.2.4',
        'events': '~1.0.1',
        'stream-browserify': '~1.0.0',
        'readable-stream': '~1.0.27-1',
        'vm-browserify': '0.0.4',
        'timers-browserify': '~1.0.1',
        'console-browserify': '~1.1.0',
        'http-browserify': '~1.3.2',
        'browserify-zlib': '~0.1.4',
        'crypto-browserify': '~2.1.8'
      },
      'devDependencies': {
        'mocha': '^1.18.2',
        'istanbul': '^0.2.9',
        'chai': '~1.9.1',
        'chai-as-promised': '~4.1.1'
      },
      'homepage': 'http://spotify.github.io/quickstart',
      'repository': {
        'type': 'git',
        'url': 'git+https://github.com/spotify/quickstart.git'
      },
      'author': {
        'name': 'Valerio Proietti',
        'email': 'kamicane@gmail.com'
      },
      'contributors': [
        {
          'name': 'Johannes Koggdal',
          'email': 'johannes@koggdal.com'
        },
        {
          'name': 'Daniel Herzog',
          'email': 'daniel.herzog@gmail.com'
        }
      ],
      'licenses': [{
          'type': 'Apache-2.0',
          'url': 'http://www.apache.org/licenses/LICENSE-2.0.html'
        }],
      'gitHead': '185cb9c38a2380561059266c47341ffbb8ce045a',
      'bugs': { 'url': 'https://github.com/spotify/quickstart/issues' },
      '_id': 'quickstart@1.1.4',
      '_shasum': 'ab20eda18e042cc1c3ee2ddb8774396d90ab9a00',
      '_from': 'quickstart@*',
      '_npmVersion': '2.8.3',
      '_nodeVersion': '0.12.2',
      '_npmUser': {
        'name': 'koggdal',
        'email': 'johannes@koggdal.com'
      },
      'maintainers': [
        {
          'name': 'kamicane',
          'email': 'kamicane@spotify.com'
        },
        {
          'name': 'koggdal',
          'email': 'johannes@koggdal.com'
        }
      ],
      'dist': {
        'shasum': 'ab20eda18e042cc1c3ee2ddb8774396d90ab9a00',
        'tarball': 'http://registry.npmjs.org/quickstart/-/quickstart-1.1.4.tgz'
      },
      'directories': {},
      '_resolved': 'https://registry.npmjs.org/quickstart/-/quickstart-1.1.4.tgz'
    };
  },
  './node_modules/quickstart/lib/quickstart.js': function (require, module, exports, global) {
    var __process = require('./node_modules/quickstart/browser/process.js');
    var __dirname = (__process.cwd() + '/node_modules/quickstart/lib').replace(/\/+/g, '/');
    'use strict';
    var Promise = require('./node_modules/quickstart/node_modules/promise/index.js');
    var prime = require('./node_modules/quickstart/node_modules/prime/index.js');
    var pathogen = require('./node_modules/quickstart/node_modules/pathogen/index.js');
    var mixIn = require('./node_modules/quickstart/node_modules/mout/object/mixIn.js');
    var append = require('./node_modules/quickstart/node_modules/mout/array/append.js');
    var find = require('./node_modules/quickstart/node_modules/mout/array/find.js');
    var esprima = require('./node_modules/quickstart/node_modules/esprima/esprima.js');
    var sequence = require('./node_modules/quickstart/util/sequence.js').use(Promise);
    var transport = require('./node_modules/quickstart/util/transport.js');
    var Resolver = require('./node_modules/quickstart/util/resolver.js');
    var Messages = require('./node_modules/quickstart/util/messages.js');
    var requireDependencies = require('./node_modules/quickstart/transforms/require-dependencies.js');
    var isNative = Resolver.isNative;
    var parsers = {
      txt: function (path, text) {
        var tree = esprima.parse('module.exports = ""');
        tree.body[0].expression.right = {
          type: 'Literal',
          value: text
        };
        return tree;
      },
      js: function (path, text) {
        return esprima.parse(text, {
          loc: this.loc,
          source: path
        });
      },
      json: function (path, json) {
        return esprima.parse('module.exports = ' + json);
      }
    };
    var QuickStart = prime({
      constructor: function QuickStart(options) {
        if (!options)
          options = {};
        this.options = options;
        this.loc = !!options.loc;
        this.root = options.root ? pathogen.resolve(options.root) : pathogen.cwd();
        this.index = 0;
        this.node = !!options.node;
        this.resolver = new Resolver({
          browser: !this.node,
          defaultPath: options.defaultPath
        });
        this.modules = {};
        this.parsers = mixIn({}, parsers, options.parsers);
        this.transforms = append(append([], options.transforms), [requireDependencies]);
        this.packages = {};
        this.messages = options.messages || new Messages();
        this.cache = { parse: {} };
      },
      resolve: function (from, required) {
        var self = this;
        var messages = self.messages;
        var dir1 = pathogen.dirname(from);
        var selfPkg = /^quickstart$|^quickstart\//;
        if (selfPkg.test(required)) {
          required = pathogen(required.replace(selfPkg, pathogen(__dirname + '/../')));
        }
        return self.resolver.resolve(dir1, required).then(function (resolved) {
          if (isNative(resolved)) {
            var dir2 = pathogen(__dirname + '/');
            return dir1 !== dir2 ? self.resolver.resolve(dir2, required) : resolved;
          } else {
            return resolved;
          }
        }).catch(function (error) {
          messages.group('Errors').error({
            id: 'ResolveError',
            message: 'unable to resolve ' + required,
            source: pathogen.relative(self.root, from)
          });
          throw error;
        });
      },
      require: function (from, required) {
        var self = this;
        return self.resolve(from, required).then(function (resolved) {
          if (isNative(resolved))
            return resolved;
          if (resolved === false)
            return false;
          return self.analyze(from, required, resolved).then(function () {
            return self.include(resolved);
          });
        });
      },
      include: function (path) {
        var self = this;
        var messages = self.messages;
        var uid = self.uid(path);
        var module = self.modules[uid];
        if (module)
          return Promise.resolve(uid);
        return transport(path).then(function (data) {
          return self.parse(path, data);
        }, function (error) {
          messages.group('Errors').error({
            id: 'TransportError',
            message: 'unable to read',
            source: pathogen.relative(self.root, path)
          });
          throw error;
        }).then(function () {
          return uid;
        });
      },
      analyze: function (from, required, resolved) {
        var self = this;
        var packages = self.packages;
        var messages = self.messages;
        var root = self.root;
        return self.resolver.findRoot(resolved).then(function (path) {
          return transport.json(path + 'package.json').then(function (json) {
            return {
              json: json,
              path: path
            };
          });
        }).then(function (result) {
          var path = result.path;
          var name = result.json.name;
          var version = result.json.version;
          path = pathogen.relative(root, path);
          var pkg = packages[name] || (packages[name] = []);
          var same = find(pkg, function (obj) {
            return obj.path === path;
          });
          if (same)
            return;
          var instance = {
            version: version,
            path: path
          };
          pkg.push(instance);
          if (pkg.length > 1) {
            var group = messages.group('Warnings');
            if (pkg.length === 2)
              group.warn({
                id: name,
                message: 'duplicate v' + pkg[0].version + ' found',
                source: pkg[0].path
              });
            group.warn({
              id: name,
              message: 'duplicate v' + version + ' found',
              source: path
            });
          }
        }, function () {
        });
      },
      uid: function (full) {
        return pathogen.relative(this.root, full);
      },
      parse: function (full, data) {
        var self = this;
        var cache = self.cache.parse;
        if (cache[full])
          return cache[full];
        var modules = self.modules;
        var messages = self.messages;
        var uid = self.uid(full);
        var relative = pathogen.relative(self.root, full);
        var module = modules[uid] = { uid: uid };
        var extname = pathogen.extname(full).substr(1);
        var parse = extname && self.parsers[extname] || self.parsers.txt;
        return cache[full] = Promise.resolve().then(function () {
          return parse.call(self, relative, data);
        }).catch(function (error) {
          messages.group('Errors').error({
            id: 'ParseError',
            message: error.message,
            source: relative
          });
          throw error;
        }).then(function (tree) {
          return self.transform(relative, tree);
        }).then(function (tree) {
          module.ast = tree;
          module.path = relative;
          return module;
        });
      },
      transform: function (path, tree) {
        var self = this;
        return sequence.reduce(self.transforms, function (tree, transform) {
          return transform.call(self, path, tree);
        }, tree);
      }
    });
    module.exports = QuickStart;
  },
  './node_modules/quickstart/util/program.js': function (require, module, exports, global) {
    'use strict';
    var esprima = require('./node_modules/quickstart/node_modules/esprima/esprima.js');
    var forIn = require('./node_modules/quickstart/node_modules/mout/object/forIn.js');
    var Syntax = esprima.Syntax;
    module.exports = function program(main, modules, runtime) {
      var Program = esprima.parse('(function(main, modules) {})({})');
      var Runtime = runtime;
      Runtime.type = Syntax.BlockStatement;
      Program.body[0].expression.callee.body = Runtime;
      var ProgramArguments = Program.body[0].expression.arguments;
      var ObjectExpression = ProgramArguments[0];
      ProgramArguments.unshift({
        type: Syntax.Literal,
        value: main
      });
      forIn(modules, function (module, id) {
        var tree = module.ast;
        var ModuleProgram = esprima.parse('(function(require, module, exports, global){})');
        tree.type = Syntax.BlockStatement;
        ModuleProgram.body[0].expression.body = tree;
        ObjectExpression.properties.push({
          type: Syntax.Property,
          key: {
            type: Syntax.Literal,
            value: id
          },
          value: ModuleProgram.body[0].expression,
          kind: 'init'
        });
      });
      return Program;
    };
  },
  './node_modules/quickstart/util/messages.js': function (require, module, exports, global) {
    'use strict';
    var prime = require('./node_modules/quickstart/node_modules/prime/index.js');
    var forIn = require('./node_modules/quickstart/node_modules/mout/object/forIn.js');
    var forEach = require('./node_modules/quickstart/node_modules/mout/array/forEach.js');
    var size = require('./node_modules/quickstart/node_modules/mout/object/size.js');
    var microseconds = require('./node_modules/quickstart/node_modules/microseconds/index.js');
    var Message = prime({
      constructor: function (type, statement) {
        this.type = type;
        this.statement = statement;
      }
    });
    var Messages = prime({
      constructor: function (name) {
        this.name = name;
        this.reset();
      },
      group: function (name, collapsed) {
        var group = this.groups[name] || (this.groups[name] = new Messages(name));
        group.collapsed = !!collapsed;
        return group;
      },
      groupCollapsed: function (name) {
        return this.group(name, true);
      },
      error: function (statement) {
        this.messages.push(new Message('error', statement));
        return this;
      },
      warn: function (statement) {
        this.messages.push(new Message('warn', statement));
        return this;
      },
      info: function (statement) {
        this.messages.push(new Message('info', statement));
        return this;
      },
      log: function (statement) {
        return this.info(statement);
      },
      time: function (id) {
        this.timeStamps[id] = microseconds.now();
        return this;
      },
      timeEnd: function (id, name) {
        var timestamp = this.timeStamps[id];
        if (timestamp) {
          var end = microseconds.since(timestamp);
          var timeStampString = microseconds.parse(end).toString();
          this.messages.push(new Message('time', {
            id: name || id,
            message: timeStampString
          }));
        }
        return this;
      },
      print: function (format) {
        if (!this.messages.length && !size(this.groups))
          return;
        if (this.name)
          format(this.collapsed ? 'groupCollapsed' : 'group', this.name);
        forIn(this.groups, function (group) {
          group.print(format);
        });
        forEach(this.messages, function (message) {
          format(message.type, message.statement);
        });
        if (this.name)
          format('groupEnd');
        return this;
      },
      reset: function () {
        this.messages = [];
        this.groups = {};
        this.timeStamps = {};
      }
    });
    module.exports = Messages;
  },
  './node_modules/quickstart/node_modules/pathogen/index.js': function (require, module, exports, global) {
    var process = require('./node_modules/quickstart/browser/process.js');
    'use strict';
    var prime = require('./node_modules/quickstart/node_modules/prime/index.js');
    var map = require('./node_modules/quickstart/node_modules/mout/array/map.js');
    var slice = require('./node_modules/quickstart/node_modules/mout/array/slice.js');
    var drvRe = /^(.+):/;
    var winRe = /\\+/g;
    var nixRe = /\/+/g;
    var absRe = /^\//;
    var extRe = /\.\w+$/;
    var split = function (path) {
      var parts = (path || '.').split(nixRe);
      var p0 = parts[0];
      if (p0 === '')
        parts.shift();
      var up = 0;
      for (var i = parts.length; i--;) {
        var curr = parts[i];
        if (curr === '.') {
          parts.splice(i, 1);
        } else if (curr === '..') {
          parts.splice(i, 1);
          up++;
        } else if (up) {
          parts.splice(i, 1);
          up--;
        }
      }
      if (p0 !== '')
        for (; up--; up)
          parts.unshift('..');
      else
        parts.length ? parts.unshift('') : parts.push('', '');
      p0 = parts[0];
      if (p0 !== '..' && p0 !== '.' && (p0 !== '' || parts.length === 1))
        parts.unshift('.');
      return parts;
    };
    var Pathogen = prime({
      constructor: function (path) {
        path = (path || '') + '';
        if (!(this instanceof Pathogen))
          return new Pathogen(path).toString();
        var drive;
        path = path.replace(drvRe, function (m) {
          drive = m;
          return '';
        });
        path = path.replace(winRe, '/');
        this.drive = drive || '';
        if (this.drive && !path)
          path = '/';
        this.parts = split(path);
      },
      basename: function (ext) {
        return this.parts.slice(-1)[0];
      },
      dirname: function () {
        if (!this.basename())
          return new Pathogen(this);
        return new Pathogen(this.drive + this.parts.slice(0, -1).join('/') + '/');
      },
      extname: function () {
        var m = this.basename().match(/\.\w+$/);
        return m ? m[0] : '';
      },
      resolve: function () {
        var absolute;
        var paths = [new Pathogen(this)].concat(map(arguments, function (path) {
          return new Pathogen(path);
        }));
        var parts = [];
        for (var i = paths.length; i--;) {
          var path = paths[i];
          if (path.parts[0] === '') {
            absolute = path;
            break;
          } else {
            parts.unshift(path.parts.join('/'));
          }
        }
        if (!absolute)
          absolute = new Pathogen(process.cwd() + '/');
        return new Pathogen(absolute.drive + absolute.parts.concat(parts).join('/'));
      },
      relative: function (to) {
        var from = this.resolve().dirname();
        to = new Pathogen(to).resolve();
        if (this.drive !== to.drive)
          return to;
        var base = to.basename();
        to = to.dirname();
        var fromParts = from.parts.slice(0, -1);
        var toParts = to.parts.slice(0, -1);
        var i;
        var length = Math.min(fromParts.length, toParts.length);
        var samePartsLength = length;
        for (i = 0; i < length; i++) {
          if (fromParts[i] !== toParts[i]) {
            samePartsLength = i;
            break;
          }
        }
        var output = [];
        for (i = samePartsLength; i < fromParts.length; i++)
          output.push('..');
        output = output.concat(toParts.slice(samePartsLength));
        var joined = output.concat(base).join('/');
        return new Pathogen(!!joined.match(absRe) ? this.drive + joined : joined);
      },
      toString: function () {
        return this.drive + this.parts.join('/');
      },
      toSystem: function () {
        return process.platform === 'win32' ? this.toWindows() : this.toString();
      },
      toWindows: function () {
        return this.drive + this.parts.join('\\');
      }
    });
    var pathogen = Pathogen;
    pathogen.cwd = function () {
      return new Pathogen(process.cwd() + '/').toString();
    };
    pathogen.dirname = function (path) {
      return new Pathogen(path).dirname().toString();
    };
    pathogen.basename = function (path) {
      return new Pathogen(path).basename();
    };
    pathogen.extname = function (path) {
      return new Pathogen(path).extname();
    };
    pathogen.resolve = function (path) {
      return Pathogen.prototype.resolve.apply(path, slice(arguments, 1)).toString();
    };
    pathogen.relative = function (path, to) {
      return new Pathogen(path).relative(to).toString();
    };
    pathogen.sys = function (path) {
      return new Pathogen(path).toSystem();
    };
    pathogen.nix = function (path) {
      return new Pathogen(path).toString();
    };
    pathogen.win = function (path) {
      return new Pathogen(path).toWindows();
    };
    module.exports = pathogen;
  },
  './node_modules/quickstart/node_modules/escodegen/escodegen.js': function (require, module, exports, global) {
    (function () {
      'use strict';
      var Syntax, Precedence, BinaryPrecedence, SourceNode, estraverse, esutils, isArray, base, indent, json, renumber, hexadecimal, quotes, escapeless, newline, space, parentheses, semicolons, safeConcatenation, directive, extra, parse, sourceMap, sourceCode, preserveBlankLines, FORMAT_MINIFY, FORMAT_DEFAULTS;
      estraverse = require('./node_modules/quickstart/node_modules/escodegen/node_modules/estraverse/estraverse.js');
      esutils = require('./node_modules/quickstart/node_modules/escodegen/node_modules/esutils/lib/utils.js');
      Syntax = estraverse.Syntax;
      function isExpression(node) {
        return CodeGenerator.Expression.hasOwnProperty(node.type);
      }
      function isStatement(node) {
        return CodeGenerator.Statement.hasOwnProperty(node.type);
      }
      Precedence = {
        Sequence: 0,
        Yield: 1,
        Await: 1,
        Assignment: 1,
        Conditional: 2,
        ArrowFunction: 2,
        LogicalOR: 3,
        LogicalAND: 4,
        BitwiseOR: 5,
        BitwiseXOR: 6,
        BitwiseAND: 7,
        Equality: 8,
        Relational: 9,
        BitwiseSHIFT: 10,
        Additive: 11,
        Multiplicative: 12,
        Unary: 13,
        Postfix: 14,
        Call: 15,
        New: 16,
        TaggedTemplate: 17,
        Member: 18,
        Primary: 19
      };
      BinaryPrecedence = {
        '||': Precedence.LogicalOR,
        '&&': Precedence.LogicalAND,
        '|': Precedence.BitwiseOR,
        '^': Precedence.BitwiseXOR,
        '&': Precedence.BitwiseAND,
        '==': Precedence.Equality,
        '!=': Precedence.Equality,
        '===': Precedence.Equality,
        '!==': Precedence.Equality,
        'is': Precedence.Equality,
        'isnt': Precedence.Equality,
        '<': Precedence.Relational,
        '>': Precedence.Relational,
        '<=': Precedence.Relational,
        '>=': Precedence.Relational,
        'in': Precedence.Relational,
        'instanceof': Precedence.Relational,
        '<<': Precedence.BitwiseSHIFT,
        '>>': Precedence.BitwiseSHIFT,
        '>>>': Precedence.BitwiseSHIFT,
        '+': Precedence.Additive,
        '-': Precedence.Additive,
        '*': Precedence.Multiplicative,
        '%': Precedence.Multiplicative,
        '/': Precedence.Multiplicative
      };
      var F_ALLOW_IN = 1, F_ALLOW_CALL = 1 << 1, F_ALLOW_UNPARATH_NEW = 1 << 2, F_FUNC_BODY = 1 << 3, F_DIRECTIVE_CTX = 1 << 4, F_SEMICOLON_OPT = 1 << 5;
      var E_FTT = F_ALLOW_CALL | F_ALLOW_UNPARATH_NEW, E_TTF = F_ALLOW_IN | F_ALLOW_CALL, E_TTT = F_ALLOW_IN | F_ALLOW_CALL | F_ALLOW_UNPARATH_NEW, E_TFF = F_ALLOW_IN, E_FFT = F_ALLOW_UNPARATH_NEW, E_TFT = F_ALLOW_IN | F_ALLOW_UNPARATH_NEW;
      var S_TFFF = F_ALLOW_IN, S_TFFT = F_ALLOW_IN | F_SEMICOLON_OPT, S_FFFF = 0, S_TFTF = F_ALLOW_IN | F_DIRECTIVE_CTX, S_TTFF = F_ALLOW_IN | F_FUNC_BODY;
      function getDefaultOptions() {
        return {
          indent: null,
          base: null,
          parse: null,
          comment: false,
          format: {
            indent: {
              style: '    ',
              base: 0,
              adjustMultilineComment: false
            },
            newline: '\n',
            space: ' ',
            json: false,
            renumber: false,
            hexadecimal: false,
            quotes: 'single',
            escapeless: false,
            compact: false,
            parentheses: true,
            semicolons: true,
            safeConcatenation: false,
            preserveBlankLines: false
          },
          moz: {
            comprehensionExpressionStartsWithAssignment: false,
            starlessGenerator: false
          },
          sourceMap: null,
          sourceMapRoot: null,
          sourceMapWithCode: false,
          directive: false,
          raw: true,
          verbatim: null,
          sourceCode: null
        };
      }
      function stringRepeat(str, num) {
        var result = '';
        for (num |= 0; num > 0; num >>>= 1, str += str) {
          if (num & 1) {
            result += str;
          }
        }
        return result;
      }
      isArray = Array.isArray;
      if (!isArray) {
        isArray = function isArray(array) {
          return Object.prototype.toString.call(array) === '[object Array]';
        };
      }
      function hasLineTerminator(str) {
        return /[\r\n]/g.test(str);
      }
      function endsWithLineTerminator(str) {
        var len = str.length;
        return len && esutils.code.isLineTerminator(str.charCodeAt(len - 1));
      }
      function merge(target, override) {
        var key;
        for (key in override) {
          if (override.hasOwnProperty(key)) {
            target[key] = override[key];
          }
        }
        return target;
      }
      function updateDeeply(target, override) {
        var key, val;
        function isHashObject(target) {
          return typeof target === 'object' && target instanceof Object && !(target instanceof RegExp);
        }
        for (key in override) {
          if (override.hasOwnProperty(key)) {
            val = override[key];
            if (isHashObject(val)) {
              if (isHashObject(target[key])) {
                updateDeeply(target[key], val);
              } else {
                target[key] = updateDeeply({}, val);
              }
            } else {
              target[key] = val;
            }
          }
        }
        return target;
      }
      function generateNumber(value) {
        var result, point, temp, exponent, pos;
        if (value !== value) {
          throw new Error('Numeric literal whose value is NaN');
        }
        if (value < 0 || value === 0 && 1 / value < 0) {
          throw new Error('Numeric literal whose value is negative');
        }
        if (value === 1 / 0) {
          return json ? 'null' : renumber ? '1e400' : '1e+400';
        }
        result = '' + value;
        if (!renumber || result.length < 3) {
          return result;
        }
        point = result.indexOf('.');
        if (!json && result.charCodeAt(0) === 48 && point === 1) {
          point = 0;
          result = result.slice(1);
        }
        temp = result;
        result = result.replace('e+', 'e');
        exponent = 0;
        if ((pos = temp.indexOf('e')) > 0) {
          exponent = +temp.slice(pos + 1);
          temp = temp.slice(0, pos);
        }
        if (point >= 0) {
          exponent -= temp.length - point - 1;
          temp = +(temp.slice(0, point) + temp.slice(point + 1)) + '';
        }
        pos = 0;
        while (temp.charCodeAt(temp.length + pos - 1) === 48) {
          --pos;
        }
        if (pos !== 0) {
          exponent -= pos;
          temp = temp.slice(0, pos);
        }
        if (exponent !== 0) {
          temp += 'e' + exponent;
        }
        if ((temp.length < result.length || hexadecimal && value > 1000000000000 && Math.floor(value) === value && (temp = '0x' + value.toString(16)).length < result.length) && +temp === value) {
          result = temp;
        }
        return result;
      }
      function escapeRegExpCharacter(ch, previousIsBackslash) {
        if ((ch & ~1) === 8232) {
          return (previousIsBackslash ? 'u' : '\\u') + (ch === 8232 ? '2028' : '2029');
        } else if (ch === 10 || ch === 13) {
          return (previousIsBackslash ? '' : '\\') + (ch === 10 ? 'n' : 'r');
        }
        return String.fromCharCode(ch);
      }
      function generateRegExp(reg) {
        var match, result, flags, i, iz, ch, characterInBrack, previousIsBackslash;
        result = reg.toString();
        if (reg.source) {
          match = result.match(/\/([^/]*)$/);
          if (!match) {
            return result;
          }
          flags = match[1];
          result = '';
          characterInBrack = false;
          previousIsBackslash = false;
          for (i = 0, iz = reg.source.length; i < iz; ++i) {
            ch = reg.source.charCodeAt(i);
            if (!previousIsBackslash) {
              if (characterInBrack) {
                if (ch === 93) {
                  characterInBrack = false;
                }
              } else {
                if (ch === 47) {
                  result += '\\';
                } else if (ch === 91) {
                  characterInBrack = true;
                }
              }
              result += escapeRegExpCharacter(ch, previousIsBackslash);
              previousIsBackslash = ch === 92;
            } else {
              result += escapeRegExpCharacter(ch, previousIsBackslash);
              previousIsBackslash = false;
            }
          }
          return '/' + result + '/' + flags;
        }
        return result;
      }
      function escapeAllowedCharacter(code, next) {
        var hex;
        if (code === 8) {
          return '\\b';
        }
        if (code === 12) {
          return '\\f';
        }
        if (code === 9) {
          return '\\t';
        }
        hex = code.toString(16).toUpperCase();
        if (json || code > 255) {
          return '\\u' + '0000'.slice(hex.length) + hex;
        } else if (code === 0 && !esutils.code.isDecimalDigit(next)) {
          return '\\0';
        } else if (code === 11) {
          return '\\x0B';
        } else {
          return '\\x' + '00'.slice(hex.length) + hex;
        }
      }
      function escapeDisallowedCharacter(code) {
        if (code === 92) {
          return '\\\\';
        }
        if (code === 10) {
          return '\\n';
        }
        if (code === 13) {
          return '\\r';
        }
        if (code === 8232) {
          return '\\u2028';
        }
        if (code === 8233) {
          return '\\u2029';
        }
        throw new Error('Incorrectly classified character');
      }
      function escapeDirective(str) {
        var i, iz, code, quote;
        quote = quotes === 'double' ? '"' : '\'';
        for (i = 0, iz = str.length; i < iz; ++i) {
          code = str.charCodeAt(i);
          if (code === 39) {
            quote = '"';
            break;
          } else if (code === 34) {
            quote = '\'';
            break;
          } else if (code === 92) {
            ++i;
          }
        }
        return quote + str + quote;
      }
      function escapeString(str) {
        var result = '', i, len, code, singleQuotes = 0, doubleQuotes = 0, single, quote;
        for (i = 0, len = str.length; i < len; ++i) {
          code = str.charCodeAt(i);
          if (code === 39) {
            ++singleQuotes;
          } else if (code === 34) {
            ++doubleQuotes;
          } else if (code === 47 && json) {
            result += '\\';
          } else if (esutils.code.isLineTerminator(code) || code === 92) {
            result += escapeDisallowedCharacter(code);
            continue;
          } else if (json && code < 32 || !(json || escapeless || code >= 32 && code <= 126)) {
            result += escapeAllowedCharacter(code, str.charCodeAt(i + 1));
            continue;
          }
          result += String.fromCharCode(code);
        }
        single = !(quotes === 'double' || quotes === 'auto' && doubleQuotes < singleQuotes);
        quote = single ? '\'' : '"';
        if (!(single ? singleQuotes : doubleQuotes)) {
          return quote + result + quote;
        }
        str = result;
        result = quote;
        for (i = 0, len = str.length; i < len; ++i) {
          code = str.charCodeAt(i);
          if (code === 39 && single || code === 34 && !single) {
            result += '\\';
          }
          result += String.fromCharCode(code);
        }
        return result + quote;
      }
      function flattenToString(arr) {
        var i, iz, elem, result = '';
        for (i = 0, iz = arr.length; i < iz; ++i) {
          elem = arr[i];
          result += isArray(elem) ? flattenToString(elem) : elem;
        }
        return result;
      }
      function toSourceNodeWhenNeeded(generated, node) {
        if (!sourceMap) {
          if (isArray(generated)) {
            return flattenToString(generated);
          } else {
            return generated;
          }
        }
        if (node == null) {
          if (generated instanceof SourceNode) {
            return generated;
          } else {
            node = {};
          }
        }
        if (node.loc == null) {
          return new SourceNode(null, null, sourceMap, generated, node.name || null);
        }
        return new SourceNode(node.loc.start.line, node.loc.start.column, sourceMap === true ? node.loc.source || null : sourceMap, generated, node.name || null);
      }
      function noEmptySpace() {
        return space ? space : ' ';
      }
      function join(left, right) {
        var leftSource, rightSource, leftCharCode, rightCharCode;
        leftSource = toSourceNodeWhenNeeded(left).toString();
        if (leftSource.length === 0) {
          return [right];
        }
        rightSource = toSourceNodeWhenNeeded(right).toString();
        if (rightSource.length === 0) {
          return [left];
        }
        leftCharCode = leftSource.charCodeAt(leftSource.length - 1);
        rightCharCode = rightSource.charCodeAt(0);
        if ((leftCharCode === 43 || leftCharCode === 45) && leftCharCode === rightCharCode || esutils.code.isIdentifierPart(leftCharCode) && esutils.code.isIdentifierPart(rightCharCode) || leftCharCode === 47 && rightCharCode === 105) {
          return [
            left,
            noEmptySpace(),
            right
          ];
        } else if (esutils.code.isWhiteSpace(leftCharCode) || esutils.code.isLineTerminator(leftCharCode) || esutils.code.isWhiteSpace(rightCharCode) || esutils.code.isLineTerminator(rightCharCode)) {
          return [
            left,
            right
          ];
        }
        return [
          left,
          space,
          right
        ];
      }
      function addIndent(stmt) {
        return [
          base,
          stmt
        ];
      }
      function withIndent(fn) {
        var previousBase;
        previousBase = base;
        base += indent;
        fn(base);
        base = previousBase;
      }
      function calculateSpaces(str) {
        var i;
        for (i = str.length - 1; i >= 0; --i) {
          if (esutils.code.isLineTerminator(str.charCodeAt(i))) {
            break;
          }
        }
        return str.length - 1 - i;
      }
      function adjustMultilineComment(value, specialBase) {
        var array, i, len, line, j, spaces, previousBase, sn;
        array = value.split(/\r\n|[\r\n]/);
        spaces = Number.MAX_VALUE;
        for (i = 1, len = array.length; i < len; ++i) {
          line = array[i];
          j = 0;
          while (j < line.length && esutils.code.isWhiteSpace(line.charCodeAt(j))) {
            ++j;
          }
          if (spaces > j) {
            spaces = j;
          }
        }
        if (typeof specialBase !== 'undefined') {
          previousBase = base;
          if (array[1][spaces] === '*') {
            specialBase += ' ';
          }
          base = specialBase;
        } else {
          if (spaces & 1) {
            --spaces;
          }
          previousBase = base;
        }
        for (i = 1, len = array.length; i < len; ++i) {
          sn = toSourceNodeWhenNeeded(addIndent(array[i].slice(spaces)));
          array[i] = sourceMap ? sn.join('') : sn;
        }
        base = previousBase;
        return array.join('\n');
      }
      function generateComment(comment, specialBase) {
        if (comment.type === 'Line') {
          if (endsWithLineTerminator(comment.value)) {
            return '//' + comment.value;
          } else {
            var result = '//' + comment.value;
            if (!preserveBlankLines) {
              result += '\n';
            }
            return result;
          }
        }
        if (extra.format.indent.adjustMultilineComment && /[\n\r]/.test(comment.value)) {
          return adjustMultilineComment('/*' + comment.value + '*/', specialBase);
        }
        return '/*' + comment.value + '*/';
      }
      function addComments(stmt, result) {
        var i, len, comment, save, tailingToStatement, specialBase, fragment, extRange, range, prevRange, prefix, infix, suffix, count;
        if (stmt.leadingComments && stmt.leadingComments.length > 0) {
          save = result;
          if (preserveBlankLines) {
            comment = stmt.leadingComments[0];
            result = [];
            extRange = comment.extendedRange;
            range = comment.range;
            prefix = sourceCode.substring(extRange[0], range[0]);
            count = (prefix.match(/\n/g) || []).length;
            if (count > 0) {
              result.push(stringRepeat('\n', count));
              result.push(addIndent(generateComment(comment)));
            } else {
              result.push(prefix);
              result.push(generateComment(comment));
            }
            prevRange = range;
            for (i = 1, len = stmt.leadingComments.length; i < len; i++) {
              comment = stmt.leadingComments[i];
              range = comment.range;
              infix = sourceCode.substring(prevRange[1], range[0]);
              count = (infix.match(/\n/g) || []).length;
              result.push(stringRepeat('\n', count));
              result.push(addIndent(generateComment(comment)));
              prevRange = range;
            }
            suffix = sourceCode.substring(range[1], extRange[1]);
            count = (suffix.match(/\n/g) || []).length;
            result.push(stringRepeat('\n', count));
          } else {
            comment = stmt.leadingComments[0];
            result = [];
            if (safeConcatenation && stmt.type === Syntax.Program && stmt.body.length === 0) {
              result.push('\n');
            }
            result.push(generateComment(comment));
            if (!endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString())) {
              result.push('\n');
            }
            for (i = 1, len = stmt.leadingComments.length; i < len; ++i) {
              comment = stmt.leadingComments[i];
              fragment = [generateComment(comment)];
              if (!endsWithLineTerminator(toSourceNodeWhenNeeded(fragment).toString())) {
                fragment.push('\n');
              }
              result.push(addIndent(fragment));
            }
          }
          result.push(addIndent(save));
        }
        if (stmt.trailingComments) {
          if (preserveBlankLines) {
            comment = stmt.trailingComments[0];
            extRange = comment.extendedRange;
            range = comment.range;
            prefix = sourceCode.substring(extRange[0], range[0]);
            count = (prefix.match(/\n/g) || []).length;
            if (count > 0) {
              result.push(stringRepeat('\n', count));
              result.push(addIndent(generateComment(comment)));
            } else {
              result.push(prefix);
              result.push(generateComment(comment));
            }
          } else {
            tailingToStatement = !endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString());
            specialBase = stringRepeat(' ', calculateSpaces(toSourceNodeWhenNeeded([
              base,
              result,
              indent
            ]).toString()));
            for (i = 0, len = stmt.trailingComments.length; i < len; ++i) {
              comment = stmt.trailingComments[i];
              if (tailingToStatement) {
                if (i === 0) {
                  result = [
                    result,
                    indent
                  ];
                } else {
                  result = [
                    result,
                    specialBase
                  ];
                }
                result.push(generateComment(comment, specialBase));
              } else {
                result = [
                  result,
                  addIndent(generateComment(comment))
                ];
              }
              if (i !== len - 1 && !endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString())) {
                result = [
                  result,
                  '\n'
                ];
              }
            }
          }
        }
        return result;
      }
      function generateBlankLines(start, end, result) {
        var j, newlineCount = 0;
        for (j = start; j < end; j++) {
          if (sourceCode[j] === '\n') {
            newlineCount++;
          }
        }
        for (j = 1; j < newlineCount; j++) {
          result.push(newline);
        }
      }
      function parenthesize(text, current, should) {
        if (current < should) {
          return [
            '(',
            text,
            ')'
          ];
        }
        return text;
      }
      function generateVerbatimString(string) {
        var i, iz, result;
        result = string.split(/\r\n|\n/);
        for (i = 1, iz = result.length; i < iz; i++) {
          result[i] = newline + base + result[i];
        }
        return result;
      }
      function generateVerbatim(expr, precedence) {
        var verbatim, result, prec;
        verbatim = expr[extra.verbatim];
        if (typeof verbatim === 'string') {
          result = parenthesize(generateVerbatimString(verbatim), Precedence.Sequence, precedence);
        } else {
          result = generateVerbatimString(verbatim.content);
          prec = verbatim.precedence != null ? verbatim.precedence : Precedence.Sequence;
          result = parenthesize(result, prec, precedence);
        }
        return toSourceNodeWhenNeeded(result, expr);
      }
      function CodeGenerator() {
      }
      CodeGenerator.prototype.maybeBlock = function (stmt, flags) {
        var result, noLeadingComment, that = this;
        noLeadingComment = !extra.comment || !stmt.leadingComments;
        if (stmt.type === Syntax.BlockStatement && noLeadingComment) {
          return [
            space,
            this.generateStatement(stmt, flags)
          ];
        }
        if (stmt.type === Syntax.EmptyStatement && noLeadingComment) {
          return ';';
        }
        withIndent(function () {
          result = [
            newline,
            addIndent(that.generateStatement(stmt, flags))
          ];
        });
        return result;
      };
      CodeGenerator.prototype.maybeBlockSuffix = function (stmt, result) {
        var ends = endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString());
        if (stmt.type === Syntax.BlockStatement && (!extra.comment || !stmt.leadingComments) && !ends) {
          return [
            result,
            space
          ];
        }
        if (ends) {
          return [
            result,
            base
          ];
        }
        return [
          result,
          newline,
          base
        ];
      };
      function generateIdentifier(node) {
        return toSourceNodeWhenNeeded(node.name, node);
      }
      function generateAsyncPrefix(node, spaceRequired) {
        return node.async ? 'async' + (spaceRequired ? noEmptySpace() : space) : '';
      }
      function generateStarSuffix(node) {
        var isGenerator = node.generator && !extra.moz.starlessGenerator;
        return isGenerator ? '*' + space : '';
      }
      function generateMethodPrefix(prop) {
        var func = prop.value;
        if (func.async) {
          return generateAsyncPrefix(func, !prop.computed);
        } else {
          return generateStarSuffix(func) ? '*' : '';
        }
      }
      CodeGenerator.prototype.generatePattern = function (node, precedence, flags) {
        if (node.type === Syntax.Identifier) {
          return generateIdentifier(node);
        }
        return this.generateExpression(node, precedence, flags);
      };
      CodeGenerator.prototype.generateFunctionParams = function (node) {
        var i, iz, result, hasDefault;
        hasDefault = false;
        if (node.type === Syntax.ArrowFunctionExpression && !node.rest && (!node.defaults || node.defaults.length === 0) && node.params.length === 1 && node.params[0].type === Syntax.Identifier) {
          result = [
            generateAsyncPrefix(node, true),
            generateIdentifier(node.params[0])
          ];
        } else {
          result = node.type === Syntax.ArrowFunctionExpression ? [generateAsyncPrefix(node, false)] : [];
          result.push('(');
          if (node.defaults) {
            hasDefault = true;
          }
          for (i = 0, iz = node.params.length; i < iz; ++i) {
            if (hasDefault && node.defaults[i]) {
              result.push(this.generateAssignment(node.params[i], node.defaults[i], '=', Precedence.Assignment, E_TTT));
            } else {
              result.push(this.generatePattern(node.params[i], Precedence.Assignment, E_TTT));
            }
            if (i + 1 < iz) {
              result.push(',' + space);
            }
          }
          if (node.rest) {
            if (node.params.length) {
              result.push(',' + space);
            }
            result.push('...');
            result.push(generateIdentifier(node.rest));
          }
          result.push(')');
        }
        return result;
      };
      CodeGenerator.prototype.generateFunctionBody = function (node) {
        var result, expr;
        result = this.generateFunctionParams(node);
        if (node.type === Syntax.ArrowFunctionExpression) {
          result.push(space);
          result.push('=>');
        }
        if (node.expression) {
          result.push(space);
          expr = this.generateExpression(node.body, Precedence.Assignment, E_TTT);
          if (expr.toString().charAt(0) === '{') {
            expr = [
              '(',
              expr,
              ')'
            ];
          }
          result.push(expr);
        } else {
          result.push(this.maybeBlock(node.body, S_TTFF));
        }
        return result;
      };
      CodeGenerator.prototype.generateIterationForStatement = function (operator, stmt, flags) {
        var result = ['for' + space + '('], that = this;
        withIndent(function () {
          if (stmt.left.type === Syntax.VariableDeclaration) {
            withIndent(function () {
              result.push(stmt.left.kind + noEmptySpace());
              result.push(that.generateStatement(stmt.left.declarations[0], S_FFFF));
            });
          } else {
            result.push(that.generateExpression(stmt.left, Precedence.Call, E_TTT));
          }
          result = join(result, operator);
          result = [
            join(result, that.generateExpression(stmt.right, Precedence.Sequence, E_TTT)),
            ')'
          ];
        });
        result.push(this.maybeBlock(stmt.body, flags));
        return result;
      };
      CodeGenerator.prototype.generatePropertyKey = function (expr, computed) {
        var result = [];
        if (computed) {
          result.push('[');
        }
        result.push(this.generateExpression(expr, Precedence.Sequence, E_TTT));
        if (computed) {
          result.push(']');
        }
        return result;
      };
      CodeGenerator.prototype.generateAssignment = function (left, right, operator, precedence, flags) {
        if (Precedence.Assignment < precedence) {
          flags |= F_ALLOW_IN;
        }
        return parenthesize([
          this.generateExpression(left, Precedence.Call, flags),
          space + operator + space,
          this.generateExpression(right, Precedence.Assignment, flags)
        ], Precedence.Assignment, precedence);
      };
      CodeGenerator.prototype.semicolon = function (flags) {
        if (!semicolons && flags & F_SEMICOLON_OPT) {
          return '';
        }
        return ';';
      };
      CodeGenerator.Statement = {
        BlockStatement: function (stmt, flags) {
          var range, content, result = [
              '{',
              newline
            ], that = this;
          withIndent(function () {
            if (stmt.body.length === 0 && preserveBlankLines) {
              range = stmt.range;
              if (range[1] - range[0] > 2) {
                content = sourceCode.substring(range[0] + 1, range[1] - 1);
                if (content[0] === '\n') {
                  result = ['{'];
                }
                result.push(content);
              }
            }
            var i, iz, fragment, bodyFlags;
            bodyFlags = S_TFFF;
            if (flags & F_FUNC_BODY) {
              bodyFlags |= F_DIRECTIVE_CTX;
            }
            for (i = 0, iz = stmt.body.length; i < iz; ++i) {
              if (preserveBlankLines) {
                if (i === 0) {
                  if (stmt.body[0].leadingComments) {
                    range = stmt.body[0].leadingComments[0].extendedRange;
                    content = sourceCode.substring(range[0], range[1]);
                    if (content[0] === '\n') {
                      result = ['{'];
                    }
                  }
                  if (!stmt.body[0].leadingComments) {
                    generateBlankLines(stmt.range[0], stmt.body[0].range[0], result);
                  }
                }
                if (i > 0) {
                  if (!stmt.body[i - 1].trailingComments && !stmt.body[i].leadingComments) {
                    generateBlankLines(stmt.body[i - 1].range[1], stmt.body[i].range[0], result);
                  }
                }
              }
              if (i === iz - 1) {
                bodyFlags |= F_SEMICOLON_OPT;
              }
              if (stmt.body[i].leadingComments && preserveBlankLines) {
                fragment = that.generateStatement(stmt.body[i], bodyFlags);
              } else {
                fragment = addIndent(that.generateStatement(stmt.body[i], bodyFlags));
              }
              result.push(fragment);
              if (!endsWithLineTerminator(toSourceNodeWhenNeeded(fragment).toString())) {
                if (preserveBlankLines && i < iz - 1) {
                  if (!stmt.body[i + 1].leadingComments) {
                    result.push(newline);
                  }
                } else {
                  result.push(newline);
                }
              }
              if (preserveBlankLines) {
                if (i === iz - 1) {
                  if (!stmt.body[i].trailingComments) {
                    generateBlankLines(stmt.body[i].range[1], stmt.range[1], result);
                  }
                }
              }
            }
          });
          result.push(addIndent('}'));
          return result;
        },
        BreakStatement: function (stmt, flags) {
          if (stmt.label) {
            return 'break ' + stmt.label.name + this.semicolon(flags);
          }
          return 'break' + this.semicolon(flags);
        },
        ContinueStatement: function (stmt, flags) {
          if (stmt.label) {
            return 'continue ' + stmt.label.name + this.semicolon(flags);
          }
          return 'continue' + this.semicolon(flags);
        },
        ClassBody: function (stmt, flags) {
          var result = [
              '{',
              newline
            ], that = this;
          withIndent(function (indent) {
            var i, iz;
            for (i = 0, iz = stmt.body.length; i < iz; ++i) {
              result.push(indent);
              result.push(that.generateExpression(stmt.body[i], Precedence.Sequence, E_TTT));
              if (i + 1 < iz) {
                result.push(newline);
              }
            }
          });
          if (!endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString())) {
            result.push(newline);
          }
          result.push(base);
          result.push('}');
          return result;
        },
        ClassDeclaration: function (stmt, flags) {
          var result, fragment;
          result = ['class ' + stmt.id.name];
          if (stmt.superClass) {
            fragment = join('extends', this.generateExpression(stmt.superClass, Precedence.Assignment, E_TTT));
            result = join(result, fragment);
          }
          result.push(space);
          result.push(this.generateStatement(stmt.body, S_TFFT));
          return result;
        },
        DirectiveStatement: function (stmt, flags) {
          if (extra.raw && stmt.raw) {
            return stmt.raw + this.semicolon(flags);
          }
          return escapeDirective(stmt.directive) + this.semicolon(flags);
        },
        DoWhileStatement: function (stmt, flags) {
          var result = join('do', this.maybeBlock(stmt.body, S_TFFF));
          result = this.maybeBlockSuffix(stmt.body, result);
          return join(result, [
            'while' + space + '(',
            this.generateExpression(stmt.test, Precedence.Sequence, E_TTT),
            ')' + this.semicolon(flags)
          ]);
        },
        CatchClause: function (stmt, flags) {
          var result, that = this;
          withIndent(function () {
            var guard;
            result = [
              'catch' + space + '(',
              that.generateExpression(stmt.param, Precedence.Sequence, E_TTT),
              ')'
            ];
            if (stmt.guard) {
              guard = that.generateExpression(stmt.guard, Precedence.Sequence, E_TTT);
              result.splice(2, 0, ' if ', guard);
            }
          });
          result.push(this.maybeBlock(stmt.body, S_TFFF));
          return result;
        },
        DebuggerStatement: function (stmt, flags) {
          return 'debugger' + this.semicolon(flags);
        },
        EmptyStatement: function (stmt, flags) {
          return ';';
        },
        ExportDeclaration: function (stmt, flags) {
          var result = ['export'], bodyFlags, that = this;
          bodyFlags = flags & F_SEMICOLON_OPT ? S_TFFT : S_TFFF;
          if (stmt['default']) {
            result = join(result, 'default');
            if (isStatement(stmt.declaration)) {
              result = join(result, this.generateStatement(stmt.declaration, bodyFlags));
            } else {
              result = join(result, this.generateExpression(stmt.declaration, Precedence.Assignment, E_TTT) + this.semicolon(flags));
            }
            return result;
          }
          if (stmt.declaration) {
            return join(result, this.generateStatement(stmt.declaration, bodyFlags));
          }
          if (stmt.specifiers) {
            if (stmt.specifiers.length === 0) {
              result = join(result, '{' + space + '}');
            } else if (stmt.specifiers[0].type === Syntax.ExportBatchSpecifier) {
              result = join(result, this.generateExpression(stmt.specifiers[0], Precedence.Sequence, E_TTT));
            } else {
              result = join(result, '{');
              withIndent(function (indent) {
                var i, iz;
                result.push(newline);
                for (i = 0, iz = stmt.specifiers.length; i < iz; ++i) {
                  result.push(indent);
                  result.push(that.generateExpression(stmt.specifiers[i], Precedence.Sequence, E_TTT));
                  if (i + 1 < iz) {
                    result.push(',' + newline);
                  }
                }
              });
              if (!endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString())) {
                result.push(newline);
              }
              result.push(base + '}');
            }
            if (stmt.source) {
              result = join(result, [
                'from' + space,
                this.generateExpression(stmt.source, Precedence.Sequence, E_TTT),
                this.semicolon(flags)
              ]);
            } else {
              result.push(this.semicolon(flags));
            }
          }
          return result;
        },
        ExpressionStatement: function (stmt, flags) {
          var result, fragment;
          function isClassPrefixed(fragment) {
            var code;
            if (fragment.slice(0, 5) !== 'class') {
              return false;
            }
            code = fragment.charCodeAt(5);
            return code === 123 || esutils.code.isWhiteSpace(code) || esutils.code.isLineTerminator(code);
          }
          function isFunctionPrefixed(fragment) {
            var code;
            if (fragment.slice(0, 8) !== 'function') {
              return false;
            }
            code = fragment.charCodeAt(8);
            return code === 40 || esutils.code.isWhiteSpace(code) || code === 42 || esutils.code.isLineTerminator(code);
          }
          function isAsyncPrefixed(fragment) {
            var code, i, iz;
            if (fragment.slice(0, 5) !== 'async') {
              return false;
            }
            if (!esutils.code.isWhiteSpace(fragment.charCodeAt(5))) {
              return false;
            }
            for (i = 6, iz = fragment.length; i < iz; ++i) {
              if (!esutils.code.isWhiteSpace(fragment.charCodeAt(i))) {
                break;
              }
            }
            if (i === iz) {
              return false;
            }
            if (fragment.slice(i, i + 8) !== 'function') {
              return false;
            }
            code = fragment.charCodeAt(i + 8);
            return code === 40 || esutils.code.isWhiteSpace(code) || code === 42 || esutils.code.isLineTerminator(code);
          }
          result = [this.generateExpression(stmt.expression, Precedence.Sequence, E_TTT)];
          fragment = toSourceNodeWhenNeeded(result).toString();
          if (fragment.charCodeAt(0) === 123 || isClassPrefixed(fragment) || isFunctionPrefixed(fragment) || isAsyncPrefixed(fragment) || directive && flags & F_DIRECTIVE_CTX && stmt.expression.type === Syntax.Literal && typeof stmt.expression.value === 'string') {
            result = [
              '(',
              result,
              ')' + this.semicolon(flags)
            ];
          } else {
            result.push(this.semicolon(flags));
          }
          return result;
        },
        ImportDeclaration: function (stmt, flags) {
          var result, cursor, that = this;
          if (stmt.specifiers.length === 0) {
            return [
              'import',
              space,
              this.generateExpression(stmt.source, Precedence.Sequence, E_TTT),
              this.semicolon(flags)
            ];
          }
          result = ['import'];
          cursor = 0;
          if (stmt.specifiers[cursor].type === Syntax.ImportDefaultSpecifier) {
            result = join(result, [this.generateExpression(stmt.specifiers[cursor], Precedence.Sequence, E_TTT)]);
            ++cursor;
          }
          if (stmt.specifiers[cursor]) {
            if (cursor !== 0) {
              result.push(',');
            }
            if (stmt.specifiers[cursor].type === Syntax.ImportNamespaceSpecifier) {
              result = join(result, [
                space,
                this.generateExpression(stmt.specifiers[cursor], Precedence.Sequence, E_TTT)
              ]);
            } else {
              result.push(space + '{');
              if (stmt.specifiers.length - cursor === 1) {
                result.push(space);
                result.push(this.generateExpression(stmt.specifiers[cursor], Precedence.Sequence, E_TTT));
                result.push(space + '}' + space);
              } else {
                withIndent(function (indent) {
                  var i, iz;
                  result.push(newline);
                  for (i = cursor, iz = stmt.specifiers.length; i < iz; ++i) {
                    result.push(indent);
                    result.push(that.generateExpression(stmt.specifiers[i], Precedence.Sequence, E_TTT));
                    if (i + 1 < iz) {
                      result.push(',' + newline);
                    }
                  }
                });
                if (!endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString())) {
                  result.push(newline);
                }
                result.push(base + '}' + space);
              }
            }
          }
          result = join(result, [
            'from' + space,
            this.generateExpression(stmt.source, Precedence.Sequence, E_TTT),
            this.semicolon(flags)
          ]);
          return result;
        },
        VariableDeclarator: function (stmt, flags) {
          var itemFlags = flags & F_ALLOW_IN ? E_TTT : E_FTT;
          if (stmt.init) {
            return [
              this.generateExpression(stmt.id, Precedence.Assignment, itemFlags),
              space,
              '=',
              space,
              this.generateExpression(stmt.init, Precedence.Assignment, itemFlags)
            ];
          }
          return this.generatePattern(stmt.id, Precedence.Assignment, itemFlags);
        },
        VariableDeclaration: function (stmt, flags) {
          var result, i, iz, node, bodyFlags, that = this;
          result = [stmt.kind];
          bodyFlags = flags & F_ALLOW_IN ? S_TFFF : S_FFFF;
          function block() {
            node = stmt.declarations[0];
            if (extra.comment && node.leadingComments) {
              result.push('\n');
              result.push(addIndent(that.generateStatement(node, bodyFlags)));
            } else {
              result.push(noEmptySpace());
              result.push(that.generateStatement(node, bodyFlags));
            }
            for (i = 1, iz = stmt.declarations.length; i < iz; ++i) {
              node = stmt.declarations[i];
              if (extra.comment && node.leadingComments) {
                result.push(',' + newline);
                result.push(addIndent(that.generateStatement(node, bodyFlags)));
              } else {
                result.push(',' + space);
                result.push(that.generateStatement(node, bodyFlags));
              }
            }
          }
          if (stmt.declarations.length > 1) {
            withIndent(block);
          } else {
            block();
          }
          result.push(this.semicolon(flags));
          return result;
        },
        ThrowStatement: function (stmt, flags) {
          return [
            join('throw', this.generateExpression(stmt.argument, Precedence.Sequence, E_TTT)),
            this.semicolon(flags)
          ];
        },
        TryStatement: function (stmt, flags) {
          var result, i, iz, guardedHandlers;
          result = [
            'try',
            this.maybeBlock(stmt.block, S_TFFF)
          ];
          result = this.maybeBlockSuffix(stmt.block, result);
          if (stmt.handlers) {
            for (i = 0, iz = stmt.handlers.length; i < iz; ++i) {
              result = join(result, this.generateStatement(stmt.handlers[i], S_TFFF));
              if (stmt.finalizer || i + 1 !== iz) {
                result = this.maybeBlockSuffix(stmt.handlers[i].body, result);
              }
            }
          } else {
            guardedHandlers = stmt.guardedHandlers || [];
            for (i = 0, iz = guardedHandlers.length; i < iz; ++i) {
              result = join(result, this.generateStatement(guardedHandlers[i], S_TFFF));
              if (stmt.finalizer || i + 1 !== iz) {
                result = this.maybeBlockSuffix(guardedHandlers[i].body, result);
              }
            }
            if (stmt.handler) {
              if (isArray(stmt.handler)) {
                for (i = 0, iz = stmt.handler.length; i < iz; ++i) {
                  result = join(result, this.generateStatement(stmt.handler[i], S_TFFF));
                  if (stmt.finalizer || i + 1 !== iz) {
                    result = this.maybeBlockSuffix(stmt.handler[i].body, result);
                  }
                }
              } else {
                result = join(result, this.generateStatement(stmt.handler, S_TFFF));
                if (stmt.finalizer) {
                  result = this.maybeBlockSuffix(stmt.handler.body, result);
                }
              }
            }
          }
          if (stmt.finalizer) {
            result = join(result, [
              'finally',
              this.maybeBlock(stmt.finalizer, S_TFFF)
            ]);
          }
          return result;
        },
        SwitchStatement: function (stmt, flags) {
          var result, fragment, i, iz, bodyFlags, that = this;
          withIndent(function () {
            result = [
              'switch' + space + '(',
              that.generateExpression(stmt.discriminant, Precedence.Sequence, E_TTT),
              ')' + space + '{' + newline
            ];
          });
          if (stmt.cases) {
            bodyFlags = S_TFFF;
            for (i = 0, iz = stmt.cases.length; i < iz; ++i) {
              if (i === iz - 1) {
                bodyFlags |= F_SEMICOLON_OPT;
              }
              fragment = addIndent(this.generateStatement(stmt.cases[i], bodyFlags));
              result.push(fragment);
              if (!endsWithLineTerminator(toSourceNodeWhenNeeded(fragment).toString())) {
                result.push(newline);
              }
            }
          }
          result.push(addIndent('}'));
          return result;
        },
        SwitchCase: function (stmt, flags) {
          var result, fragment, i, iz, bodyFlags, that = this;
          withIndent(function () {
            if (stmt.test) {
              result = [
                join('case', that.generateExpression(stmt.test, Precedence.Sequence, E_TTT)),
                ':'
              ];
            } else {
              result = ['default:'];
            }
            i = 0;
            iz = stmt.consequent.length;
            if (iz && stmt.consequent[0].type === Syntax.BlockStatement) {
              fragment = that.maybeBlock(stmt.consequent[0], S_TFFF);
              result.push(fragment);
              i = 1;
            }
            if (i !== iz && !endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString())) {
              result.push(newline);
            }
            bodyFlags = S_TFFF;
            for (; i < iz; ++i) {
              if (i === iz - 1 && flags & F_SEMICOLON_OPT) {
                bodyFlags |= F_SEMICOLON_OPT;
              }
              fragment = addIndent(that.generateStatement(stmt.consequent[i], bodyFlags));
              result.push(fragment);
              if (i + 1 !== iz && !endsWithLineTerminator(toSourceNodeWhenNeeded(fragment).toString())) {
                result.push(newline);
              }
            }
          });
          return result;
        },
        IfStatement: function (stmt, flags) {
          var result, bodyFlags, semicolonOptional, that = this;
          withIndent(function () {
            result = [
              'if' + space + '(',
              that.generateExpression(stmt.test, Precedence.Sequence, E_TTT),
              ')'
            ];
          });
          semicolonOptional = flags & F_SEMICOLON_OPT;
          bodyFlags = S_TFFF;
          if (semicolonOptional) {
            bodyFlags |= F_SEMICOLON_OPT;
          }
          if (stmt.alternate) {
            result.push(this.maybeBlock(stmt.consequent, S_TFFF));
            result = this.maybeBlockSuffix(stmt.consequent, result);
            if (stmt.alternate.type === Syntax.IfStatement) {
              result = join(result, [
                'else ',
                this.generateStatement(stmt.alternate, bodyFlags)
              ]);
            } else {
              result = join(result, join('else', this.maybeBlock(stmt.alternate, bodyFlags)));
            }
          } else {
            result.push(this.maybeBlock(stmt.consequent, bodyFlags));
          }
          return result;
        },
        ForStatement: function (stmt, flags) {
          var result, that = this;
          withIndent(function () {
            result = ['for' + space + '('];
            if (stmt.init) {
              if (stmt.init.type === Syntax.VariableDeclaration) {
                result.push(that.generateStatement(stmt.init, S_FFFF));
              } else {
                result.push(that.generateExpression(stmt.init, Precedence.Sequence, E_FTT));
                result.push(';');
              }
            } else {
              result.push(';');
            }
            if (stmt.test) {
              result.push(space);
              result.push(that.generateExpression(stmt.test, Precedence.Sequence, E_TTT));
              result.push(';');
            } else {
              result.push(';');
            }
            if (stmt.update) {
              result.push(space);
              result.push(that.generateExpression(stmt.update, Precedence.Sequence, E_TTT));
              result.push(')');
            } else {
              result.push(')');
            }
          });
          result.push(this.maybeBlock(stmt.body, flags & F_SEMICOLON_OPT ? S_TFFT : S_TFFF));
          return result;
        },
        ForInStatement: function (stmt, flags) {
          return this.generateIterationForStatement('in', stmt, flags & F_SEMICOLON_OPT ? S_TFFT : S_TFFF);
        },
        ForOfStatement: function (stmt, flags) {
          return this.generateIterationForStatement('of', stmt, flags & F_SEMICOLON_OPT ? S_TFFT : S_TFFF);
        },
        LabeledStatement: function (stmt, flags) {
          return [
            stmt.label.name + ':',
            this.maybeBlock(stmt.body, flags & F_SEMICOLON_OPT ? S_TFFT : S_TFFF)
          ];
        },
        Program: function (stmt, flags) {
          var result, fragment, i, iz, bodyFlags;
          iz = stmt.body.length;
          result = [safeConcatenation && iz > 0 ? '\n' : ''];
          bodyFlags = S_TFTF;
          for (i = 0; i < iz; ++i) {
            if (!safeConcatenation && i === iz - 1) {
              bodyFlags |= F_SEMICOLON_OPT;
            }
            if (preserveBlankLines) {
              if (i === 0) {
                if (!stmt.body[0].leadingComments) {
                  generateBlankLines(stmt.range[0], stmt.body[i].range[0], result);
                }
              }
              if (i > 0) {
                if (!stmt.body[i - 1].trailingComments && !stmt.body[i].leadingComments) {
                  generateBlankLines(stmt.body[i - 1].range[1], stmt.body[i].range[0], result);
                }
              }
            }
            fragment = addIndent(this.generateStatement(stmt.body[i], bodyFlags));
            result.push(fragment);
            if (i + 1 < iz && !endsWithLineTerminator(toSourceNodeWhenNeeded(fragment).toString())) {
              if (preserveBlankLines) {
                if (!stmt.body[i + 1].leadingComments) {
                  result.push(newline);
                }
              } else {
                result.push(newline);
              }
            }
            if (preserveBlankLines) {
              if (i === iz - 1) {
                if (!stmt.body[i].trailingComments) {
                  generateBlankLines(stmt.body[i].range[1], stmt.range[1], result);
                }
              }
            }
          }
          return result;
        },
        FunctionDeclaration: function (stmt, flags) {
          return [
            generateAsyncPrefix(stmt, true),
            'function',
            generateStarSuffix(stmt) || noEmptySpace(),
            generateIdentifier(stmt.id),
            this.generateFunctionBody(stmt)
          ];
        },
        ReturnStatement: function (stmt, flags) {
          if (stmt.argument) {
            return [
              join('return', this.generateExpression(stmt.argument, Precedence.Sequence, E_TTT)),
              this.semicolon(flags)
            ];
          }
          return ['return' + this.semicolon(flags)];
        },
        WhileStatement: function (stmt, flags) {
          var result, that = this;
          withIndent(function () {
            result = [
              'while' + space + '(',
              that.generateExpression(stmt.test, Precedence.Sequence, E_TTT),
              ')'
            ];
          });
          result.push(this.maybeBlock(stmt.body, flags & F_SEMICOLON_OPT ? S_TFFT : S_TFFF));
          return result;
        },
        WithStatement: function (stmt, flags) {
          var result, that = this;
          withIndent(function () {
            result = [
              'with' + space + '(',
              that.generateExpression(stmt.object, Precedence.Sequence, E_TTT),
              ')'
            ];
          });
          result.push(this.maybeBlock(stmt.body, flags & F_SEMICOLON_OPT ? S_TFFT : S_TFFF));
          return result;
        }
      };
      merge(CodeGenerator.prototype, CodeGenerator.Statement);
      CodeGenerator.Expression = {
        SequenceExpression: function (expr, precedence, flags) {
          var result, i, iz;
          if (Precedence.Sequence < precedence) {
            flags |= F_ALLOW_IN;
          }
          result = [];
          for (i = 0, iz = expr.expressions.length; i < iz; ++i) {
            result.push(this.generateExpression(expr.expressions[i], Precedence.Assignment, flags));
            if (i + 1 < iz) {
              result.push(',' + space);
            }
          }
          return parenthesize(result, Precedence.Sequence, precedence);
        },
        AssignmentExpression: function (expr, precedence, flags) {
          return this.generateAssignment(expr.left, expr.right, expr.operator, precedence, flags);
        },
        ArrowFunctionExpression: function (expr, precedence, flags) {
          return parenthesize(this.generateFunctionBody(expr), Precedence.ArrowFunction, precedence);
        },
        ConditionalExpression: function (expr, precedence, flags) {
          if (Precedence.Conditional < precedence) {
            flags |= F_ALLOW_IN;
          }
          return parenthesize([
            this.generateExpression(expr.test, Precedence.LogicalOR, flags),
            space + '?' + space,
            this.generateExpression(expr.consequent, Precedence.Assignment, flags),
            space + ':' + space,
            this.generateExpression(expr.alternate, Precedence.Assignment, flags)
          ], Precedence.Conditional, precedence);
        },
        LogicalExpression: function (expr, precedence, flags) {
          return this.BinaryExpression(expr, precedence, flags);
        },
        BinaryExpression: function (expr, precedence, flags) {
          var result, currentPrecedence, fragment, leftSource;
          currentPrecedence = BinaryPrecedence[expr.operator];
          if (currentPrecedence < precedence) {
            flags |= F_ALLOW_IN;
          }
          fragment = this.generateExpression(expr.left, currentPrecedence, flags);
          leftSource = fragment.toString();
          if (leftSource.charCodeAt(leftSource.length - 1) === 47 && esutils.code.isIdentifierPart(expr.operator.charCodeAt(0))) {
            result = [
              fragment,
              noEmptySpace(),
              expr.operator
            ];
          } else {
            result = join(fragment, expr.operator);
          }
          fragment = this.generateExpression(expr.right, currentPrecedence + 1, flags);
          if (expr.operator === '/' && fragment.toString().charAt(0) === '/' || expr.operator.slice(-1) === '<' && fragment.toString().slice(0, 3) === '!--') {
            result.push(noEmptySpace());
            result.push(fragment);
          } else {
            result = join(result, fragment);
          }
          if (expr.operator === 'in' && !(flags & F_ALLOW_IN)) {
            return [
              '(',
              result,
              ')'
            ];
          }
          return parenthesize(result, currentPrecedence, precedence);
        },
        CallExpression: function (expr, precedence, flags) {
          var result, i, iz;
          result = [this.generateExpression(expr.callee, Precedence.Call, E_TTF)];
          result.push('(');
          for (i = 0, iz = expr['arguments'].length; i < iz; ++i) {
            result.push(this.generateExpression(expr['arguments'][i], Precedence.Assignment, E_TTT));
            if (i + 1 < iz) {
              result.push(',' + space);
            }
          }
          result.push(')');
          if (!(flags & F_ALLOW_CALL)) {
            return [
              '(',
              result,
              ')'
            ];
          }
          return parenthesize(result, Precedence.Call, precedence);
        },
        NewExpression: function (expr, precedence, flags) {
          var result, length, i, iz, itemFlags;
          length = expr['arguments'].length;
          itemFlags = flags & F_ALLOW_UNPARATH_NEW && !parentheses && length === 0 ? E_TFT : E_TFF;
          result = join('new', this.generateExpression(expr.callee, Precedence.New, itemFlags));
          if (!(flags & F_ALLOW_UNPARATH_NEW) || parentheses || length > 0) {
            result.push('(');
            for (i = 0, iz = length; i < iz; ++i) {
              result.push(this.generateExpression(expr['arguments'][i], Precedence.Assignment, E_TTT));
              if (i + 1 < iz) {
                result.push(',' + space);
              }
            }
            result.push(')');
          }
          return parenthesize(result, Precedence.New, precedence);
        },
        MemberExpression: function (expr, precedence, flags) {
          var result, fragment;
          result = [this.generateExpression(expr.object, Precedence.Call, flags & F_ALLOW_CALL ? E_TTF : E_TFF)];
          if (expr.computed) {
            result.push('[');
            result.push(this.generateExpression(expr.property, Precedence.Sequence, flags & F_ALLOW_CALL ? E_TTT : E_TFT));
            result.push(']');
          } else {
            if (expr.object.type === Syntax.Literal && typeof expr.object.value === 'number') {
              fragment = toSourceNodeWhenNeeded(result).toString();
              if (fragment.indexOf('.') < 0 && !/[eExX]/.test(fragment) && esutils.code.isDecimalDigit(fragment.charCodeAt(fragment.length - 1)) && !(fragment.length >= 2 && fragment.charCodeAt(0) === 48)) {
                result.push('.');
              }
            }
            result.push('.');
            result.push(generateIdentifier(expr.property));
          }
          return parenthesize(result, Precedence.Member, precedence);
        },
        UnaryExpression: function (expr, precedence, flags) {
          var result, fragment, rightCharCode, leftSource, leftCharCode;
          fragment = this.generateExpression(expr.argument, Precedence.Unary, E_TTT);
          if (space === '') {
            result = join(expr.operator, fragment);
          } else {
            result = [expr.operator];
            if (expr.operator.length > 2) {
              result = join(result, fragment);
            } else {
              leftSource = toSourceNodeWhenNeeded(result).toString();
              leftCharCode = leftSource.charCodeAt(leftSource.length - 1);
              rightCharCode = fragment.toString().charCodeAt(0);
              if ((leftCharCode === 43 || leftCharCode === 45) && leftCharCode === rightCharCode || esutils.code.isIdentifierPart(leftCharCode) && esutils.code.isIdentifierPart(rightCharCode)) {
                result.push(noEmptySpace());
                result.push(fragment);
              } else {
                result.push(fragment);
              }
            }
          }
          return parenthesize(result, Precedence.Unary, precedence);
        },
        YieldExpression: function (expr, precedence, flags) {
          var result;
          if (expr.delegate) {
            result = 'yield*';
          } else {
            result = 'yield';
          }
          if (expr.argument) {
            result = join(result, this.generateExpression(expr.argument, Precedence.Yield, E_TTT));
          }
          return parenthesize(result, Precedence.Yield, precedence);
        },
        AwaitExpression: function (expr, precedence, flags) {
          var result = join(expr.delegate ? 'await*' : 'await', this.generateExpression(expr.argument, Precedence.Await, E_TTT));
          return parenthesize(result, Precedence.Await, precedence);
        },
        UpdateExpression: function (expr, precedence, flags) {
          if (expr.prefix) {
            return parenthesize([
              expr.operator,
              this.generateExpression(expr.argument, Precedence.Unary, E_TTT)
            ], Precedence.Unary, precedence);
          }
          return parenthesize([
            this.generateExpression(expr.argument, Precedence.Postfix, E_TTT),
            expr.operator
          ], Precedence.Postfix, precedence);
        },
        FunctionExpression: function (expr, precedence, flags) {
          var result = [
            generateAsyncPrefix(expr, true),
            'function'
          ];
          if (expr.id) {
            result.push(generateStarSuffix(expr) || noEmptySpace());
            result.push(generateIdentifier(expr.id));
          } else {
            result.push(generateStarSuffix(expr) || space);
          }
          result.push(this.generateFunctionBody(expr));
          return result;
        },
        ExportBatchSpecifier: function (expr, precedence, flags) {
          return '*';
        },
        ArrayPattern: function (expr, precedence, flags) {
          return this.ArrayExpression(expr, precedence, flags);
        },
        ArrayExpression: function (expr, precedence, flags) {
          var result, multiline, that = this;
          if (!expr.elements.length) {
            return '[]';
          }
          multiline = expr.elements.length > 1;
          result = [
            '[',
            multiline ? newline : ''
          ];
          withIndent(function (indent) {
            var i, iz;
            for (i = 0, iz = expr.elements.length; i < iz; ++i) {
              if (!expr.elements[i]) {
                if (multiline) {
                  result.push(indent);
                }
                if (i + 1 === iz) {
                  result.push(',');
                }
              } else {
                result.push(multiline ? indent : '');
                result.push(that.generateExpression(expr.elements[i], Precedence.Assignment, E_TTT));
              }
              if (i + 1 < iz) {
                result.push(',' + (multiline ? newline : space));
              }
            }
          });
          if (multiline && !endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString())) {
            result.push(newline);
          }
          result.push(multiline ? base : '');
          result.push(']');
          return result;
        },
        ClassExpression: function (expr, precedence, flags) {
          var result, fragment;
          result = ['class'];
          if (expr.id) {
            result = join(result, this.generateExpression(expr.id, Precedence.Sequence, E_TTT));
          }
          if (expr.superClass) {
            fragment = join('extends', this.generateExpression(expr.superClass, Precedence.Assignment, E_TTT));
            result = join(result, fragment);
          }
          result.push(space);
          result.push(this.generateStatement(expr.body, S_TFFT));
          return result;
        },
        MethodDefinition: function (expr, precedence, flags) {
          var result, fragment;
          if (expr['static']) {
            result = ['static' + space];
          } else {
            result = [];
          }
          if (expr.kind === 'get' || expr.kind === 'set') {
            fragment = [
              join(expr.kind, this.generatePropertyKey(expr.key, expr.computed)),
              this.generateFunctionBody(expr.value)
            ];
          } else {
            fragment = [
              generateMethodPrefix(expr),
              this.generatePropertyKey(expr.key, expr.computed),
              this.generateFunctionBody(expr.value)
            ];
          }
          return join(result, fragment);
        },
        Property: function (expr, precedence, flags) {
          if (expr.kind === 'get' || expr.kind === 'set') {
            return [
              expr.kind,
              noEmptySpace(),
              this.generatePropertyKey(expr.key, expr.computed),
              this.generateFunctionBody(expr.value)
            ];
          }
          if (expr.shorthand) {
            return this.generatePropertyKey(expr.key, expr.computed);
          }
          if (expr.method) {
            return [
              generateMethodPrefix(expr),
              this.generatePropertyKey(expr.key, expr.computed),
              this.generateFunctionBody(expr.value)
            ];
          }
          return [
            this.generatePropertyKey(expr.key, expr.computed),
            ':' + space,
            this.generateExpression(expr.value, Precedence.Assignment, E_TTT)
          ];
        },
        ObjectExpression: function (expr, precedence, flags) {
          var multiline, result, fragment, that = this;
          if (!expr.properties.length) {
            return '{}';
          }
          multiline = expr.properties.length > 1;
          withIndent(function () {
            fragment = that.generateExpression(expr.properties[0], Precedence.Sequence, E_TTT);
          });
          if (!multiline) {
            if (!hasLineTerminator(toSourceNodeWhenNeeded(fragment).toString())) {
              return [
                '{',
                space,
                fragment,
                space,
                '}'
              ];
            }
          }
          withIndent(function (indent) {
            var i, iz;
            result = [
              '{',
              newline,
              indent,
              fragment
            ];
            if (multiline) {
              result.push(',' + newline);
              for (i = 1, iz = expr.properties.length; i < iz; ++i) {
                result.push(indent);
                result.push(that.generateExpression(expr.properties[i], Precedence.Sequence, E_TTT));
                if (i + 1 < iz) {
                  result.push(',' + newline);
                }
              }
            }
          });
          if (!endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString())) {
            result.push(newline);
          }
          result.push(base);
          result.push('}');
          return result;
        },
        ObjectPattern: function (expr, precedence, flags) {
          var result, i, iz, multiline, property, that = this;
          if (!expr.properties.length) {
            return '{}';
          }
          multiline = false;
          if (expr.properties.length === 1) {
            property = expr.properties[0];
            if (property.value.type !== Syntax.Identifier) {
              multiline = true;
            }
          } else {
            for (i = 0, iz = expr.properties.length; i < iz; ++i) {
              property = expr.properties[i];
              if (!property.shorthand) {
                multiline = true;
                break;
              }
            }
          }
          result = [
            '{',
            multiline ? newline : ''
          ];
          withIndent(function (indent) {
            var i, iz;
            for (i = 0, iz = expr.properties.length; i < iz; ++i) {
              result.push(multiline ? indent : '');
              result.push(that.generateExpression(expr.properties[i], Precedence.Sequence, E_TTT));
              if (i + 1 < iz) {
                result.push(',' + (multiline ? newline : space));
              }
            }
          });
          if (multiline && !endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString())) {
            result.push(newline);
          }
          result.push(multiline ? base : '');
          result.push('}');
          return result;
        },
        ThisExpression: function (expr, precedence, flags) {
          return 'this';
        },
        Identifier: function (expr, precedence, flags) {
          return generateIdentifier(expr);
        },
        ImportDefaultSpecifier: function (expr, precedence, flags) {
          return generateIdentifier(expr.id);
        },
        ImportNamespaceSpecifier: function (expr, precedence, flags) {
          var result = ['*'];
          if (expr.id) {
            result.push(space + 'as' + noEmptySpace() + generateIdentifier(expr.id));
          }
          return result;
        },
        ImportSpecifier: function (expr, precedence, flags) {
          return this.ExportSpecifier(expr, precedence, flags);
        },
        ExportSpecifier: function (expr, precedence, flags) {
          var result = [expr.id.name];
          if (expr.name) {
            result.push(noEmptySpace() + 'as' + noEmptySpace() + generateIdentifier(expr.name));
          }
          return result;
        },
        Literal: function (expr, precedence, flags) {
          var raw;
          if (expr.hasOwnProperty('raw') && parse && extra.raw) {
            try {
              raw = parse(expr.raw).body[0].expression;
              if (raw.type === Syntax.Literal) {
                if (raw.value === expr.value) {
                  return expr.raw;
                }
              }
            } catch (e) {
            }
          }
          if (expr.value === null) {
            return 'null';
          }
          if (typeof expr.value === 'string') {
            return escapeString(expr.value);
          }
          if (typeof expr.value === 'number') {
            return generateNumber(expr.value);
          }
          if (typeof expr.value === 'boolean') {
            return expr.value ? 'true' : 'false';
          }
          return generateRegExp(expr.value);
        },
        GeneratorExpression: function (expr, precedence, flags) {
          return this.ComprehensionExpression(expr, precedence, flags);
        },
        ComprehensionExpression: function (expr, precedence, flags) {
          var result, i, iz, fragment, that = this;
          result = expr.type === Syntax.GeneratorExpression ? ['('] : ['['];
          if (extra.moz.comprehensionExpressionStartsWithAssignment) {
            fragment = this.generateExpression(expr.body, Precedence.Assignment, E_TTT);
            result.push(fragment);
          }
          if (expr.blocks) {
            withIndent(function () {
              for (i = 0, iz = expr.blocks.length; i < iz; ++i) {
                fragment = that.generateExpression(expr.blocks[i], Precedence.Sequence, E_TTT);
                if (i > 0 || extra.moz.comprehensionExpressionStartsWithAssignment) {
                  result = join(result, fragment);
                } else {
                  result.push(fragment);
                }
              }
            });
          }
          if (expr.filter) {
            result = join(result, 'if' + space);
            fragment = this.generateExpression(expr.filter, Precedence.Sequence, E_TTT);
            result = join(result, [
              '(',
              fragment,
              ')'
            ]);
          }
          if (!extra.moz.comprehensionExpressionStartsWithAssignment) {
            fragment = this.generateExpression(expr.body, Precedence.Assignment, E_TTT);
            result = join(result, fragment);
          }
          result.push(expr.type === Syntax.GeneratorExpression ? ')' : ']');
          return result;
        },
        ComprehensionBlock: function (expr, precedence, flags) {
          var fragment;
          if (expr.left.type === Syntax.VariableDeclaration) {
            fragment = [
              expr.left.kind,
              noEmptySpace(),
              this.generateStatement(expr.left.declarations[0], S_FFFF)
            ];
          } else {
            fragment = this.generateExpression(expr.left, Precedence.Call, E_TTT);
          }
          fragment = join(fragment, expr.of ? 'of' : 'in');
          fragment = join(fragment, this.generateExpression(expr.right, Precedence.Sequence, E_TTT));
          return [
            'for' + space + '(',
            fragment,
            ')'
          ];
        },
        SpreadElement: function (expr, precedence, flags) {
          return [
            '...',
            this.generateExpression(expr.argument, Precedence.Assignment, E_TTT)
          ];
        },
        TaggedTemplateExpression: function (expr, precedence, flags) {
          var itemFlags = E_TTF;
          if (!(flags & F_ALLOW_CALL)) {
            itemFlags = E_TFF;
          }
          var result = [
            this.generateExpression(expr.tag, Precedence.Call, itemFlags),
            this.generateExpression(expr.quasi, Precedence.Primary, E_FFT)
          ];
          return parenthesize(result, Precedence.TaggedTemplate, precedence);
        },
        TemplateElement: function (expr, precedence, flags) {
          return expr.value.raw;
        },
        TemplateLiteral: function (expr, precedence, flags) {
          var result, i, iz;
          result = ['`'];
          for (i = 0, iz = expr.quasis.length; i < iz; ++i) {
            result.push(this.generateExpression(expr.quasis[i], Precedence.Primary, E_TTT));
            if (i + 1 < iz) {
              result.push('${' + space);
              result.push(this.generateExpression(expr.expressions[i], Precedence.Sequence, E_TTT));
              result.push(space + '}');
            }
          }
          result.push('`');
          return result;
        },
        ModuleSpecifier: function (expr, precedence, flags) {
          return this.Literal(expr, precedence, flags);
        }
      };
      merge(CodeGenerator.prototype, CodeGenerator.Expression);
      CodeGenerator.prototype.generateExpression = function (expr, precedence, flags) {
        var result, type;
        type = expr.type || Syntax.Property;
        if (extra.verbatim && expr.hasOwnProperty(extra.verbatim)) {
          return generateVerbatim(expr, precedence);
        }
        result = this[type](expr, precedence, flags);
        if (extra.comment) {
          result = addComments(expr, result);
        }
        return toSourceNodeWhenNeeded(result, expr);
      };
      CodeGenerator.prototype.generateStatement = function (stmt, flags) {
        var result, fragment;
        result = this[stmt.type](stmt, flags);
        if (extra.comment) {
          result = addComments(stmt, result);
        }
        fragment = toSourceNodeWhenNeeded(result).toString();
        if (stmt.type === Syntax.Program && !safeConcatenation && newline === '' && fragment.charAt(fragment.length - 1) === '\n') {
          result = sourceMap ? toSourceNodeWhenNeeded(result).replaceRight(/\s+$/, '') : fragment.replace(/\s+$/, '');
        }
        return toSourceNodeWhenNeeded(result, stmt);
      };
      function generateInternal(node) {
        var codegen;
        codegen = new CodeGenerator();
        if (isStatement(node)) {
          return codegen.generateStatement(node, S_TFFF);
        }
        if (isExpression(node)) {
          return codegen.generateExpression(node, Precedence.Sequence, E_TTT);
        }
        throw new Error('Unknown node type: ' + node.type);
      }
      function generate(node, options) {
        var defaultOptions = getDefaultOptions(), result, pair;
        if (options != null) {
          if (typeof options.indent === 'string') {
            defaultOptions.format.indent.style = options.indent;
          }
          if (typeof options.base === 'number') {
            defaultOptions.format.indent.base = options.base;
          }
          options = updateDeeply(defaultOptions, options);
          indent = options.format.indent.style;
          if (typeof options.base === 'string') {
            base = options.base;
          } else {
            base = stringRepeat(indent, options.format.indent.base);
          }
        } else {
          options = defaultOptions;
          indent = options.format.indent.style;
          base = stringRepeat(indent, options.format.indent.base);
        }
        json = options.format.json;
        renumber = options.format.renumber;
        hexadecimal = json ? false : options.format.hexadecimal;
        quotes = json ? 'double' : options.format.quotes;
        escapeless = options.format.escapeless;
        newline = options.format.newline;
        space = options.format.space;
        if (options.format.compact) {
          newline = space = indent = base = '';
        }
        parentheses = options.format.parentheses;
        semicolons = options.format.semicolons;
        safeConcatenation = options.format.safeConcatenation;
        directive = options.directive;
        parse = json ? null : options.parse;
        sourceMap = options.sourceMap;
        sourceCode = options.sourceCode;
        preserveBlankLines = options.format.preserveBlankLines && sourceCode !== null;
        extra = options;
        if (sourceMap) {
          if (!exports.browser) {
            SourceNode = require('./node_modules/quickstart/node_modules/escodegen/node_modules/source-map/lib/source-map.js').SourceNode;
          } else {
            SourceNode = global.sourceMap.SourceNode;
          }
        }
        result = generateInternal(node);
        if (!sourceMap) {
          pair = {
            code: result.toString(),
            map: null
          };
          return options.sourceMapWithCode ? pair : pair.code;
        }
        pair = result.toStringWithSourceMap({
          file: options.file,
          sourceRoot: options.sourceMapRoot
        });
        if (options.sourceContent) {
          pair.map.setSourceContent(options.sourceMap, options.sourceContent);
        }
        if (options.sourceMapWithCode) {
          return pair;
        }
        return pair.map.toString();
      }
      FORMAT_MINIFY = {
        indent: {
          style: '',
          base: 0
        },
        renumber: true,
        hexadecimal: true,
        quotes: 'auto',
        escapeless: true,
        compact: true,
        parentheses: false,
        semicolons: false
      };
      FORMAT_DEFAULTS = getDefaultOptions().format;
      exports.version = require('./node_modules/quickstart/node_modules/escodegen/package.json').version;
      exports.generate = generate;
      exports.attachComments = estraverse.attachComments;
      exports.Precedence = updateDeeply({}, Precedence);
      exports.browser = false;
      exports.FORMAT_MINIFY = FORMAT_MINIFY;
      exports.FORMAT_DEFAULTS = FORMAT_DEFAULTS;
    }());
  },
  './node_modules/quickstart/node_modules/esprima/esprima.js': function (require, module, exports, global) {
    (function (root, factory) {
      'use strict';
      if (typeof define === 'function' && define.amd) {
        define(['exports'], factory);
      } else if (typeof exports !== 'undefined') {
        factory(exports);
      } else {
        factory(root.esprima = {});
      }
    }(this, function (exports) {
      'use strict';
      var Token, TokenName, FnExprTokens, Syntax, PropertyKind, Messages, Regex, SyntaxTreeDelegate, source, strict, index, lineNumber, lineStart, length, delegate, lookahead, state, extra;
      Token = {
        BooleanLiteral: 1,
        EOF: 2,
        Identifier: 3,
        Keyword: 4,
        NullLiteral: 5,
        NumericLiteral: 6,
        Punctuator: 7,
        StringLiteral: 8,
        RegularExpression: 9
      };
      TokenName = {};
      TokenName[Token.BooleanLiteral] = 'Boolean';
      TokenName[Token.EOF] = '<end>';
      TokenName[Token.Identifier] = 'Identifier';
      TokenName[Token.Keyword] = 'Keyword';
      TokenName[Token.NullLiteral] = 'Null';
      TokenName[Token.NumericLiteral] = 'Numeric';
      TokenName[Token.Punctuator] = 'Punctuator';
      TokenName[Token.StringLiteral] = 'String';
      TokenName[Token.RegularExpression] = 'RegularExpression';
      FnExprTokens = [
        '(',
        '{',
        '[',
        'in',
        'typeof',
        'instanceof',
        'new',
        'return',
        'case',
        'delete',
        'throw',
        'void',
        '=',
        '+=',
        '-=',
        '*=',
        '/=',
        '%=',
        '<<=',
        '>>=',
        '>>>=',
        '&=',
        '|=',
        '^=',
        ',',
        '+',
        '-',
        '*',
        '/',
        '%',
        '++',
        '--',
        '<<',
        '>>',
        '>>>',
        '&',
        '|',
        '^',
        '!',
        '~',
        '&&',
        '||',
        '?',
        ':',
        '===',
        '==',
        '>=',
        '<=',
        '<',
        '>',
        '!=',
        '!=='
      ];
      Syntax = {
        AssignmentExpression: 'AssignmentExpression',
        ArrayExpression: 'ArrayExpression',
        BlockStatement: 'BlockStatement',
        BinaryExpression: 'BinaryExpression',
        BreakStatement: 'BreakStatement',
        CallExpression: 'CallExpression',
        CatchClause: 'CatchClause',
        ConditionalExpression: 'ConditionalExpression',
        ContinueStatement: 'ContinueStatement',
        DoWhileStatement: 'DoWhileStatement',
        DebuggerStatement: 'DebuggerStatement',
        EmptyStatement: 'EmptyStatement',
        ExpressionStatement: 'ExpressionStatement',
        ForStatement: 'ForStatement',
        ForInStatement: 'ForInStatement',
        FunctionDeclaration: 'FunctionDeclaration',
        FunctionExpression: 'FunctionExpression',
        Identifier: 'Identifier',
        IfStatement: 'IfStatement',
        Literal: 'Literal',
        LabeledStatement: 'LabeledStatement',
        LogicalExpression: 'LogicalExpression',
        MemberExpression: 'MemberExpression',
        NewExpression: 'NewExpression',
        ObjectExpression: 'ObjectExpression',
        Program: 'Program',
        Property: 'Property',
        ReturnStatement: 'ReturnStatement',
        SequenceExpression: 'SequenceExpression',
        SwitchStatement: 'SwitchStatement',
        SwitchCase: 'SwitchCase',
        ThisExpression: 'ThisExpression',
        ThrowStatement: 'ThrowStatement',
        TryStatement: 'TryStatement',
        UnaryExpression: 'UnaryExpression',
        UpdateExpression: 'UpdateExpression',
        VariableDeclaration: 'VariableDeclaration',
        VariableDeclarator: 'VariableDeclarator',
        WhileStatement: 'WhileStatement',
        WithStatement: 'WithStatement'
      };
      PropertyKind = {
        Data: 1,
        Get: 2,
        Set: 4
      };
      Messages = {
        UnexpectedToken: 'Unexpected token %0',
        UnexpectedNumber: 'Unexpected number',
        UnexpectedString: 'Unexpected string',
        UnexpectedIdentifier: 'Unexpected identifier',
        UnexpectedReserved: 'Unexpected reserved word',
        UnexpectedEOS: 'Unexpected end of input',
        NewlineAfterThrow: 'Illegal newline after throw',
        InvalidRegExp: 'Invalid regular expression',
        UnterminatedRegExp: 'Invalid regular expression: missing /',
        InvalidLHSInAssignment: 'Invalid left-hand side in assignment',
        InvalidLHSInForIn: 'Invalid left-hand side in for-in',
        MultipleDefaultsInSwitch: 'More than one default clause in switch statement',
        NoCatchOrFinally: 'Missing catch or finally after try',
        UnknownLabel: 'Undefined label \'%0\'',
        Redeclaration: '%0 \'%1\' has already been declared',
        IllegalContinue: 'Illegal continue statement',
        IllegalBreak: 'Illegal break statement',
        IllegalReturn: 'Illegal return statement',
        StrictModeWith: 'Strict mode code may not include a with statement',
        StrictCatchVariable: 'Catch variable may not be eval or arguments in strict mode',
        StrictVarName: 'Variable name may not be eval or arguments in strict mode',
        StrictParamName: 'Parameter name eval or arguments is not allowed in strict mode',
        StrictParamDupe: 'Strict mode function may not have duplicate parameter names',
        StrictFunctionName: 'Function name may not be eval or arguments in strict mode',
        StrictOctalLiteral: 'Octal literals are not allowed in strict mode.',
        StrictDelete: 'Delete of an unqualified identifier in strict mode.',
        StrictDuplicateProperty: 'Duplicate data property in object literal not allowed in strict mode',
        AccessorDataProperty: 'Object literal may not have data and accessor property with the same name',
        AccessorGetSet: 'Object literal may not have multiple get/set accessors with the same name',
        StrictLHSAssignment: 'Assignment to eval or arguments is not allowed in strict mode',
        StrictLHSPostfix: 'Postfix increment/decrement may not have eval or arguments operand in strict mode',
        StrictLHSPrefix: 'Prefix increment/decrement may not have eval or arguments operand in strict mode',
        StrictReservedWord: 'Use of future reserved word in strict mode'
      };
      Regex = {
        NonAsciiIdentifierStart: new RegExp('[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F0\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA697\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]'),
        NonAsciiIdentifierPart: new RegExp('[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0\u08A2-\u08AC\u08E4-\u08FE\u0900-\u0963\u0966-\u096F\u0971-\u0977\u0979-\u097F\u0981-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C01-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58\u0C59\u0C60-\u0C63\u0C66-\u0C6F\u0C82\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D02\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D57\u0D60-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F0\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191C\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19D9\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1CD0-\u1CD2\u1CD4-\u1CF6\u1D00-\u1DE6\u1DFC-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u2E2F\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099\u309A\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA697\uA69F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA827\uA840-\uA873\uA880-\uA8C4\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A\uAA7B\uAA80-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE26\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]')
      };
      function assert(condition, message) {
        if (!condition) {
          throw new Error('ASSERT: ' + message);
        }
      }
      function isDecimalDigit(ch) {
        return ch >= 48 && ch <= 57;
      }
      function isHexDigit(ch) {
        return '0123456789abcdefABCDEF'.indexOf(ch) >= 0;
      }
      function isOctalDigit(ch) {
        return '01234567'.indexOf(ch) >= 0;
      }
      function isWhiteSpace(ch) {
        return ch === 32 || ch === 9 || ch === 11 || ch === 12 || ch === 160 || ch >= 5760 && [
          5760,
          6158,
          8192,
          8193,
          8194,
          8195,
          8196,
          8197,
          8198,
          8199,
          8200,
          8201,
          8202,
          8239,
          8287,
          12288,
          65279
        ].indexOf(ch) >= 0;
      }
      function isLineTerminator(ch) {
        return ch === 10 || ch === 13 || ch === 8232 || ch === 8233;
      }
      function isIdentifierStart(ch) {
        return ch === 36 || ch === 95 || ch >= 65 && ch <= 90 || ch >= 97 && ch <= 122 || ch === 92 || ch >= 128 && Regex.NonAsciiIdentifierStart.test(String.fromCharCode(ch));
      }
      function isIdentifierPart(ch) {
        return ch === 36 || ch === 95 || ch >= 65 && ch <= 90 || ch >= 97 && ch <= 122 || ch >= 48 && ch <= 57 || ch === 92 || ch >= 128 && Regex.NonAsciiIdentifierPart.test(String.fromCharCode(ch));
      }
      function isFutureReservedWord(id) {
        switch (id) {
        case 'class':
        case 'enum':
        case 'export':
        case 'extends':
        case 'import':
        case 'super':
          return true;
        default:
          return false;
        }
      }
      function isStrictModeReservedWord(id) {
        switch (id) {
        case 'implements':
        case 'interface':
        case 'package':
        case 'private':
        case 'protected':
        case 'public':
        case 'static':
        case 'yield':
        case 'let':
          return true;
        default:
          return false;
        }
      }
      function isRestrictedWord(id) {
        return id === 'eval' || id === 'arguments';
      }
      function isKeyword(id) {
        if (strict && isStrictModeReservedWord(id)) {
          return true;
        }
        switch (id.length) {
        case 2:
          return id === 'if' || id === 'in' || id === 'do';
        case 3:
          return id === 'var' || id === 'for' || id === 'new' || id === 'try' || id === 'let';
        case 4:
          return id === 'this' || id === 'else' || id === 'case' || id === 'void' || id === 'with' || id === 'enum';
        case 5:
          return id === 'while' || id === 'break' || id === 'catch' || id === 'throw' || id === 'const' || id === 'yield' || id === 'class' || id === 'super';
        case 6:
          return id === 'return' || id === 'typeof' || id === 'delete' || id === 'switch' || id === 'export' || id === 'import';
        case 7:
          return id === 'default' || id === 'finally' || id === 'extends';
        case 8:
          return id === 'function' || id === 'continue' || id === 'debugger';
        case 10:
          return id === 'instanceof';
        default:
          return false;
        }
      }
      function addComment(type, value, start, end, loc) {
        var comment, attacher;
        assert(typeof start === 'number', 'Comment must have valid position');
        if (state.lastCommentStart >= start) {
          return;
        }
        state.lastCommentStart = start;
        comment = {
          type: type,
          value: value
        };
        if (extra.range) {
          comment.range = [
            start,
            end
          ];
        }
        if (extra.loc) {
          comment.loc = loc;
        }
        extra.comments.push(comment);
        if (extra.attachComment) {
          extra.leadingComments.push(comment);
          extra.trailingComments.push(comment);
        }
      }
      function skipSingleLineComment(offset) {
        var start, loc, ch, comment;
        start = index - offset;
        loc = {
          start: {
            line: lineNumber,
            column: index - lineStart - offset
          }
        };
        while (index < length) {
          ch = source.charCodeAt(index);
          ++index;
          if (isLineTerminator(ch)) {
            if (extra.comments) {
              comment = source.slice(start + offset, index - 1);
              loc.end = {
                line: lineNumber,
                column: index - lineStart - 1
              };
              addComment('Line', comment, start, index - 1, loc);
            }
            if (ch === 13 && source.charCodeAt(index) === 10) {
              ++index;
            }
            ++lineNumber;
            lineStart = index;
            return;
          }
        }
        if (extra.comments) {
          comment = source.slice(start + offset, index);
          loc.end = {
            line: lineNumber,
            column: index - lineStart
          };
          addComment('Line', comment, start, index, loc);
        }
      }
      function skipMultiLineComment() {
        var start, loc, ch, comment;
        if (extra.comments) {
          start = index - 2;
          loc = {
            start: {
              line: lineNumber,
              column: index - lineStart - 2
            }
          };
        }
        while (index < length) {
          ch = source.charCodeAt(index);
          if (isLineTerminator(ch)) {
            if (ch === 13 && source.charCodeAt(index + 1) === 10) {
              ++index;
            }
            ++lineNumber;
            ++index;
            lineStart = index;
            if (index >= length) {
              throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
            }
          } else if (ch === 42) {
            if (source.charCodeAt(index + 1) === 47) {
              ++index;
              ++index;
              if (extra.comments) {
                comment = source.slice(start + 2, index - 2);
                loc.end = {
                  line: lineNumber,
                  column: index - lineStart
                };
                addComment('Block', comment, start, index, loc);
              }
              return;
            }
            ++index;
          } else {
            ++index;
          }
        }
        throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
      }
      function skipComment() {
        var ch, start;
        start = index === 0;
        while (index < length) {
          ch = source.charCodeAt(index);
          if (isWhiteSpace(ch)) {
            ++index;
          } else if (isLineTerminator(ch)) {
            ++index;
            if (ch === 13 && source.charCodeAt(index) === 10) {
              ++index;
            }
            ++lineNumber;
            lineStart = index;
            start = true;
          } else if (ch === 47) {
            ch = source.charCodeAt(index + 1);
            if (ch === 47) {
              ++index;
              ++index;
              skipSingleLineComment(2);
              start = true;
            } else if (ch === 42) {
              ++index;
              ++index;
              skipMultiLineComment();
            } else {
              break;
            }
          } else if (start && ch === 45) {
            if (source.charCodeAt(index + 1) === 45 && source.charCodeAt(index + 2) === 62) {
              index += 3;
              skipSingleLineComment(3);
            } else {
              break;
            }
          } else if (ch === 60) {
            if (source.slice(index + 1, index + 4) === '!--') {
              ++index;
              ++index;
              ++index;
              ++index;
              skipSingleLineComment(4);
            } else {
              break;
            }
          } else {
            break;
          }
        }
      }
      function scanHexEscape(prefix) {
        var i, len, ch, code = 0;
        len = prefix === 'u' ? 4 : 2;
        for (i = 0; i < len; ++i) {
          if (index < length && isHexDigit(source[index])) {
            ch = source[index++];
            code = code * 16 + '0123456789abcdef'.indexOf(ch.toLowerCase());
          } else {
            return '';
          }
        }
        return String.fromCharCode(code);
      }
      function getEscapedIdentifier() {
        var ch, id;
        ch = source.charCodeAt(index++);
        id = String.fromCharCode(ch);
        if (ch === 92) {
          if (source.charCodeAt(index) !== 117) {
            throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
          }
          ++index;
          ch = scanHexEscape('u');
          if (!ch || ch === '\\' || !isIdentifierStart(ch.charCodeAt(0))) {
            throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
          }
          id = ch;
        }
        while (index < length) {
          ch = source.charCodeAt(index);
          if (!isIdentifierPart(ch)) {
            break;
          }
          ++index;
          id += String.fromCharCode(ch);
          if (ch === 92) {
            id = id.substr(0, id.length - 1);
            if (source.charCodeAt(index) !== 117) {
              throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
            }
            ++index;
            ch = scanHexEscape('u');
            if (!ch || ch === '\\' || !isIdentifierPart(ch.charCodeAt(0))) {
              throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
            }
            id += ch;
          }
        }
        return id;
      }
      function getIdentifier() {
        var start, ch;
        start = index++;
        while (index < length) {
          ch = source.charCodeAt(index);
          if (ch === 92) {
            index = start;
            return getEscapedIdentifier();
          }
          if (isIdentifierPart(ch)) {
            ++index;
          } else {
            break;
          }
        }
        return source.slice(start, index);
      }
      function scanIdentifier() {
        var start, id, type;
        start = index;
        id = source.charCodeAt(index) === 92 ? getEscapedIdentifier() : getIdentifier();
        if (id.length === 1) {
          type = Token.Identifier;
        } else if (isKeyword(id)) {
          type = Token.Keyword;
        } else if (id === 'null') {
          type = Token.NullLiteral;
        } else if (id === 'true' || id === 'false') {
          type = Token.BooleanLiteral;
        } else {
          type = Token.Identifier;
        }
        return {
          type: type,
          value: id,
          lineNumber: lineNumber,
          lineStart: lineStart,
          start: start,
          end: index
        };
      }
      function scanPunctuator() {
        var start = index, code = source.charCodeAt(index), code2, ch1 = source[index], ch2, ch3, ch4;
        switch (code) {
        case 46:
        case 40:
        case 41:
        case 59:
        case 44:
        case 123:
        case 125:
        case 91:
        case 93:
        case 58:
        case 63:
        case 126:
          ++index;
          if (extra.tokenize) {
            if (code === 40) {
              extra.openParenToken = extra.tokens.length;
            } else if (code === 123) {
              extra.openCurlyToken = extra.tokens.length;
            }
          }
          return {
            type: Token.Punctuator,
            value: String.fromCharCode(code),
            lineNumber: lineNumber,
            lineStart: lineStart,
            start: start,
            end: index
          };
        default:
          code2 = source.charCodeAt(index + 1);
          if (code2 === 61) {
            switch (code) {
            case 43:
            case 45:
            case 47:
            case 60:
            case 62:
            case 94:
            case 124:
            case 37:
            case 38:
            case 42:
              index += 2;
              return {
                type: Token.Punctuator,
                value: String.fromCharCode(code) + String.fromCharCode(code2),
                lineNumber: lineNumber,
                lineStart: lineStart,
                start: start,
                end: index
              };
            case 33:
            case 61:
              index += 2;
              if (source.charCodeAt(index) === 61) {
                ++index;
              }
              return {
                type: Token.Punctuator,
                value: source.slice(start, index),
                lineNumber: lineNumber,
                lineStart: lineStart,
                start: start,
                end: index
              };
            }
          }
        }
        ch4 = source.substr(index, 4);
        if (ch4 === '>>>=') {
          index += 4;
          return {
            type: Token.Punctuator,
            value: ch4,
            lineNumber: lineNumber,
            lineStart: lineStart,
            start: start,
            end: index
          };
        }
        ch3 = ch4.substr(0, 3);
        if (ch3 === '>>>' || ch3 === '<<=' || ch3 === '>>=') {
          index += 3;
          return {
            type: Token.Punctuator,
            value: ch3,
            lineNumber: lineNumber,
            lineStart: lineStart,
            start: start,
            end: index
          };
        }
        ch2 = ch3.substr(0, 2);
        if (ch1 === ch2[1] && '+-<>&|'.indexOf(ch1) >= 0 || ch2 === '=>') {
          index += 2;
          return {
            type: Token.Punctuator,
            value: ch2,
            lineNumber: lineNumber,
            lineStart: lineStart,
            start: start,
            end: index
          };
        }
        if ('<>=!+-*%&|^/'.indexOf(ch1) >= 0) {
          ++index;
          return {
            type: Token.Punctuator,
            value: ch1,
            lineNumber: lineNumber,
            lineStart: lineStart,
            start: start,
            end: index
          };
        }
        throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
      }
      function scanHexLiteral(start) {
        var number = '';
        while (index < length) {
          if (!isHexDigit(source[index])) {
            break;
          }
          number += source[index++];
        }
        if (number.length === 0) {
          throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
        }
        if (isIdentifierStart(source.charCodeAt(index))) {
          throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
        }
        return {
          type: Token.NumericLiteral,
          value: parseInt('0x' + number, 16),
          lineNumber: lineNumber,
          lineStart: lineStart,
          start: start,
          end: index
        };
      }
      function scanOctalLiteral(start) {
        var number = '0' + source[index++];
        while (index < length) {
          if (!isOctalDigit(source[index])) {
            break;
          }
          number += source[index++];
        }
        if (isIdentifierStart(source.charCodeAt(index)) || isDecimalDigit(source.charCodeAt(index))) {
          throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
        }
        return {
          type: Token.NumericLiteral,
          value: parseInt(number, 8),
          octal: true,
          lineNumber: lineNumber,
          lineStart: lineStart,
          start: start,
          end: index
        };
      }
      function isImplicitOctalLiteral() {
        var i, ch;
        for (i = index + 1; i < length; ++i) {
          ch = source[i];
          if (ch === '8' || ch === '9') {
            return false;
          }
          if (!isOctalDigit(ch)) {
            return true;
          }
        }
        return true;
      }
      function scanNumericLiteral() {
        var number, start, ch;
        ch = source[index];
        assert(isDecimalDigit(ch.charCodeAt(0)) || ch === '.', 'Numeric literal must start with a decimal digit or a decimal point');
        start = index;
        number = '';
        if (ch !== '.') {
          number = source[index++];
          ch = source[index];
          if (number === '0') {
            if (ch === 'x' || ch === 'X') {
              ++index;
              return scanHexLiteral(start);
            }
            if (isOctalDigit(ch)) {
              if (isImplicitOctalLiteral()) {
                return scanOctalLiteral(start);
              }
            }
          }
          while (isDecimalDigit(source.charCodeAt(index))) {
            number += source[index++];
          }
          ch = source[index];
        }
        if (ch === '.') {
          number += source[index++];
          while (isDecimalDigit(source.charCodeAt(index))) {
            number += source[index++];
          }
          ch = source[index];
        }
        if (ch === 'e' || ch === 'E') {
          number += source[index++];
          ch = source[index];
          if (ch === '+' || ch === '-') {
            number += source[index++];
          }
          if (isDecimalDigit(source.charCodeAt(index))) {
            while (isDecimalDigit(source.charCodeAt(index))) {
              number += source[index++];
            }
          } else {
            throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
          }
        }
        if (isIdentifierStart(source.charCodeAt(index))) {
          throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
        }
        return {
          type: Token.NumericLiteral,
          value: parseFloat(number),
          lineNumber: lineNumber,
          lineStart: lineStart,
          start: start,
          end: index
        };
      }
      function scanStringLiteral() {
        var str = '', quote, start, ch, code, unescaped, restore, octal = false, startLineNumber, startLineStart;
        startLineNumber = lineNumber;
        startLineStart = lineStart;
        quote = source[index];
        assert(quote === '\'' || quote === '"', 'String literal must starts with a quote');
        start = index;
        ++index;
        while (index < length) {
          ch = source[index++];
          if (ch === quote) {
            quote = '';
            break;
          } else if (ch === '\\') {
            ch = source[index++];
            if (!ch || !isLineTerminator(ch.charCodeAt(0))) {
              switch (ch) {
              case 'u':
              case 'x':
                restore = index;
                unescaped = scanHexEscape(ch);
                if (unescaped) {
                  str += unescaped;
                } else {
                  index = restore;
                  str += ch;
                }
                break;
              case 'n':
                str += '\n';
                break;
              case 'r':
                str += '\r';
                break;
              case 't':
                str += '\t';
                break;
              case 'b':
                str += '\b';
                break;
              case 'f':
                str += '\f';
                break;
              case 'v':
                str += '\x0B';
                break;
              default:
                if (isOctalDigit(ch)) {
                  code = '01234567'.indexOf(ch);
                  if (code !== 0) {
                    octal = true;
                  }
                  if (index < length && isOctalDigit(source[index])) {
                    octal = true;
                    code = code * 8 + '01234567'.indexOf(source[index++]);
                    if ('0123'.indexOf(ch) >= 0 && index < length && isOctalDigit(source[index])) {
                      code = code * 8 + '01234567'.indexOf(source[index++]);
                    }
                  }
                  str += String.fromCharCode(code);
                } else {
                  str += ch;
                }
                break;
              }
            } else {
              ++lineNumber;
              if (ch === '\r' && source[index] === '\n') {
                ++index;
              }
              lineStart = index;
            }
          } else if (isLineTerminator(ch.charCodeAt(0))) {
            break;
          } else {
            str += ch;
          }
        }
        if (quote !== '') {
          throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
        }
        return {
          type: Token.StringLiteral,
          value: str,
          octal: octal,
          startLineNumber: startLineNumber,
          startLineStart: startLineStart,
          lineNumber: lineNumber,
          lineStart: lineStart,
          start: start,
          end: index
        };
      }
      function testRegExp(pattern, flags) {
        var value;
        try {
          value = new RegExp(pattern, flags);
        } catch (e) {
          throwError({}, Messages.InvalidRegExp);
        }
        return value;
      }
      function scanRegExpBody() {
        var ch, str, classMarker, terminated, body;
        ch = source[index];
        assert(ch === '/', 'Regular expression literal must start with a slash');
        str = source[index++];
        classMarker = false;
        terminated = false;
        while (index < length) {
          ch = source[index++];
          str += ch;
          if (ch === '\\') {
            ch = source[index++];
            if (isLineTerminator(ch.charCodeAt(0))) {
              throwError({}, Messages.UnterminatedRegExp);
            }
            str += ch;
          } else if (isLineTerminator(ch.charCodeAt(0))) {
            throwError({}, Messages.UnterminatedRegExp);
          } else if (classMarker) {
            if (ch === ']') {
              classMarker = false;
            }
          } else {
            if (ch === '/') {
              terminated = true;
              break;
            } else if (ch === '[') {
              classMarker = true;
            }
          }
        }
        if (!terminated) {
          throwError({}, Messages.UnterminatedRegExp);
        }
        body = str.substr(1, str.length - 2);
        return {
          value: body,
          literal: str
        };
      }
      function scanRegExpFlags() {
        var ch, str, flags, restore;
        str = '';
        flags = '';
        while (index < length) {
          ch = source[index];
          if (!isIdentifierPart(ch.charCodeAt(0))) {
            break;
          }
          ++index;
          if (ch === '\\' && index < length) {
            ch = source[index];
            if (ch === 'u') {
              ++index;
              restore = index;
              ch = scanHexEscape('u');
              if (ch) {
                flags += ch;
                for (str += '\\u'; restore < index; ++restore) {
                  str += source[restore];
                }
              } else {
                index = restore;
                flags += 'u';
                str += '\\u';
              }
              throwErrorTolerant({}, Messages.UnexpectedToken, 'ILLEGAL');
            } else {
              str += '\\';
              throwErrorTolerant({}, Messages.UnexpectedToken, 'ILLEGAL');
            }
          } else {
            flags += ch;
            str += ch;
          }
        }
        return {
          value: flags,
          literal: str
        };
      }
      function scanRegExp() {
        var start, body, flags, pattern, value;
        lookahead = null;
        skipComment();
        start = index;
        body = scanRegExpBody();
        flags = scanRegExpFlags();
        value = testRegExp(body.value, flags.value);
        if (extra.tokenize) {
          return {
            type: Token.RegularExpression,
            value: value,
            lineNumber: lineNumber,
            lineStart: lineStart,
            start: start,
            end: index
          };
        }
        return {
          literal: body.literal + flags.literal,
          value: value,
          start: start,
          end: index
        };
      }
      function collectRegex() {
        var pos, loc, regex, token;
        skipComment();
        pos = index;
        loc = {
          start: {
            line: lineNumber,
            column: index - lineStart
          }
        };
        regex = scanRegExp();
        loc.end = {
          line: lineNumber,
          column: index - lineStart
        };
        if (!extra.tokenize) {
          if (extra.tokens.length > 0) {
            token = extra.tokens[extra.tokens.length - 1];
            if (token.range[0] === pos && token.type === 'Punctuator') {
              if (token.value === '/' || token.value === '/=') {
                extra.tokens.pop();
              }
            }
          }
          extra.tokens.push({
            type: 'RegularExpression',
            value: regex.literal,
            range: [
              pos,
              index
            ],
            loc: loc
          });
        }
        return regex;
      }
      function isIdentifierName(token) {
        return token.type === Token.Identifier || token.type === Token.Keyword || token.type === Token.BooleanLiteral || token.type === Token.NullLiteral;
      }
      function advanceSlash() {
        var prevToken, checkToken;
        prevToken = extra.tokens[extra.tokens.length - 1];
        if (!prevToken) {
          return collectRegex();
        }
        if (prevToken.type === 'Punctuator') {
          if (prevToken.value === ']') {
            return scanPunctuator();
          }
          if (prevToken.value === ')') {
            checkToken = extra.tokens[extra.openParenToken - 1];
            if (checkToken && checkToken.type === 'Keyword' && (checkToken.value === 'if' || checkToken.value === 'while' || checkToken.value === 'for' || checkToken.value === 'with')) {
              return collectRegex();
            }
            return scanPunctuator();
          }
          if (prevToken.value === '}') {
            if (extra.tokens[extra.openCurlyToken - 3] && extra.tokens[extra.openCurlyToken - 3].type === 'Keyword') {
              checkToken = extra.tokens[extra.openCurlyToken - 4];
              if (!checkToken) {
                return scanPunctuator();
              }
            } else if (extra.tokens[extra.openCurlyToken - 4] && extra.tokens[extra.openCurlyToken - 4].type === 'Keyword') {
              checkToken = extra.tokens[extra.openCurlyToken - 5];
              if (!checkToken) {
                return collectRegex();
              }
            } else {
              return scanPunctuator();
            }
            if (FnExprTokens.indexOf(checkToken.value) >= 0) {
              return scanPunctuator();
            }
            return collectRegex();
          }
          return collectRegex();
        }
        if (prevToken.type === 'Keyword' && prevToken.value !== 'this') {
          return collectRegex();
        }
        return scanPunctuator();
      }
      function advance() {
        var ch;
        skipComment();
        if (index >= length) {
          return {
            type: Token.EOF,
            lineNumber: lineNumber,
            lineStart: lineStart,
            start: index,
            end: index
          };
        }
        ch = source.charCodeAt(index);
        if (isIdentifierStart(ch)) {
          return scanIdentifier();
        }
        if (ch === 40 || ch === 41 || ch === 59) {
          return scanPunctuator();
        }
        if (ch === 39 || ch === 34) {
          return scanStringLiteral();
        }
        if (ch === 46) {
          if (isDecimalDigit(source.charCodeAt(index + 1))) {
            return scanNumericLiteral();
          }
          return scanPunctuator();
        }
        if (isDecimalDigit(ch)) {
          return scanNumericLiteral();
        }
        if (extra.tokenize && ch === 47) {
          return advanceSlash();
        }
        return scanPunctuator();
      }
      function collectToken() {
        var loc, token, range, value;
        skipComment();
        loc = {
          start: {
            line: lineNumber,
            column: index - lineStart
          }
        };
        token = advance();
        loc.end = {
          line: lineNumber,
          column: index - lineStart
        };
        if (token.type !== Token.EOF) {
          value = source.slice(token.start, token.end);
          extra.tokens.push({
            type: TokenName[token.type],
            value: value,
            range: [
              token.start,
              token.end
            ],
            loc: loc
          });
        }
        return token;
      }
      function lex() {
        var token;
        token = lookahead;
        index = token.end;
        lineNumber = token.lineNumber;
        lineStart = token.lineStart;
        lookahead = typeof extra.tokens !== 'undefined' ? collectToken() : advance();
        index = token.end;
        lineNumber = token.lineNumber;
        lineStart = token.lineStart;
        return token;
      }
      function peek() {
        var pos, line, start;
        pos = index;
        line = lineNumber;
        start = lineStart;
        lookahead = typeof extra.tokens !== 'undefined' ? collectToken() : advance();
        index = pos;
        lineNumber = line;
        lineStart = start;
      }
      function Position(line, column) {
        this.line = line;
        this.column = column;
      }
      function SourceLocation(startLine, startColumn, line, column) {
        this.start = new Position(startLine, startColumn);
        this.end = new Position(line, column);
      }
      SyntaxTreeDelegate = {
        name: 'SyntaxTree',
        processComment: function (node) {
          var lastChild, trailingComments;
          if (node.type === Syntax.Program) {
            if (node.body.length > 0) {
              return;
            }
          }
          if (extra.trailingComments.length > 0) {
            if (extra.trailingComments[0].range[0] >= node.range[1]) {
              trailingComments = extra.trailingComments;
              extra.trailingComments = [];
            } else {
              extra.trailingComments.length = 0;
            }
          } else {
            if (extra.bottomRightStack.length > 0 && extra.bottomRightStack[extra.bottomRightStack.length - 1].trailingComments && extra.bottomRightStack[extra.bottomRightStack.length - 1].trailingComments[0].range[0] >= node.range[1]) {
              trailingComments = extra.bottomRightStack[extra.bottomRightStack.length - 1].trailingComments;
              delete extra.bottomRightStack[extra.bottomRightStack.length - 1].trailingComments;
            }
          }
          while (extra.bottomRightStack.length > 0 && extra.bottomRightStack[extra.bottomRightStack.length - 1].range[0] >= node.range[0]) {
            lastChild = extra.bottomRightStack.pop();
          }
          if (lastChild) {
            if (lastChild.leadingComments && lastChild.leadingComments[lastChild.leadingComments.length - 1].range[1] <= node.range[0]) {
              node.leadingComments = lastChild.leadingComments;
              delete lastChild.leadingComments;
            }
          } else if (extra.leadingComments.length > 0 && extra.leadingComments[extra.leadingComments.length - 1].range[1] <= node.range[0]) {
            node.leadingComments = extra.leadingComments;
            extra.leadingComments = [];
          }
          if (trailingComments) {
            node.trailingComments = trailingComments;
          }
          extra.bottomRightStack.push(node);
        },
        markEnd: function (node, startToken) {
          if (extra.range) {
            node.range = [
              startToken.start,
              index
            ];
          }
          if (extra.loc) {
            node.loc = new SourceLocation(startToken.startLineNumber === undefined ? startToken.lineNumber : startToken.startLineNumber, startToken.start - (startToken.startLineStart === undefined ? startToken.lineStart : startToken.startLineStart), lineNumber, index - lineStart);
            this.postProcess(node);
          }
          if (extra.attachComment) {
            this.processComment(node);
          }
          return node;
        },
        postProcess: function (node) {
          if (extra.source) {
            node.loc.source = extra.source;
          }
          return node;
        },
        createArrayExpression: function (elements) {
          return {
            type: Syntax.ArrayExpression,
            elements: elements
          };
        },
        createAssignmentExpression: function (operator, left, right) {
          return {
            type: Syntax.AssignmentExpression,
            operator: operator,
            left: left,
            right: right
          };
        },
        createBinaryExpression: function (operator, left, right) {
          var type = operator === '||' || operator === '&&' ? Syntax.LogicalExpression : Syntax.BinaryExpression;
          return {
            type: type,
            operator: operator,
            left: left,
            right: right
          };
        },
        createBlockStatement: function (body) {
          return {
            type: Syntax.BlockStatement,
            body: body
          };
        },
        createBreakStatement: function (label) {
          return {
            type: Syntax.BreakStatement,
            label: label
          };
        },
        createCallExpression: function (callee, args) {
          return {
            type: Syntax.CallExpression,
            callee: callee,
            'arguments': args
          };
        },
        createCatchClause: function (param, body) {
          return {
            type: Syntax.CatchClause,
            param: param,
            body: body
          };
        },
        createConditionalExpression: function (test, consequent, alternate) {
          return {
            type: Syntax.ConditionalExpression,
            test: test,
            consequent: consequent,
            alternate: alternate
          };
        },
        createContinueStatement: function (label) {
          return {
            type: Syntax.ContinueStatement,
            label: label
          };
        },
        createDebuggerStatement: function () {
          return { type: Syntax.DebuggerStatement };
        },
        createDoWhileStatement: function (body, test) {
          return {
            type: Syntax.DoWhileStatement,
            body: body,
            test: test
          };
        },
        createEmptyStatement: function () {
          return { type: Syntax.EmptyStatement };
        },
        createExpressionStatement: function (expression) {
          return {
            type: Syntax.ExpressionStatement,
            expression: expression
          };
        },
        createForStatement: function (init, test, update, body) {
          return {
            type: Syntax.ForStatement,
            init: init,
            test: test,
            update: update,
            body: body
          };
        },
        createForInStatement: function (left, right, body) {
          return {
            type: Syntax.ForInStatement,
            left: left,
            right: right,
            body: body,
            each: false
          };
        },
        createFunctionDeclaration: function (id, params, defaults, body) {
          return {
            type: Syntax.FunctionDeclaration,
            id: id,
            params: params,
            defaults: defaults,
            body: body,
            rest: null,
            generator: false,
            expression: false
          };
        },
        createFunctionExpression: function (id, params, defaults, body) {
          return {
            type: Syntax.FunctionExpression,
            id: id,
            params: params,
            defaults: defaults,
            body: body,
            rest: null,
            generator: false,
            expression: false
          };
        },
        createIdentifier: function (name) {
          return {
            type: Syntax.Identifier,
            name: name
          };
        },
        createIfStatement: function (test, consequent, alternate) {
          return {
            type: Syntax.IfStatement,
            test: test,
            consequent: consequent,
            alternate: alternate
          };
        },
        createLabeledStatement: function (label, body) {
          return {
            type: Syntax.LabeledStatement,
            label: label,
            body: body
          };
        },
        createLiteral: function (token) {
          return {
            type: Syntax.Literal,
            value: token.value,
            raw: source.slice(token.start, token.end)
          };
        },
        createMemberExpression: function (accessor, object, property) {
          return {
            type: Syntax.MemberExpression,
            computed: accessor === '[',
            object: object,
            property: property
          };
        },
        createNewExpression: function (callee, args) {
          return {
            type: Syntax.NewExpression,
            callee: callee,
            'arguments': args
          };
        },
        createObjectExpression: function (properties) {
          return {
            type: Syntax.ObjectExpression,
            properties: properties
          };
        },
        createPostfixExpression: function (operator, argument) {
          return {
            type: Syntax.UpdateExpression,
            operator: operator,
            argument: argument,
            prefix: false
          };
        },
        createProgram: function (body) {
          return {
            type: Syntax.Program,
            body: body
          };
        },
        createProperty: function (kind, key, value) {
          return {
            type: Syntax.Property,
            key: key,
            value: value,
            kind: kind
          };
        },
        createReturnStatement: function (argument) {
          return {
            type: Syntax.ReturnStatement,
            argument: argument
          };
        },
        createSequenceExpression: function (expressions) {
          return {
            type: Syntax.SequenceExpression,
            expressions: expressions
          };
        },
        createSwitchCase: function (test, consequent) {
          return {
            type: Syntax.SwitchCase,
            test: test,
            consequent: consequent
          };
        },
        createSwitchStatement: function (discriminant, cases) {
          return {
            type: Syntax.SwitchStatement,
            discriminant: discriminant,
            cases: cases
          };
        },
        createThisExpression: function () {
          return { type: Syntax.ThisExpression };
        },
        createThrowStatement: function (argument) {
          return {
            type: Syntax.ThrowStatement,
            argument: argument
          };
        },
        createTryStatement: function (block, guardedHandlers, handlers, finalizer) {
          return {
            type: Syntax.TryStatement,
            block: block,
            guardedHandlers: guardedHandlers,
            handlers: handlers,
            finalizer: finalizer
          };
        },
        createUnaryExpression: function (operator, argument) {
          if (operator === '++' || operator === '--') {
            return {
              type: Syntax.UpdateExpression,
              operator: operator,
              argument: argument,
              prefix: true
            };
          }
          return {
            type: Syntax.UnaryExpression,
            operator: operator,
            argument: argument,
            prefix: true
          };
        },
        createVariableDeclaration: function (declarations, kind) {
          return {
            type: Syntax.VariableDeclaration,
            declarations: declarations,
            kind: kind
          };
        },
        createVariableDeclarator: function (id, init) {
          return {
            type: Syntax.VariableDeclarator,
            id: id,
            init: init
          };
        },
        createWhileStatement: function (test, body) {
          return {
            type: Syntax.WhileStatement,
            test: test,
            body: body
          };
        },
        createWithStatement: function (object, body) {
          return {
            type: Syntax.WithStatement,
            object: object,
            body: body
          };
        }
      };
      function peekLineTerminator() {
        var pos, line, start, found;
        pos = index;
        line = lineNumber;
        start = lineStart;
        skipComment();
        found = lineNumber !== line;
        index = pos;
        lineNumber = line;
        lineStart = start;
        return found;
      }
      function throwError(token, messageFormat) {
        var error, args = Array.prototype.slice.call(arguments, 2), msg = messageFormat.replace(/%(\d)/g, function (whole, index) {
            assert(index < args.length, 'Message reference must be in range');
            return args[index];
          });
        if (typeof token.lineNumber === 'number') {
          error = new Error('Line ' + token.lineNumber + ': ' + msg);
          error.index = token.start;
          error.lineNumber = token.lineNumber;
          error.column = token.start - lineStart + 1;
        } else {
          error = new Error('Line ' + lineNumber + ': ' + msg);
          error.index = index;
          error.lineNumber = lineNumber;
          error.column = index - lineStart + 1;
        }
        error.description = msg;
        throw error;
      }
      function throwErrorTolerant() {
        try {
          throwError.apply(null, arguments);
        } catch (e) {
          if (extra.errors) {
            extra.errors.push(e);
          } else {
            throw e;
          }
        }
      }
      function throwUnexpected(token) {
        if (token.type === Token.EOF) {
          throwError(token, Messages.UnexpectedEOS);
        }
        if (token.type === Token.NumericLiteral) {
          throwError(token, Messages.UnexpectedNumber);
        }
        if (token.type === Token.StringLiteral) {
          throwError(token, Messages.UnexpectedString);
        }
        if (token.type === Token.Identifier) {
          throwError(token, Messages.UnexpectedIdentifier);
        }
        if (token.type === Token.Keyword) {
          if (isFutureReservedWord(token.value)) {
            throwError(token, Messages.UnexpectedReserved);
          } else if (strict && isStrictModeReservedWord(token.value)) {
            throwErrorTolerant(token, Messages.StrictReservedWord);
            return;
          }
          throwError(token, Messages.UnexpectedToken, token.value);
        }
        throwError(token, Messages.UnexpectedToken, token.value);
      }
      function expect(value) {
        var token = lex();
        if (token.type !== Token.Punctuator || token.value !== value) {
          throwUnexpected(token);
        }
      }
      function expectKeyword(keyword) {
        var token = lex();
        if (token.type !== Token.Keyword || token.value !== keyword) {
          throwUnexpected(token);
        }
      }
      function match(value) {
        return lookahead.type === Token.Punctuator && lookahead.value === value;
      }
      function matchKeyword(keyword) {
        return lookahead.type === Token.Keyword && lookahead.value === keyword;
      }
      function matchAssign() {
        var op;
        if (lookahead.type !== Token.Punctuator) {
          return false;
        }
        op = lookahead.value;
        return op === '=' || op === '*=' || op === '/=' || op === '%=' || op === '+=' || op === '-=' || op === '<<=' || op === '>>=' || op === '>>>=' || op === '&=' || op === '^=' || op === '|=';
      }
      function consumeSemicolon() {
        var line, oldIndex = index, oldLineNumber = lineNumber, oldLineStart = lineStart, oldLookahead = lookahead;
        if (source.charCodeAt(index) === 59 || match(';')) {
          lex();
          return;
        }
        line = lineNumber;
        skipComment();
        if (lineNumber !== line) {
          index = oldIndex;
          lineNumber = oldLineNumber;
          lineStart = oldLineStart;
          lookahead = oldLookahead;
          return;
        }
        if (lookahead.type !== Token.EOF && !match('}')) {
          throwUnexpected(lookahead);
        }
      }
      function isLeftHandSide(expr) {
        return expr.type === Syntax.Identifier || expr.type === Syntax.MemberExpression;
      }
      function parseArrayInitialiser() {
        var elements = [], startToken;
        startToken = lookahead;
        expect('[');
        while (!match(']')) {
          if (match(',')) {
            lex();
            elements.push(null);
          } else {
            elements.push(parseAssignmentExpression());
            if (!match(']')) {
              expect(',');
            }
          }
        }
        lex();
        return delegate.markEnd(delegate.createArrayExpression(elements), startToken);
      }
      function parsePropertyFunction(param, first) {
        var previousStrict, body, startToken;
        previousStrict = strict;
        startToken = lookahead;
        body = parseFunctionSourceElements();
        if (first && strict && isRestrictedWord(param[0].name)) {
          throwErrorTolerant(first, Messages.StrictParamName);
        }
        strict = previousStrict;
        return delegate.markEnd(delegate.createFunctionExpression(null, param, [], body), startToken);
      }
      function parseObjectPropertyKey() {
        var token, startToken;
        startToken = lookahead;
        token = lex();
        if (token.type === Token.StringLiteral || token.type === Token.NumericLiteral) {
          if (strict && token.octal) {
            throwErrorTolerant(token, Messages.StrictOctalLiteral);
          }
          return delegate.markEnd(delegate.createLiteral(token), startToken);
        }
        return delegate.markEnd(delegate.createIdentifier(token.value), startToken);
      }
      function parseObjectProperty() {
        var token, key, id, value, param, startToken;
        token = lookahead;
        startToken = lookahead;
        if (token.type === Token.Identifier) {
          id = parseObjectPropertyKey();
          if (token.value === 'get' && !match(':')) {
            key = parseObjectPropertyKey();
            expect('(');
            expect(')');
            value = parsePropertyFunction([]);
            return delegate.markEnd(delegate.createProperty('get', key, value), startToken);
          }
          if (token.value === 'set' && !match(':')) {
            key = parseObjectPropertyKey();
            expect('(');
            token = lookahead;
            if (token.type !== Token.Identifier) {
              expect(')');
              throwErrorTolerant(token, Messages.UnexpectedToken, token.value);
              value = parsePropertyFunction([]);
            } else {
              param = [parseVariableIdentifier()];
              expect(')');
              value = parsePropertyFunction(param, token);
            }
            return delegate.markEnd(delegate.createProperty('set', key, value), startToken);
          }
          expect(':');
          value = parseAssignmentExpression();
          return delegate.markEnd(delegate.createProperty('init', id, value), startToken);
        }
        if (token.type === Token.EOF || token.type === Token.Punctuator) {
          throwUnexpected(token);
        } else {
          key = parseObjectPropertyKey();
          expect(':');
          value = parseAssignmentExpression();
          return delegate.markEnd(delegate.createProperty('init', key, value), startToken);
        }
      }
      function parseObjectInitialiser() {
        var properties = [], property, name, key, kind, map = {}, toString = String, startToken;
        startToken = lookahead;
        expect('{');
        while (!match('}')) {
          property = parseObjectProperty();
          if (property.key.type === Syntax.Identifier) {
            name = property.key.name;
          } else {
            name = toString(property.key.value);
          }
          kind = property.kind === 'init' ? PropertyKind.Data : property.kind === 'get' ? PropertyKind.Get : PropertyKind.Set;
          key = '$' + name;
          if (Object.prototype.hasOwnProperty.call(map, key)) {
            if (map[key] === PropertyKind.Data) {
              if (strict && kind === PropertyKind.Data) {
                throwErrorTolerant({}, Messages.StrictDuplicateProperty);
              } else if (kind !== PropertyKind.Data) {
                throwErrorTolerant({}, Messages.AccessorDataProperty);
              }
            } else {
              if (kind === PropertyKind.Data) {
                throwErrorTolerant({}, Messages.AccessorDataProperty);
              } else if (map[key] & kind) {
                throwErrorTolerant({}, Messages.AccessorGetSet);
              }
            }
            map[key] |= kind;
          } else {
            map[key] = kind;
          }
          properties.push(property);
          if (!match('}')) {
            expect(',');
          }
        }
        expect('}');
        return delegate.markEnd(delegate.createObjectExpression(properties), startToken);
      }
      function parseGroupExpression() {
        var expr;
        expect('(');
        expr = parseExpression();
        expect(')');
        return expr;
      }
      function parsePrimaryExpression() {
        var type, token, expr, startToken;
        if (match('(')) {
          return parseGroupExpression();
        }
        if (match('[')) {
          return parseArrayInitialiser();
        }
        if (match('{')) {
          return parseObjectInitialiser();
        }
        type = lookahead.type;
        startToken = lookahead;
        if (type === Token.Identifier) {
          expr = delegate.createIdentifier(lex().value);
        } else if (type === Token.StringLiteral || type === Token.NumericLiteral) {
          if (strict && lookahead.octal) {
            throwErrorTolerant(lookahead, Messages.StrictOctalLiteral);
          }
          expr = delegate.createLiteral(lex());
        } else if (type === Token.Keyword) {
          if (matchKeyword('function')) {
            return parseFunctionExpression();
          }
          if (matchKeyword('this')) {
            lex();
            expr = delegate.createThisExpression();
          } else {
            throwUnexpected(lex());
          }
        } else if (type === Token.BooleanLiteral) {
          token = lex();
          token.value = token.value === 'true';
          expr = delegate.createLiteral(token);
        } else if (type === Token.NullLiteral) {
          token = lex();
          token.value = null;
          expr = delegate.createLiteral(token);
        } else if (match('/') || match('/=')) {
          if (typeof extra.tokens !== 'undefined') {
            expr = delegate.createLiteral(collectRegex());
          } else {
            expr = delegate.createLiteral(scanRegExp());
          }
          peek();
        } else {
          throwUnexpected(lex());
        }
        return delegate.markEnd(expr, startToken);
      }
      function parseArguments() {
        var args = [];
        expect('(');
        if (!match(')')) {
          while (index < length) {
            args.push(parseAssignmentExpression());
            if (match(')')) {
              break;
            }
            expect(',');
          }
        }
        expect(')');
        return args;
      }
      function parseNonComputedProperty() {
        var token, startToken;
        startToken = lookahead;
        token = lex();
        if (!isIdentifierName(token)) {
          throwUnexpected(token);
        }
        return delegate.markEnd(delegate.createIdentifier(token.value), startToken);
      }
      function parseNonComputedMember() {
        expect('.');
        return parseNonComputedProperty();
      }
      function parseComputedMember() {
        var expr;
        expect('[');
        expr = parseExpression();
        expect(']');
        return expr;
      }
      function parseNewExpression() {
        var callee, args, startToken;
        startToken = lookahead;
        expectKeyword('new');
        callee = parseLeftHandSideExpression();
        args = match('(') ? parseArguments() : [];
        return delegate.markEnd(delegate.createNewExpression(callee, args), startToken);
      }
      function parseLeftHandSideExpressionAllowCall() {
        var expr, args, property, startToken, previousAllowIn = state.allowIn;
        startToken = lookahead;
        state.allowIn = true;
        expr = matchKeyword('new') ? parseNewExpression() : parsePrimaryExpression();
        for (;;) {
          if (match('.')) {
            property = parseNonComputedMember();
            expr = delegate.createMemberExpression('.', expr, property);
          } else if (match('(')) {
            args = parseArguments();
            expr = delegate.createCallExpression(expr, args);
          } else if (match('[')) {
            property = parseComputedMember();
            expr = delegate.createMemberExpression('[', expr, property);
          } else {
            break;
          }
          delegate.markEnd(expr, startToken);
        }
        state.allowIn = previousAllowIn;
        return expr;
      }
      function parseLeftHandSideExpression() {
        var expr, property, startToken;
        assert(state.allowIn, 'callee of new expression always allow in keyword.');
        startToken = lookahead;
        expr = matchKeyword('new') ? parseNewExpression() : parsePrimaryExpression();
        while (match('.') || match('[')) {
          if (match('[')) {
            property = parseComputedMember();
            expr = delegate.createMemberExpression('[', expr, property);
          } else {
            property = parseNonComputedMember();
            expr = delegate.createMemberExpression('.', expr, property);
          }
          delegate.markEnd(expr, startToken);
        }
        return expr;
      }
      function parsePostfixExpression() {
        var expr, token, startToken = lookahead;
        expr = parseLeftHandSideExpressionAllowCall();
        if (lookahead.type === Token.Punctuator) {
          if ((match('++') || match('--')) && !peekLineTerminator()) {
            if (strict && expr.type === Syntax.Identifier && isRestrictedWord(expr.name)) {
              throwErrorTolerant({}, Messages.StrictLHSPostfix);
            }
            if (!isLeftHandSide(expr)) {
              throwErrorTolerant({}, Messages.InvalidLHSInAssignment);
            }
            token = lex();
            expr = delegate.markEnd(delegate.createPostfixExpression(token.value, expr), startToken);
          }
        }
        return expr;
      }
      function parseUnaryExpression() {
        var token, expr, startToken;
        if (lookahead.type !== Token.Punctuator && lookahead.type !== Token.Keyword) {
          expr = parsePostfixExpression();
        } else if (match('++') || match('--')) {
          startToken = lookahead;
          token = lex();
          expr = parseUnaryExpression();
          if (strict && expr.type === Syntax.Identifier && isRestrictedWord(expr.name)) {
            throwErrorTolerant({}, Messages.StrictLHSPrefix);
          }
          if (!isLeftHandSide(expr)) {
            throwErrorTolerant({}, Messages.InvalidLHSInAssignment);
          }
          expr = delegate.createUnaryExpression(token.value, expr);
          expr = delegate.markEnd(expr, startToken);
        } else if (match('+') || match('-') || match('~') || match('!')) {
          startToken = lookahead;
          token = lex();
          expr = parseUnaryExpression();
          expr = delegate.createUnaryExpression(token.value, expr);
          expr = delegate.markEnd(expr, startToken);
        } else if (matchKeyword('delete') || matchKeyword('void') || matchKeyword('typeof')) {
          startToken = lookahead;
          token = lex();
          expr = parseUnaryExpression();
          expr = delegate.createUnaryExpression(token.value, expr);
          expr = delegate.markEnd(expr, startToken);
          if (strict && expr.operator === 'delete' && expr.argument.type === Syntax.Identifier) {
            throwErrorTolerant({}, Messages.StrictDelete);
          }
        } else {
          expr = parsePostfixExpression();
        }
        return expr;
      }
      function binaryPrecedence(token, allowIn) {
        var prec = 0;
        if (token.type !== Token.Punctuator && token.type !== Token.Keyword) {
          return 0;
        }
        switch (token.value) {
        case '||':
          prec = 1;
          break;
        case '&&':
          prec = 2;
          break;
        case '|':
          prec = 3;
          break;
        case '^':
          prec = 4;
          break;
        case '&':
          prec = 5;
          break;
        case '==':
        case '!=':
        case '===':
        case '!==':
          prec = 6;
          break;
        case '<':
        case '>':
        case '<=':
        case '>=':
        case 'instanceof':
          prec = 7;
          break;
        case 'in':
          prec = allowIn ? 7 : 0;
          break;
        case '<<':
        case '>>':
        case '>>>':
          prec = 8;
          break;
        case '+':
        case '-':
          prec = 9;
          break;
        case '*':
        case '/':
        case '%':
          prec = 11;
          break;
        default:
          break;
        }
        return prec;
      }
      function parseBinaryExpression() {
        var marker, markers, expr, token, prec, stack, right, operator, left, i;
        marker = lookahead;
        left = parseUnaryExpression();
        token = lookahead;
        prec = binaryPrecedence(token, state.allowIn);
        if (prec === 0) {
          return left;
        }
        token.prec = prec;
        lex();
        markers = [
          marker,
          lookahead
        ];
        right = parseUnaryExpression();
        stack = [
          left,
          token,
          right
        ];
        while ((prec = binaryPrecedence(lookahead, state.allowIn)) > 0) {
          while (stack.length > 2 && prec <= stack[stack.length - 2].prec) {
            right = stack.pop();
            operator = stack.pop().value;
            left = stack.pop();
            expr = delegate.createBinaryExpression(operator, left, right);
            markers.pop();
            marker = markers[markers.length - 1];
            delegate.markEnd(expr, marker);
            stack.push(expr);
          }
          token = lex();
          token.prec = prec;
          stack.push(token);
          markers.push(lookahead);
          expr = parseUnaryExpression();
          stack.push(expr);
        }
        i = stack.length - 1;
        expr = stack[i];
        markers.pop();
        while (i > 1) {
          expr = delegate.createBinaryExpression(stack[i - 1].value, stack[i - 2], expr);
          i -= 2;
          marker = markers.pop();
          delegate.markEnd(expr, marker);
        }
        return expr;
      }
      function parseConditionalExpression() {
        var expr, previousAllowIn, consequent, alternate, startToken;
        startToken = lookahead;
        expr = parseBinaryExpression();
        if (match('?')) {
          lex();
          previousAllowIn = state.allowIn;
          state.allowIn = true;
          consequent = parseAssignmentExpression();
          state.allowIn = previousAllowIn;
          expect(':');
          alternate = parseAssignmentExpression();
          expr = delegate.createConditionalExpression(expr, consequent, alternate);
          delegate.markEnd(expr, startToken);
        }
        return expr;
      }
      function parseAssignmentExpression() {
        var token, left, right, node, startToken;
        token = lookahead;
        startToken = lookahead;
        node = left = parseConditionalExpression();
        if (matchAssign()) {
          if (!isLeftHandSide(left)) {
            throwErrorTolerant({}, Messages.InvalidLHSInAssignment);
          }
          if (strict && left.type === Syntax.Identifier && isRestrictedWord(left.name)) {
            throwErrorTolerant(token, Messages.StrictLHSAssignment);
          }
          token = lex();
          right = parseAssignmentExpression();
          node = delegate.markEnd(delegate.createAssignmentExpression(token.value, left, right), startToken);
        }
        return node;
      }
      function parseExpression() {
        var expr, startToken = lookahead;
        expr = parseAssignmentExpression();
        if (match(',')) {
          expr = delegate.createSequenceExpression([expr]);
          while (index < length) {
            if (!match(',')) {
              break;
            }
            lex();
            expr.expressions.push(parseAssignmentExpression());
          }
          delegate.markEnd(expr, startToken);
        }
        return expr;
      }
      function parseStatementList() {
        var list = [], statement;
        while (index < length) {
          if (match('}')) {
            break;
          }
          statement = parseSourceElement();
          if (typeof statement === 'undefined') {
            break;
          }
          list.push(statement);
        }
        return list;
      }
      function parseBlock() {
        var block, startToken;
        startToken = lookahead;
        expect('{');
        block = parseStatementList();
        expect('}');
        return delegate.markEnd(delegate.createBlockStatement(block), startToken);
      }
      function parseVariableIdentifier() {
        var token, startToken;
        startToken = lookahead;
        token = lex();
        if (token.type !== Token.Identifier) {
          throwUnexpected(token);
        }
        return delegate.markEnd(delegate.createIdentifier(token.value), startToken);
      }
      function parseVariableDeclaration(kind) {
        var init = null, id, startToken;
        startToken = lookahead;
        id = parseVariableIdentifier();
        if (strict && isRestrictedWord(id.name)) {
          throwErrorTolerant({}, Messages.StrictVarName);
        }
        if (kind === 'const') {
          expect('=');
          init = parseAssignmentExpression();
        } else if (match('=')) {
          lex();
          init = parseAssignmentExpression();
        }
        return delegate.markEnd(delegate.createVariableDeclarator(id, init), startToken);
      }
      function parseVariableDeclarationList(kind) {
        var list = [];
        do {
          list.push(parseVariableDeclaration(kind));
          if (!match(',')) {
            break;
          }
          lex();
        } while (index < length);
        return list;
      }
      function parseVariableStatement() {
        var declarations;
        expectKeyword('var');
        declarations = parseVariableDeclarationList();
        consumeSemicolon();
        return delegate.createVariableDeclaration(declarations, 'var');
      }
      function parseConstLetDeclaration(kind) {
        var declarations, startToken;
        startToken = lookahead;
        expectKeyword(kind);
        declarations = parseVariableDeclarationList(kind);
        consumeSemicolon();
        return delegate.markEnd(delegate.createVariableDeclaration(declarations, kind), startToken);
      }
      function parseEmptyStatement() {
        expect(';');
        return delegate.createEmptyStatement();
      }
      function parseExpressionStatement() {
        var expr = parseExpression();
        consumeSemicolon();
        return delegate.createExpressionStatement(expr);
      }
      function parseIfStatement() {
        var test, consequent, alternate;
        expectKeyword('if');
        expect('(');
        test = parseExpression();
        expect(')');
        consequent = parseStatement();
        if (matchKeyword('else')) {
          lex();
          alternate = parseStatement();
        } else {
          alternate = null;
        }
        return delegate.createIfStatement(test, consequent, alternate);
      }
      function parseDoWhileStatement() {
        var body, test, oldInIteration;
        expectKeyword('do');
        oldInIteration = state.inIteration;
        state.inIteration = true;
        body = parseStatement();
        state.inIteration = oldInIteration;
        expectKeyword('while');
        expect('(');
        test = parseExpression();
        expect(')');
        if (match(';')) {
          lex();
        }
        return delegate.createDoWhileStatement(body, test);
      }
      function parseWhileStatement() {
        var test, body, oldInIteration;
        expectKeyword('while');
        expect('(');
        test = parseExpression();
        expect(')');
        oldInIteration = state.inIteration;
        state.inIteration = true;
        body = parseStatement();
        state.inIteration = oldInIteration;
        return delegate.createWhileStatement(test, body);
      }
      function parseForVariableDeclaration() {
        var token, declarations, startToken;
        startToken = lookahead;
        token = lex();
        declarations = parseVariableDeclarationList();
        return delegate.markEnd(delegate.createVariableDeclaration(declarations, token.value), startToken);
      }
      function parseForStatement() {
        var init, test, update, left, right, body, oldInIteration, previousAllowIn = state.allowIn;
        init = test = update = null;
        expectKeyword('for');
        expect('(');
        if (match(';')) {
          lex();
        } else {
          if (matchKeyword('var') || matchKeyword('let')) {
            state.allowIn = false;
            init = parseForVariableDeclaration();
            state.allowIn = previousAllowIn;
            if (init.declarations.length === 1 && matchKeyword('in')) {
              lex();
              left = init;
              right = parseExpression();
              init = null;
            }
          } else {
            state.allowIn = false;
            init = parseExpression();
            state.allowIn = previousAllowIn;
            if (matchKeyword('in')) {
              if (!isLeftHandSide(init)) {
                throwErrorTolerant({}, Messages.InvalidLHSInForIn);
              }
              lex();
              left = init;
              right = parseExpression();
              init = null;
            }
          }
          if (typeof left === 'undefined') {
            expect(';');
          }
        }
        if (typeof left === 'undefined') {
          if (!match(';')) {
            test = parseExpression();
          }
          expect(';');
          if (!match(')')) {
            update = parseExpression();
          }
        }
        expect(')');
        oldInIteration = state.inIteration;
        state.inIteration = true;
        body = parseStatement();
        state.inIteration = oldInIteration;
        return typeof left === 'undefined' ? delegate.createForStatement(init, test, update, body) : delegate.createForInStatement(left, right, body);
      }
      function parseContinueStatement() {
        var label = null, key;
        expectKeyword('continue');
        if (source.charCodeAt(index) === 59) {
          lex();
          if (!state.inIteration) {
            throwError({}, Messages.IllegalContinue);
          }
          return delegate.createContinueStatement(null);
        }
        if (peekLineTerminator()) {
          if (!state.inIteration) {
            throwError({}, Messages.IllegalContinue);
          }
          return delegate.createContinueStatement(null);
        }
        if (lookahead.type === Token.Identifier) {
          label = parseVariableIdentifier();
          key = '$' + label.name;
          if (!Object.prototype.hasOwnProperty.call(state.labelSet, key)) {
            throwError({}, Messages.UnknownLabel, label.name);
          }
        }
        consumeSemicolon();
        if (label === null && !state.inIteration) {
          throwError({}, Messages.IllegalContinue);
        }
        return delegate.createContinueStatement(label);
      }
      function parseBreakStatement() {
        var label = null, key;
        expectKeyword('break');
        if (source.charCodeAt(index) === 59) {
          lex();
          if (!(state.inIteration || state.inSwitch)) {
            throwError({}, Messages.IllegalBreak);
          }
          return delegate.createBreakStatement(null);
        }
        if (peekLineTerminator()) {
          if (!(state.inIteration || state.inSwitch)) {
            throwError({}, Messages.IllegalBreak);
          }
          return delegate.createBreakStatement(null);
        }
        if (lookahead.type === Token.Identifier) {
          label = parseVariableIdentifier();
          key = '$' + label.name;
          if (!Object.prototype.hasOwnProperty.call(state.labelSet, key)) {
            throwError({}, Messages.UnknownLabel, label.name);
          }
        }
        consumeSemicolon();
        if (label === null && !(state.inIteration || state.inSwitch)) {
          throwError({}, Messages.IllegalBreak);
        }
        return delegate.createBreakStatement(label);
      }
      function parseReturnStatement() {
        var argument = null;
        expectKeyword('return');
        if (!state.inFunctionBody) {
          throwErrorTolerant({}, Messages.IllegalReturn);
        }
        if (source.charCodeAt(index) === 32) {
          if (isIdentifierStart(source.charCodeAt(index + 1))) {
            argument = parseExpression();
            consumeSemicolon();
            return delegate.createReturnStatement(argument);
          }
        }
        if (peekLineTerminator()) {
          return delegate.createReturnStatement(null);
        }
        if (!match(';')) {
          if (!match('}') && lookahead.type !== Token.EOF) {
            argument = parseExpression();
          }
        }
        consumeSemicolon();
        return delegate.createReturnStatement(argument);
      }
      function parseWithStatement() {
        var object, body;
        if (strict) {
          skipComment();
          throwErrorTolerant({}, Messages.StrictModeWith);
        }
        expectKeyword('with');
        expect('(');
        object = parseExpression();
        expect(')');
        body = parseStatement();
        return delegate.createWithStatement(object, body);
      }
      function parseSwitchCase() {
        var test, consequent = [], statement, startToken;
        startToken = lookahead;
        if (matchKeyword('default')) {
          lex();
          test = null;
        } else {
          expectKeyword('case');
          test = parseExpression();
        }
        expect(':');
        while (index < length) {
          if (match('}') || matchKeyword('default') || matchKeyword('case')) {
            break;
          }
          statement = parseStatement();
          consequent.push(statement);
        }
        return delegate.markEnd(delegate.createSwitchCase(test, consequent), startToken);
      }
      function parseSwitchStatement() {
        var discriminant, cases, clause, oldInSwitch, defaultFound;
        expectKeyword('switch');
        expect('(');
        discriminant = parseExpression();
        expect(')');
        expect('{');
        cases = [];
        if (match('}')) {
          lex();
          return delegate.createSwitchStatement(discriminant, cases);
        }
        oldInSwitch = state.inSwitch;
        state.inSwitch = true;
        defaultFound = false;
        while (index < length) {
          if (match('}')) {
            break;
          }
          clause = parseSwitchCase();
          if (clause.test === null) {
            if (defaultFound) {
              throwError({}, Messages.MultipleDefaultsInSwitch);
            }
            defaultFound = true;
          }
          cases.push(clause);
        }
        state.inSwitch = oldInSwitch;
        expect('}');
        return delegate.createSwitchStatement(discriminant, cases);
      }
      function parseThrowStatement() {
        var argument;
        expectKeyword('throw');
        if (peekLineTerminator()) {
          throwError({}, Messages.NewlineAfterThrow);
        }
        argument = parseExpression();
        consumeSemicolon();
        return delegate.createThrowStatement(argument);
      }
      function parseCatchClause() {
        var param, body, startToken;
        startToken = lookahead;
        expectKeyword('catch');
        expect('(');
        if (match(')')) {
          throwUnexpected(lookahead);
        }
        param = parseVariableIdentifier();
        if (strict && isRestrictedWord(param.name)) {
          throwErrorTolerant({}, Messages.StrictCatchVariable);
        }
        expect(')');
        body = parseBlock();
        return delegate.markEnd(delegate.createCatchClause(param, body), startToken);
      }
      function parseTryStatement() {
        var block, handlers = [], finalizer = null;
        expectKeyword('try');
        block = parseBlock();
        if (matchKeyword('catch')) {
          handlers.push(parseCatchClause());
        }
        if (matchKeyword('finally')) {
          lex();
          finalizer = parseBlock();
        }
        if (handlers.length === 0 && !finalizer) {
          throwError({}, Messages.NoCatchOrFinally);
        }
        return delegate.createTryStatement(block, [], handlers, finalizer);
      }
      function parseDebuggerStatement() {
        expectKeyword('debugger');
        consumeSemicolon();
        return delegate.createDebuggerStatement();
      }
      function parseStatement() {
        var type = lookahead.type, expr, labeledBody, key, startToken;
        if (type === Token.EOF) {
          throwUnexpected(lookahead);
        }
        if (type === Token.Punctuator && lookahead.value === '{') {
          return parseBlock();
        }
        startToken = lookahead;
        if (type === Token.Punctuator) {
          switch (lookahead.value) {
          case ';':
            return delegate.markEnd(parseEmptyStatement(), startToken);
          case '(':
            return delegate.markEnd(parseExpressionStatement(), startToken);
          default:
            break;
          }
        }
        if (type === Token.Keyword) {
          switch (lookahead.value) {
          case 'break':
            return delegate.markEnd(parseBreakStatement(), startToken);
          case 'continue':
            return delegate.markEnd(parseContinueStatement(), startToken);
          case 'debugger':
            return delegate.markEnd(parseDebuggerStatement(), startToken);
          case 'do':
            return delegate.markEnd(parseDoWhileStatement(), startToken);
          case 'for':
            return delegate.markEnd(parseForStatement(), startToken);
          case 'function':
            return delegate.markEnd(parseFunctionDeclaration(), startToken);
          case 'if':
            return delegate.markEnd(parseIfStatement(), startToken);
          case 'return':
            return delegate.markEnd(parseReturnStatement(), startToken);
          case 'switch':
            return delegate.markEnd(parseSwitchStatement(), startToken);
          case 'throw':
            return delegate.markEnd(parseThrowStatement(), startToken);
          case 'try':
            return delegate.markEnd(parseTryStatement(), startToken);
          case 'var':
            return delegate.markEnd(parseVariableStatement(), startToken);
          case 'while':
            return delegate.markEnd(parseWhileStatement(), startToken);
          case 'with':
            return delegate.markEnd(parseWithStatement(), startToken);
          default:
            break;
          }
        }
        expr = parseExpression();
        if (expr.type === Syntax.Identifier && match(':')) {
          lex();
          key = '$' + expr.name;
          if (Object.prototype.hasOwnProperty.call(state.labelSet, key)) {
            throwError({}, Messages.Redeclaration, 'Label', expr.name);
          }
          state.labelSet[key] = true;
          labeledBody = parseStatement();
          delete state.labelSet[key];
          return delegate.markEnd(delegate.createLabeledStatement(expr, labeledBody), startToken);
        }
        consumeSemicolon();
        return delegate.markEnd(delegate.createExpressionStatement(expr), startToken);
      }
      function parseFunctionSourceElements() {
        var sourceElement, sourceElements = [], token, directive, firstRestricted, oldLabelSet, oldInIteration, oldInSwitch, oldInFunctionBody, startToken;
        startToken = lookahead;
        expect('{');
        while (index < length) {
          if (lookahead.type !== Token.StringLiteral) {
            break;
          }
          token = lookahead;
          sourceElement = parseSourceElement();
          sourceElements.push(sourceElement);
          if (sourceElement.expression.type !== Syntax.Literal) {
            break;
          }
          directive = source.slice(token.start + 1, token.end - 1);
          if (directive === 'use strict') {
            strict = true;
            if (firstRestricted) {
              throwErrorTolerant(firstRestricted, Messages.StrictOctalLiteral);
            }
          } else {
            if (!firstRestricted && token.octal) {
              firstRestricted = token;
            }
          }
        }
        oldLabelSet = state.labelSet;
        oldInIteration = state.inIteration;
        oldInSwitch = state.inSwitch;
        oldInFunctionBody = state.inFunctionBody;
        state.labelSet = {};
        state.inIteration = false;
        state.inSwitch = false;
        state.inFunctionBody = true;
        while (index < length) {
          if (match('}')) {
            break;
          }
          sourceElement = parseSourceElement();
          if (typeof sourceElement === 'undefined') {
            break;
          }
          sourceElements.push(sourceElement);
        }
        expect('}');
        state.labelSet = oldLabelSet;
        state.inIteration = oldInIteration;
        state.inSwitch = oldInSwitch;
        state.inFunctionBody = oldInFunctionBody;
        return delegate.markEnd(delegate.createBlockStatement(sourceElements), startToken);
      }
      function parseParams(firstRestricted) {
        var param, params = [], token, stricted, paramSet, key, message;
        expect('(');
        if (!match(')')) {
          paramSet = {};
          while (index < length) {
            token = lookahead;
            param = parseVariableIdentifier();
            key = '$' + token.value;
            if (strict) {
              if (isRestrictedWord(token.value)) {
                stricted = token;
                message = Messages.StrictParamName;
              }
              if (Object.prototype.hasOwnProperty.call(paramSet, key)) {
                stricted = token;
                message = Messages.StrictParamDupe;
              }
            } else if (!firstRestricted) {
              if (isRestrictedWord(token.value)) {
                firstRestricted = token;
                message = Messages.StrictParamName;
              } else if (isStrictModeReservedWord(token.value)) {
                firstRestricted = token;
                message = Messages.StrictReservedWord;
              } else if (Object.prototype.hasOwnProperty.call(paramSet, key)) {
                firstRestricted = token;
                message = Messages.StrictParamDupe;
              }
            }
            params.push(param);
            paramSet[key] = true;
            if (match(')')) {
              break;
            }
            expect(',');
          }
        }
        expect(')');
        return {
          params: params,
          stricted: stricted,
          firstRestricted: firstRestricted,
          message: message
        };
      }
      function parseFunctionDeclaration() {
        var id, params = [], body, token, stricted, tmp, firstRestricted, message, previousStrict, startToken;
        startToken = lookahead;
        expectKeyword('function');
        token = lookahead;
        id = parseVariableIdentifier();
        if (strict) {
          if (isRestrictedWord(token.value)) {
            throwErrorTolerant(token, Messages.StrictFunctionName);
          }
        } else {
          if (isRestrictedWord(token.value)) {
            firstRestricted = token;
            message = Messages.StrictFunctionName;
          } else if (isStrictModeReservedWord(token.value)) {
            firstRestricted = token;
            message = Messages.StrictReservedWord;
          }
        }
        tmp = parseParams(firstRestricted);
        params = tmp.params;
        stricted = tmp.stricted;
        firstRestricted = tmp.firstRestricted;
        if (tmp.message) {
          message = tmp.message;
        }
        previousStrict = strict;
        body = parseFunctionSourceElements();
        if (strict && firstRestricted) {
          throwError(firstRestricted, message);
        }
        if (strict && stricted) {
          throwErrorTolerant(stricted, message);
        }
        strict = previousStrict;
        return delegate.markEnd(delegate.createFunctionDeclaration(id, params, [], body), startToken);
      }
      function parseFunctionExpression() {
        var token, id = null, stricted, firstRestricted, message, tmp, params = [], body, previousStrict, startToken;
        startToken = lookahead;
        expectKeyword('function');
        if (!match('(')) {
          token = lookahead;
          id = parseVariableIdentifier();
          if (strict) {
            if (isRestrictedWord(token.value)) {
              throwErrorTolerant(token, Messages.StrictFunctionName);
            }
          } else {
            if (isRestrictedWord(token.value)) {
              firstRestricted = token;
              message = Messages.StrictFunctionName;
            } else if (isStrictModeReservedWord(token.value)) {
              firstRestricted = token;
              message = Messages.StrictReservedWord;
            }
          }
        }
        tmp = parseParams(firstRestricted);
        params = tmp.params;
        stricted = tmp.stricted;
        firstRestricted = tmp.firstRestricted;
        if (tmp.message) {
          message = tmp.message;
        }
        previousStrict = strict;
        body = parseFunctionSourceElements();
        if (strict && firstRestricted) {
          throwError(firstRestricted, message);
        }
        if (strict && stricted) {
          throwErrorTolerant(stricted, message);
        }
        strict = previousStrict;
        return delegate.markEnd(delegate.createFunctionExpression(id, params, [], body), startToken);
      }
      function parseSourceElement() {
        if (lookahead.type === Token.Keyword) {
          switch (lookahead.value) {
          case 'const':
          case 'let':
            return parseConstLetDeclaration(lookahead.value);
          case 'function':
            return parseFunctionDeclaration();
          default:
            return parseStatement();
          }
        }
        if (lookahead.type !== Token.EOF) {
          return parseStatement();
        }
      }
      function parseSourceElements() {
        var sourceElement, sourceElements = [], token, directive, firstRestricted;
        while (index < length) {
          token = lookahead;
          if (token.type !== Token.StringLiteral) {
            break;
          }
          sourceElement = parseSourceElement();
          sourceElements.push(sourceElement);
          if (sourceElement.expression.type !== Syntax.Literal) {
            break;
          }
          directive = source.slice(token.start + 1, token.end - 1);
          if (directive === 'use strict') {
            strict = true;
            if (firstRestricted) {
              throwErrorTolerant(firstRestricted, Messages.StrictOctalLiteral);
            }
          } else {
            if (!firstRestricted && token.octal) {
              firstRestricted = token;
            }
          }
        }
        while (index < length) {
          sourceElement = parseSourceElement();
          if (typeof sourceElement === 'undefined') {
            break;
          }
          sourceElements.push(sourceElement);
        }
        return sourceElements;
      }
      function parseProgram() {
        var body, startToken;
        skipComment();
        peek();
        startToken = lookahead;
        strict = false;
        body = parseSourceElements();
        return delegate.markEnd(delegate.createProgram(body), startToken);
      }
      function filterTokenLocation() {
        var i, entry, token, tokens = [];
        for (i = 0; i < extra.tokens.length; ++i) {
          entry = extra.tokens[i];
          token = {
            type: entry.type,
            value: entry.value
          };
          if (extra.range) {
            token.range = entry.range;
          }
          if (extra.loc) {
            token.loc = entry.loc;
          }
          tokens.push(token);
        }
        extra.tokens = tokens;
      }
      function tokenize(code, options) {
        var toString, token, tokens;
        toString = String;
        if (typeof code !== 'string' && !(code instanceof String)) {
          code = toString(code);
        }
        delegate = SyntaxTreeDelegate;
        source = code;
        index = 0;
        lineNumber = source.length > 0 ? 1 : 0;
        lineStart = 0;
        length = source.length;
        lookahead = null;
        state = {
          allowIn: true,
          labelSet: {},
          inFunctionBody: false,
          inIteration: false,
          inSwitch: false,
          lastCommentStart: -1
        };
        extra = {};
        options = options || {};
        options.tokens = true;
        extra.tokens = [];
        extra.tokenize = true;
        extra.openParenToken = -1;
        extra.openCurlyToken = -1;
        extra.range = typeof options.range === 'boolean' && options.range;
        extra.loc = typeof options.loc === 'boolean' && options.loc;
        if (typeof options.comment === 'boolean' && options.comment) {
          extra.comments = [];
        }
        if (typeof options.tolerant === 'boolean' && options.tolerant) {
          extra.errors = [];
        }
        try {
          peek();
          if (lookahead.type === Token.EOF) {
            return extra.tokens;
          }
          token = lex();
          while (lookahead.type !== Token.EOF) {
            try {
              token = lex();
            } catch (lexError) {
              token = lookahead;
              if (extra.errors) {
                extra.errors.push(lexError);
                break;
              } else {
                throw lexError;
              }
            }
          }
          filterTokenLocation();
          tokens = extra.tokens;
          if (typeof extra.comments !== 'undefined') {
            tokens.comments = extra.comments;
          }
          if (typeof extra.errors !== 'undefined') {
            tokens.errors = extra.errors;
          }
        } catch (e) {
          throw e;
        } finally {
          extra = {};
        }
        return tokens;
      }
      function parse(code, options) {
        var program, toString;
        toString = String;
        if (typeof code !== 'string' && !(code instanceof String)) {
          code = toString(code);
        }
        delegate = SyntaxTreeDelegate;
        source = code;
        index = 0;
        lineNumber = source.length > 0 ? 1 : 0;
        lineStart = 0;
        length = source.length;
        lookahead = null;
        state = {
          allowIn: true,
          labelSet: {},
          inFunctionBody: false,
          inIteration: false,
          inSwitch: false,
          lastCommentStart: -1
        };
        extra = {};
        if (typeof options !== 'undefined') {
          extra.range = typeof options.range === 'boolean' && options.range;
          extra.loc = typeof options.loc === 'boolean' && options.loc;
          extra.attachComment = typeof options.attachComment === 'boolean' && options.attachComment;
          if (extra.loc && options.source !== null && options.source !== undefined) {
            extra.source = toString(options.source);
          }
          if (typeof options.tokens === 'boolean' && options.tokens) {
            extra.tokens = [];
          }
          if (typeof options.comment === 'boolean' && options.comment) {
            extra.comments = [];
          }
          if (typeof options.tolerant === 'boolean' && options.tolerant) {
            extra.errors = [];
          }
          if (extra.attachComment) {
            extra.range = true;
            extra.comments = [];
            extra.bottomRightStack = [];
            extra.trailingComments = [];
            extra.leadingComments = [];
          }
        }
        try {
          program = parseProgram();
          if (typeof extra.comments !== 'undefined') {
            program.comments = extra.comments;
          }
          if (typeof extra.tokens !== 'undefined') {
            filterTokenLocation();
            program.tokens = extra.tokens;
          }
          if (typeof extra.errors !== 'undefined') {
            program.errors = extra.errors;
          }
        } catch (e) {
          throw e;
        } finally {
          extra = {};
        }
        return program;
      }
      exports.version = '1.2.5';
      exports.tokenize = tokenize;
      exports.parse = parse;
      exports.Syntax = function () {
        var name, types = {};
        if (typeof Object.create === 'function') {
          types = Object.create(null);
        }
        for (name in Syntax) {
          if (Syntax.hasOwnProperty(name)) {
            types[name] = Syntax[name];
          }
        }
        if (typeof Object.freeze === 'function') {
          Object.freeze(types);
        }
        return types;
      }();
    }));
  },
  './node_modules/quickstart/node_modules/escodegen/package.json': function (require, module, exports, global) {
    module.exports = {
      'name': 'escodegen',
      'description': 'ECMAScript code generator',
      'homepage': 'http://github.com/estools/escodegen',
      'main': 'escodegen.js',
      'bin': {
        'esgenerate': './bin/esgenerate.js',
        'escodegen': './bin/escodegen.js'
      },
      'files': [
        'LICENSE.BSD',
        'LICENSE.source-map',
        'README.md',
        'bin',
        'escodegen.js',
        'package.json'
      ],
      'version': '1.6.1',
      'engines': { 'node': '>=0.10.0' },
      'maintainers': [{
          'name': 'constellation',
          'email': 'utatane.tea@gmail.com'
        }],
      'repository': {
        'type': 'git',
        'url': 'http://github.com/estools/escodegen.git'
      },
      'dependencies': {
        'estraverse': '^1.9.1',
        'esutils': '^1.1.6',
        'esprima': '^1.2.2',
        'optionator': '^0.5.0',
        'source-map': '~0.1.40'
      },
      'optionalDependencies': { 'source-map': '~0.1.40' },
      'devDependencies': {
        'acorn-6to5': '^0.11.1-25',
        'bluebird': '^2.3.11',
        'bower-registry-client': '^0.2.1',
        'chai': '^1.10.0',
        'commonjs-everywhere': '^0.9.7',
        'esprima-moz': '*',
        'gulp': '^3.8.10',
        'gulp-eslint': '^0.2.0',
        'gulp-mocha': '^2.0.0',
        'semver': '^4.1.0'
      },
      'licenses': [{
          'type': 'BSD',
          'url': 'http://github.com/estools/escodegen/raw/master/LICENSE.BSD'
        }],
      'scripts': {
        'test': 'gulp travis',
        'unit-test': 'gulp test',
        'lint': 'gulp lint',
        'release': 'node tools/release.js',
        'build-min': 'cjsify -ma path: tools/entry-point.js > escodegen.browser.min.js',
        'build': 'cjsify -a path: tools/entry-point.js > escodegen.browser.js'
      },
      'gitHead': '1ca664f68dcf220b76c9dc562b2337c5e0b4227d',
      'bugs': { 'url': 'https://github.com/estools/escodegen/issues' },
      '_id': 'escodegen@1.6.1',
      '_shasum': '367de17d8510540d12bc6dcb8b3f918391265815',
      '_from': 'escodegen@>=1.3.2 <2.0.0',
      '_npmVersion': '2.0.0-alpha-5',
      '_npmUser': {
        'name': 'constellation',
        'email': 'utatane.tea@gmail.com'
      },
      'dist': {
        'shasum': '367de17d8510540d12bc6dcb8b3f918391265815',
        'tarball': 'http://registry.npmjs.org/escodegen/-/escodegen-1.6.1.tgz'
      },
      'directories': {},
      '_resolved': 'https://registry.npmjs.org/escodegen/-/escodegen-1.6.1.tgz',
      'readme': 'ERROR: No README data found!'
    };
  },
  './node_modules/quickstart/node_modules/mout/array/forEach.js': function (require, module, exports, global) {
    function forEach(arr, callback, thisObj) {
      if (arr == null) {
        return;
      }
      var i = -1, len = arr.length;
      while (++i < len) {
        if (callback.call(thisObj, arr[i], i, arr) === false) {
          break;
        }
      }
    }
    module.exports = forEach;
  },
  './node_modules/quickstart/node_modules/mout/object/forIn.js': function (require, module, exports, global) {
    var hasOwn = require('./node_modules/quickstart/node_modules/mout/object/hasOwn.js');
    var _hasDontEnumBug, _dontEnums;
    function checkDontEnum() {
      _dontEnums = [
        'toString',
        'toLocaleString',
        'valueOf',
        'hasOwnProperty',
        'isPrototypeOf',
        'propertyIsEnumerable',
        'constructor'
      ];
      _hasDontEnumBug = true;
      for (var key in { 'toString': null }) {
        _hasDontEnumBug = false;
      }
    }
    function forIn(obj, fn, thisObj) {
      var key, i = 0;
      if (_hasDontEnumBug == null)
        checkDontEnum();
      for (key in obj) {
        if (exec(fn, obj, key, thisObj) === false) {
          break;
        }
      }
      if (_hasDontEnumBug) {
        var ctor = obj.constructor, isProto = !!ctor && obj === ctor.prototype;
        while (key = _dontEnums[i++]) {
          if ((key !== 'constructor' || !isProto && hasOwn(obj, key)) && obj[key] !== Object.prototype[key]) {
            if (exec(fn, obj, key, thisObj) === false) {
              break;
            }
          }
        }
      }
    }
    function exec(fn, obj, key, thisObj) {
      return fn.call(thisObj, obj[key], key, obj);
    }
    module.exports = forIn;
  },
  './node_modules/quickstart/node_modules/mout/object/map.js': function (require, module, exports, global) {
    var forOwn = require('./node_modules/quickstart/node_modules/mout/object/forOwn.js');
    var makeIterator = require('./node_modules/quickstart/node_modules/mout/function/makeIterator_.js');
    function mapValues(obj, callback, thisObj) {
      callback = makeIterator(callback, thisObj);
      var output = {};
      forOwn(obj, function (val, key, obj) {
        output[key] = callback(val, key, obj);
      });
      return output;
    }
    module.exports = mapValues;
  },
  './node_modules/quickstart/util/sequence.js': function (require, module, exports, global) {
    'use strict';
    var forEach = require('./node_modules/quickstart/node_modules/mout/collection/forEach.js');
    var isInteger = require('./node_modules/quickstart/node_modules/mout/lang/isInteger.js');
    var isArray = require('./node_modules/quickstart/node_modules/mout/lang/isArray.js');
    var fillIn = require('./node_modules/quickstart/node_modules/mout/object/fillIn.js');
    function Control(collection, length, keys, values, next, resolve, reject) {
      var pending = true;
      var remaining = length;
      var caught, saved;
      var done = function () {
        pending = false;
        if (caught) {
          reject(caught.error);
        } else if (saved) {
          resolve(saved.value);
        } else {
          if (isArray(collection)) {
            var result = [];
            for (var i = 0; i < length; i++)
              if (i in collection)
                result.push(collection[i]);
            resolve(result);
          } else {
            resolve(collection);
          }
        }
      };
      this.resolve = function (value) {
        if (pending) {
          pending = false;
          resolve(value);
        }
        return this;
      };
      this.reject = function (error) {
        if (pending) {
          pending = false;
          reject(error);
        }
        return this;
      };
      this.collect = function (index, value) {
        if (pending) {
          collection[keys[index]] = value;
          if (!--remaining)
            done();
        }
        return this;
      };
      this.catch = function (error) {
        if (pending) {
          caught = { error: error };
          if (!--remaining)
            done();
        }
        return this;
      };
      this.save = function (value) {
        if (pending) {
          saved = { value: value };
          if (!--remaining)
            done();
        }
        return this;
      };
      this.skip = function () {
        if (pending && !--remaining)
          done();
        return this;
      };
      this.continue = function () {
        if (pending)
          next();
        return this;
      };
    }
    var identity = function (promise) {
      return promise;
    };
    function use(Promise) {
      if (!Promise)
        throw new Error('sequence needs a Promise implementation');
      function sequence(list, iterator, previous) {
        var length = 0;
        var keys = [];
        var values = [];
        forEach(list, function (value, key) {
          values.push(value);
          keys.push(key);
          length++;
        });
        if (!length)
          return Promise.resolve(previous);
        var index = 0;
        var collection = isInteger(list.length) ? [] : {};
        return new Promise(function (resolve, reject) {
          var control = new Control(collection, length, keys, values, next, resolve, reject);
          function next() {
            if (index === length)
              return;
            var current = index++;
            var key = keys[current];
            var value = values[current];
            var ctrl = fillIn({
              index: current,
              last: index === length,
              collect: function (value) {
                return control.collect(current, value);
              }
            }, control);
            previous = iterator(value, key, ctrl, previous);
          }
          next();
        });
      }
      sequence.find = function find(values, iterator) {
        if (!iterator)
          iterator = identity;
        return sequence(values, function (value, key, control) {
          Promise.resolve().then(function () {
            return iterator(value, key);
          }).then(control.resolve, function (error) {
            control.catch(error).continue();
          });
        });
      };
      sequence.filter = function filter(values, iterator) {
        if (!iterator)
          iterator = identity;
        return sequence(values, function (value, key, control) {
          Promise.resolve().then(function () {
            return iterator(value, key);
          }).then(control.collect, control.skip);
          control.continue();
        });
      };
      sequence.map = function map(values, iterator) {
        if (!iterator)
          iterator = identity;
        return sequence(values, function (value, key, control) {
          Promise.resolve().then(function () {
            return iterator(value, key);
          }).then(function (value) {
            control.collect(value).continue();
          }, control.reject);
        });
      };
      sequence.every = function every(values, iterator) {
        if (!iterator)
          iterator = identity;
        return sequence(values, function (value, key, control) {
          Promise.resolve().then(function () {
            return iterator(value, key);
          }).then(control.collect, control.catch);
          control.continue();
        });
      };
      sequence.some = function some(values, iterator) {
        if (!iterator)
          iterator = identity;
        var found = false;
        return sequence(values, function (value, key, control) {
          Promise.resolve().then(function () {
            return iterator(value, key);
          }).then(function (value) {
            found = true;
            control.collect(value);
          }, function (error) {
            if (control.last && !found)
              control.reject(error);
            else
              control.skip();
          });
          control.continue();
        });
      };
      sequence.all = function all(values, iterator) {
        if (!iterator)
          iterator = identity;
        return sequence(values, function (value, key, control) {
          Promise.resolve().then(function () {
            return iterator(value, key);
          }).then(control.collect, control.reject);
          control.continue();
        });
      };
      sequence.reduce = function reduce(values, iterator, init) {
        if (!iterator)
          iterator = identity;
        return sequence(values, function (value, key, control, promise) {
          return promise.then(function (resolved) {
            return iterator(resolved, value, key);
          }).then(function (value) {
            control.save(value).continue();
            return value;
          }, control.reject);
        }, Promise.resolve(init));
      };
      sequence.race = function race(values, iterator) {
        if (!iterator)
          iterator = identity;
        return sequence(values, function (value, key, control) {
          Promise.resolve().then(function () {
            return iterator(value, key);
          }).then(control.resolve, control.reject);
          control.continue();
        });
      };
      return sequence;
    }
    exports.use = use;
  },
  './node_modules/quickstart/util/transport.js': function (require, module, exports, global) {
    'use strict';
    var fs = require.node('fs');
    var pathogen = require('./node_modules/quickstart/node_modules/pathogen/index.js');
    var Promise = require('./node_modules/quickstart/node_modules/promise/index.js');
    var transport;
    var cache = {
      get: {},
      json: {}
    };
    if ('readFile' in fs) {
      transport = function get(url) {
        var cached = cache.get[url];
        if (cached)
          return cached;
        return cache.get[url] = new Promise(function (fulfill, reject) {
          fs.readFile(pathogen.sys(url), 'utf-8', function (error, data) {
            error ? reject(error) : fulfill(data);
          });
        });
      };
    } else {
      var agent = require('./node_modules/quickstart/node_modules/agent/index.js');
      agent.MAX_REQUESTS = 4;
      agent.decoder('application/json', null);
      transport = function get(url) {
        var cached = cache.get[url];
        if (cached)
          return cached;
        return cache.get[url] = new Promise(function (fulfill, reject) {
          agent.get(url, function (error, response) {
            if (error)
              return reject(error);
            var status = response.status;
            if (status >= 300 || status < 200)
              return reject(new Error('GET ' + url + ' ' + status));
            if (pathogen.extname(url) !== '.html' && response.header['Content-Type'] === 'text/html') {
              reject(new Error('GET ' + url + ' content-type mismatch'));
            } else {
              fulfill(response.body);
            }
          });
        });
      };
    }
    transport.json = function json(url) {
      var cached = cache.json[url];
      if (cached)
        return cached;
      return cache.json[url] = transport(url).then(JSON.parse);
    };
    transport.cache = cache;
    module.exports = transport;
  },
  './node_modules/quickstart/util/resolver.js': function (require, module, exports, global) {
    'use strict';
    var pathogen = require('./node_modules/quickstart/node_modules/pathogen/index.js');
    var prime = require('./node_modules/quickstart/node_modules/prime/index.js');
    var Promise = require('./node_modules/quickstart/node_modules/promise/index.js');
    var isString = require('./node_modules/quickstart/node_modules/mout/lang/isString.js');
    var isPlainObject = require('./node_modules/quickstart/node_modules/mout/lang/isPlainObject.js');
    var contains = require('./node_modules/quickstart/node_modules/mout/array/contains.js');
    var transport = require('./node_modules/quickstart/util/transport.js');
    var sequence = require('./node_modules/quickstart/util/sequence.js').use(Promise);
    var absRe = /^(\/|.+:\/)/;
    var relRe = /^(\.\/|\.\.\/)/;
    var natives = [
      '_debugger',
      '_linklist',
      'assert',
      'buffer',
      'child_process',
      'console',
      'constants',
      'crypto',
      'cluster',
      'dgram',
      'dns',
      'domain',
      'events',
      'freelist',
      'fs',
      'http',
      'https',
      'module',
      'net',
      'os',
      'path',
      'punycode',
      'querystring',
      'readline',
      'repl',
      'stream',
      '_stream_readable',
      '_stream_writable',
      '_stream_duplex',
      '_stream_transform',
      '_stream_passthrough',
      'string_decoder',
      'sys',
      'timers',
      'tls',
      'tty',
      'url',
      'util',
      'vm',
      'zlib'
    ];
    var isNative = function (pkg) {
      return contains(natives, pkg);
    };
    var Resolver = prime({
      constructor: function (options) {
        if (!options)
          options = {};
        this.browser = options.browser == null ? true : !!options.browser;
        this.nodeModules = options.nodeModules || 'node_modules';
        this.defaultPath = options.defaultPath ? pathogen.resolve(options.defaultPath) : null;
      },
      resolve: function (from, required) {
        from = pathogen.resolve(pathogen.dirname(from));
        if (isNative(required)) {
          if (!this.browser)
            return Promise.resolve(required);
          else
            return this._findRoute(this._paths(from), required);
        } else {
          if (!this.browser)
            return this._resolve(from, required);
          else
            return this._resolveAndRoute(from, required);
        }
      },
      _resolveAndRoute: function (from, required) {
        var self = this;
        return self._resolve(from, required).then(function (resolved) {
          return self._route(from, resolved);
        });
      },
      _resolve: function (from, required) {
        if (relRe.test(required))
          return this._load(pathogen.resolve(from, required));
        else if (absRe.test(required))
          return this._load(required);
        else
          return this._package(from, required);
      },
      _findRouteInBrowserField: function (browser, path, resolved) {
        var self = this;
        return sequence(browser, function (value, key, control) {
          if (isNative(key)) {
            if (key === resolved) {
              if (!value)
                control.resolve(false);
              else
                self._resolveAndRoute(path, value).then(control.resolve, control.reject);
            } else {
              control.save(null).continue();
            }
          } else {
            self._resolve(path, key).then(function (res) {
              if (res === resolved) {
                if (!value)
                  control.resolve(false);
                else
                  self.resolve(path, value).then(control.resolve, control.reject);
              } else {
                control.save(null).continue();
              }
            }, function () {
              control.save(null).continue();
            });
          }
        });
      },
      _findRoute: function (paths, resolved) {
        var self = this;
        return sequence(paths, function (path, i, control) {
          transport.json(path + 'package.json').then(function (json) {
            if (isPlainObject(json.browser)) {
              self._findRouteInBrowserField(json.browser, path, resolved).then(function (route) {
                if (route == null)
                  control.save(resolved).continue();
                else
                  control.resolve(route);
              }, control.reject);
            } else {
              control.save(resolved).continue();
            }
          }, function () {
            control.save(resolved).continue();
          });
        });
      },
      _route: function (from, resolved) {
        var self = this;
        var paths = self._paths(from);
        return self.findRoot(resolved).then(function (path) {
          if (paths[0] !== path)
            paths.unshift(path);
          return self._findRoute(paths, resolved);
        });
      },
      _load: function (required) {
        var self = this;
        var promise = Promise.reject();
        if (!/\/$/.test(required))
          promise = self._file(required);
        return promise.catch(function () {
          return self._directory(required);
        });
      },
      _file: function (required) {
        var exts = ['.js'];
        if (pathogen.extname(required))
          exts.unshift('');
        return sequence.find(exts, function (ext) {
          var path = required + ext;
          return transport(required + ext).then(function () {
            return path;
          });
        });
      },
      _directory: function (full) {
        var self = this;
        return transport.json(full + 'package.json').catch(function () {
          return {};
        }).then(function (json) {
          var main = isString(json.browser) ? json.browser : json.main;
          if (main == null)
            return self._file(pathogen.resolve(full, 'index'));
          return self._load(pathogen.resolve(full, main));
        });
      },
      _package: function (from, required) {
        var self = this;
        var split = required.split('/');
        var packageName = split.shift();
        if (required.indexOf('/') === -1)
          required += '/';
        return self.resolvePackage(from, packageName).then(function (jsonPath) {
          return self._load(pathogen.dirname(jsonPath) + split.join('/'));
        });
      },
      _paths: function (path) {
        var node_modules = this.nodeModules;
        var paths = [];
        var parts = path.split('/').slice(1, -1);
        var drive = new pathogen(path).drive;
        for (var i = parts.length, part; i; part = parts[i--]) {
          if (part === node_modules)
            continue;
          var dir = drive + '/' + parts.slice(0, i).join('/') + '/';
          paths.push(dir);
        }
        paths.push(drive + '/');
        if (this.defaultPath)
          paths.push(this.defaultPath + '/');
        return paths;
      },
      resolvePackage: function (path, packageName) {
        var self = this;
        var node_modules = self.nodeModules;
        path = pathogen.resolve(pathogen.dirname(path));
        var paths = self._paths(path);
        return sequence.find(paths, function (path) {
          var jsonPath = path + node_modules + '/' + packageName + '/package.json';
          return transport(jsonPath).then(function () {
            return jsonPath;
          });
        });
      },
      findRoot: function (path) {
        var self = this;
        var paths = self._paths(pathogen.resolve(pathogen.dirname(path)));
        return sequence.find(paths, function (path) {
          return transport(path + 'package.json').then(function () {
            return path;
          });
        });
      }
    });
    Resolver.natives = natives;
    Resolver.isNative = isNative;
    module.exports = Resolver;
  },
  './node_modules/quickstart/browser/process.js': function (require, module, exports, global) {
    'use strict';
    exports.title = document.title;
    exports.browser = true;
    exports.cwd = function () {
      return location.pathname.split(/\/+/g).slice(0, -1).join('/') || '/';
    };
  },
  './node_modules/quickstart/node_modules/mout/object/mixIn.js': function (require, module, exports, global) {
    var forOwn = require('./node_modules/quickstart/node_modules/mout/object/forOwn.js');
    function mixIn(target, objects) {
      var i = 0, n = arguments.length, obj;
      while (++i < n) {
        obj = arguments[i];
        if (obj != null) {
          forOwn(obj, copyProp, target);
        }
      }
      return target;
    }
    function copyProp(val, key) {
      this[key] = val;
    }
    module.exports = mixIn;
  },
  './node_modules/quickstart/node_modules/mout/array/append.js': function (require, module, exports, global) {
    function append(arr1, arr2) {
      if (arr2 == null) {
        return arr1;
      }
      var pad = arr1.length, i = -1, len = arr2.length;
      while (++i < len) {
        arr1[pad + i] = arr2[i];
      }
      return arr1;
    }
    module.exports = append;
  },
  './node_modules/quickstart/node_modules/mout/array/find.js': function (require, module, exports, global) {
    var findIndex = require('./node_modules/quickstart/node_modules/mout/array/findIndex.js');
    function find(arr, iterator, thisObj) {
      var idx = findIndex(arr, iterator, thisObj);
      return idx >= 0 ? arr[idx] : void 0;
    }
    module.exports = find;
  },
  './node_modules/quickstart/transforms/require-dependencies.js': function (require, module, exports, global) {
    'use strict';
    var esprima = require('./node_modules/quickstart/node_modules/esprima/esprima.js');
    var estraverse = require('./node_modules/quickstart/node_modules/estraverse/estraverse.js');
    var Promise = require('./node_modules/quickstart/node_modules/promise/index.js');
    var pathogen = require('./node_modules/quickstart/node_modules/pathogen/index.js');
    var sequence = require('./node_modules/quickstart/util/sequence.js').use(Promise);
    var transport = require('./node_modules/quickstart/util/transport.js');
    var Resolver = require('./node_modules/quickstart/util/resolver.js');
    var isNative = Resolver.isNative;
    var Syntax = esprima.Syntax;
    var traverse = estraverse.traverse;
    var express = function (string) {
      return esprima.parse(string).body[0].expression;
    };
    function requireDependencies(path, tree) {
      var self = this;
      var requireNodes = [];
      var resolveNodes = [];
      traverse(tree, {
        enter: function (node, parent) {
          if (node.type !== Syntax.CallExpression || node.arguments.length !== 1)
            return;
          var argument = node.arguments[0];
          if (argument.type !== Syntax.Literal)
            return;
          var callee = node.callee;
          if (callee.type === Syntax.Identifier && callee.name === 'require') {
            requireNodes.push({
              node: node,
              value: argument.value,
              parent: parent
            });
          } else if (callee.type === Syntax.MemberExpression && callee.object.type === Syntax.Identifier && callee.object.name === 'require' && callee.property.type === Syntax.Identifier && callee.property.name === 'resolve') {
            resolveNodes.push({
              node: node,
              value: argument.value,
              parent: parent
            });
          }
        }
      });
      var requireNodesPromise = sequence.every(requireNodes, function (result) {
        var requireNode = result.node;
        var requireNodeValue = result.value;
        return self.require(pathogen(self.root + path), requireNodeValue).then(function (uid) {
          if (uid) {
            if (isNative(uid))
              requireNode.callee = {
                type: Syntax.MemberExpression,
                computed: false,
                object: {
                  type: Syntax.Identifier,
                  name: 'require'
                },
                property: {
                  type: Syntax.Identifier,
                  name: 'node'
                }
              };
            requireNode.arguments[0].value = uid;
          } else {
            requireNode.type = Syntax.ObjectExpression;
            requireNode.properties = [];
            delete requireNode.callee;
            delete requireNode.arguments;
          }
        });
      });
      var resolveNodesPromise = sequence.every(resolveNodes, function (result) {
        var resolveNode = result.node;
        var resolveNodeValue = result.value;
        return self.require(pathogen(self.root + path), resolveNodeValue).then(function (uid) {
          resolveNode.arguments[0].value = uid;
        });
      });
      return sequence.every([
        requireNodesPromise,
        resolveNodesPromise
      ]).then(function () {
        return tree;
      });
    }
    module.exports = requireDependencies;
  },
  './node_modules/quickstart/node_modules/mout/object/size.js': function (require, module, exports, global) {
    var forOwn = require('./node_modules/quickstart/node_modules/mout/object/forOwn.js');
    function size(obj) {
      var count = 0;
      forOwn(obj, function () {
        count++;
      });
      return count;
    }
    module.exports = size;
  },
  './node_modules/quickstart/node_modules/mout/object/hasOwn.js': function (require, module, exports, global) {
    function hasOwn(obj, prop) {
      return Object.prototype.hasOwnProperty.call(obj, prop);
    }
    module.exports = hasOwn;
  },
  './node_modules/quickstart/node_modules/mout/object/forOwn.js': function (require, module, exports, global) {
    var hasOwn = require('./node_modules/quickstart/node_modules/mout/object/hasOwn.js');
    var forIn = require('./node_modules/quickstart/node_modules/mout/object/forIn.js');
    function forOwn(obj, fn, thisObj) {
      forIn(obj, function (val, key) {
        if (hasOwn(obj, key)) {
          return fn.call(thisObj, obj[key], key, obj);
        }
      });
    }
    module.exports = forOwn;
  },
  './node_modules/quickstart/node_modules/mout/object/fillIn.js': function (require, module, exports, global) {
    var forEach = require('./node_modules/quickstart/node_modules/mout/array/forEach.js');
    var slice = require('./node_modules/quickstart/node_modules/mout/array/slice.js');
    var forOwn = require('./node_modules/quickstart/node_modules/mout/object/forOwn.js');
    function fillIn(obj, var_defaults) {
      forEach(slice(arguments, 1), function (base) {
        forOwn(base, function (val, key) {
          if (obj[key] == null) {
            obj[key] = val;
          }
        });
      });
      return obj;
    }
    module.exports = fillIn;
  },
  './node_modules/quickstart/node_modules/mout/array/contains.js': function (require, module, exports, global) {
    var indexOf = require('./node_modules/quickstart/node_modules/mout/array/indexOf.js');
    function contains(arr, val) {
      return indexOf(arr, val) !== -1;
    }
    module.exports = contains;
  },
  './node_modules/quickstart/node_modules/mout/array/map.js': function (require, module, exports, global) {
    var makeIterator = require('./node_modules/quickstart/node_modules/mout/function/makeIterator_.js');
    function map(arr, callback, thisObj) {
      callback = makeIterator(callback, thisObj);
      var results = [];
      if (arr == null) {
        return results;
      }
      var i = -1, len = arr.length;
      while (++i < len) {
        results[i] = callback(arr[i], i, arr);
      }
      return results;
    }
    module.exports = map;
  },
  './node_modules/quickstart/node_modules/mout/array/slice.js': function (require, module, exports, global) {
    function slice(arr, start, end) {
      var len = arr.length;
      if (start == null) {
        start = 0;
      } else if (start < 0) {
        start = Math.max(len + start, 0);
      } else {
        start = Math.min(start, len);
      }
      if (end == null) {
        end = len;
      } else if (end < 0) {
        end = Math.max(len + end, 0);
      } else {
        end = Math.min(end, len);
      }
      var result = [];
      while (start < end) {
        result.push(arr[start++]);
      }
      return result;
    }
    module.exports = slice;
  },
  './node_modules/quickstart/node_modules/prime/index.js': function (require, module, exports, global) {
    'use strict';
    var hasOwn = require('./node_modules/quickstart/node_modules/mout/object/hasOwn.js'), mixIn = require('./node_modules/quickstart/node_modules/mout/object/mixIn.js'), create = require('./node_modules/quickstart/node_modules/mout/lang/createObject.js'), kindOf = require('./node_modules/quickstart/node_modules/mout/lang/kindOf.js');
    var hasDescriptors = true;
    try {
      Object.defineProperty({}, '~', {});
      Object.getOwnPropertyDescriptor({}, '~');
    } catch (e) {
      hasDescriptors = false;
    }
    var hasEnumBug = !{ valueOf: 0 }.propertyIsEnumerable('valueOf'), buggy = [
        'toString',
        'valueOf'
      ];
    var verbs = /^constructor|inherits|mixin$/;
    var implement = function (proto) {
      var prototype = this.prototype;
      for (var key in proto) {
        if (key.match(verbs))
          continue;
        if (hasDescriptors) {
          var descriptor = Object.getOwnPropertyDescriptor(proto, key);
          if (descriptor) {
            Object.defineProperty(prototype, key, descriptor);
            continue;
          }
        }
        prototype[key] = proto[key];
      }
      if (hasEnumBug)
        for (var i = 0; key = buggy[i]; i++) {
          var value = proto[key];
          if (value !== Object.prototype[key])
            prototype[key] = value;
        }
      return this;
    };
    var prime = function (proto) {
      if (kindOf(proto) === 'Function')
        proto = { constructor: proto };
      var superprime = proto.inherits;
      var constructor = hasOwn(proto, 'constructor') ? proto.constructor : superprime ? function () {
        return superprime.apply(this, arguments);
      } : function () {
      };
      if (superprime) {
        mixIn(constructor, superprime);
        var superproto = superprime.prototype;
        var cproto = constructor.prototype = create(superproto);
        constructor.parent = superproto;
        cproto.constructor = constructor;
      }
      if (!constructor.implement)
        constructor.implement = implement;
      var mixins = proto.mixin;
      if (mixins) {
        if (kindOf(mixins) !== 'Array')
          mixins = [mixins];
        for (var i = 0; i < mixins.length; i++)
          constructor.implement(create(mixins[i].prototype));
      }
      return constructor.implement(proto);
    };
    module.exports = prime;
  },
  './node_modules/quickstart/node_modules/promise/index.js': function (require, module, exports, global) {
    'use strict';
    var Promise = require('./node_modules/quickstart/node_modules/promise/core.js');
    var asap = require('./node_modules/quickstart/node_modules/promise/node_modules/asap/asap.js');
    module.exports = Promise;
    function ValuePromise(value) {
      this.then = function (onFulfilled) {
        if (typeof onFulfilled !== 'function')
          return this;
        return new Promise(function (resolve, reject) {
          asap(function () {
            try {
              resolve(onFulfilled(value));
            } catch (ex) {
              reject(ex);
            }
          });
        });
      };
    }
    ValuePromise.prototype = Object.create(Promise.prototype);
    var TRUE = new ValuePromise(true);
    var FALSE = new ValuePromise(false);
    var NULL = new ValuePromise(null);
    var UNDEFINED = new ValuePromise(undefined);
    var ZERO = new ValuePromise(0);
    var EMPTYSTRING = new ValuePromise('');
    Promise.resolve = function (value) {
      if (value instanceof Promise)
        return value;
      if (value === null)
        return NULL;
      if (value === undefined)
        return UNDEFINED;
      if (value === true)
        return TRUE;
      if (value === false)
        return FALSE;
      if (value === 0)
        return ZERO;
      if (value === '')
        return EMPTYSTRING;
      if (typeof value === 'object' || typeof value === 'function') {
        try {
          var then = value.then;
          if (typeof then === 'function') {
            return new Promise(then.bind(value));
          }
        } catch (ex) {
          return new Promise(function (resolve, reject) {
            reject(ex);
          });
        }
      }
      return new ValuePromise(value);
    };
    Promise.from = Promise.cast = function (value) {
      var err = new Error('Promise.from and Promise.cast are deprecated, use Promise.resolve instead');
      err.name = 'Warning';
      console.warn(err.stack);
      return Promise.resolve(value);
    };
    Promise.denodeify = function (fn, argumentCount) {
      argumentCount = argumentCount || Infinity;
      return function () {
        var self = this;
        var args = Array.prototype.slice.call(arguments);
        return new Promise(function (resolve, reject) {
          while (args.length && args.length > argumentCount) {
            args.pop();
          }
          args.push(function (err, res) {
            if (err)
              reject(err);
            else
              resolve(res);
          });
          fn.apply(self, args);
        });
      };
    };
    Promise.nodeify = function (fn) {
      return function () {
        var args = Array.prototype.slice.call(arguments);
        var callback = typeof args[args.length - 1] === 'function' ? args.pop() : null;
        try {
          return fn.apply(this, arguments).nodeify(callback);
        } catch (ex) {
          if (callback === null || typeof callback == 'undefined') {
            return new Promise(function (resolve, reject) {
              reject(ex);
            });
          } else {
            asap(function () {
              callback(ex);
            });
          }
        }
      };
    };
    Promise.all = function () {
      var calledWithArray = arguments.length === 1 && Array.isArray(arguments[0]);
      var args = Array.prototype.slice.call(calledWithArray ? arguments[0] : arguments);
      if (!calledWithArray) {
        var err = new Error('Promise.all should be called with a single array, calling it with multiple arguments is deprecated');
        err.name = 'Warning';
        console.warn(err.stack);
      }
      return new Promise(function (resolve, reject) {
        if (args.length === 0)
          return resolve([]);
        var remaining = args.length;
        function res(i, val) {
          try {
            if (val && (typeof val === 'object' || typeof val === 'function')) {
              var then = val.then;
              if (typeof then === 'function') {
                then.call(val, function (val) {
                  res(i, val);
                }, reject);
                return;
              }
            }
            args[i] = val;
            if (--remaining === 0) {
              resolve(args);
            }
          } catch (ex) {
            reject(ex);
          }
        }
        for (var i = 0; i < args.length; i++) {
          res(i, args[i]);
        }
      });
    };
    Promise.reject = function (value) {
      return new Promise(function (resolve, reject) {
        reject(value);
      });
    };
    Promise.race = function (values) {
      return new Promise(function (resolve, reject) {
        values.forEach(function (value) {
          Promise.resolve(value).then(resolve, reject);
        });
      });
    };
    Promise.prototype.done = function (onFulfilled, onRejected) {
      var self = arguments.length ? this.then.apply(this, arguments) : this;
      self.then(null, function (err) {
        asap(function () {
          throw err;
        });
      });
    };
    Promise.prototype.nodeify = function (callback) {
      if (typeof callback != 'function')
        return this;
      this.then(function (value) {
        asap(function () {
          callback(null, value);
        });
      }, function (err) {
        asap(function () {
          callback(err);
        });
      });
    };
    Promise.prototype['catch'] = function (onRejected) {
      return this.then(null, onRejected);
    };
  },
  './node_modules/quickstart/node_modules/mout/array/findIndex.js': function (require, module, exports, global) {
    var makeIterator = require('./node_modules/quickstart/node_modules/mout/function/makeIterator_.js');
    function findIndex(arr, iterator, thisObj) {
      iterator = makeIterator(iterator, thisObj);
      if (arr == null) {
        return -1;
      }
      var i = -1, len = arr.length;
      while (++i < len) {
        if (iterator(arr[i], i, arr)) {
          return i;
        }
      }
      return -1;
    }
    module.exports = findIndex;
  },
  './node_modules/quickstart/node_modules/mout/function/makeIterator_.js': function (require, module, exports, global) {
    var identity = require('./node_modules/quickstart/node_modules/mout/function/identity.js');
    var prop = require('./node_modules/quickstart/node_modules/mout/function/prop.js');
    var deepMatches = require('./node_modules/quickstart/node_modules/mout/object/deepMatches.js');
    function makeIterator(src, thisObj) {
      if (src == null) {
        return identity;
      }
      switch (typeof src) {
      case 'function':
        return typeof thisObj !== 'undefined' ? function (val, i, arr) {
          return src.call(thisObj, val, i, arr);
        } : src;
      case 'object':
        return function (val) {
          return deepMatches(val, src);
        };
      case 'string':
      case 'number':
        return prop(src);
      }
    }
    module.exports = makeIterator;
  },
  './node_modules/quickstart/node_modules/mout/collection/forEach.js': function (require, module, exports, global) {
    var make = require('./node_modules/quickstart/node_modules/mout/collection/make_.js');
    var arrForEach = require('./node_modules/quickstart/node_modules/mout/array/forEach.js');
    var objForEach = require('./node_modules/quickstart/node_modules/mout/object/forOwn.js');
    module.exports = make(arrForEach, objForEach);
  },
  './node_modules/quickstart/node_modules/mout/lang/isInteger.js': function (require, module, exports, global) {
    var isNumber = require('./node_modules/quickstart/node_modules/mout/lang/isNumber.js');
    function isInteger(val) {
      return isNumber(val) && val % 1 === 0;
    }
    module.exports = isInteger;
  },
  './node_modules/quickstart/node_modules/mout/lang/isArray.js': function (require, module, exports, global) {
    var isKind = require('./node_modules/quickstart/node_modules/mout/lang/isKind.js');
    var isArray = Array.isArray || function (val) {
      return isKind(val, 'Array');
    };
    module.exports = isArray;
  },
  './node_modules/quickstart/node_modules/mout/lang/isString.js': function (require, module, exports, global) {
    var isKind = require('./node_modules/quickstart/node_modules/mout/lang/isKind.js');
    function isString(val) {
      return isKind(val, 'String');
    }
    module.exports = isString;
  },
  './node_modules/quickstart/node_modules/mout/lang/isPlainObject.js': function (require, module, exports, global) {
    function isPlainObject(value) {
      return !!value && typeof value === 'object' && value.constructor === Object;
    }
    module.exports = isPlainObject;
  },
  './node_modules/quickstart/node_modules/microseconds/index.js': function (require, module, exports, global) {
    'use strict';
    var now = require('./node_modules/quickstart/node_modules/microseconds/now.js'), parse = require('./node_modules/quickstart/node_modules/microseconds/parse.js');
    var since = function (nano) {
      return now() - nano;
    };
    exports.now = now;
    exports.since = since;
    exports.parse = parse;
  },
  './node_modules/quickstart/node_modules/escodegen/node_modules/estraverse/estraverse.js': function (require, module, exports, global) {
    (function (root, factory) {
      'use strict';
      if (typeof define === 'function' && define.amd) {
        define(['exports'], factory);
      } else if (typeof exports !== 'undefined') {
        factory(exports);
      } else {
        factory(root.estraverse = {});
      }
    }(this, function clone(exports) {
      'use strict';
      var Syntax, isArray, VisitorOption, VisitorKeys, objectCreate, objectKeys, BREAK, SKIP, REMOVE;
      function ignoreJSHintError() {
      }
      isArray = Array.isArray;
      if (!isArray) {
        isArray = function isArray(array) {
          return Object.prototype.toString.call(array) === '[object Array]';
        };
      }
      function deepCopy(obj) {
        var ret = {}, key, val;
        for (key in obj) {
          if (obj.hasOwnProperty(key)) {
            val = obj[key];
            if (typeof val === 'object' && val !== null) {
              ret[key] = deepCopy(val);
            } else {
              ret[key] = val;
            }
          }
        }
        return ret;
      }
      function shallowCopy(obj) {
        var ret = {}, key;
        for (key in obj) {
          if (obj.hasOwnProperty(key)) {
            ret[key] = obj[key];
          }
        }
        return ret;
      }
      ignoreJSHintError(shallowCopy);
      function upperBound(array, func) {
        var diff, len, i, current;
        len = array.length;
        i = 0;
        while (len) {
          diff = len >>> 1;
          current = i + diff;
          if (func(array[current])) {
            len = diff;
          } else {
            i = current + 1;
            len -= diff + 1;
          }
        }
        return i;
      }
      function lowerBound(array, func) {
        var diff, len, i, current;
        len = array.length;
        i = 0;
        while (len) {
          diff = len >>> 1;
          current = i + diff;
          if (func(array[current])) {
            i = current + 1;
            len -= diff + 1;
          } else {
            len = diff;
          }
        }
        return i;
      }
      ignoreJSHintError(lowerBound);
      objectCreate = Object.create || function () {
        function F() {
        }
        return function (o) {
          F.prototype = o;
          return new F();
        };
      }();
      objectKeys = Object.keys || function (o) {
        var keys = [], key;
        for (key in o) {
          keys.push(key);
        }
        return keys;
      };
      function extend(to, from) {
        var keys = objectKeys(from), key, i, len;
        for (i = 0, len = keys.length; i < len; i += 1) {
          key = keys[i];
          to[key] = from[key];
        }
        return to;
      }
      Syntax = {
        AssignmentExpression: 'AssignmentExpression',
        ArrayExpression: 'ArrayExpression',
        ArrayPattern: 'ArrayPattern',
        ArrowFunctionExpression: 'ArrowFunctionExpression',
        AwaitExpression: 'AwaitExpression',
        BlockStatement: 'BlockStatement',
        BinaryExpression: 'BinaryExpression',
        BreakStatement: 'BreakStatement',
        CallExpression: 'CallExpression',
        CatchClause: 'CatchClause',
        ClassBody: 'ClassBody',
        ClassDeclaration: 'ClassDeclaration',
        ClassExpression: 'ClassExpression',
        ComprehensionBlock: 'ComprehensionBlock',
        ComprehensionExpression: 'ComprehensionExpression',
        ConditionalExpression: 'ConditionalExpression',
        ContinueStatement: 'ContinueStatement',
        DebuggerStatement: 'DebuggerStatement',
        DirectiveStatement: 'DirectiveStatement',
        DoWhileStatement: 'DoWhileStatement',
        EmptyStatement: 'EmptyStatement',
        ExportBatchSpecifier: 'ExportBatchSpecifier',
        ExportDeclaration: 'ExportDeclaration',
        ExportSpecifier: 'ExportSpecifier',
        ExpressionStatement: 'ExpressionStatement',
        ForStatement: 'ForStatement',
        ForInStatement: 'ForInStatement',
        ForOfStatement: 'ForOfStatement',
        FunctionDeclaration: 'FunctionDeclaration',
        FunctionExpression: 'FunctionExpression',
        GeneratorExpression: 'GeneratorExpression',
        Identifier: 'Identifier',
        IfStatement: 'IfStatement',
        ImportDeclaration: 'ImportDeclaration',
        ImportDefaultSpecifier: 'ImportDefaultSpecifier',
        ImportNamespaceSpecifier: 'ImportNamespaceSpecifier',
        ImportSpecifier: 'ImportSpecifier',
        Literal: 'Literal',
        LabeledStatement: 'LabeledStatement',
        LogicalExpression: 'LogicalExpression',
        MemberExpression: 'MemberExpression',
        MethodDefinition: 'MethodDefinition',
        ModuleSpecifier: 'ModuleSpecifier',
        NewExpression: 'NewExpression',
        ObjectExpression: 'ObjectExpression',
        ObjectPattern: 'ObjectPattern',
        Program: 'Program',
        Property: 'Property',
        ReturnStatement: 'ReturnStatement',
        SequenceExpression: 'SequenceExpression',
        SpreadElement: 'SpreadElement',
        SwitchStatement: 'SwitchStatement',
        SwitchCase: 'SwitchCase',
        TaggedTemplateExpression: 'TaggedTemplateExpression',
        TemplateElement: 'TemplateElement',
        TemplateLiteral: 'TemplateLiteral',
        ThisExpression: 'ThisExpression',
        ThrowStatement: 'ThrowStatement',
        TryStatement: 'TryStatement',
        UnaryExpression: 'UnaryExpression',
        UpdateExpression: 'UpdateExpression',
        VariableDeclaration: 'VariableDeclaration',
        VariableDeclarator: 'VariableDeclarator',
        WhileStatement: 'WhileStatement',
        WithStatement: 'WithStatement',
        YieldExpression: 'YieldExpression'
      };
      VisitorKeys = {
        AssignmentExpression: [
          'left',
          'right'
        ],
        ArrayExpression: ['elements'],
        ArrayPattern: ['elements'],
        ArrowFunctionExpression: [
          'params',
          'defaults',
          'rest',
          'body'
        ],
        AwaitExpression: ['argument'],
        BlockStatement: ['body'],
        BinaryExpression: [
          'left',
          'right'
        ],
        BreakStatement: ['label'],
        CallExpression: [
          'callee',
          'arguments'
        ],
        CatchClause: [
          'param',
          'body'
        ],
        ClassBody: ['body'],
        ClassDeclaration: [
          'id',
          'body',
          'superClass'
        ],
        ClassExpression: [
          'id',
          'body',
          'superClass'
        ],
        ComprehensionBlock: [
          'left',
          'right'
        ],
        ComprehensionExpression: [
          'blocks',
          'filter',
          'body'
        ],
        ConditionalExpression: [
          'test',
          'consequent',
          'alternate'
        ],
        ContinueStatement: ['label'],
        DebuggerStatement: [],
        DirectiveStatement: [],
        DoWhileStatement: [
          'body',
          'test'
        ],
        EmptyStatement: [],
        ExportBatchSpecifier: [],
        ExportDeclaration: [
          'declaration',
          'specifiers',
          'source'
        ],
        ExportSpecifier: [
          'id',
          'name'
        ],
        ExpressionStatement: ['expression'],
        ForStatement: [
          'init',
          'test',
          'update',
          'body'
        ],
        ForInStatement: [
          'left',
          'right',
          'body'
        ],
        ForOfStatement: [
          'left',
          'right',
          'body'
        ],
        FunctionDeclaration: [
          'id',
          'params',
          'defaults',
          'rest',
          'body'
        ],
        FunctionExpression: [
          'id',
          'params',
          'defaults',
          'rest',
          'body'
        ],
        GeneratorExpression: [
          'blocks',
          'filter',
          'body'
        ],
        Identifier: [],
        IfStatement: [
          'test',
          'consequent',
          'alternate'
        ],
        ImportDeclaration: [
          'specifiers',
          'source'
        ],
        ImportDefaultSpecifier: ['id'],
        ImportNamespaceSpecifier: ['id'],
        ImportSpecifier: [
          'id',
          'name'
        ],
        Literal: [],
        LabeledStatement: [
          'label',
          'body'
        ],
        LogicalExpression: [
          'left',
          'right'
        ],
        MemberExpression: [
          'object',
          'property'
        ],
        MethodDefinition: [
          'key',
          'value'
        ],
        ModuleSpecifier: [],
        NewExpression: [
          'callee',
          'arguments'
        ],
        ObjectExpression: ['properties'],
        ObjectPattern: ['properties'],
        Program: ['body'],
        Property: [
          'key',
          'value'
        ],
        ReturnStatement: ['argument'],
        SequenceExpression: ['expressions'],
        SpreadElement: ['argument'],
        SwitchStatement: [
          'discriminant',
          'cases'
        ],
        SwitchCase: [
          'test',
          'consequent'
        ],
        TaggedTemplateExpression: [
          'tag',
          'quasi'
        ],
        TemplateElement: [],
        TemplateLiteral: [
          'quasis',
          'expressions'
        ],
        ThisExpression: [],
        ThrowStatement: ['argument'],
        TryStatement: [
          'block',
          'handlers',
          'handler',
          'guardedHandlers',
          'finalizer'
        ],
        UnaryExpression: ['argument'],
        UpdateExpression: ['argument'],
        VariableDeclaration: ['declarations'],
        VariableDeclarator: [
          'id',
          'init'
        ],
        WhileStatement: [
          'test',
          'body'
        ],
        WithStatement: [
          'object',
          'body'
        ],
        YieldExpression: ['argument']
      };
      BREAK = {};
      SKIP = {};
      REMOVE = {};
      VisitorOption = {
        Break: BREAK,
        Skip: SKIP,
        Remove: REMOVE
      };
      function Reference(parent, key) {
        this.parent = parent;
        this.key = key;
      }
      Reference.prototype.replace = function replace(node) {
        this.parent[this.key] = node;
      };
      Reference.prototype.remove = function remove() {
        if (isArray(this.parent)) {
          this.parent.splice(this.key, 1);
          return true;
        } else {
          this.replace(null);
          return false;
        }
      };
      function Element(node, path, wrap, ref) {
        this.node = node;
        this.path = path;
        this.wrap = wrap;
        this.ref = ref;
      }
      function Controller() {
      }
      Controller.prototype.path = function path() {
        var i, iz, j, jz, result, element;
        function addToPath(result, path) {
          if (isArray(path)) {
            for (j = 0, jz = path.length; j < jz; ++j) {
              result.push(path[j]);
            }
          } else {
            result.push(path);
          }
        }
        if (!this.__current.path) {
          return null;
        }
        result = [];
        for (i = 2, iz = this.__leavelist.length; i < iz; ++i) {
          element = this.__leavelist[i];
          addToPath(result, element.path);
        }
        addToPath(result, this.__current.path);
        return result;
      };
      Controller.prototype.type = function () {
        var node = this.current();
        return node.type || this.__current.wrap;
      };
      Controller.prototype.parents = function parents() {
        var i, iz, result;
        result = [];
        for (i = 1, iz = this.__leavelist.length; i < iz; ++i) {
          result.push(this.__leavelist[i].node);
        }
        return result;
      };
      Controller.prototype.current = function current() {
        return this.__current.node;
      };
      Controller.prototype.__execute = function __execute(callback, element) {
        var previous, result;
        result = undefined;
        previous = this.__current;
        this.__current = element;
        this.__state = null;
        if (callback) {
          result = callback.call(this, element.node, this.__leavelist[this.__leavelist.length - 1].node);
        }
        this.__current = previous;
        return result;
      };
      Controller.prototype.notify = function notify(flag) {
        this.__state = flag;
      };
      Controller.prototype.skip = function () {
        this.notify(SKIP);
      };
      Controller.prototype['break'] = function () {
        this.notify(BREAK);
      };
      Controller.prototype.remove = function () {
        this.notify(REMOVE);
      };
      Controller.prototype.__initialize = function (root, visitor) {
        this.visitor = visitor;
        this.root = root;
        this.__worklist = [];
        this.__leavelist = [];
        this.__current = null;
        this.__state = null;
        this.__fallback = visitor.fallback === 'iteration';
        this.__keys = VisitorKeys;
        if (visitor.keys) {
          this.__keys = extend(objectCreate(this.__keys), visitor.keys);
        }
      };
      function isNode(node) {
        if (node == null) {
          return false;
        }
        return typeof node === 'object' && typeof node.type === 'string';
      }
      function isProperty(nodeType, key) {
        return (nodeType === Syntax.ObjectExpression || nodeType === Syntax.ObjectPattern) && 'properties' === key;
      }
      Controller.prototype.traverse = function traverse(root, visitor) {
        var worklist, leavelist, element, node, nodeType, ret, key, current, current2, candidates, candidate, sentinel;
        this.__initialize(root, visitor);
        sentinel = {};
        worklist = this.__worklist;
        leavelist = this.__leavelist;
        worklist.push(new Element(root, null, null, null));
        leavelist.push(new Element(null, null, null, null));
        while (worklist.length) {
          element = worklist.pop();
          if (element === sentinel) {
            element = leavelist.pop();
            ret = this.__execute(visitor.leave, element);
            if (this.__state === BREAK || ret === BREAK) {
              return;
            }
            continue;
          }
          if (element.node) {
            ret = this.__execute(visitor.enter, element);
            if (this.__state === BREAK || ret === BREAK) {
              return;
            }
            worklist.push(sentinel);
            leavelist.push(element);
            if (this.__state === SKIP || ret === SKIP) {
              continue;
            }
            node = element.node;
            nodeType = element.wrap || node.type;
            candidates = this.__keys[nodeType];
            if (!candidates) {
              if (this.__fallback) {
                candidates = objectKeys(node);
              } else {
                throw new Error('Unknown node type ' + nodeType + '.');
              }
            }
            current = candidates.length;
            while ((current -= 1) >= 0) {
              key = candidates[current];
              candidate = node[key];
              if (!candidate) {
                continue;
              }
              if (isArray(candidate)) {
                current2 = candidate.length;
                while ((current2 -= 1) >= 0) {
                  if (!candidate[current2]) {
                    continue;
                  }
                  if (isProperty(nodeType, candidates[current])) {
                    element = new Element(candidate[current2], [
                      key,
                      current2
                    ], 'Property', null);
                  } else if (isNode(candidate[current2])) {
                    element = new Element(candidate[current2], [
                      key,
                      current2
                    ], null, null);
                  } else {
                    continue;
                  }
                  worklist.push(element);
                }
              } else if (isNode(candidate)) {
                worklist.push(new Element(candidate, key, null, null));
              }
            }
          }
        }
      };
      Controller.prototype.replace = function replace(root, visitor) {
        function removeElem(element) {
          var i, key, nextElem, parent;
          if (element.ref.remove()) {
            key = element.ref.key;
            parent = element.ref.parent;
            i = worklist.length;
            while (i--) {
              nextElem = worklist[i];
              if (nextElem.ref && nextElem.ref.parent === parent) {
                if (nextElem.ref.key < key) {
                  break;
                }
                --nextElem.ref.key;
              }
            }
          }
        }
        var worklist, leavelist, node, nodeType, target, element, current, current2, candidates, candidate, sentinel, outer, key;
        this.__initialize(root, visitor);
        sentinel = {};
        worklist = this.__worklist;
        leavelist = this.__leavelist;
        outer = { root: root };
        element = new Element(root, null, null, new Reference(outer, 'root'));
        worklist.push(element);
        leavelist.push(element);
        while (worklist.length) {
          element = worklist.pop();
          if (element === sentinel) {
            element = leavelist.pop();
            target = this.__execute(visitor.leave, element);
            if (target !== undefined && target !== BREAK && target !== SKIP && target !== REMOVE) {
              element.ref.replace(target);
            }
            if (this.__state === REMOVE || target === REMOVE) {
              removeElem(element);
            }
            if (this.__state === BREAK || target === BREAK) {
              return outer.root;
            }
            continue;
          }
          target = this.__execute(visitor.enter, element);
          if (target !== undefined && target !== BREAK && target !== SKIP && target !== REMOVE) {
            element.ref.replace(target);
            element.node = target;
          }
          if (this.__state === REMOVE || target === REMOVE) {
            removeElem(element);
            element.node = null;
          }
          if (this.__state === BREAK || target === BREAK) {
            return outer.root;
          }
          node = element.node;
          if (!node) {
            continue;
          }
          worklist.push(sentinel);
          leavelist.push(element);
          if (this.__state === SKIP || target === SKIP) {
            continue;
          }
          nodeType = element.wrap || node.type;
          candidates = this.__keys[nodeType];
          if (!candidates) {
            if (this.__fallback) {
              candidates = objectKeys(node);
            } else {
              throw new Error('Unknown node type ' + nodeType + '.');
            }
          }
          current = candidates.length;
          while ((current -= 1) >= 0) {
            key = candidates[current];
            candidate = node[key];
            if (!candidate) {
              continue;
            }
            if (isArray(candidate)) {
              current2 = candidate.length;
              while ((current2 -= 1) >= 0) {
                if (!candidate[current2]) {
                  continue;
                }
                if (isProperty(nodeType, candidates[current])) {
                  element = new Element(candidate[current2], [
                    key,
                    current2
                  ], 'Property', new Reference(candidate, current2));
                } else if (isNode(candidate[current2])) {
                  element = new Element(candidate[current2], [
                    key,
                    current2
                  ], null, new Reference(candidate, current2));
                } else {
                  continue;
                }
                worklist.push(element);
              }
            } else if (isNode(candidate)) {
              worklist.push(new Element(candidate, key, null, new Reference(node, key)));
            }
          }
        }
        return outer.root;
      };
      function traverse(root, visitor) {
        var controller = new Controller();
        return controller.traverse(root, visitor);
      }
      function replace(root, visitor) {
        var controller = new Controller();
        return controller.replace(root, visitor);
      }
      function extendCommentRange(comment, tokens) {
        var target;
        target = upperBound(tokens, function search(token) {
          return token.range[0] > comment.range[0];
        });
        comment.extendedRange = [
          comment.range[0],
          comment.range[1]
        ];
        if (target !== tokens.length) {
          comment.extendedRange[1] = tokens[target].range[0];
        }
        target -= 1;
        if (target >= 0) {
          comment.extendedRange[0] = tokens[target].range[1];
        }
        return comment;
      }
      function attachComments(tree, providedComments, tokens) {
        var comments = [], comment, len, i, cursor;
        if (!tree.range) {
          throw new Error('attachComments needs range information');
        }
        if (!tokens.length) {
          if (providedComments.length) {
            for (i = 0, len = providedComments.length; i < len; i += 1) {
              comment = deepCopy(providedComments[i]);
              comment.extendedRange = [
                0,
                tree.range[0]
              ];
              comments.push(comment);
            }
            tree.leadingComments = comments;
          }
          return tree;
        }
        for (i = 0, len = providedComments.length; i < len; i += 1) {
          comments.push(extendCommentRange(deepCopy(providedComments[i]), tokens));
        }
        cursor = 0;
        traverse(tree, {
          enter: function (node) {
            var comment;
            while (cursor < comments.length) {
              comment = comments[cursor];
              if (comment.extendedRange[1] > node.range[0]) {
                break;
              }
              if (comment.extendedRange[1] === node.range[0]) {
                if (!node.leadingComments) {
                  node.leadingComments = [];
                }
                node.leadingComments.push(comment);
                comments.splice(cursor, 1);
              } else {
                cursor += 1;
              }
            }
            if (cursor === comments.length) {
              return VisitorOption.Break;
            }
            if (comments[cursor].extendedRange[0] > node.range[1]) {
              return VisitorOption.Skip;
            }
          }
        });
        cursor = 0;
        traverse(tree, {
          leave: function (node) {
            var comment;
            while (cursor < comments.length) {
              comment = comments[cursor];
              if (node.range[1] < comment.extendedRange[0]) {
                break;
              }
              if (node.range[1] === comment.extendedRange[0]) {
                if (!node.trailingComments) {
                  node.trailingComments = [];
                }
                node.trailingComments.push(comment);
                comments.splice(cursor, 1);
              } else {
                cursor += 1;
              }
            }
            if (cursor === comments.length) {
              return VisitorOption.Break;
            }
            if (comments[cursor].extendedRange[0] > node.range[1]) {
              return VisitorOption.Skip;
            }
          }
        });
        return tree;
      }
      exports.version = '1.8.1-dev';
      exports.Syntax = Syntax;
      exports.traverse = traverse;
      exports.replace = replace;
      exports.attachComments = attachComments;
      exports.VisitorKeys = VisitorKeys;
      exports.VisitorOption = VisitorOption;
      exports.Controller = Controller;
      exports.cloneEnvironment = function () {
        return clone({});
      };
      return exports;
    }));
  },
  './node_modules/quickstart/node_modules/escodegen/node_modules/esutils/lib/utils.js': function (require, module, exports, global) {
    (function () {
      'use strict';
      exports.ast = require('./node_modules/quickstart/node_modules/escodegen/node_modules/esutils/lib/ast.js');
      exports.code = require('./node_modules/quickstart/node_modules/escodegen/node_modules/esutils/lib/code.js');
      exports.keyword = require('./node_modules/quickstart/node_modules/escodegen/node_modules/esutils/lib/keyword.js');
    }());
  },
  './node_modules/quickstart/node_modules/escodegen/node_modules/source-map/lib/source-map.js': function (require, module, exports, global) {
    exports.SourceMapGenerator = require('./node_modules/quickstart/node_modules/escodegen/node_modules/source-map/lib/source-map/source-map-generator.js').SourceMapGenerator;
    exports.SourceMapConsumer = require('./node_modules/quickstart/node_modules/escodegen/node_modules/source-map/lib/source-map/source-map-consumer.js').SourceMapConsumer;
    exports.SourceNode = require('./node_modules/quickstart/node_modules/escodegen/node_modules/source-map/lib/source-map/source-node.js').SourceNode;
  },
  './node_modules/quickstart/node_modules/mout/array/indexOf.js': function (require, module, exports, global) {
    function indexOf(arr, item, fromIndex) {
      fromIndex = fromIndex || 0;
      if (arr == null) {
        return -1;
      }
      var len = arr.length, i = fromIndex < 0 ? len + fromIndex : fromIndex;
      while (i < len) {
        if (arr[i] === item) {
          return i;
        }
        i++;
      }
      return -1;
    }
    module.exports = indexOf;
  },
  './node_modules/quickstart/node_modules/promise/core.js': function (require, module, exports, global) {
    'use strict';
    var asap = require('./node_modules/quickstart/node_modules/promise/node_modules/asap/asap.js');
    module.exports = Promise;
    function Promise(fn) {
      if (typeof this !== 'object')
        throw new TypeError('Promises must be constructed via new');
      if (typeof fn !== 'function')
        throw new TypeError('not a function');
      var state = null;
      var value = null;
      var deferreds = [];
      var self = this;
      this.then = function (onFulfilled, onRejected) {
        return new Promise(function (resolve, reject) {
          handle(new Handler(onFulfilled, onRejected, resolve, reject));
        });
      };
      function handle(deferred) {
        if (state === null) {
          deferreds.push(deferred);
          return;
        }
        asap(function () {
          var cb = state ? deferred.onFulfilled : deferred.onRejected;
          if (cb === null) {
            (state ? deferred.resolve : deferred.reject)(value);
            return;
          }
          var ret;
          try {
            ret = cb(value);
          } catch (e) {
            deferred.reject(e);
            return;
          }
          deferred.resolve(ret);
        });
      }
      function resolve(newValue) {
        try {
          if (newValue === self)
            throw new TypeError('A promise cannot be resolved with itself.');
          if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
            var then = newValue.then;
            if (typeof then === 'function') {
              doResolve(then.bind(newValue), resolve, reject);
              return;
            }
          }
          state = true;
          value = newValue;
          finale();
        } catch (e) {
          reject(e);
        }
      }
      function reject(newValue) {
        state = false;
        value = newValue;
        finale();
      }
      function finale() {
        for (var i = 0, len = deferreds.length; i < len; i++)
          handle(deferreds[i]);
        deferreds = null;
      }
      doResolve(fn, resolve, reject);
    }
    function Handler(onFulfilled, onRejected, resolve, reject) {
      this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
      this.onRejected = typeof onRejected === 'function' ? onRejected : null;
      this.resolve = resolve;
      this.reject = reject;
    }
    function doResolve(fn, onFulfilled, onRejected) {
      var done = false;
      try {
        fn(function (value) {
          if (done)
            return;
          done = true;
          onFulfilled(value);
        }, function (reason) {
          if (done)
            return;
          done = true;
          onRejected(reason);
        });
      } catch (ex) {
        if (done)
          return;
        done = true;
        onRejected(ex);
      }
    }
  },
  './node_modules/quickstart/node_modules/mout/function/identity.js': function (require, module, exports, global) {
    function identity(val) {
      return val;
    }
    module.exports = identity;
  },
  './node_modules/quickstart/node_modules/mout/function/prop.js': function (require, module, exports, global) {
    function prop(name) {
      return function (obj) {
        return obj[name];
      };
    }
    module.exports = prop;
  },
  './node_modules/quickstart/node_modules/mout/object/deepMatches.js': function (require, module, exports, global) {
    var forOwn = require('./node_modules/quickstart/node_modules/mout/object/forOwn.js');
    var isArray = require('./node_modules/quickstart/node_modules/mout/lang/isArray.js');
    function containsMatch(array, pattern) {
      var i = -1, length = array.length;
      while (++i < length) {
        if (deepMatches(array[i], pattern)) {
          return true;
        }
      }
      return false;
    }
    function matchArray(target, pattern) {
      var i = -1, patternLength = pattern.length;
      while (++i < patternLength) {
        if (!containsMatch(target, pattern[i])) {
          return false;
        }
      }
      return true;
    }
    function matchObject(target, pattern) {
      var result = true;
      forOwn(pattern, function (val, key) {
        if (!deepMatches(target[key], val)) {
          return result = false;
        }
      });
      return result;
    }
    function deepMatches(target, pattern) {
      if (target && typeof target === 'object') {
        if (isArray(target) && isArray(pattern)) {
          return matchArray(target, pattern);
        } else {
          return matchObject(target, pattern);
        }
      } else {
        return target === pattern;
      }
    }
    module.exports = deepMatches;
  },
  './node_modules/quickstart/node_modules/mout/collection/make_.js': function (require, module, exports, global) {
    var slice = require('./node_modules/quickstart/node_modules/mout/array/slice.js');
    function makeCollectionMethod(arrMethod, objMethod, defaultReturn) {
      return function () {
        var args = slice(arguments);
        if (args[0] == null) {
          return defaultReturn;
        }
        return typeof args[0].length === 'number' ? arrMethod.apply(null, args) : objMethod.apply(null, args);
      };
    }
    module.exports = makeCollectionMethod;
  },
  './node_modules/quickstart/node_modules/mout/lang/isNumber.js': function (require, module, exports, global) {
    var isKind = require('./node_modules/quickstart/node_modules/mout/lang/isKind.js');
    function isNumber(val) {
      return isKind(val, 'Number');
    }
    module.exports = isNumber;
  },
  './node_modules/quickstart/node_modules/mout/lang/isKind.js': function (require, module, exports, global) {
    var kindOf = require('./node_modules/quickstart/node_modules/mout/lang/kindOf.js');
    function isKind(val, kind) {
      return kindOf(val) === kind;
    }
    module.exports = isKind;
  },
  './node_modules/quickstart/node_modules/agent/index.js': function (require, module, exports, global) {
    'use strict';
    var prime = require('./node_modules/quickstart/node_modules/prime/index.js'), Emitter = require('./node_modules/quickstart/node_modules/prime/emitter.js');
    var isObject = require('./node_modules/quickstart/node_modules/mout/lang/isObject.js'), isString = require('./node_modules/quickstart/node_modules/mout/lang/isString.js'), isArray = require('./node_modules/quickstart/node_modules/mout/lang/isArray.js'), isFunction = require('./node_modules/quickstart/node_modules/mout/lang/isFunction.js'), trim = require('./node_modules/quickstart/node_modules/mout/string/trim.js'), upperCase = require('./node_modules/quickstart/node_modules/mout/string/upperCase.js'), forIn = require('./node_modules/quickstart/node_modules/mout/object/forIn.js'), mixIn = require('./node_modules/quickstart/node_modules/mout/object/mixIn.js'), remove = require('./node_modules/quickstart/node_modules/mout/array/remove.js'), forEach = require('./node_modules/quickstart/node_modules/mout/array/forEach.js');
    var capitalize = function (str) {
      return str.replace(/\b[a-z]/g, upperCase);
    };
    var getRequest = function () {
      var XMLHTTP = function () {
          return new XMLHttpRequest();
        }, MSXML2 = function () {
          return new ActiveXObject('MSXML2.XMLHTTP');
        }, MSXML = function () {
          return new ActiveXObject('Microsoft.XMLHTTP');
        };
      try {
        XMLHTTP();
        return XMLHTTP;
      } catch (e) {
      }
      try {
        MSXML2();
        return MSXML2;
      } catch (e) {
      }
      try {
        MSXML();
        return MSXML;
      } catch (e) {
      }
      return null;
    }();
    var encodeJSON = function (object) {
      if (object == null)
        return '';
      if (object.toJSON)
        return object.toJSON();
      return JSON.stringify(object);
    };
    var encodeQueryString = function (object, base) {
      if (object == null)
        return '';
      if (object.toQueryString)
        return object.toQueryString();
      var queryString = [];
      forIn(object, function (value, key) {
        if (base)
          key = base + '[' + key + ']';
        var result;
        if (value == null)
          return;
        if (isArray(value)) {
          var qs = {};
          for (var i = 0; i < value.length; i++)
            qs[i] = value[i];
          result = encodeQueryString(qs, key);
        } else if (isObject(value)) {
          result = encodeQueryString(value, key);
        } else {
          result = key + '=' + encodeURIComponent(value);
        }
        queryString.push(result);
      });
      return queryString.join('&');
    };
    var decodeJSON = JSON.parse;
    var decodeQueryString = function (params) {
      var pairs = params.split('&'), result = {};
      for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i].split('='), key = decodeURIComponent(pair[0]), value = decodeURIComponent(pair[1]), isArray = /\[\]$/.test(key), dictMatch = key.match(/^(.+)\[([^\]]+)\]$/);
        if (dictMatch) {
          key = dictMatch[1];
          var subkey = dictMatch[2];
          result[key] = result[key] || {};
          result[key][subkey] = value;
        } else if (isArray) {
          key = key.substring(0, key.length - 2);
          result[key] = result[key] || [];
          result[key].push(value);
        } else {
          result[key] = value;
        }
      }
      return result;
    };
    var encoders = {
      'application/json': encodeJSON,
      'application/x-www-form-urlencoded': encodeQueryString
    };
    var decoders = {
      'application/json': decodeJSON,
      'application/x-www-form-urlencoded': decodeQueryString
    };
    var parseHeader = function (str) {
      var lines = str.split(/\r?\n/), fields = {};
      lines.pop();
      for (var i = 0, l = lines.length; i < l; ++i) {
        var line = lines[i], index = line.indexOf(':'), field = capitalize(line.slice(0, index)), value = trim(line.slice(index + 1));
        fields[field] = value;
      }
      return fields;
    };
    var REQUESTS = 0, Q = [];
    var Request = prime({
      constructor: function Request() {
        this._header = { 'Content-Type': 'application/x-www-form-urlencoded' };
      },
      header: function (name, value) {
        if (isObject(name))
          for (var key in name)
            this.header(key, name[key]);
        else if (!arguments.length)
          return this._header;
        else if (arguments.length === 1)
          return this._header[capitalize(name)];
        else if (arguments.length === 2) {
          if (value == null)
            delete this._header[capitalize(name)];
          else
            this._header[capitalize(name)] = value;
        }
        return this;
      },
      running: function () {
        return !!this._running;
      },
      abort: function () {
        if (this._queued) {
          remove(Q, this._queued);
          delete this._queued;
        }
        if (this._xhr) {
          this._xhr.abort();
          this._end();
        }
        return this;
      },
      method: function (m) {
        if (!arguments.length)
          return this._method;
        this._method = m.toUpperCase();
        return this;
      },
      data: function (d) {
        if (!arguments.length)
          return this._data;
        this._data = d;
        return this;
      },
      url: function (u) {
        if (!arguments.length)
          return this._url;
        this._url = u;
        return this;
      },
      user: function (u) {
        if (!arguments.length)
          return this._user;
        this._user = u;
        return this;
      },
      password: function (p) {
        if (!arguments.length)
          return this._password;
        this._password = p;
        return this;
      },
      _send: function (method, url, data, header, user, password, callback) {
        var self = this;
        if (REQUESTS === agent.MAX_REQUESTS)
          return Q.unshift(this._queued = function () {
            delete self._queued;
            self._send(method, url, data, header, user, password, callback);
          });
        REQUESTS++;
        var xhr = this._xhr = agent.getRequest();
        if (xhr.addEventListener)
          forEach([
            'progress',
            'load',
            'error',
            'abort',
            'loadend'
          ], function (method) {
            xhr.addEventListener(method, function (event) {
              self.emit(method, event);
            }, false);
          });
        xhr.open(method, url, true, user, password);
        if (user != null && 'withCredentials' in xhr)
          xhr.withCredentials = true;
        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
            var status = xhr.status;
            var response = new Response(xhr.responseText, status, parseHeader(xhr.getAllResponseHeaders()));
            var error = response.error ? new Error(method + ' ' + url + ' ' + status) : null;
            self._end();
            callback(error, response);
          }
        };
        for (var field in header)
          xhr.setRequestHeader(field, header[field]);
        xhr.send(data || null);
      },
      _end: function () {
        this._xhr.onreadystatechange = function () {
        };
        delete this._xhr;
        delete this._running;
        REQUESTS--;
        var queued = Q.pop();
        if (queued)
          queued();
      },
      send: function (callback) {
        if (this._running)
          this.abort();
        this._running = true;
        if (!callback)
          callback = function () {
          };
        var method = this._method || 'POST', data = this._data || null, url = this._url, user = this._user || null, password = this._password || null;
        if (data && !isString(data)) {
          var contentType = this._header['Content-Type'].split(/ *; */).shift(), encode = encoders[contentType];
          if (encode)
            data = encode(data);
        }
        if (/GET|HEAD/.test(method) && data)
          url += (url.indexOf('?') > -1 ? '&' : '?') + data;
        var header = mixIn({}, this._header);
        this._send(method, url, data, header, user, password, callback);
        return this;
      }
    });
    Request.implement(new Emitter());
    var Response = prime({
      constructor: function Response(text, status, header) {
        this.text = text;
        this.status = status;
        this.header = header;
        var t = status / 100 | 0;
        this.info = t === 1;
        this.ok = t === 2;
        this.clientError = t === 4;
        this.serverError = t === 5;
        this.error = t === 4 || t === 5;
        var length = '' + header['Content-Length'];
        this.accepted = status === 202;
        this.noContent = length === '0' || status === 204 || status === 1223;
        this.badRequest = status === 400;
        this.unauthorized = status === 401;
        this.notAcceptable = status === 406;
        this.notFound = status === 404;
        var contentType = header['Content-Type'] ? header['Content-Type'].split(/ *; */).shift() : '', decode;
        if (!this.noContent)
          decode = decoders[contentType];
        this.body = decode ? decode(this.text) : this.text;
      }
    });
    var methods = 'get|post|put|delete|head|patch|options', rMethods = new RegExp('^' + methods + '$', 'i');
    var agent = function (method, url, data, callback) {
      var request = new Request();
      if (!arguments.length)
        return request;
      if (!rMethods.test(method)) {
        callback = data;
        data = url;
        url = method;
        method = 'post';
      }
      if (isFunction(data)) {
        callback = data;
        data = null;
      }
      request.method(method);
      if (url)
        request.url(url);
      if (data)
        request.data(data);
      if (callback)
        request.send(callback);
      return request;
    };
    agent.encoder = function (ct, encode) {
      if (arguments.length === 1)
        return encoders[ct];
      encoders[ct] = encode;
      return agent;
    };
    agent.decoder = function (ct, decode) {
      if (arguments.length === 1)
        return decoders[ct];
      decoders[ct] = decode;
      return agent;
    };
    forEach(methods.split('|'), function (method) {
      agent[method] = function (url, data, callback) {
        return agent(method, url, data, callback);
      };
    });
    agent.MAX_REQUESTS = Infinity;
    agent.getRequest = getRequest;
    agent.Request = Request;
    agent.Response = Response;
    module.exports = agent;
  },
  './node_modules/quickstart/node_modules/microseconds/now.js': function (require, module, exports, global) {
    var process = require('./node_modules/quickstart/browser/process.js');
    'use strict';
    var now;
    if (global.process && process.hrtime) {
      var hrtime = process.hrtime;
      now = function () {
        var hr = hrtime();
        return (hr[0] * 1000000000 + hr[1]) / 1000;
      };
    } else if (global.performance && performance.now) {
      var start = performance.timing && performance.timing.navigationStart || Date.now();
      now = function () {
        return (start + performance.now()) * 1000;
      };
    } else {
      now = function () {
        return Date.now() * 1000;
      };
    }
    module.exports = now;
  },
  './node_modules/quickstart/node_modules/microseconds/parse.js': function (require, module, exports, global) {
    'use strict';
    var toString = function () {
      var microseconds = this.microseconds, milliseconds = this.milliseconds, seconds = this.seconds, minutes = this.minutes, hours = this.hours, days = this.days;
      var parts = [
        {
          name: 'day',
          value: days
        },
        {
          name: 'hour',
          value: hours
        },
        {
          name: 'minute',
          value: minutes
        },
        {
          name: 'second',
          value: seconds
        },
        {
          name: 'millisecond',
          value: milliseconds
        },
        {
          name: 'microsecond',
          value: microseconds
        }
      ];
      var time = [];
      for (var i = 0; i < parts.length; i++) {
        var part = parts[i];
        if (part.value === 0) {
          if (!time.length)
            continue;
          var broken = false;
          for (var j = i; j < parts.length; j++) {
            var p = parts[j];
            if (p.value) {
              broken = true;
              break;
            }
          }
          if (!broken)
            break;
        }
        time.push(part.value, part.value === 1 ? part.name : part.name + 's');
      }
      return time.join(' ');
    };
    module.exports = function parse(nano) {
      var ms = nano / 1000;
      var ss = ms / 1000;
      var mm = ss / 60;
      var hh = mm / 60;
      var dd = hh / 24;
      var microseconds = Math.round(ms % 1 * 1000);
      var milliseconds = Math.floor(ms % 1000);
      var seconds = Math.floor(ss % 60);
      var minutes = Math.floor(mm % 60);
      var hours = Math.floor(hh % 24);
      var days = Math.floor(dd);
      return {
        microseconds: microseconds,
        milliseconds: milliseconds,
        seconds: seconds,
        minutes: minutes,
        hours: hours,
        days: days,
        toString: toString
      };
    };
  },
  './node_modules/quickstart/node_modules/mout/lang/createObject.js': function (require, module, exports, global) {
    var mixIn = require('./node_modules/quickstart/node_modules/mout/object/mixIn.js');
    function createObject(parent, props) {
      function F() {
      }
      F.prototype = parent;
      return mixIn(new F(), props);
    }
    module.exports = createObject;
  },
  './node_modules/quickstart/node_modules/mout/lang/kindOf.js': function (require, module, exports, global) {
    var _rKind = /^\[object (.*)\]$/, _toString = Object.prototype.toString, UNDEF;
    function kindOf(val) {
      if (val === null) {
        return 'Null';
      } else if (val === UNDEF) {
        return 'Undefined';
      } else {
        return _rKind.exec(_toString.call(val))[1];
      }
    }
    module.exports = kindOf;
  },
  './node_modules/quickstart/node_modules/estraverse/estraverse.js': function (require, module, exports, global) {
    (function (root, factory) {
      'use strict';
      if (typeof define === 'function' && define.amd) {
        define(['exports'], factory);
      } else if (typeof exports !== 'undefined') {
        factory(exports);
      } else {
        factory(root.estraverse = {});
      }
    }(this, function (exports) {
      'use strict';
      var Syntax, isArray, VisitorOption, VisitorKeys, BREAK, SKIP;
      Syntax = {
        AssignmentExpression: 'AssignmentExpression',
        ArrayExpression: 'ArrayExpression',
        ArrayPattern: 'ArrayPattern',
        ArrowFunctionExpression: 'ArrowFunctionExpression',
        BlockStatement: 'BlockStatement',
        BinaryExpression: 'BinaryExpression',
        BreakStatement: 'BreakStatement',
        CallExpression: 'CallExpression',
        CatchClause: 'CatchClause',
        ClassBody: 'ClassBody',
        ClassDeclaration: 'ClassDeclaration',
        ClassExpression: 'ClassExpression',
        ConditionalExpression: 'ConditionalExpression',
        ContinueStatement: 'ContinueStatement',
        DebuggerStatement: 'DebuggerStatement',
        DirectiveStatement: 'DirectiveStatement',
        DoWhileStatement: 'DoWhileStatement',
        EmptyStatement: 'EmptyStatement',
        ExpressionStatement: 'ExpressionStatement',
        ForStatement: 'ForStatement',
        ForInStatement: 'ForInStatement',
        FunctionDeclaration: 'FunctionDeclaration',
        FunctionExpression: 'FunctionExpression',
        Identifier: 'Identifier',
        IfStatement: 'IfStatement',
        Literal: 'Literal',
        LabeledStatement: 'LabeledStatement',
        LogicalExpression: 'LogicalExpression',
        MemberExpression: 'MemberExpression',
        MethodDefinition: 'MethodDefinition',
        NewExpression: 'NewExpression',
        ObjectExpression: 'ObjectExpression',
        ObjectPattern: 'ObjectPattern',
        Program: 'Program',
        Property: 'Property',
        ReturnStatement: 'ReturnStatement',
        SequenceExpression: 'SequenceExpression',
        SwitchStatement: 'SwitchStatement',
        SwitchCase: 'SwitchCase',
        ThisExpression: 'ThisExpression',
        ThrowStatement: 'ThrowStatement',
        TryStatement: 'TryStatement',
        UnaryExpression: 'UnaryExpression',
        UpdateExpression: 'UpdateExpression',
        VariableDeclaration: 'VariableDeclaration',
        VariableDeclarator: 'VariableDeclarator',
        WhileStatement: 'WhileStatement',
        WithStatement: 'WithStatement',
        YieldExpression: 'YieldExpression'
      };
      function ignoreJSHintError() {
      }
      isArray = Array.isArray;
      if (!isArray) {
        isArray = function isArray(array) {
          return Object.prototype.toString.call(array) === '[object Array]';
        };
      }
      function deepCopy(obj) {
        var ret = {}, key, val;
        for (key in obj) {
          if (obj.hasOwnProperty(key)) {
            val = obj[key];
            if (typeof val === 'object' && val !== null) {
              ret[key] = deepCopy(val);
            } else {
              ret[key] = val;
            }
          }
        }
        return ret;
      }
      function shallowCopy(obj) {
        var ret = {}, key;
        for (key in obj) {
          if (obj.hasOwnProperty(key)) {
            ret[key] = obj[key];
          }
        }
        return ret;
      }
      ignoreJSHintError(shallowCopy);
      function upperBound(array, func) {
        var diff, len, i, current;
        len = array.length;
        i = 0;
        while (len) {
          diff = len >>> 1;
          current = i + diff;
          if (func(array[current])) {
            len = diff;
          } else {
            i = current + 1;
            len -= diff + 1;
          }
        }
        return i;
      }
      function lowerBound(array, func) {
        var diff, len, i, current;
        len = array.length;
        i = 0;
        while (len) {
          diff = len >>> 1;
          current = i + diff;
          if (func(array[current])) {
            i = current + 1;
            len -= diff + 1;
          } else {
            len = diff;
          }
        }
        return i;
      }
      ignoreJSHintError(lowerBound);
      VisitorKeys = {
        AssignmentExpression: [
          'left',
          'right'
        ],
        ArrayExpression: ['elements'],
        ArrayPattern: ['elements'],
        ArrowFunctionExpression: [
          'params',
          'defaults',
          'rest',
          'body'
        ],
        BlockStatement: ['body'],
        BinaryExpression: [
          'left',
          'right'
        ],
        BreakStatement: ['label'],
        CallExpression: [
          'callee',
          'arguments'
        ],
        CatchClause: [
          'param',
          'body'
        ],
        ClassBody: ['body'],
        ClassDeclaration: [
          'id',
          'body',
          'superClass'
        ],
        ClassExpression: [
          'id',
          'body',
          'superClass'
        ],
        ConditionalExpression: [
          'test',
          'consequent',
          'alternate'
        ],
        ContinueStatement: ['label'],
        DebuggerStatement: [],
        DirectiveStatement: [],
        DoWhileStatement: [
          'body',
          'test'
        ],
        EmptyStatement: [],
        ExpressionStatement: ['expression'],
        ForStatement: [
          'init',
          'test',
          'update',
          'body'
        ],
        ForInStatement: [
          'left',
          'right',
          'body'
        ],
        ForOfStatement: [
          'left',
          'right',
          'body'
        ],
        FunctionDeclaration: [
          'id',
          'params',
          'defaults',
          'rest',
          'body'
        ],
        FunctionExpression: [
          'id',
          'params',
          'defaults',
          'rest',
          'body'
        ],
        Identifier: [],
        IfStatement: [
          'test',
          'consequent',
          'alternate'
        ],
        Literal: [],
        LabeledStatement: [
          'label',
          'body'
        ],
        LogicalExpression: [
          'left',
          'right'
        ],
        MemberExpression: [
          'object',
          'property'
        ],
        MethodDefinition: [
          'key',
          'value'
        ],
        NewExpression: [
          'callee',
          'arguments'
        ],
        ObjectExpression: ['properties'],
        ObjectPattern: ['properties'],
        Program: ['body'],
        Property: [
          'key',
          'value'
        ],
        ReturnStatement: ['argument'],
        SequenceExpression: ['expressions'],
        SwitchStatement: [
          'discriminant',
          'cases'
        ],
        SwitchCase: [
          'test',
          'consequent'
        ],
        ThisExpression: [],
        ThrowStatement: ['argument'],
        TryStatement: [
          'block',
          'handlers',
          'handler',
          'guardedHandlers',
          'finalizer'
        ],
        UnaryExpression: ['argument'],
        UpdateExpression: ['argument'],
        VariableDeclaration: ['declarations'],
        VariableDeclarator: [
          'id',
          'init'
        ],
        WhileStatement: [
          'test',
          'body'
        ],
        WithStatement: [
          'object',
          'body'
        ],
        YieldExpression: ['argument']
      };
      BREAK = {};
      SKIP = {};
      VisitorOption = {
        Break: BREAK,
        Skip: SKIP
      };
      function Reference(parent, key) {
        this.parent = parent;
        this.key = key;
      }
      Reference.prototype.replace = function replace(node) {
        this.parent[this.key] = node;
      };
      function Element(node, path, wrap, ref) {
        this.node = node;
        this.path = path;
        this.wrap = wrap;
        this.ref = ref;
      }
      function Controller() {
      }
      Controller.prototype.path = function path() {
        var i, iz, j, jz, result, element;
        function addToPath(result, path) {
          if (isArray(path)) {
            for (j = 0, jz = path.length; j < jz; ++j) {
              result.push(path[j]);
            }
          } else {
            result.push(path);
          }
        }
        if (!this.__current.path) {
          return null;
        }
        result = [];
        for (i = 2, iz = this.__leavelist.length; i < iz; ++i) {
          element = this.__leavelist[i];
          addToPath(result, element.path);
        }
        addToPath(result, this.__current.path);
        return result;
      };
      Controller.prototype.parents = function parents() {
        var i, iz, result;
        result = [];
        for (i = 1, iz = this.__leavelist.length; i < iz; ++i) {
          result.push(this.__leavelist[i].node);
        }
        return result;
      };
      Controller.prototype.current = function current() {
        return this.__current.node;
      };
      Controller.prototype.__execute = function __execute(callback, element) {
        var previous, result;
        result = undefined;
        previous = this.__current;
        this.__current = element;
        this.__state = null;
        if (callback) {
          result = callback.call(this, element.node, this.__leavelist[this.__leavelist.length - 1].node);
        }
        this.__current = previous;
        return result;
      };
      Controller.prototype.notify = function notify(flag) {
        this.__state = flag;
      };
      Controller.prototype.skip = function () {
        this.notify(SKIP);
      };
      Controller.prototype['break'] = function () {
        this.notify(BREAK);
      };
      Controller.prototype.__initialize = function (root, visitor) {
        this.visitor = visitor;
        this.root = root;
        this.__worklist = [];
        this.__leavelist = [];
        this.__current = null;
        this.__state = null;
      };
      Controller.prototype.traverse = function traverse(root, visitor) {
        var worklist, leavelist, element, node, nodeType, ret, key, current, current2, candidates, candidate, sentinel;
        this.__initialize(root, visitor);
        sentinel = {};
        worklist = this.__worklist;
        leavelist = this.__leavelist;
        worklist.push(new Element(root, null, null, null));
        leavelist.push(new Element(null, null, null, null));
        while (worklist.length) {
          element = worklist.pop();
          if (element === sentinel) {
            element = leavelist.pop();
            ret = this.__execute(visitor.leave, element);
            if (this.__state === BREAK || ret === BREAK) {
              return;
            }
            continue;
          }
          if (element.node) {
            ret = this.__execute(visitor.enter, element);
            if (this.__state === BREAK || ret === BREAK) {
              return;
            }
            worklist.push(sentinel);
            leavelist.push(element);
            if (this.__state === SKIP || ret === SKIP) {
              continue;
            }
            node = element.node;
            nodeType = element.wrap || node.type;
            candidates = VisitorKeys[nodeType];
            current = candidates.length;
            while ((current -= 1) >= 0) {
              key = candidates[current];
              candidate = node[key];
              if (!candidate) {
                continue;
              }
              if (!isArray(candidate)) {
                worklist.push(new Element(candidate, key, null, null));
                continue;
              }
              current2 = candidate.length;
              while ((current2 -= 1) >= 0) {
                if (!candidate[current2]) {
                  continue;
                }
                if ((nodeType === Syntax.ObjectExpression || nodeType === Syntax.ObjectPattern) && 'properties' === candidates[current]) {
                  element = new Element(candidate[current2], [
                    key,
                    current2
                  ], 'Property', null);
                } else {
                  element = new Element(candidate[current2], [
                    key,
                    current2
                  ], null, null);
                }
                worklist.push(element);
              }
            }
          }
        }
      };
      Controller.prototype.replace = function replace(root, visitor) {
        var worklist, leavelist, node, nodeType, target, element, current, current2, candidates, candidate, sentinel, outer, key;
        this.__initialize(root, visitor);
        sentinel = {};
        worklist = this.__worklist;
        leavelist = this.__leavelist;
        outer = { root: root };
        element = new Element(root, null, null, new Reference(outer, 'root'));
        worklist.push(element);
        leavelist.push(element);
        while (worklist.length) {
          element = worklist.pop();
          if (element === sentinel) {
            element = leavelist.pop();
            target = this.__execute(visitor.leave, element);
            if (target !== undefined && target !== BREAK && target !== SKIP) {
              element.ref.replace(target);
            }
            if (this.__state === BREAK || target === BREAK) {
              return outer.root;
            }
            continue;
          }
          target = this.__execute(visitor.enter, element);
          if (target !== undefined && target !== BREAK && target !== SKIP) {
            element.ref.replace(target);
            element.node = target;
          }
          if (this.__state === BREAK || target === BREAK) {
            return outer.root;
          }
          node = element.node;
          if (!node) {
            continue;
          }
          worklist.push(sentinel);
          leavelist.push(element);
          if (this.__state === SKIP || target === SKIP) {
            continue;
          }
          nodeType = element.wrap || node.type;
          candidates = VisitorKeys[nodeType];
          current = candidates.length;
          while ((current -= 1) >= 0) {
            key = candidates[current];
            candidate = node[key];
            if (!candidate) {
              continue;
            }
            if (!isArray(candidate)) {
              worklist.push(new Element(candidate, key, null, new Reference(node, key)));
              continue;
            }
            current2 = candidate.length;
            while ((current2 -= 1) >= 0) {
              if (!candidate[current2]) {
                continue;
              }
              if (nodeType === Syntax.ObjectExpression && 'properties' === candidates[current]) {
                element = new Element(candidate[current2], [
                  key,
                  current2
                ], 'Property', new Reference(candidate, current2));
              } else {
                element = new Element(candidate[current2], [
                  key,
                  current2
                ], null, new Reference(candidate, current2));
              }
              worklist.push(element);
            }
          }
        }
        return outer.root;
      };
      function traverse(root, visitor) {
        var controller = new Controller();
        return controller.traverse(root, visitor);
      }
      function replace(root, visitor) {
        var controller = new Controller();
        return controller.replace(root, visitor);
      }
      function extendCommentRange(comment, tokens) {
        var target;
        target = upperBound(tokens, function search(token) {
          return token.range[0] > comment.range[0];
        });
        comment.extendedRange = [
          comment.range[0],
          comment.range[1]
        ];
        if (target !== tokens.length) {
          comment.extendedRange[1] = tokens[target].range[0];
        }
        target -= 1;
        if (target >= 0) {
          comment.extendedRange[0] = tokens[target].range[1];
        }
        return comment;
      }
      function attachComments(tree, providedComments, tokens) {
        var comments = [], comment, len, i, cursor;
        if (!tree.range) {
          throw new Error('attachComments needs range information');
        }
        if (!tokens.length) {
          if (providedComments.length) {
            for (i = 0, len = providedComments.length; i < len; i += 1) {
              comment = deepCopy(providedComments[i]);
              comment.extendedRange = [
                0,
                tree.range[0]
              ];
              comments.push(comment);
            }
            tree.leadingComments = comments;
          }
          return tree;
        }
        for (i = 0, len = providedComments.length; i < len; i += 1) {
          comments.push(extendCommentRange(deepCopy(providedComments[i]), tokens));
        }
        cursor = 0;
        traverse(tree, {
          enter: function (node) {
            var comment;
            while (cursor < comments.length) {
              comment = comments[cursor];
              if (comment.extendedRange[1] > node.range[0]) {
                break;
              }
              if (comment.extendedRange[1] === node.range[0]) {
                if (!node.leadingComments) {
                  node.leadingComments = [];
                }
                node.leadingComments.push(comment);
                comments.splice(cursor, 1);
              } else {
                cursor += 1;
              }
            }
            if (cursor === comments.length) {
              return VisitorOption.Break;
            }
            if (comments[cursor].extendedRange[0] > node.range[1]) {
              return VisitorOption.Skip;
            }
          }
        });
        cursor = 0;
        traverse(tree, {
          leave: function (node) {
            var comment;
            while (cursor < comments.length) {
              comment = comments[cursor];
              if (node.range[1] < comment.extendedRange[0]) {
                break;
              }
              if (node.range[1] === comment.extendedRange[0]) {
                if (!node.trailingComments) {
                  node.trailingComments = [];
                }
                node.trailingComments.push(comment);
                comments.splice(cursor, 1);
              } else {
                cursor += 1;
              }
            }
            if (cursor === comments.length) {
              return VisitorOption.Break;
            }
            if (comments[cursor].extendedRange[0] > node.range[1]) {
              return VisitorOption.Skip;
            }
          }
        });
        return tree;
      }
      exports.version = '1.5.1-dev';
      exports.Syntax = Syntax;
      exports.traverse = traverse;
      exports.replace = replace;
      exports.attachComments = attachComments;
      exports.VisitorKeys = VisitorKeys;
      exports.VisitorOption = VisitorOption;
      exports.Controller = Controller;
    }));
  },
  './node_modules/quickstart/node_modules/escodegen/node_modules/esutils/lib/ast.js': function (require, module, exports, global) {
    (function () {
      'use strict';
      function isExpression(node) {
        if (node == null) {
          return false;
        }
        switch (node.type) {
        case 'ArrayExpression':
        case 'AssignmentExpression':
        case 'BinaryExpression':
        case 'CallExpression':
        case 'ConditionalExpression':
        case 'FunctionExpression':
        case 'Identifier':
        case 'Literal':
        case 'LogicalExpression':
        case 'MemberExpression':
        case 'NewExpression':
        case 'ObjectExpression':
        case 'SequenceExpression':
        case 'ThisExpression':
        case 'UnaryExpression':
        case 'UpdateExpression':
          return true;
        }
        return false;
      }
      function isIterationStatement(node) {
        if (node == null) {
          return false;
        }
        switch (node.type) {
        case 'DoWhileStatement':
        case 'ForInStatement':
        case 'ForStatement':
        case 'WhileStatement':
          return true;
        }
        return false;
      }
      function isStatement(node) {
        if (node == null) {
          return false;
        }
        switch (node.type) {
        case 'BlockStatement':
        case 'BreakStatement':
        case 'ContinueStatement':
        case 'DebuggerStatement':
        case 'DoWhileStatement':
        case 'EmptyStatement':
        case 'ExpressionStatement':
        case 'ForInStatement':
        case 'ForStatement':
        case 'IfStatement':
        case 'LabeledStatement':
        case 'ReturnStatement':
        case 'SwitchStatement':
        case 'ThrowStatement':
        case 'TryStatement':
        case 'VariableDeclaration':
        case 'WhileStatement':
        case 'WithStatement':
          return true;
        }
        return false;
      }
      function isSourceElement(node) {
        return isStatement(node) || node != null && node.type === 'FunctionDeclaration';
      }
      function trailingStatement(node) {
        switch (node.type) {
        case 'IfStatement':
          if (node.alternate != null) {
            return node.alternate;
          }
          return node.consequent;
        case 'LabeledStatement':
        case 'ForStatement':
        case 'ForInStatement':
        case 'WhileStatement':
        case 'WithStatement':
          return node.body;
        }
        return null;
      }
      function isProblematicIfStatement(node) {
        var current;
        if (node.type !== 'IfStatement') {
          return false;
        }
        if (node.alternate == null) {
          return false;
        }
        current = node.consequent;
        do {
          if (current.type === 'IfStatement') {
            if (current.alternate == null) {
              return true;
            }
          }
          current = trailingStatement(current);
        } while (current);
        return false;
      }
      module.exports = {
        isExpression: isExpression,
        isStatement: isStatement,
        isIterationStatement: isIterationStatement,
        isSourceElement: isSourceElement,
        isProblematicIfStatement: isProblematicIfStatement,
        trailingStatement: trailingStatement
      };
    }());
  },
  './node_modules/quickstart/node_modules/escodegen/node_modules/esutils/lib/code.js': function (require, module, exports, global) {
    (function () {
      'use strict';
      var Regex, NON_ASCII_WHITESPACES;
      Regex = {
        NonAsciiIdentifierStart: new RegExp('[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F0\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA697\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]'),
        NonAsciiIdentifierPart: new RegExp('[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0\u08A2-\u08AC\u08E4-\u08FE\u0900-\u0963\u0966-\u096F\u0971-\u0977\u0979-\u097F\u0981-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C01-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58\u0C59\u0C60-\u0C63\u0C66-\u0C6F\u0C82\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D02\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D57\u0D60-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F0\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191C\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19D9\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1CD0-\u1CD2\u1CD4-\u1CF6\u1D00-\u1DE6\u1DFC-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u2E2F\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099\u309A\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA697\uA69F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA827\uA840-\uA873\uA880-\uA8C4\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A\uAA7B\uAA80-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE26\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]')
      };
      function isDecimalDigit(ch) {
        return ch >= 48 && ch <= 57;
      }
      function isHexDigit(ch) {
        return isDecimalDigit(ch) || 97 <= ch && ch <= 102 || 65 <= ch && ch <= 70;
      }
      function isOctalDigit(ch) {
        return ch >= 48 && ch <= 55;
      }
      NON_ASCII_WHITESPACES = [
        5760,
        6158,
        8192,
        8193,
        8194,
        8195,
        8196,
        8197,
        8198,
        8199,
        8200,
        8201,
        8202,
        8239,
        8287,
        12288,
        65279
      ];
      function isWhiteSpace(ch) {
        return ch === 32 || ch === 9 || ch === 11 || ch === 12 || ch === 160 || ch >= 5760 && NON_ASCII_WHITESPACES.indexOf(ch) >= 0;
      }
      function isLineTerminator(ch) {
        return ch === 10 || ch === 13 || ch === 8232 || ch === 8233;
      }
      function isIdentifierStart(ch) {
        return ch >= 97 && ch <= 122 || ch >= 65 && ch <= 90 || ch === 36 || ch === 95 || ch === 92 || ch >= 128 && Regex.NonAsciiIdentifierStart.test(String.fromCharCode(ch));
      }
      function isIdentifierPart(ch) {
        return ch >= 97 && ch <= 122 || ch >= 65 && ch <= 90 || ch >= 48 && ch <= 57 || ch === 36 || ch === 95 || ch === 92 || ch >= 128 && Regex.NonAsciiIdentifierPart.test(String.fromCharCode(ch));
      }
      module.exports = {
        isDecimalDigit: isDecimalDigit,
        isHexDigit: isHexDigit,
        isOctalDigit: isOctalDigit,
        isWhiteSpace: isWhiteSpace,
        isLineTerminator: isLineTerminator,
        isIdentifierStart: isIdentifierStart,
        isIdentifierPart: isIdentifierPart
      };
    }());
  },
  './node_modules/quickstart/node_modules/escodegen/node_modules/esutils/lib/keyword.js': function (require, module, exports, global) {
    (function () {
      'use strict';
      var code = require('./node_modules/quickstart/node_modules/escodegen/node_modules/esutils/lib/code.js');
      function isStrictModeReservedWordES6(id) {
        switch (id) {
        case 'implements':
        case 'interface':
        case 'package':
        case 'private':
        case 'protected':
        case 'public':
        case 'static':
        case 'let':
          return true;
        default:
          return false;
        }
      }
      function isKeywordES5(id, strict) {
        if (!strict && id === 'yield') {
          return false;
        }
        return isKeywordES6(id, strict);
      }
      function isKeywordES6(id, strict) {
        if (strict && isStrictModeReservedWordES6(id)) {
          return true;
        }
        switch (id.length) {
        case 2:
          return id === 'if' || id === 'in' || id === 'do';
        case 3:
          return id === 'var' || id === 'for' || id === 'new' || id === 'try';
        case 4:
          return id === 'this' || id === 'else' || id === 'case' || id === 'void' || id === 'with' || id === 'enum';
        case 5:
          return id === 'while' || id === 'break' || id === 'catch' || id === 'throw' || id === 'const' || id === 'yield' || id === 'class' || id === 'super';
        case 6:
          return id === 'return' || id === 'typeof' || id === 'delete' || id === 'switch' || id === 'export' || id === 'import';
        case 7:
          return id === 'default' || id === 'finally' || id === 'extends';
        case 8:
          return id === 'function' || id === 'continue' || id === 'debugger';
        case 10:
          return id === 'instanceof';
        default:
          return false;
        }
      }
      function isReservedWordES5(id, strict) {
        return id === 'null' || id === 'true' || id === 'false' || isKeywordES5(id, strict);
      }
      function isReservedWordES6(id, strict) {
        return id === 'null' || id === 'true' || id === 'false' || isKeywordES6(id, strict);
      }
      function isRestrictedWord(id) {
        return id === 'eval' || id === 'arguments';
      }
      function isIdentifierName(id) {
        var i, iz, ch;
        if (id.length === 0) {
          return false;
        }
        ch = id.charCodeAt(0);
        if (!code.isIdentifierStart(ch) || ch === 92) {
          return false;
        }
        for (i = 1, iz = id.length; i < iz; ++i) {
          ch = id.charCodeAt(i);
          if (!code.isIdentifierPart(ch) || ch === 92) {
            return false;
          }
        }
        return true;
      }
      function isIdentifierES5(id, strict) {
        return isIdentifierName(id) && !isReservedWordES5(id, strict);
      }
      function isIdentifierES6(id, strict) {
        return isIdentifierName(id) && !isReservedWordES6(id, strict);
      }
      module.exports = {
        isKeywordES5: isKeywordES5,
        isKeywordES6: isKeywordES6,
        isReservedWordES5: isReservedWordES5,
        isReservedWordES6: isReservedWordES6,
        isRestrictedWord: isRestrictedWord,
        isIdentifierName: isIdentifierName,
        isIdentifierES5: isIdentifierES5,
        isIdentifierES6: isIdentifierES6
      };
    }());
  },
  './node_modules/quickstart/node_modules/escodegen/node_modules/source-map/lib/source-map/source-map-generator.js': function (require, module, exports, global) {
    if (typeof define !== 'function') {
      var define = require('./node_modules/quickstart/node_modules/escodegen/node_modules/source-map/node_modules/amdefine/amdefine.js')(module, require);
    }
    define(function (require, exports, module) {
      var base64VLQ = require('./node_modules/quickstart/node_modules/escodegen/node_modules/source-map/lib/source-map/base64-vlq.js');
      var util = require('./node_modules/quickstart/node_modules/escodegen/node_modules/source-map/lib/source-map/util.js');
      var ArraySet = require('./node_modules/quickstart/node_modules/escodegen/node_modules/source-map/lib/source-map/array-set.js').ArraySet;
      var MappingList = require('./node_modules/quickstart/node_modules/escodegen/node_modules/source-map/lib/source-map/mapping-list.js').MappingList;
      function SourceMapGenerator(aArgs) {
        if (!aArgs) {
          aArgs = {};
        }
        this._file = util.getArg(aArgs, 'file', null);
        this._sourceRoot = util.getArg(aArgs, 'sourceRoot', null);
        this._skipValidation = util.getArg(aArgs, 'skipValidation', false);
        this._sources = new ArraySet();
        this._names = new ArraySet();
        this._mappings = new MappingList();
        this._sourcesContents = null;
      }
      SourceMapGenerator.prototype._version = 3;
      SourceMapGenerator.fromSourceMap = function SourceMapGenerator_fromSourceMap(aSourceMapConsumer) {
        var sourceRoot = aSourceMapConsumer.sourceRoot;
        var generator = new SourceMapGenerator({
          file: aSourceMapConsumer.file,
          sourceRoot: sourceRoot
        });
        aSourceMapConsumer.eachMapping(function (mapping) {
          var newMapping = {
            generated: {
              line: mapping.generatedLine,
              column: mapping.generatedColumn
            }
          };
          if (mapping.source != null) {
            newMapping.source = mapping.source;
            if (sourceRoot != null) {
              newMapping.source = util.relative(sourceRoot, newMapping.source);
            }
            newMapping.original = {
              line: mapping.originalLine,
              column: mapping.originalColumn
            };
            if (mapping.name != null) {
              newMapping.name = mapping.name;
            }
          }
          generator.addMapping(newMapping);
        });
        aSourceMapConsumer.sources.forEach(function (sourceFile) {
          var content = aSourceMapConsumer.sourceContentFor(sourceFile);
          if (content != null) {
            generator.setSourceContent(sourceFile, content);
          }
        });
        return generator;
      };
      SourceMapGenerator.prototype.addMapping = function SourceMapGenerator_addMapping(aArgs) {
        var generated = util.getArg(aArgs, 'generated');
        var original = util.getArg(aArgs, 'original', null);
        var source = util.getArg(aArgs, 'source', null);
        var name = util.getArg(aArgs, 'name', null);
        if (!this._skipValidation) {
          this._validateMapping(generated, original, source, name);
        }
        if (source != null && !this._sources.has(source)) {
          this._sources.add(source);
        }
        if (name != null && !this._names.has(name)) {
          this._names.add(name);
        }
        this._mappings.add({
          generatedLine: generated.line,
          generatedColumn: generated.column,
          originalLine: original != null && original.line,
          originalColumn: original != null && original.column,
          source: source,
          name: name
        });
      };
      SourceMapGenerator.prototype.setSourceContent = function SourceMapGenerator_setSourceContent(aSourceFile, aSourceContent) {
        var source = aSourceFile;
        if (this._sourceRoot != null) {
          source = util.relative(this._sourceRoot, source);
        }
        if (aSourceContent != null) {
          if (!this._sourcesContents) {
            this._sourcesContents = {};
          }
          this._sourcesContents[util.toSetString(source)] = aSourceContent;
        } else if (this._sourcesContents) {
          delete this._sourcesContents[util.toSetString(source)];
          if (Object.keys(this._sourcesContents).length === 0) {
            this._sourcesContents = null;
          }
        }
      };
      SourceMapGenerator.prototype.applySourceMap = function SourceMapGenerator_applySourceMap(aSourceMapConsumer, aSourceFile, aSourceMapPath) {
        var sourceFile = aSourceFile;
        if (aSourceFile == null) {
          if (aSourceMapConsumer.file == null) {
            throw new Error('SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, ' + 'or the source map\'s "file" property. Both were omitted.');
          }
          sourceFile = aSourceMapConsumer.file;
        }
        var sourceRoot = this._sourceRoot;
        if (sourceRoot != null) {
          sourceFile = util.relative(sourceRoot, sourceFile);
        }
        var newSources = new ArraySet();
        var newNames = new ArraySet();
        this._mappings.unsortedForEach(function (mapping) {
          if (mapping.source === sourceFile && mapping.originalLine != null) {
            var original = aSourceMapConsumer.originalPositionFor({
              line: mapping.originalLine,
              column: mapping.originalColumn
            });
            if (original.source != null) {
              mapping.source = original.source;
              if (aSourceMapPath != null) {
                mapping.source = util.join(aSourceMapPath, mapping.source);
              }
              if (sourceRoot != null) {
                mapping.source = util.relative(sourceRoot, mapping.source);
              }
              mapping.originalLine = original.line;
              mapping.originalColumn = original.column;
              if (original.name != null) {
                mapping.name = original.name;
              }
            }
          }
          var source = mapping.source;
          if (source != null && !newSources.has(source)) {
            newSources.add(source);
          }
          var name = mapping.name;
          if (name != null && !newNames.has(name)) {
            newNames.add(name);
          }
        }, this);
        this._sources = newSources;
        this._names = newNames;
        aSourceMapConsumer.sources.forEach(function (sourceFile) {
          var content = aSourceMapConsumer.sourceContentFor(sourceFile);
          if (content != null) {
            if (aSourceMapPath != null) {
              sourceFile = util.join(aSourceMapPath, sourceFile);
            }
            if (sourceRoot != null) {
              sourceFile = util.relative(sourceRoot, sourceFile);
            }
            this.setSourceContent(sourceFile, content);
          }
        }, this);
      };
      SourceMapGenerator.prototype._validateMapping = function SourceMapGenerator_validateMapping(aGenerated, aOriginal, aSource, aName) {
        if (aGenerated && 'line' in aGenerated && 'column' in aGenerated && aGenerated.line > 0 && aGenerated.column >= 0 && !aOriginal && !aSource && !aName) {
          return;
        } else if (aGenerated && 'line' in aGenerated && 'column' in aGenerated && aOriginal && 'line' in aOriginal && 'column' in aOriginal && aGenerated.line > 0 && aGenerated.column >= 0 && aOriginal.line > 0 && aOriginal.column >= 0 && aSource) {
          return;
        } else {
          throw new Error('Invalid mapping: ' + JSON.stringify({
            generated: aGenerated,
            source: aSource,
            original: aOriginal,
            name: aName
          }));
        }
      };
      SourceMapGenerator.prototype._serializeMappings = function SourceMapGenerator_serializeMappings() {
        var previousGeneratedColumn = 0;
        var previousGeneratedLine = 1;
        var previousOriginalColumn = 0;
        var previousOriginalLine = 0;
        var previousName = 0;
        var previousSource = 0;
        var result = '';
        var mapping;
        var mappings = this._mappings.toArray();
        for (var i = 0, len = mappings.length; i < len; i++) {
          mapping = mappings[i];
          if (mapping.generatedLine !== previousGeneratedLine) {
            previousGeneratedColumn = 0;
            while (mapping.generatedLine !== previousGeneratedLine) {
              result += ';';
              previousGeneratedLine++;
            }
          } else {
            if (i > 0) {
              if (!util.compareByGeneratedPositions(mapping, mappings[i - 1])) {
                continue;
              }
              result += ',';
            }
          }
          result += base64VLQ.encode(mapping.generatedColumn - previousGeneratedColumn);
          previousGeneratedColumn = mapping.generatedColumn;
          if (mapping.source != null) {
            result += base64VLQ.encode(this._sources.indexOf(mapping.source) - previousSource);
            previousSource = this._sources.indexOf(mapping.source);
            result += base64VLQ.encode(mapping.originalLine - 1 - previousOriginalLine);
            previousOriginalLine = mapping.originalLine - 1;
            result += base64VLQ.encode(mapping.originalColumn - previousOriginalColumn);
            previousOriginalColumn = mapping.originalColumn;
            if (mapping.name != null) {
              result += base64VLQ.encode(this._names.indexOf(mapping.name) - previousName);
              previousName = this._names.indexOf(mapping.name);
            }
          }
        }
        return result;
      };
      SourceMapGenerator.prototype._generateSourcesContent = function SourceMapGenerator_generateSourcesContent(aSources, aSourceRoot) {
        return aSources.map(function (source) {
          if (!this._sourcesContents) {
            return null;
          }
          if (aSourceRoot != null) {
            source = util.relative(aSourceRoot, source);
          }
          var key = util.toSetString(source);
          return Object.prototype.hasOwnProperty.call(this._sourcesContents, key) ? this._sourcesContents[key] : null;
        }, this);
      };
      SourceMapGenerator.prototype.toJSON = function SourceMapGenerator_toJSON() {
        var map = {
          version: this._version,
          sources: this._sources.toArray(),
          names: this._names.toArray(),
          mappings: this._serializeMappings()
        };
        if (this._file != null) {
          map.file = this._file;
        }
        if (this._sourceRoot != null) {
          map.sourceRoot = this._sourceRoot;
        }
        if (this._sourcesContents) {
          map.sourcesContent = this._generateSourcesContent(map.sources, map.sourceRoot);
        }
        return map;
      };
      SourceMapGenerator.prototype.toString = function SourceMapGenerator_toString() {
        return JSON.stringify(this);
      };
      exports.SourceMapGenerator = SourceMapGenerator;
    });
  },
  './node_modules/quickstart/node_modules/escodegen/node_modules/source-map/lib/source-map/source-map-consumer.js': function (require, module, exports, global) {
    if (typeof define !== 'function') {
      var define = require('./node_modules/quickstart/node_modules/escodegen/node_modules/source-map/node_modules/amdefine/amdefine.js')(module, require);
    }
    define(function (require, exports, module) {
      var util = require('./node_modules/quickstart/node_modules/escodegen/node_modules/source-map/lib/source-map/util.js');
      var binarySearch = require('./node_modules/quickstart/node_modules/escodegen/node_modules/source-map/lib/source-map/binary-search.js');
      var ArraySet = require('./node_modules/quickstart/node_modules/escodegen/node_modules/source-map/lib/source-map/array-set.js').ArraySet;
      var base64VLQ = require('./node_modules/quickstart/node_modules/escodegen/node_modules/source-map/lib/source-map/base64-vlq.js');
      function SourceMapConsumer(aSourceMap) {
        var sourceMap = aSourceMap;
        if (typeof aSourceMap === 'string') {
          sourceMap = JSON.parse(aSourceMap.replace(/^\)\]\}'/, ''));
        }
        var version = util.getArg(sourceMap, 'version');
        var sources = util.getArg(sourceMap, 'sources');
        var names = util.getArg(sourceMap, 'names', []);
        var sourceRoot = util.getArg(sourceMap, 'sourceRoot', null);
        var sourcesContent = util.getArg(sourceMap, 'sourcesContent', null);
        var mappings = util.getArg(sourceMap, 'mappings');
        var file = util.getArg(sourceMap, 'file', null);
        if (version != this._version) {
          throw new Error('Unsupported version: ' + version);
        }
        sources = sources.map(util.normalize);
        this._names = ArraySet.fromArray(names, true);
        this._sources = ArraySet.fromArray(sources, true);
        this.sourceRoot = sourceRoot;
        this.sourcesContent = sourcesContent;
        this._mappings = mappings;
        this.file = file;
      }
      SourceMapConsumer.fromSourceMap = function SourceMapConsumer_fromSourceMap(aSourceMap) {
        var smc = Object.create(SourceMapConsumer.prototype);
        smc._names = ArraySet.fromArray(aSourceMap._names.toArray(), true);
        smc._sources = ArraySet.fromArray(aSourceMap._sources.toArray(), true);
        smc.sourceRoot = aSourceMap._sourceRoot;
        smc.sourcesContent = aSourceMap._generateSourcesContent(smc._sources.toArray(), smc.sourceRoot);
        smc.file = aSourceMap._file;
        smc.__generatedMappings = aSourceMap._mappings.toArray().slice();
        smc.__originalMappings = aSourceMap._mappings.toArray().slice().sort(util.compareByOriginalPositions);
        return smc;
      };
      SourceMapConsumer.prototype._version = 3;
      Object.defineProperty(SourceMapConsumer.prototype, 'sources', {
        get: function () {
          return this._sources.toArray().map(function (s) {
            return this.sourceRoot != null ? util.join(this.sourceRoot, s) : s;
          }, this);
        }
      });
      SourceMapConsumer.prototype.__generatedMappings = null;
      Object.defineProperty(SourceMapConsumer.prototype, '_generatedMappings', {
        get: function () {
          if (!this.__generatedMappings) {
            this.__generatedMappings = [];
            this.__originalMappings = [];
            this._parseMappings(this._mappings, this.sourceRoot);
          }
          return this.__generatedMappings;
        }
      });
      SourceMapConsumer.prototype.__originalMappings = null;
      Object.defineProperty(SourceMapConsumer.prototype, '_originalMappings', {
        get: function () {
          if (!this.__originalMappings) {
            this.__generatedMappings = [];
            this.__originalMappings = [];
            this._parseMappings(this._mappings, this.sourceRoot);
          }
          return this.__originalMappings;
        }
      });
      SourceMapConsumer.prototype._nextCharIsMappingSeparator = function SourceMapConsumer_nextCharIsMappingSeparator(aStr) {
        var c = aStr.charAt(0);
        return c === ';' || c === ',';
      };
      SourceMapConsumer.prototype._parseMappings = function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
        var generatedLine = 1;
        var previousGeneratedColumn = 0;
        var previousOriginalLine = 0;
        var previousOriginalColumn = 0;
        var previousSource = 0;
        var previousName = 0;
        var str = aStr;
        var temp = {};
        var mapping;
        while (str.length > 0) {
          if (str.charAt(0) === ';') {
            generatedLine++;
            str = str.slice(1);
            previousGeneratedColumn = 0;
          } else if (str.charAt(0) === ',') {
            str = str.slice(1);
          } else {
            mapping = {};
            mapping.generatedLine = generatedLine;
            base64VLQ.decode(str, temp);
            mapping.generatedColumn = previousGeneratedColumn + temp.value;
            previousGeneratedColumn = mapping.generatedColumn;
            str = temp.rest;
            if (str.length > 0 && !this._nextCharIsMappingSeparator(str)) {
              base64VLQ.decode(str, temp);
              mapping.source = this._sources.at(previousSource + temp.value);
              previousSource += temp.value;
              str = temp.rest;
              if (str.length === 0 || this._nextCharIsMappingSeparator(str)) {
                throw new Error('Found a source, but no line and column');
              }
              base64VLQ.decode(str, temp);
              mapping.originalLine = previousOriginalLine + temp.value;
              previousOriginalLine = mapping.originalLine;
              mapping.originalLine += 1;
              str = temp.rest;
              if (str.length === 0 || this._nextCharIsMappingSeparator(str)) {
                throw new Error('Found a source and line, but no column');
              }
              base64VLQ.decode(str, temp);
              mapping.originalColumn = previousOriginalColumn + temp.value;
              previousOriginalColumn = mapping.originalColumn;
              str = temp.rest;
              if (str.length > 0 && !this._nextCharIsMappingSeparator(str)) {
                base64VLQ.decode(str, temp);
                mapping.name = this._names.at(previousName + temp.value);
                previousName += temp.value;
                str = temp.rest;
              }
            }
            this.__generatedMappings.push(mapping);
            if (typeof mapping.originalLine === 'number') {
              this.__originalMappings.push(mapping);
            }
          }
        }
        this.__generatedMappings.sort(util.compareByGeneratedPositions);
        this.__originalMappings.sort(util.compareByOriginalPositions);
      };
      SourceMapConsumer.prototype._findMapping = function SourceMapConsumer_findMapping(aNeedle, aMappings, aLineName, aColumnName, aComparator) {
        if (aNeedle[aLineName] <= 0) {
          throw new TypeError('Line must be greater than or equal to 1, got ' + aNeedle[aLineName]);
        }
        if (aNeedle[aColumnName] < 0) {
          throw new TypeError('Column must be greater than or equal to 0, got ' + aNeedle[aColumnName]);
        }
        return binarySearch.search(aNeedle, aMappings, aComparator);
      };
      SourceMapConsumer.prototype.computeColumnSpans = function SourceMapConsumer_computeColumnSpans() {
        for (var index = 0; index < this._generatedMappings.length; ++index) {
          var mapping = this._generatedMappings[index];
          if (index + 1 < this._generatedMappings.length) {
            var nextMapping = this._generatedMappings[index + 1];
            if (mapping.generatedLine === nextMapping.generatedLine) {
              mapping.lastGeneratedColumn = nextMapping.generatedColumn - 1;
              continue;
            }
          }
          mapping.lastGeneratedColumn = Infinity;
        }
      };
      SourceMapConsumer.prototype.originalPositionFor = function SourceMapConsumer_originalPositionFor(aArgs) {
        var needle = {
          generatedLine: util.getArg(aArgs, 'line'),
          generatedColumn: util.getArg(aArgs, 'column')
        };
        var index = this._findMapping(needle, this._generatedMappings, 'generatedLine', 'generatedColumn', util.compareByGeneratedPositions);
        if (index >= 0) {
          var mapping = this._generatedMappings[index];
          if (mapping.generatedLine === needle.generatedLine) {
            var source = util.getArg(mapping, 'source', null);
            if (source != null && this.sourceRoot != null) {
              source = util.join(this.sourceRoot, source);
            }
            return {
              source: source,
              line: util.getArg(mapping, 'originalLine', null),
              column: util.getArg(mapping, 'originalColumn', null),
              name: util.getArg(mapping, 'name', null)
            };
          }
        }
        return {
          source: null,
          line: null,
          column: null,
          name: null
        };
      };
      SourceMapConsumer.prototype.sourceContentFor = function SourceMapConsumer_sourceContentFor(aSource) {
        if (!this.sourcesContent) {
          return null;
        }
        if (this.sourceRoot != null) {
          aSource = util.relative(this.sourceRoot, aSource);
        }
        if (this._sources.has(aSource)) {
          return this.sourcesContent[this._sources.indexOf(aSource)];
        }
        var url;
        if (this.sourceRoot != null && (url = util.urlParse(this.sourceRoot))) {
          var fileUriAbsPath = aSource.replace(/^file:\/\//, '');
          if (url.scheme == 'file' && this._sources.has(fileUriAbsPath)) {
            return this.sourcesContent[this._sources.indexOf(fileUriAbsPath)];
          }
          if ((!url.path || url.path == '/') && this._sources.has('/' + aSource)) {
            return this.sourcesContent[this._sources.indexOf('/' + aSource)];
          }
        }
        throw new Error('"' + aSource + '" is not in the SourceMap.');
      };
      SourceMapConsumer.prototype.generatedPositionFor = function SourceMapConsumer_generatedPositionFor(aArgs) {
        var needle = {
          source: util.getArg(aArgs, 'source'),
          originalLine: util.getArg(aArgs, 'line'),
          originalColumn: util.getArg(aArgs, 'column')
        };
        if (this.sourceRoot != null) {
          needle.source = util.relative(this.sourceRoot, needle.source);
        }
        var index = this._findMapping(needle, this._originalMappings, 'originalLine', 'originalColumn', util.compareByOriginalPositions);
        if (index >= 0) {
          var mapping = this._originalMappings[index];
          return {
            line: util.getArg(mapping, 'generatedLine', null),
            column: util.getArg(mapping, 'generatedColumn', null),
            lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
          };
        }
        return {
          line: null,
          column: null,
          lastColumn: null
        };
      };
      SourceMapConsumer.prototype.allGeneratedPositionsFor = function SourceMapConsumer_allGeneratedPositionsFor(aArgs) {
        var needle = {
          source: util.getArg(aArgs, 'source'),
          originalLine: util.getArg(aArgs, 'line'),
          originalColumn: Infinity
        };
        if (this.sourceRoot != null) {
          needle.source = util.relative(this.sourceRoot, needle.source);
        }
        var mappings = [];
        var index = this._findMapping(needle, this._originalMappings, 'originalLine', 'originalColumn', util.compareByOriginalPositions);
        if (index >= 0) {
          var mapping = this._originalMappings[index];
          while (mapping && mapping.originalLine === needle.originalLine) {
            mappings.push({
              line: util.getArg(mapping, 'generatedLine', null),
              column: util.getArg(mapping, 'generatedColumn', null),
              lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
            });
            mapping = this._originalMappings[--index];
          }
        }
        return mappings.reverse();
      };
      SourceMapConsumer.GENERATED_ORDER = 1;
      SourceMapConsumer.ORIGINAL_ORDER = 2;
      SourceMapConsumer.prototype.eachMapping = function SourceMapConsumer_eachMapping(aCallback, aContext, aOrder) {
        var context = aContext || null;
        var order = aOrder || SourceMapConsumer.GENERATED_ORDER;
        var mappings;
        switch (order) {
        case SourceMapConsumer.GENERATED_ORDER:
          mappings = this._generatedMappings;
          break;
        case SourceMapConsumer.ORIGINAL_ORDER:
          mappings = this._originalMappings;
          break;
        default:
          throw new Error('Unknown order of iteration.');
        }
        var sourceRoot = this.sourceRoot;
        mappings.map(function (mapping) {
          var source = mapping.source;
          if (source != null && sourceRoot != null) {
            source = util.join(sourceRoot, source);
          }
          return {
            source: source,
            generatedLine: mapping.generatedLine,
            generatedColumn: mapping.generatedColumn,
            originalLine: mapping.originalLine,
            originalColumn: mapping.originalColumn,
            name: mapping.name
          };
        }).forEach(aCallback, context);
      };
      exports.SourceMapConsumer = SourceMapConsumer;
    });
  },
  './node_modules/quickstart/node_modules/escodegen/node_modules/source-map/lib/source-map/source-node.js': function (require, module, exports, global) {
    if (typeof define !== 'function') {
      var define = require('./node_modules/quickstart/node_modules/escodegen/node_modules/source-map/node_modules/amdefine/amdefine.js')(module, require);
    }
    define(function (require, exports, module) {
      var SourceMapGenerator = require('./node_modules/quickstart/node_modules/escodegen/node_modules/source-map/lib/source-map/source-map-generator.js').SourceMapGenerator;
      var util = require('./node_modules/quickstart/node_modules/escodegen/node_modules/source-map/lib/source-map/util.js');
      var REGEX_NEWLINE = /(\r?\n)/;
      var NEWLINE_CODE = 10;
      var isSourceNode = '$$$isSourceNode$$$';
      function SourceNode(aLine, aColumn, aSource, aChunks, aName) {
        this.children = [];
        this.sourceContents = {};
        this.line = aLine == null ? null : aLine;
        this.column = aColumn == null ? null : aColumn;
        this.source = aSource == null ? null : aSource;
        this.name = aName == null ? null : aName;
        this[isSourceNode] = true;
        if (aChunks != null)
          this.add(aChunks);
      }
      SourceNode.fromStringWithSourceMap = function SourceNode_fromStringWithSourceMap(aGeneratedCode, aSourceMapConsumer, aRelativePath) {
        var node = new SourceNode();
        var remainingLines = aGeneratedCode.split(REGEX_NEWLINE);
        var shiftNextLine = function () {
          var lineContents = remainingLines.shift();
          var newLine = remainingLines.shift() || '';
          return lineContents + newLine;
        };
        var lastGeneratedLine = 1, lastGeneratedColumn = 0;
        var lastMapping = null;
        aSourceMapConsumer.eachMapping(function (mapping) {
          if (lastMapping !== null) {
            if (lastGeneratedLine < mapping.generatedLine) {
              var code = '';
              addMappingWithCode(lastMapping, shiftNextLine());
              lastGeneratedLine++;
              lastGeneratedColumn = 0;
            } else {
              var nextLine = remainingLines[0];
              var code = nextLine.substr(0, mapping.generatedColumn - lastGeneratedColumn);
              remainingLines[0] = nextLine.substr(mapping.generatedColumn - lastGeneratedColumn);
              lastGeneratedColumn = mapping.generatedColumn;
              addMappingWithCode(lastMapping, code);
              lastMapping = mapping;
              return;
            }
          }
          while (lastGeneratedLine < mapping.generatedLine) {
            node.add(shiftNextLine());
            lastGeneratedLine++;
          }
          if (lastGeneratedColumn < mapping.generatedColumn) {
            var nextLine = remainingLines[0];
            node.add(nextLine.substr(0, mapping.generatedColumn));
            remainingLines[0] = nextLine.substr(mapping.generatedColumn);
            lastGeneratedColumn = mapping.generatedColumn;
          }
          lastMapping = mapping;
        }, this);
        if (remainingLines.length > 0) {
          if (lastMapping) {
            addMappingWithCode(lastMapping, shiftNextLine());
          }
          node.add(remainingLines.join(''));
        }
        aSourceMapConsumer.sources.forEach(function (sourceFile) {
          var content = aSourceMapConsumer.sourceContentFor(sourceFile);
          if (content != null) {
            if (aRelativePath != null) {
              sourceFile = util.join(aRelativePath, sourceFile);
            }
            node.setSourceContent(sourceFile, content);
          }
        });
        return node;
        function addMappingWithCode(mapping, code) {
          if (mapping === null || mapping.source === undefined) {
            node.add(code);
          } else {
            var source = aRelativePath ? util.join(aRelativePath, mapping.source) : mapping.source;
            node.add(new SourceNode(mapping.originalLine, mapping.originalColumn, source, code, mapping.name));
          }
        }
      };
      SourceNode.prototype.add = function SourceNode_add(aChunk) {
        if (Array.isArray(aChunk)) {
          aChunk.forEach(function (chunk) {
            this.add(chunk);
          }, this);
        } else if (aChunk[isSourceNode] || typeof aChunk === 'string') {
          if (aChunk) {
            this.children.push(aChunk);
          }
        } else {
          throw new TypeError('Expected a SourceNode, string, or an array of SourceNodes and strings. Got ' + aChunk);
        }
        return this;
      };
      SourceNode.prototype.prepend = function SourceNode_prepend(aChunk) {
        if (Array.isArray(aChunk)) {
          for (var i = aChunk.length - 1; i >= 0; i--) {
            this.prepend(aChunk[i]);
          }
        } else if (aChunk[isSourceNode] || typeof aChunk === 'string') {
          this.children.unshift(aChunk);
        } else {
          throw new TypeError('Expected a SourceNode, string, or an array of SourceNodes and strings. Got ' + aChunk);
        }
        return this;
      };
      SourceNode.prototype.walk = function SourceNode_walk(aFn) {
        var chunk;
        for (var i = 0, len = this.children.length; i < len; i++) {
          chunk = this.children[i];
          if (chunk[isSourceNode]) {
            chunk.walk(aFn);
          } else {
            if (chunk !== '') {
              aFn(chunk, {
                source: this.source,
                line: this.line,
                column: this.column,
                name: this.name
              });
            }
          }
        }
      };
      SourceNode.prototype.join = function SourceNode_join(aSep) {
        var newChildren;
        var i;
        var len = this.children.length;
        if (len > 0) {
          newChildren = [];
          for (i = 0; i < len - 1; i++) {
            newChildren.push(this.children[i]);
            newChildren.push(aSep);
          }
          newChildren.push(this.children[i]);
          this.children = newChildren;
        }
        return this;
      };
      SourceNode.prototype.replaceRight = function SourceNode_replaceRight(aPattern, aReplacement) {
        var lastChild = this.children[this.children.length - 1];
        if (lastChild[isSourceNode]) {
          lastChild.replaceRight(aPattern, aReplacement);
        } else if (typeof lastChild === 'string') {
          this.children[this.children.length - 1] = lastChild.replace(aPattern, aReplacement);
        } else {
          this.children.push(''.replace(aPattern, aReplacement));
        }
        return this;
      };
      SourceNode.prototype.setSourceContent = function SourceNode_setSourceContent(aSourceFile, aSourceContent) {
        this.sourceContents[util.toSetString(aSourceFile)] = aSourceContent;
      };
      SourceNode.prototype.walkSourceContents = function SourceNode_walkSourceContents(aFn) {
        for (var i = 0, len = this.children.length; i < len; i++) {
          if (this.children[i][isSourceNode]) {
            this.children[i].walkSourceContents(aFn);
          }
        }
        var sources = Object.keys(this.sourceContents);
        for (var i = 0, len = sources.length; i < len; i++) {
          aFn(util.fromSetString(sources[i]), this.sourceContents[sources[i]]);
        }
      };
      SourceNode.prototype.toString = function SourceNode_toString() {
        var str = '';
        this.walk(function (chunk) {
          str += chunk;
        });
        return str;
      };
      SourceNode.prototype.toStringWithSourceMap = function SourceNode_toStringWithSourceMap(aArgs) {
        var generated = {
          code: '',
          line: 1,
          column: 0
        };
        var map = new SourceMapGenerator(aArgs);
        var sourceMappingActive = false;
        var lastOriginalSource = null;
        var lastOriginalLine = null;
        var lastOriginalColumn = null;
        var lastOriginalName = null;
        this.walk(function (chunk, original) {
          generated.code += chunk;
          if (original.source !== null && original.line !== null && original.column !== null) {
            if (lastOriginalSource !== original.source || lastOriginalLine !== original.line || lastOriginalColumn !== original.column || lastOriginalName !== original.name) {
              map.addMapping({
                source: original.source,
                original: {
                  line: original.line,
                  column: original.column
                },
                generated: {
                  line: generated.line,
                  column: generated.column
                },
                name: original.name
              });
            }
            lastOriginalSource = original.source;
            lastOriginalLine = original.line;
            lastOriginalColumn = original.column;
            lastOriginalName = original.name;
            sourceMappingActive = true;
          } else if (sourceMappingActive) {
            map.addMapping({
              generated: {
                line: generated.line,
                column: generated.column
              }
            });
            lastOriginalSource = null;
            sourceMappingActive = false;
          }
          for (var idx = 0, length = chunk.length; idx < length; idx++) {
            if (chunk.charCodeAt(idx) === NEWLINE_CODE) {
              generated.line++;
              generated.column = 0;
              if (idx + 1 === length) {
                lastOriginalSource = null;
                sourceMappingActive = false;
              } else if (sourceMappingActive) {
                map.addMapping({
                  source: original.source,
                  original: {
                    line: original.line,
                    column: original.column
                  },
                  generated: {
                    line: generated.line,
                    column: generated.column
                  },
                  name: original.name
                });
              }
            } else {
              generated.column++;
            }
          }
        });
        this.walkSourceContents(function (sourceFile, sourceContent) {
          map.setSourceContent(sourceFile, sourceContent);
        });
        return {
          code: generated.code,
          map: map
        };
      };
      exports.SourceNode = SourceNode;
    });
  },
  './node_modules/quickstart/node_modules/promise/node_modules/asap/asap.js': function (require, module, exports, global) {
    var process = require('./node_modules/quickstart/browser/process.js');
    var head = {
      task: void 0,
      next: null
    };
    var tail = head;
    var flushing = false;
    var requestFlush = void 0;
    var isNodeJS = false;
    function flush() {
      while (head.next) {
        head = head.next;
        var task = head.task;
        head.task = void 0;
        var domain = head.domain;
        if (domain) {
          head.domain = void 0;
          domain.enter();
        }
        try {
          task();
        } catch (e) {
          if (isNodeJS) {
            if (domain) {
              domain.exit();
            }
            setTimeout(flush, 0);
            if (domain) {
              domain.enter();
            }
            throw e;
          } else {
            setTimeout(function () {
              throw e;
            }, 0);
          }
        }
        if (domain) {
          domain.exit();
        }
      }
      flushing = false;
    }
    if (typeof process !== 'undefined' && process.nextTick) {
      isNodeJS = true;
      requestFlush = function () {
        process.nextTick(flush);
      };
    } else if (typeof setImmediate === 'function') {
      if (typeof window !== 'undefined') {
        requestFlush = setImmediate.bind(window, flush);
      } else {
        requestFlush = function () {
          setImmediate(flush);
        };
      }
    } else if (typeof MessageChannel !== 'undefined') {
      var channel = new MessageChannel();
      channel.port1.onmessage = flush;
      requestFlush = function () {
        channel.port2.postMessage(0);
      };
    } else {
      requestFlush = function () {
        setTimeout(flush, 0);
      };
    }
    function asap(task) {
      tail = tail.next = {
        task: task,
        domain: isNodeJS && process.domain,
        next: null
      };
      if (!flushing) {
        flushing = true;
        requestFlush();
      }
    }
    ;
    module.exports = asap;
  },
  './node_modules/quickstart/node_modules/prime/emitter.js': function (require, module, exports, global) {
    'use strict';
    var indexOf = require('./node_modules/quickstart/node_modules/mout/array/indexOf.js'), forEach = require('./node_modules/quickstart/node_modules/mout/array/forEach.js');
    var prime = require('./node_modules/quickstart/node_modules/prime/index.js'), defer = require('./node_modules/quickstart/node_modules/prime/defer.js');
    var slice = Array.prototype.slice;
    var Emitter = prime({
      on: function (event, fn) {
        var listeners = this._listeners || (this._listeners = {}), events = listeners[event] || (listeners[event] = []);
        if (indexOf(events, fn) === -1)
          events.push(fn);
        return this;
      },
      off: function (event, fn) {
        var listeners = this._listeners, events, key, length = 0;
        if (listeners && (events = listeners[event])) {
          var io = indexOf(events, fn);
          if (io > -1)
            events.splice(io, 1);
          if (!events.length)
            delete listeners[event];
          for (var l in listeners)
            return this;
          delete this._listeners;
        }
        return this;
      },
      emit: function (event) {
        var self = this, args = slice.call(arguments, 1);
        var emit = function () {
          var listeners = self._listeners, events;
          if (listeners && (events = listeners[event])) {
            forEach(events.slice(0), function (event) {
              return event.apply(self, args);
            });
          }
        };
        if (args[args.length - 1] === Emitter.EMIT_SYNC) {
          args.pop();
          emit();
        } else {
          defer(emit);
        }
        return this;
      }
    });
    Emitter.EMIT_SYNC = {};
    module.exports = Emitter;
  },
  './node_modules/quickstart/node_modules/mout/lang/isObject.js': function (require, module, exports, global) {
    var isKind = require('./node_modules/quickstart/node_modules/mout/lang/isKind.js');
    function isObject(val) {
      return isKind(val, 'Object');
    }
    module.exports = isObject;
  },
  './node_modules/quickstart/node_modules/mout/lang/isFunction.js': function (require, module, exports, global) {
    var isKind = require('./node_modules/quickstart/node_modules/mout/lang/isKind.js');
    function isFunction(val) {
      return isKind(val, 'Function');
    }
    module.exports = isFunction;
  },
  './node_modules/quickstart/node_modules/mout/array/remove.js': function (require, module, exports, global) {
    var indexOf = require('./node_modules/quickstart/node_modules/mout/array/indexOf.js');
    function remove(arr, item) {
      var idx = indexOf(arr, item);
      if (idx !== -1)
        arr.splice(idx, 1);
    }
    module.exports = remove;
  },
  './node_modules/quickstart/node_modules/mout/string/trim.js': function (require, module, exports, global) {
    var toString = require('./node_modules/quickstart/node_modules/mout/lang/toString.js');
    var WHITE_SPACES = require('./node_modules/quickstart/node_modules/mout/string/WHITE_SPACES.js');
    var ltrim = require('./node_modules/quickstart/node_modules/mout/string/ltrim.js');
    var rtrim = require('./node_modules/quickstart/node_modules/mout/string/rtrim.js');
    function trim(str, chars) {
      str = toString(str);
      chars = chars || WHITE_SPACES;
      return ltrim(rtrim(str, chars), chars);
    }
    module.exports = trim;
  },
  './node_modules/quickstart/node_modules/mout/string/upperCase.js': function (require, module, exports, global) {
    var toString = require('./node_modules/quickstart/node_modules/mout/lang/toString.js');
    function upperCase(str) {
      str = toString(str);
      return str.toUpperCase();
    }
    module.exports = upperCase;
  },
  './node_modules/quickstart/node_modules/escodegen/node_modules/source-map/lib/source-map/base64-vlq.js': function (require, module, exports, global) {
    if (typeof define !== 'function') {
      var define = require('./node_modules/quickstart/node_modules/escodegen/node_modules/source-map/node_modules/amdefine/amdefine.js')(module, require);
    }
    define(function (require, exports, module) {
      var base64 = require('./node_modules/quickstart/node_modules/escodegen/node_modules/source-map/lib/source-map/base64.js');
      var VLQ_BASE_SHIFT = 5;
      var VLQ_BASE = 1 << VLQ_BASE_SHIFT;
      var VLQ_BASE_MASK = VLQ_BASE - 1;
      var VLQ_CONTINUATION_BIT = VLQ_BASE;
      function toVLQSigned(aValue) {
        return aValue < 0 ? (-aValue << 1) + 1 : (aValue << 1) + 0;
      }
      function fromVLQSigned(aValue) {
        var isNegative = (aValue & 1) === 1;
        var shifted = aValue >> 1;
        return isNegative ? -shifted : shifted;
      }
      exports.encode = function base64VLQ_encode(aValue) {
        var encoded = '';
        var digit;
        var vlq = toVLQSigned(aValue);
        do {
          digit = vlq & VLQ_BASE_MASK;
          vlq >>>= VLQ_BASE_SHIFT;
          if (vlq > 0) {
            digit |= VLQ_CONTINUATION_BIT;
          }
          encoded += base64.encode(digit);
        } while (vlq > 0);
        return encoded;
      };
      exports.decode = function base64VLQ_decode(aStr, aOutParam) {
        var i = 0;
        var strLen = aStr.length;
        var result = 0;
        var shift = 0;
        var continuation, digit;
        do {
          if (i >= strLen) {
            throw new Error('Expected more digits in base 64 VLQ value.');
          }
          digit = base64.decode(aStr.charAt(i++));
          continuation = !!(digit & VLQ_CONTINUATION_BIT);
          digit &= VLQ_BASE_MASK;
          result = result + (digit << shift);
          shift += VLQ_BASE_SHIFT;
        } while (continuation);
        aOutParam.value = fromVLQSigned(result);
        aOutParam.rest = aStr.slice(i);
      };
    });
  },
  './node_modules/quickstart/node_modules/escodegen/node_modules/source-map/lib/source-map/util.js': function (require, module, exports, global) {
    if (typeof define !== 'function') {
      var define = require('./node_modules/quickstart/node_modules/escodegen/node_modules/source-map/node_modules/amdefine/amdefine.js')(module, require);
    }
    define(function (require, exports, module) {
      function getArg(aArgs, aName, aDefaultValue) {
        if (aName in aArgs) {
          return aArgs[aName];
        } else if (arguments.length === 3) {
          return aDefaultValue;
        } else {
          throw new Error('"' + aName + '" is a required argument.');
        }
      }
      exports.getArg = getArg;
      var urlRegexp = /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.]*)(?::(\d+))?(\S*)$/;
      var dataUrlRegexp = /^data:.+\,.+$/;
      function urlParse(aUrl) {
        var match = aUrl.match(urlRegexp);
        if (!match) {
          return null;
        }
        return {
          scheme: match[1],
          auth: match[2],
          host: match[3],
          port: match[4],
          path: match[5]
        };
      }
      exports.urlParse = urlParse;
      function urlGenerate(aParsedUrl) {
        var url = '';
        if (aParsedUrl.scheme) {
          url += aParsedUrl.scheme + ':';
        }
        url += '//';
        if (aParsedUrl.auth) {
          url += aParsedUrl.auth + '@';
        }
        if (aParsedUrl.host) {
          url += aParsedUrl.host;
        }
        if (aParsedUrl.port) {
          url += ':' + aParsedUrl.port;
        }
        if (aParsedUrl.path) {
          url += aParsedUrl.path;
        }
        return url;
      }
      exports.urlGenerate = urlGenerate;
      function normalize(aPath) {
        var path = aPath;
        var url = urlParse(aPath);
        if (url) {
          if (!url.path) {
            return aPath;
          }
          path = url.path;
        }
        var isAbsolute = path.charAt(0) === '/';
        var parts = path.split(/\/+/);
        for (var part, up = 0, i = parts.length - 1; i >= 0; i--) {
          part = parts[i];
          if (part === '.') {
            parts.splice(i, 1);
          } else if (part === '..') {
            up++;
          } else if (up > 0) {
            if (part === '') {
              parts.splice(i + 1, up);
              up = 0;
            } else {
              parts.splice(i, 2);
              up--;
            }
          }
        }
        path = parts.join('/');
        if (path === '') {
          path = isAbsolute ? '/' : '.';
        }
        if (url) {
          url.path = path;
          return urlGenerate(url);
        }
        return path;
      }
      exports.normalize = normalize;
      function join(aRoot, aPath) {
        if (aRoot === '') {
          aRoot = '.';
        }
        if (aPath === '') {
          aPath = '.';
        }
        var aPathUrl = urlParse(aPath);
        var aRootUrl = urlParse(aRoot);
        if (aRootUrl) {
          aRoot = aRootUrl.path || '/';
        }
        if (aPathUrl && !aPathUrl.scheme) {
          if (aRootUrl) {
            aPathUrl.scheme = aRootUrl.scheme;
          }
          return urlGenerate(aPathUrl);
        }
        if (aPathUrl || aPath.match(dataUrlRegexp)) {
          return aPath;
        }
        if (aRootUrl && !aRootUrl.host && !aRootUrl.path) {
          aRootUrl.host = aPath;
          return urlGenerate(aRootUrl);
        }
        var joined = aPath.charAt(0) === '/' ? aPath : normalize(aRoot.replace(/\/+$/, '') + '/' + aPath);
        if (aRootUrl) {
          aRootUrl.path = joined;
          return urlGenerate(aRootUrl);
        }
        return joined;
      }
      exports.join = join;
      function relative(aRoot, aPath) {
        if (aRoot === '') {
          aRoot = '.';
        }
        aRoot = aRoot.replace(/\/$/, '');
        var url = urlParse(aRoot);
        if (aPath.charAt(0) == '/' && url && url.path == '/') {
          return aPath.slice(1);
        }
        return aPath.indexOf(aRoot + '/') === 0 ? aPath.substr(aRoot.length + 1) : aPath;
      }
      exports.relative = relative;
      function toSetString(aStr) {
        return '$' + aStr;
      }
      exports.toSetString = toSetString;
      function fromSetString(aStr) {
        return aStr.substr(1);
      }
      exports.fromSetString = fromSetString;
      function strcmp(aStr1, aStr2) {
        var s1 = aStr1 || '';
        var s2 = aStr2 || '';
        return (s1 > s2) - (s1 < s2);
      }
      function compareByOriginalPositions(mappingA, mappingB, onlyCompareOriginal) {
        var cmp;
        cmp = strcmp(mappingA.source, mappingB.source);
        if (cmp) {
          return cmp;
        }
        cmp = mappingA.originalLine - mappingB.originalLine;
        if (cmp) {
          return cmp;
        }
        cmp = mappingA.originalColumn - mappingB.originalColumn;
        if (cmp || onlyCompareOriginal) {
          return cmp;
        }
        cmp = strcmp(mappingA.name, mappingB.name);
        if (cmp) {
          return cmp;
        }
        cmp = mappingA.generatedLine - mappingB.generatedLine;
        if (cmp) {
          return cmp;
        }
        return mappingA.generatedColumn - mappingB.generatedColumn;
      }
      ;
      exports.compareByOriginalPositions = compareByOriginalPositions;
      function compareByGeneratedPositions(mappingA, mappingB, onlyCompareGenerated) {
        var cmp;
        cmp = mappingA.generatedLine - mappingB.generatedLine;
        if (cmp) {
          return cmp;
        }
        cmp = mappingA.generatedColumn - mappingB.generatedColumn;
        if (cmp || onlyCompareGenerated) {
          return cmp;
        }
        cmp = strcmp(mappingA.source, mappingB.source);
        if (cmp) {
          return cmp;
        }
        cmp = mappingA.originalLine - mappingB.originalLine;
        if (cmp) {
          return cmp;
        }
        cmp = mappingA.originalColumn - mappingB.originalColumn;
        if (cmp) {
          return cmp;
        }
        return strcmp(mappingA.name, mappingB.name);
      }
      ;
      exports.compareByGeneratedPositions = compareByGeneratedPositions;
    });
  },
  './node_modules/quickstart/node_modules/escodegen/node_modules/source-map/lib/source-map/array-set.js': function (require, module, exports, global) {
    if (typeof define !== 'function') {
      var define = require('./node_modules/quickstart/node_modules/escodegen/node_modules/source-map/node_modules/amdefine/amdefine.js')(module, require);
    }
    define(function (require, exports, module) {
      var util = require('./node_modules/quickstart/node_modules/escodegen/node_modules/source-map/lib/source-map/util.js');
      function ArraySet() {
        this._array = [];
        this._set = {};
      }
      ArraySet.fromArray = function ArraySet_fromArray(aArray, aAllowDuplicates) {
        var set = new ArraySet();
        for (var i = 0, len = aArray.length; i < len; i++) {
          set.add(aArray[i], aAllowDuplicates);
        }
        return set;
      };
      ArraySet.prototype.add = function ArraySet_add(aStr, aAllowDuplicates) {
        var isDuplicate = this.has(aStr);
        var idx = this._array.length;
        if (!isDuplicate || aAllowDuplicates) {
          this._array.push(aStr);
        }
        if (!isDuplicate) {
          this._set[util.toSetString(aStr)] = idx;
        }
      };
      ArraySet.prototype.has = function ArraySet_has(aStr) {
        return Object.prototype.hasOwnProperty.call(this._set, util.toSetString(aStr));
      };
      ArraySet.prototype.indexOf = function ArraySet_indexOf(aStr) {
        if (this.has(aStr)) {
          return this._set[util.toSetString(aStr)];
        }
        throw new Error('"' + aStr + '" is not in the set.');
      };
      ArraySet.prototype.at = function ArraySet_at(aIdx) {
        if (aIdx >= 0 && aIdx < this._array.length) {
          return this._array[aIdx];
        }
        throw new Error('No element indexed by ' + aIdx);
      };
      ArraySet.prototype.toArray = function ArraySet_toArray() {
        return this._array.slice();
      };
      exports.ArraySet = ArraySet;
    });
  },
  './node_modules/quickstart/node_modules/escodegen/node_modules/source-map/lib/source-map/mapping-list.js': function (require, module, exports, global) {
    if (typeof define !== 'function') {
      var define = require('./node_modules/quickstart/node_modules/escodegen/node_modules/source-map/node_modules/amdefine/amdefine.js')(module, require);
    }
    define(function (require, exports, module) {
      var util = require('./node_modules/quickstart/node_modules/escodegen/node_modules/source-map/lib/source-map/util.js');
      function generatedPositionAfter(mappingA, mappingB) {
        var lineA = mappingA.generatedLine;
        var lineB = mappingB.generatedLine;
        var columnA = mappingA.generatedColumn;
        var columnB = mappingB.generatedColumn;
        return lineB > lineA || lineB == lineA && columnB >= columnA || util.compareByGeneratedPositions(mappingA, mappingB) <= 0;
      }
      function MappingList() {
        this._array = [];
        this._sorted = true;
        this._last = {
          generatedLine: -1,
          generatedColumn: 0
        };
      }
      MappingList.prototype.unsortedForEach = function MappingList_forEach(aCallback, aThisArg) {
        this._array.forEach(aCallback, aThisArg);
      };
      MappingList.prototype.add = function MappingList_add(aMapping) {
        var mapping;
        if (generatedPositionAfter(this._last, aMapping)) {
          this._last = aMapping;
          this._array.push(aMapping);
        } else {
          this._sorted = false;
          this._array.push(aMapping);
        }
      };
      MappingList.prototype.toArray = function MappingList_toArray() {
        if (!this._sorted) {
          this._array.sort(util.compareByGeneratedPositions);
          this._sorted = true;
        }
        return this._array;
      };
      exports.MappingList = MappingList;
    });
  },
  './node_modules/quickstart/node_modules/escodegen/node_modules/source-map/lib/source-map/binary-search.js': function (require, module, exports, global) {
    if (typeof define !== 'function') {
      var define = require('./node_modules/quickstart/node_modules/escodegen/node_modules/source-map/node_modules/amdefine/amdefine.js')(module, require);
    }
    define(function (require, exports, module) {
      function recursiveSearch(aLow, aHigh, aNeedle, aHaystack, aCompare) {
        var mid = Math.floor((aHigh - aLow) / 2) + aLow;
        var cmp = aCompare(aNeedle, aHaystack[mid], true);
        if (cmp === 0) {
          return mid;
        } else if (cmp > 0) {
          if (aHigh - mid > 1) {
            return recursiveSearch(mid, aHigh, aNeedle, aHaystack, aCompare);
          }
          return mid;
        } else {
          if (mid - aLow > 1) {
            return recursiveSearch(aLow, mid, aNeedle, aHaystack, aCompare);
          }
          return aLow < 0 ? -1 : aLow;
        }
      }
      exports.search = function search(aNeedle, aHaystack, aCompare) {
        if (aHaystack.length === 0) {
          return -1;
        }
        return recursiveSearch(-1, aHaystack.length, aNeedle, aHaystack, aCompare);
      };
    });
  },
  './node_modules/quickstart/node_modules/prime/defer.js': function (require, module, exports, global) {
    var process = require('./node_modules/quickstart/browser/process.js');
    'use strict';
    var kindOf = require('./node_modules/quickstart/node_modules/mout/lang/kindOf.js'), now = require('./node_modules/quickstart/node_modules/mout/time/now.js'), forEach = require('./node_modules/quickstart/node_modules/mout/array/forEach.js'), indexOf = require('./node_modules/quickstart/node_modules/mout/array/indexOf.js');
    var callbacks = {
      timeout: {},
      frame: [],
      immediate: []
    };
    var push = function (collection, callback, context, defer) {
      var iterator = function () {
        iterate(collection);
      };
      if (!collection.length)
        defer(iterator);
      var entry = {
        callback: callback,
        context: context
      };
      collection.push(entry);
      return function () {
        var io = indexOf(collection, entry);
        if (io > -1)
          collection.splice(io, 1);
      };
    };
    var iterate = function (collection) {
      var time = now();
      forEach(collection.splice(0), function (entry) {
        entry.callback.call(entry.context, time);
      });
    };
    var defer = function (callback, argument, context) {
      return kindOf(argument) === 'Number' ? defer.timeout(callback, argument, context) : defer.immediate(callback, argument);
    };
    if (global.process && process.nextTick) {
      defer.immediate = function (callback, context) {
        return push(callbacks.immediate, callback, context, process.nextTick);
      };
    } else if (global.setImmediate) {
      defer.immediate = function (callback, context) {
        return push(callbacks.immediate, callback, context, setImmediate);
      };
    } else if (global.postMessage && global.addEventListener) {
      addEventListener('message', function (event) {
        if (event.source === global && event.data === '@deferred') {
          event.stopPropagation();
          iterate(callbacks.immediate);
        }
      }, true);
      defer.immediate = function (callback, context) {
        return push(callbacks.immediate, callback, context, function () {
          postMessage('@deferred', '*');
        });
      };
    } else {
      defer.immediate = function (callback, context) {
        return push(callbacks.immediate, callback, context, function (iterator) {
          setTimeout(iterator, 0);
        });
      };
    }
    var requestAnimationFrame = global.requestAnimationFrame || global.webkitRequestAnimationFrame || global.mozRequestAnimationFrame || global.oRequestAnimationFrame || global.msRequestAnimationFrame || function (callback) {
      setTimeout(callback, 1000 / 60);
    };
    defer.frame = function (callback, context) {
      return push(callbacks.frame, callback, context, requestAnimationFrame);
    };
    var clear;
    defer.timeout = function (callback, ms, context) {
      var ct = callbacks.timeout;
      if (!clear)
        clear = defer.immediate(function () {
          clear = null;
          callbacks.timeout = {};
        });
      return push(ct[ms] || (ct[ms] = []), callback, context, function (iterator) {
        setTimeout(iterator, ms);
      });
    };
    module.exports = defer;
  },
  './node_modules/quickstart/node_modules/mout/lang/toString.js': function (require, module, exports, global) {
    function toString(val) {
      return val == null ? '' : val.toString();
    }
    module.exports = toString;
  },
  './node_modules/quickstart/node_modules/mout/string/WHITE_SPACES.js': function (require, module, exports, global) {
    module.exports = [
      ' ',
      '\n',
      '\r',
      '\t',
      '\f',
      '\x0B',
      '\xA0',
      '\u1680',
      '\u180E',
      '\u2000',
      '\u2001',
      '\u2002',
      '\u2003',
      '\u2004',
      '\u2005',
      '\u2006',
      '\u2007',
      '\u2008',
      '\u2009',
      '\u200A',
      '\u2028',
      '\u2029',
      '\u202F',
      '\u205F',
      '\u3000'
    ];
  },
  './node_modules/quickstart/node_modules/mout/string/ltrim.js': function (require, module, exports, global) {
    var toString = require('./node_modules/quickstart/node_modules/mout/lang/toString.js');
    var WHITE_SPACES = require('./node_modules/quickstart/node_modules/mout/string/WHITE_SPACES.js');
    function ltrim(str, chars) {
      str = toString(str);
      chars = chars || WHITE_SPACES;
      var start = 0, len = str.length, charLen = chars.length, found = true, i, c;
      while (found && start < len) {
        found = false;
        i = -1;
        c = str.charAt(start);
        while (++i < charLen) {
          if (c === chars[i]) {
            found = true;
            start++;
            break;
          }
        }
      }
      return start >= len ? '' : str.substr(start, len);
    }
    module.exports = ltrim;
  },
  './node_modules/quickstart/node_modules/mout/string/rtrim.js': function (require, module, exports, global) {
    var toString = require('./node_modules/quickstart/node_modules/mout/lang/toString.js');
    var WHITE_SPACES = require('./node_modules/quickstart/node_modules/mout/string/WHITE_SPACES.js');
    function rtrim(str, chars) {
      str = toString(str);
      chars = chars || WHITE_SPACES;
      var end = str.length - 1, charLen = chars.length, found = true, i, c;
      while (found && end >= 0) {
        found = false;
        i = -1;
        c = str.charAt(end);
        while (++i < charLen) {
          if (c === chars[i]) {
            found = true;
            end--;
            break;
          }
        }
      }
      return end >= 0 ? str.substring(0, end + 1) : '';
    }
    module.exports = rtrim;
  },
  './node_modules/quickstart/node_modules/escodegen/node_modules/source-map/lib/source-map/base64.js': function (require, module, exports, global) {
    if (typeof define !== 'function') {
      var define = require('./node_modules/quickstart/node_modules/escodegen/node_modules/source-map/node_modules/amdefine/amdefine.js')(module, require);
    }
    define(function (require, exports, module) {
      var charToIntMap = {};
      var intToCharMap = {};
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('').forEach(function (ch, index) {
        charToIntMap[ch] = index;
        intToCharMap[index] = ch;
      });
      exports.encode = function base64_encode(aNumber) {
        if (aNumber in intToCharMap) {
          return intToCharMap[aNumber];
        }
        throw new TypeError('Must be between 0 and 63: ' + aNumber);
      };
      exports.decode = function base64_decode(aChar) {
        if (aChar in charToIntMap) {
          return charToIntMap[aChar];
        }
        throw new TypeError('Not a valid base 64 digit: ' + aChar);
      };
    });
  },
  './node_modules/quickstart/node_modules/escodegen/node_modules/source-map/node_modules/amdefine/amdefine.js': function (require, module, exports, global) {
    var process = require('./node_modules/quickstart/browser/process.js');
    var __filename = (process.cwd() + '/node_modules/quickstart/node_modules/escodegen/node_modules/source-map/node_modules/amdefine/amdefine.js').replace(/\/+/g, '/');
    'use strict';
    function amdefine(module, requireFn) {
      'use strict';
      var defineCache = {}, loaderCache = {}, alreadyCalled = false, path = require('./node_modules/quickstart/node_modules/path-browserify/index.js'), makeRequire, stringRequire;
      function trimDots(ary) {
        var i, part;
        for (i = 0; ary[i]; i += 1) {
          part = ary[i];
          if (part === '.') {
            ary.splice(i, 1);
            i -= 1;
          } else if (part === '..') {
            if (i === 1 && (ary[2] === '..' || ary[0] === '..')) {
              break;
            } else if (i > 0) {
              ary.splice(i - 1, 2);
              i -= 2;
            }
          }
        }
      }
      function normalize(name, baseName) {
        var baseParts;
        if (name && name.charAt(0) === '.') {
          if (baseName) {
            baseParts = baseName.split('/');
            baseParts = baseParts.slice(0, baseParts.length - 1);
            baseParts = baseParts.concat(name.split('/'));
            trimDots(baseParts);
            name = baseParts.join('/');
          }
        }
        return name;
      }
      function makeNormalize(relName) {
        return function (name) {
          return normalize(name, relName);
        };
      }
      function makeLoad(id) {
        function load(value) {
          loaderCache[id] = value;
        }
        load.fromText = function (id, text) {
          throw new Error('amdefine does not implement load.fromText');
        };
        return load;
      }
      makeRequire = function (systemRequire, exports, module, relId) {
        function amdRequire(deps, callback) {
          if (typeof deps === 'string') {
            return stringRequire(systemRequire, exports, module, deps, relId);
          } else {
            deps = deps.map(function (depName) {
              return stringRequire(systemRequire, exports, module, depName, relId);
            });
            process.nextTick(function () {
              callback.apply(null, deps);
            });
          }
        }
        amdRequire.toUrl = function (filePath) {
          if (filePath.indexOf('.') === 0) {
            return normalize(filePath, path.dirname(module.filename));
          } else {
            return filePath;
          }
        };
        return amdRequire;
      };
      requireFn = requireFn || function req() {
        return module.require.apply(module, arguments);
      };
      function runFactory(id, deps, factory) {
        var r, e, m, result;
        if (id) {
          e = loaderCache[id] = {};
          m = {
            id: id,
            uri: __filename,
            exports: e
          };
          r = makeRequire(requireFn, e, m, id);
        } else {
          if (alreadyCalled) {
            throw new Error('amdefine with no module ID cannot be called more than once per file.');
          }
          alreadyCalled = true;
          e = module.exports;
          m = module;
          r = makeRequire(requireFn, e, m, module.id);
        }
        if (deps) {
          deps = deps.map(function (depName) {
            return r(depName);
          });
        }
        if (typeof factory === 'function') {
          result = factory.apply(m.exports, deps);
        } else {
          result = factory;
        }
        if (result !== undefined) {
          m.exports = result;
          if (id) {
            loaderCache[id] = m.exports;
          }
        }
      }
      stringRequire = function (systemRequire, exports, module, id, relId) {
        var index = id.indexOf('!'), originalId = id, prefix, plugin;
        if (index === -1) {
          id = normalize(id, relId);
          if (id === 'require') {
            return makeRequire(systemRequire, exports, module, relId);
          } else if (id === 'exports') {
            return exports;
          } else if (id === 'module') {
            return module;
          } else if (loaderCache.hasOwnProperty(id)) {
            return loaderCache[id];
          } else if (defineCache[id]) {
            runFactory.apply(null, defineCache[id]);
            return loaderCache[id];
          } else {
            if (systemRequire) {
              return systemRequire(originalId);
            } else {
              throw new Error('No module with ID: ' + id);
            }
          }
        } else {
          prefix = id.substring(0, index);
          id = id.substring(index + 1, id.length);
          plugin = stringRequire(systemRequire, exports, module, prefix, relId);
          if (plugin.normalize) {
            id = plugin.normalize(id, makeNormalize(relId));
          } else {
            id = normalize(id, relId);
          }
          if (loaderCache[id]) {
            return loaderCache[id];
          } else {
            plugin.load(id, makeRequire(systemRequire, exports, module, relId), makeLoad(id), {});
            return loaderCache[id];
          }
        }
      };
      function define(id, deps, factory) {
        if (Array.isArray(id)) {
          factory = deps;
          deps = id;
          id = undefined;
        } else if (typeof id !== 'string') {
          factory = id;
          id = deps = undefined;
        }
        if (deps && !Array.isArray(deps)) {
          factory = deps;
          deps = undefined;
        }
        if (!deps) {
          deps = [
            'require',
            'exports',
            'module'
          ];
        }
        if (id) {
          defineCache[id] = [
            id,
            deps,
            factory
          ];
        } else {
          runFactory(id, deps, factory);
        }
      }
      define.require = function (id) {
        if (loaderCache[id]) {
          return loaderCache[id];
        }
        if (defineCache[id]) {
          runFactory.apply(null, defineCache[id]);
          return loaderCache[id];
        }
      };
      define.amd = {};
      return define;
    }
    module.exports = amdefine;
  },
  './node_modules/quickstart/node_modules/mout/time/now.js': function (require, module, exports, global) {
    function now() {
      return now.get();
    }
    now.get = typeof Date.now === 'function' ? Date.now : function () {
      return +new Date();
    };
    module.exports = now;
  },
  './node_modules/quickstart/node_modules/path-browserify/index.js': function (require, module, exports, global) {
    var process = require('./node_modules/quickstart/browser/process.js');
    function normalizeArray(parts, allowAboveRoot) {
      var up = 0;
      for (var i = parts.length - 1; i >= 0; i--) {
        var last = parts[i];
        if (last === '.') {
          parts.splice(i, 1);
        } else if (last === '..') {
          parts.splice(i, 1);
          up++;
        } else if (up) {
          parts.splice(i, 1);
          up--;
        }
      }
      if (allowAboveRoot) {
        for (; up--; up) {
          parts.unshift('..');
        }
      }
      return parts;
    }
    var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
    var splitPath = function (filename) {
      return splitPathRe.exec(filename).slice(1);
    };
    exports.resolve = function () {
      var resolvedPath = '', resolvedAbsolute = false;
      for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
        var path = i >= 0 ? arguments[i] : process.cwd();
        if (typeof path !== 'string') {
          throw new TypeError('Arguments to path.resolve must be strings');
        } else if (!path) {
          continue;
        }
        resolvedPath = path + '/' + resolvedPath;
        resolvedAbsolute = path.charAt(0) === '/';
      }
      resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function (p) {
        return !!p;
      }), !resolvedAbsolute).join('/');
      return (resolvedAbsolute ? '/' : '') + resolvedPath || '.';
    };
    exports.normalize = function (path) {
      var isAbsolute = exports.isAbsolute(path), trailingSlash = substr(path, -1) === '/';
      path = normalizeArray(filter(path.split('/'), function (p) {
        return !!p;
      }), !isAbsolute).join('/');
      if (!path && !isAbsolute) {
        path = '.';
      }
      if (path && trailingSlash) {
        path += '/';
      }
      return (isAbsolute ? '/' : '') + path;
    };
    exports.isAbsolute = function (path) {
      return path.charAt(0) === '/';
    };
    exports.join = function () {
      var paths = Array.prototype.slice.call(arguments, 0);
      return exports.normalize(filter(paths, function (p, index) {
        if (typeof p !== 'string') {
          throw new TypeError('Arguments to path.join must be strings');
        }
        return p;
      }).join('/'));
    };
    exports.relative = function (from, to) {
      from = exports.resolve(from).substr(1);
      to = exports.resolve(to).substr(1);
      function trim(arr) {
        var start = 0;
        for (; start < arr.length; start++) {
          if (arr[start] !== '')
            break;
        }
        var end = arr.length - 1;
        for (; end >= 0; end--) {
          if (arr[end] !== '')
            break;
        }
        if (start > end)
          return [];
        return arr.slice(start, end - start + 1);
      }
      var fromParts = trim(from.split('/'));
      var toParts = trim(to.split('/'));
      var length = Math.min(fromParts.length, toParts.length);
      var samePartsLength = length;
      for (var i = 0; i < length; i++) {
        if (fromParts[i] !== toParts[i]) {
          samePartsLength = i;
          break;
        }
      }
      var outputParts = [];
      for (var i = samePartsLength; i < fromParts.length; i++) {
        outputParts.push('..');
      }
      outputParts = outputParts.concat(toParts.slice(samePartsLength));
      return outputParts.join('/');
    };
    exports.sep = '/';
    exports.delimiter = ':';
    exports.dirname = function (path) {
      var result = splitPath(path), root = result[0], dir = result[1];
      if (!root && !dir) {
        return '.';
      }
      if (dir) {
        dir = dir.substr(0, dir.length - 1);
      }
      return root + dir;
    };
    exports.basename = function (path, ext) {
      var f = splitPath(path)[2];
      if (ext && f.substr(-1 * ext.length) === ext) {
        f = f.substr(0, f.length - ext.length);
      }
      return f;
    };
    exports.extname = function (path) {
      return splitPath(path)[3];
    };
    function filter(xs, f) {
      if (xs.filter)
        return xs.filter(f);
      var res = [];
      for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs))
          res.push(xs[i]);
      }
      return res;
    }
    var substr = 'ab'.substr(-1) === 'b' ? function (str, start, len) {
      return str.substr(start, len);
    } : function (str, start, len) {
      if (start < 0)
        start = str.length + start;
      return str.substr(start, len);
    };
  }
}));
