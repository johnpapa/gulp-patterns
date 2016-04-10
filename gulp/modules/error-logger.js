module.exports = function (log) {
	/**
	 * Log an error message and emit the end of a task
	 */
	function errorLogger(error) {
			log('*** Start of Error ***');
			log(error);
			log('*** End of Error ***');
			this.emit('end');
	}

	return errorLogger;
};
