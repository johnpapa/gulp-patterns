module.exports = function(gulp, config, browserSync, changeEvent) {

  function addWatchForFileReload(isDev) {
      /**
       * Add watches to build and reload using browser-sync.
       * Use this XOR the browser-sync option.files, not both.
       * @param  {Boolean} isDev - dev or build mode
       */
     if (isDev) {
         gulp.watch([config.less], ['styles', browserSync.reload]);
         gulp.watch([config.client + '**/*', '!' + config.less], browserSync.reload)
             .on('change', function(event) { changeEvent(event); });
     }
     else {
         gulp.watch([config.less, config.js, config.html], ['build', browserSync.reload])
             .on('change', function(event) { changeEvent(event); });
     }
  }

  return addWatchForFileReload;

};
