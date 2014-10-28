require.plugins.push(
    'global.require(\'logger\', '
    + function (logger) {
        logger(__filename);
    }
    + ');'
);

require('logger', function () {
    require(
        // module dependencies
        ['example', 'url'],
        // module definition
        function define(example, url) {
            console.log(example, url);
        }
    );
});
