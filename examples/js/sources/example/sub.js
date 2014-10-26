require([], function () {
    console.log('/example/sub module loaded');
    
    module.exports.dirname = __dirname;
});
