require(function () {
    var console;
    
    console = global.console;
    
    module.exports = console.log.bind(console, 'module loaded :');
});
