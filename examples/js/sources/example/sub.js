require([], function () {
    console.log('/test/sub module loaded');
    
    module.exports.dirname = __dirname;
});
