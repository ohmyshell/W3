module.exports = async () => {
  var log = console.log;
  console.log = function (a) {
    log('[' + new Date().toLocaleString() + ']: ' + a);
  };

  var warn = console.warn;
  console.warn = function (a) {
    warn('[' + new Date().toLocaleString() + ']: ' + a);
  };

  var error = console.error;
  console.error = function (a) {
    error('[' + new Date().toLocaleString() + ']: ' + a);
  };
};
