var require;

require = function (global) {
    'use strict';

    var env,
        modules,
        url,
        Module,
        require;

    if (!Function.prototype.bind) {
        Function.prototype.bind = function bind(target) {
            var instance,
                args,
                constructor,
                bound;

            instance = this;

            if (typeof instance !== 'function') {
                throw new TypeError('Unable to bind '.concat(instance));
            }

            args = Array.prototype.slice.call(arguments, 1);
            constructor = function () {};

            bound = function bound() {
                return instance.apply(
                    this instanceof constructor
                    && target
                        ? this
                        : target,
                    args.concat(Array.prototype.slice.call(arguments))
                );
            };

            constructor.prototype = instance.prototype;
            bound.prototype = new constructor();

            return bound;
        };
    }

    env = {};
    modules = {};

    url = (function () {
        var absolutePattern,
            trailings1Pattern,
            trailings2Pattern,
            trailings3Pattern,
            rootPattern,
            parentsPattern,
            currentPattern,
            resolve,
            clean,
            concat,
            parseHost,
            isSegment,
            isAbsolute,
            removeTraillingSlashes;

        absolutePattern = /^(\w+:)?\/\//;
        trailings1Pattern = /([^/][^:])\/+/g;
        trailings2Pattern = /^(\/\/)\/+(.*)(\/+)?/;
        trailings3Pattern = /(\/)+$/;
        rootPattern = /^([^/]*\/\/[^/]+).*/;
        parentsPattern = /\/[^/]+\/\.\./g;
        currentPattern = /\/\./g;

        resolve = function resolve() {
            var segments;

            segments = Array.prototype.slice.call(arguments);

            if (!arguments.length) {
                return env.cwd;
            }

            return concat(parseHost(clean(segments)));
        }

        clean = function clean(segments) {
            var iterator,
                length,
                segment;

            iterator = 0;
            length = segments.length;

            for (; iterator < segments.length; iterator += 1) {
                segment = segments[iterator];

                if (!isSegment(segment)) {
                    segments.splice(iterator, 1);

                    continue;
                }

                segment = removeTraillingSlashes(segment);
                segments[iterator] = segment;
            }

            return segments;
        };

        parseHost = function parseHost(segments) {
            var iterator,
                segment;

            iterator = segments.length - 1;

            for (; iterator > -1; iterator -= 1) {
                segment = segments[iterator];

                if (isAbsolute(segment)) {
                    segments.splice(0, iterator);

                    break;
                }
            }

            if (iterator === -1) {
                segments.unshift(env.cwd);
            }

            return segments;
        };

        concat = function concat(segments) {
            var result,
                iterator,
                length,
                segment;

            result = segments[0];
            iterator = 1;
            length = segments.length;

            for (; iterator < length; iterator += 1) {
                segment = segments[iterator];

                if (segment.charAt(0) !== '/') {
                    result = result.concat('/', segment);

                    continue;
                }

                result = result.replace(rootPattern, '$1'.concat(segment));
            }

            return result.replace(parentsPattern, '')
                .replace(currentPattern, '');
        };

        isSegment = function isSegment(segment) {
            if (typeof segment !== 'string') {
                throw new TypeError('Arguments to url.resolve must be strings');
            }

            return !!segment;
        };

        isAbsolute = function isAbsolute(segment) {
            return absolutePattern.test(segment);
        };

        removeTraillingSlashes = function removeTraillingSlashes(segment) {
            return segment.replace(trailings1Pattern, '$1/')
                .replace(trailings2Pattern, '$1$2')
                .replace(trailings3Pattern, '');
        };

        return {
            resolve: resolve
        };
    }());

    void function detectCwd() {
        var iterator,
            scripts,
            length,
            requirePattern,
            matches,
            cwd;

        iterator = 0;
        scripts = document.getElementsByTagName('script');
        length = scripts.length;
        requirePattern = /(.*)\/(?:easy-require)((?:\.min)?\.js$)/;

        for (; iterator < length; iterator += 1) {
            matches = scripts[iterator]
                .getAttribute('src')
                .match(requirePattern);

            if (matches && matches.length === 3) {
                break;
            }
        }

        cwd = matches[1];

        if (cwd.indexOf('//') === -1) {
            cwd = url.resolve('//'.concat(window.location.host), cwd);
        }

        env.cwd = cwd;
        env.extension = matches[2];
    }();

    Module = (function build() {
        var dirnamePattern,
            extensionPattern,
            noop,
            execute,
            Module,
            prototype,
            parseUrl;

        dirnamePattern = /(\/[^\/]+)$/;
        extensionPattern = /(\.js)$/;
        noop = function noop() {};

        execute = Function.bind(
            undefined,
            'global',
            'module',
            'exports',
            'require',
            '__dirname',
            '__filename'
        );

        Module = function Module(url) {
            var instance;

            instance = this;
            instance.status = Module.INIT;
            instance.url = url;
            instance.mode = 0;

            instance.dirname = url.replace(dirnamePattern, '/');

            instance.callers = [];
            instance.dependencies = [];
            instance.require = instance.require.bind(instance);
            instance.onload = instance.onload.bind(instance);

            instance.module = {
                exports: {}
            };
        };

        Module.INIT = 0;
        Module.MODULE_LOADING = 1;
        Module.MODULE_LOADED = 2;
        Module.DEPENDENCIES_LOADING = 3;
        Module.DEPENDENCIES_LOADED = 4;
        Module.MODULE_DEFINED = 5;

        Module.loadInstance = function loadInstance(caller, modulePath) {
            var url,
                instance;

            url = parseUrl(caller.dirname, modulePath);
            instance = modules[url];

            if (!instance) {
                modules[url] =
                instance = new Module(url);
            }

            setTimeout(instance.addCaller.bind(instance, caller));

            return instance;
        };

        prototype = Module.prototype;

        prototype.addCaller = function addCaller(caller) {
            var instance,
                status;

            instance = this;
            instance.callers.push(caller);
            status = instance.status;

            if (status === Module.MODULE_DEFINED) {
                return instance.dispatch();
            }

            status === Module.INIT
            && instance.load();
        };

        prototype.load = function load() {
            var instance,
                ajax;

            instance = this;
            instance.status = Module.MODULE_LOADING;
            ajax = modules.ajax.module.exports;
            ajax(instance);

            return instance;
        };

        prototype.dispatch = function dispatch() {
            var instance,
                callers,
                caller;

            instance = this;
            callers = instance.callers;

            while (callers.length) {
                caller = callers.shift();
                caller.ondependency();
            }
        };

        prototype.onload = function onload(xhr) {
            var instance,
                module,
                closure;

            instance = this;
            module = instance.module;
            instance.status = Module.MODULE_LOADED;
            closure = execute(xhr.responseText);

            closure.call(
                instance,
                global,
                module,
                module.exports,
                instance.require,
                instance.dirname,
                instance.url
            );
        };

        prototype.require = function require(dependencies, define) {
            var instance,
                iterator,
                length,
                url,
                dependency;

            instance = this;

            instance.define = typeof define === 'function'
                ? define
                : noop;

            instance.status = Module.DEPENDENCIES_LOADING;

            if (!dependencies.length) {
                instance.status = Module.DEPENDENCIES_LOADED;
                instance.define.call({});
                instance.exports = instance.module.exports;
                instance.status = Module.MODULE_DEFINED;

                return instance.dispatch();
            }

            iterator = 0;

            instance.remainingDependencies =
            length = dependencies.length;

            for (; iterator < length; iterator += 1) {
                url = dependencies[iterator];
                dependency = Module.loadInstance(instance, url);
                instance.dependencies.push(dependency);
            }
        };

        prototype.ondependency = function ondependency() {
            var instance,
                args,
                iterator,
                length,
                dependencies;

            instance = this;
            instance.remainingDependencies -= 1;

            if (instance.remainingDependencies) {
                return;
            }

            args = [];
            iterator = 0;
            dependencies = instance.dependencies;
            length = dependencies.length;

            for (; iterator < length; iterator += 1) {
                args.push(dependencies[iterator].module.exports);
            }

            instance.status = Module.DEPENDENCIES_LOADED;
            instance.define.apply({}, args);
            instance.status = Module.MODULE_DEFINED;
            instance.dispatch();
        };

        parseUrl = function parseUrl(dirname, filename) {
            var resolve,
                extension,
                resolved,
                url;

            if (filename === 'ajax' || filename === 'url') {
                return filename;
            }

            extension = env.extension;
            resolve = modules.url.module.exports.resolve;

            if (filename.charAt(0) === '.') {
                resolved = resolve(dirname, filename);
            } else {
                resolved = resolve(filename);
            }

            url = resolved.substring(resolved.length - 3) === '.js'
                ? extension === '.js'
                    ? resolved
                    : resolved.replace(extensionPattern, extension)
                : resolved.concat('/index', extension);

            return url;
        };

        return Module;
    }());

    void function defineEmbeddedModules() {
        var ajax;

        modules.ajax =
        ajax = new Module('ajax');

        ajax.module.exports = (function() {
            var queue,
                ajax,
                parseOptions;

            queue = [];

            ajax = function ajax(options) {
                var xhr;

                xhr = new XMLHttpRequest();

                parseOptions(xhr, options);

                xhr.onreadystatechange = function onreadystatechange() {
                    var onload;

                    onload = xhr.onload;

                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {

                            if (onload) {
                                onload(xhr);
                            }

                            xhr.sendNext();
                        } else {
                            clearTimeout(xhr._timeout);

                            xhr._timeout = setTimeout(function() {
                                if ('sendRequest' in xhr) {
                                    xhr.sendRequest();
                                }
                            }, xhr.delay);
                        }
                    }
                };

                xhr.sendRequest = function sendRequest() {
                    var iterator,
                        method,
                        headers,
                        length,
                        data,
                        isGet,
                        url,
                        header;

                    iterator = 0;
                    method = xhr.method;
                    headers = xhr.headers;
                    length = headers.length;
                    data = xhr.data;
                    isGet = method === 'get';
                    url = xhr.url;

                    if (isGet && data) {
                        if (url.indexOf('?') !== -1) {
                            url = url.concat('&', data);
                        } else if (data.indexOf('?') === -1) {
                            url = url.concat('?', data);
                        }
                    }

                    xhr.open(method, url, xhr.async);

                    if (isGet) {
                        xhr.send('');

                        return;
                    }

                    for (;iterator < length;iterator += 1) {
                        header = headers[iterator];

                        xhr.setRequestHeader(header.name, header.value);
                    }

                    xhr.send(data === undefined
                        ? ''
                        : data
                    );
                };

                xhr.sendNext = function sendNext() {
                    var request,
                        readyState;

                    request = queue[0];

                    if (request) {
                        readyState = request.readyState;

                        if (readyState === 4 && request.status === 200) {
                            queue.shift();

                            if (queue.length !== 0) {
                                request.sendRequest();
                            }
                        } else if (readyState === 0) {
                            this.sendRequest();
                        }
                    }
                };

                xhr.cancel = function(deep) {
                    if (deep && deep > 0 && queue.length !== 1) {
                        queue[1].cancel(deep - 1);
                    }

                    this.abort();
                    queue.shift();
                };

                if (xhr.mode > ajax.ENQUEUE) {
                    xhr.sendRequest();

                    return xhr;
                }

                queue.push(xhr);
                queue[0].sendNext();

                return xhr;
            };

            ajax.ENQUEUE = 0;
            ajax.ASYNC = 1;
            ajax.SYNC = 2;

            parseOptions = function parseOptions(xhr, options) {
                var mode;

                xhr.url = options.url;

                xhr.mode =
                mode = ~~options.mode % 3;

                xhr.async = mode < ajax.SYNC;

                xhr.data = options.hasOwnProperty('data')
                    ? options.data
                    : null;

                xhr.method = options.hasOwnProperty('method')
                    ? options.method
                    : 'GET';

                xhr.onload = typeof options.onload === 'function'
                    ? options.onload
                    : null;

                xhr.delay = options.hasOwnProperty('delay')
                    ? options.delay
                    : 1000;

                xhr.headers = options.hasOwnProperty('headers')
                    ? options.headers
                    : [];

                xhr.headers.push({
                    name: 'HTTP_X_REQUESTED_WITH',
                    value: 'xmlhttprequest'
                });

                if (xhr.method !== 'GET') {
                    xhr.headers.push({
                        name: 'Content-Type',
                        value: 'application/x-www-form-urlencoded'
                    });
                }
            };

            return ajax;
        }());

        ajax.status = Module.MODULE_DEFINED;

        modules.url = new Module('url');

        modules.url.module.exports = url;

        modules.url.status = Module.MODULE_DEFINED;
    }();

    require = function require(dependencies, define) {
        var instance,
            deferred;

        instance = new Module(env.cwd);
        deferred = instance.require.bind(instance, dependencies, define);
        setTimeout(deferred);
    };

    return require;
}(this);
