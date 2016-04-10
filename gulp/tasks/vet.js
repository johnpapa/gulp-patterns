module.exports = function (gulp, config, $if, args, jshint, jscs, log, print) {

  gulp.task('vet', function() {
    /**
     * vet the code and create coverage report
     * @return {Stream}
     */
      log('Analyzing source with JSHint and JSCS');

      return gulp
          .src(config.alljs)
          .pipe($if(args.verbose, print()))
          .pipe(jshint())
          .pipe(jshint.reporter('jshint-stylish', {verbose: true}))
          .pipe(jshint.reporter('fail'))
          .pipe(jscs());
  });

};
