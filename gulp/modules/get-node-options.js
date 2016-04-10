module.exports = function (config) {

  function getNodeOptions(isDev) {
      var port = process.env.PORT || config.defaultPort;
      return {
          script: config.nodeServer,
          delayTime: 1,
          env: {
              'PORT': port,
              'NODE_ENV': isDev ? 'dev' : 'build'
          },
          watch: [config.server]
      };
  }

  return getNodeOptions;

};