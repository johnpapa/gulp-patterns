'use strict';

var path = require('path'),
    crypto = require('crypto'),
    PassThrough = require('stream').PassThrough,
    _ = require('lodash-node'),
    should = require('should'),
    sinon = require('sinon'),
    map = require('map-stream'),
    gutil = require('gulp-util');

var cache = require('../index');

require('mocha');

describe('gulp-cache', function () {
    var sandbox,
        fakeFileHandler,
        fakeTask;

    beforeEach(function (done) {
        sandbox = sinon.sandbox.create();

        // Spy on the fakeFileHandler to check if it gets called later
        fakeFileHandler = sandbox.spy(function (file, cb) {
            file.ran = true;

            if (Buffer.isBuffer(file.contents)) {
                file.contents = new Buffer(file.contents.toString('utf8') + '-modified');
            }
            
            cb(null, file);
        });
        fakeTask = map(fakeFileHandler);

        cache.fileCache.clear('default', done);
    });

    afterEach(function () {
        sandbox.restore();
    });

    it('throws an error if no task is passed', function () {
        var shouldThrow = function () {
            var proxied = cache();
        };

        shouldThrow.should.throw();
    });

    describe('in streaming mode', function () {
        it('does not work', function () {
            // create the fake file
            var fakeStream = new PassThrough(),
                fakeFile = new gutil.File({
                    contents: fakeStream
                });

            // Create a proxied plugin stream
            var proxied = cache(fakeTask, {
                key: function (file, cb) {
                    // For testing async key generation
                    setTimeout(function () {
                        cb(null, '123');
                    }, 1);
                },
                value: function (file, cb) {
                    // For testing async value generation
                    setTimeout(function () {
                        cb(null, {
                            ran: file.ran,
                            cached: true
                        });
                    }, 1);
                }
            });

            // write the fake file to it
            var writeFile = function () {
                proxied.write(fakeFile);
            };

            writeFile.should.throw();
        });
    });

    describe('in buffered mode', function () {
        it('can clear all the cache', function (done) {
            cache.clearAll(function (err) {
                done(err);
            });
        });

        it('can clear specific cache', function (done) {
            var fakeFileCache = {
                    removeCached: sandbox.spy(function (category, hash, done) {
                        return done();
                    })
                },
                someKeyHash = crypto.createHash('md5').update('somekey').digest('hex'),
                fakeFile = new gutil.File({
                    contents: new Buffer('something')
                });

            var toClear = cache.clear({
                name: 'somename',
                fileCache: fakeFileCache,
                key: function () {
                    return 'somekey';
                }
            });

            toClear.write(fakeFile);

            toClear.once('data', function () {
                fakeFileCache.removeCached.calledWith('somename', someKeyHash).should.equal(true);

                done();
            });
        });

        it('only caches successful tasks', function (done) {
            // create the fake file
            var fakeFile = new gutil.File({
                    contents: new Buffer('abufferwiththiscontent')
                });

            // Create a proxied plugin stream
            var valStub = sandbox.stub().returns({
                    ran: true,
                    cached: true
                }),
                proxied = cache(fakeTask, {
                    success: function () {
                        return false;
                    },
                    value: valStub
                });

            proxied.write(fakeFile);

            proxied.once('data', function (file) {
                valStub.called.should.equal(false);

                done();
            });
        });

        it('sets the content correctly on subsequently ran cached tasks', function (done) {
            // create the fake file
            var fakeFile = new gutil.File({
                    contents: new Buffer('abufferwiththiscontent')
                }),
                otherFile = new gutil.File({
                    contents: new Buffer('abufferwiththiscontent')
                });

            // Create a proxied plugin stream
            var proxied = cache(fakeTask, {
                    success: function () {
                        return true;
                    }
                });

            proxied.write(fakeFile);

            proxied.once('data', function (file) {
                file.contents.toString('utf8').should.equal('abufferwiththiscontent-modified');

                proxied.write(otherFile);

                proxied.once('data', function (file2) {
                    should.exist(file2.contents);

                    file2.contents.toString('utf8').should.equal('abufferwiththiscontent-modified');

                    done();
                });
            });
        });

        it('can proxy a task with specific options', function (done) {
            // create the fake file
            var fakeFile = new gutil.File({
                    contents: new Buffer('abufferwiththiscontent')
                }),
                otherFile = new gutil.File({
                    contents: new Buffer('abufferwiththiscontent')
                });

            // Create a proxied plugin stream
            var proxied = cache(fakeTask, {
                value: function (file) {
                    return {
                        ran: file.ran,
                        cached: true,
                        contents: (file.contents || file._contents)
                    };
                }
            });

            // write the fake file to it
            proxied.write(fakeFile);

            // wait for the file to come back out
            proxied.once('data', function (file) {
                // make sure it came out the same way it went in
                file.isBuffer().should.equal(true);

                // check the contents are same
                file.contents.toString('utf8').should.equal('abufferwiththiscontent-modified');

                // Check it assigned the proxied task result
                file.ran.should.equal(true);
                should.not.exist(file.cached);

                // Check the original task was called
                fakeFileHandler.called.should.equal(true);

                // Reset for the second run through
                fakeFileHandler.reset();

                // Write the same file again, should be cached result
                proxied.write(otherFile);

                proxied.once('data', function (secondFile) {
                    // make sure it came out the same way it went in
                    secondFile.isBuffer().should.equal(true);

                    // check the contents are same
                    secondFile.contents.toString('utf8').should.equal('abufferwiththiscontent-modified');

                    // Cached value should have been applied
                    secondFile.ran.should.equal(true);
                    secondFile.cached.should.equal(true);

                    // Should not have called the original task
                    fakeFileHandler.called.should.equal(false);

                    done();
                });
            });
        });

        it('can proxy a task using task.cacheable', function (done) {
            // create the fake file
            var fakeFile = new gutil.File({
                    contents: new Buffer('abufferwiththiscontent')
                }),
                otherFile = new gutil.File({
                    contents: new Buffer('abufferwiththiscontent')
                });

            // Let the task define the cacheable aspects.
            fakeTask.cacheable = {
                key: sandbox.spy(function (file) {
                    return file.contents.toString('utf8');
                }),
                success: sandbox.stub().returns(true),
                value: sandbox.spy(function (file) {
                    return {
                        ran: true,
                        cached: true,
                        contents: file.contents || file._contents
                    };
                })
            };

            var proxied = cache(fakeTask);

            // write the fake file to it
            proxied.write(fakeFile);

            // wait for the file to come back out
            proxied.once('data', function (file) {
                // make sure it came out the same way it went in
                file.isBuffer().should.equal(true);

                // check the contents are same
                file.contents.toString('utf8').should.equal('abufferwiththiscontent-modified');

                // Verify the cacheable options were used.
                fakeTask.cacheable.key.called.should.equal(true);
                fakeTask.cacheable.success.called.should.equal(true);
                fakeTask.cacheable.value.called.should.equal(true);

                _.invoke([
                        fakeTask.cacheable.key, 
                        fakeTask.cacheable.success, 
                        fakeTask.cacheable.value,
                        fakeFileHandler
                    ], 'reset');

                // Write the same file again, should be cached result
                proxied.write(otherFile);

                proxied.once('data', function (secondFile) {
                    fakeTask.cacheable.key.called.should.equal(true);
                    fakeTask.cacheable.success.called.should.equal(false);
                    fakeTask.cacheable.value.called.should.equal(false);

                    // Should not have called the original task
                    fakeFileHandler.called.should.equal(false);

                    // Cached value should have been applied
                    secondFile.cached.should.equal(true);

                    done();
                });
            });
        });

        it('can proxy a task using task.cacheable with user overrides', function (done) {
            // create the fake file
            var fakeFile = new gutil.File({
                    contents: new Buffer('abufferwiththiscontent')
                }),
                otherFile = new gutil.File({
                    contents: new Buffer('abufferwiththiscontent')
                });

            // Let the task define the cacheable aspects.
            fakeTask.cacheable = {
                key: sandbox.spy(function (file) {
                    return file.contents.toString('utf8');
                }),
                success: sandbox.stub().returns(true),
                value: sandbox.stub().returns({
                    ran: true,
                    cached: true
                })
            };

            var overriddenValue = sandbox.stub().returns({
                    ran: true,
                    cached: true,
                    overridden: true
                }),
                proxied = cache(fakeTask, {
                    value: overriddenValue
                });

            // write the fake file to it
            proxied.write(fakeFile);

            // wait for the file to come back out
            proxied.once('data', function (file) {
                // make sure it came out the same way it went in
                file.isBuffer().should.equal(true);

                // check the contents are same
                file.contents.toString('utf8').should.equal('abufferwiththiscontent-modified');

                // Verify the cacheable options were used.
                fakeTask.cacheable.key.called.should.equal(true);
                fakeTask.cacheable.success.called.should.equal(true);
                fakeTask.cacheable.value.called.should.equal(false);
                overriddenValue.called.should.equal(true);

                _.invoke([
                        fakeTask.cacheable.key, 
                        fakeTask.cacheable.success, 
                        fakeTask.cacheable.value,
                        overriddenValue,
                        fakeFileHandler
                    ], 'reset');

                // Write the same file again, should be cached result
                proxied.write(otherFile);

                proxied.once('data', function (secondFile) {
                    // Cached value should have been applied
                    secondFile.cached.should.equal(true);
                    secondFile.overridden.should.equal(true);

                    fakeTask.cacheable.key.called.should.equal(true);
                    fakeTask.cacheable.success.called.should.equal(false);
                    fakeTask.cacheable.value.called.should.equal(false);
                    overriddenValue.called.should.equal(false);

                    // Should not have called the original task
                    fakeFileHandler.called.should.equal(false);

                    done();
                });
            });
        });

        it('can be passed just a string for the value', function (done) {
            // create the fake file
            var fakeFile = new gutil.File({
                    contents: new Buffer('abufferwiththiscontent')
                }),
                otherFile = new gutil.File({
                    contents: new Buffer('abufferwiththiscontent')
                });

            // Create a proxied plugin stream
            var proxied = cache(fakeTask, {
                value: 'ran'
            });

            // write the fake file to it
            proxied.write(fakeFile);

            // wait for the file to come back out
            proxied.once('data', function (file) {
                // Check it assigned the proxied task result
                file.ran.should.equal(true);

                // Write the same file again, should be cached result
                proxied.write(otherFile);

                proxied.once('data', function (secondFile) {
                    // Cached value should have been applied
                    secondFile.ran.should.equal(true);

                    done();
                });
            });
        });

        it('can store changed contents of files', function (done) {
            // create the fake file
            var fakeFile = new gutil.File({
                    contents: new Buffer('abufferwiththiscontent')
                }),
                updatedFileHandler = sandbox.spy(function (file, cb) {
                    file.contents = new Buffer('updatedcontent');

                    cb(null, file);
                });

            fakeTask = map(updatedFileHandler);

            // Create a proxied plugin stream
            var proxied = cache(fakeTask);

            // write the fake file to it
            proxied.write(fakeFile);

            // wait for the file to come back out
            proxied.once('data', function (file) {
                // Check for updated content
                file.contents.toString().should.equal('updatedcontent');

                // Check original handler was called
                updatedFileHandler.called.should.equal(true);

                updatedFileHandler.reset();

                // Write the same file again, should be cached result
                proxied.write(new gutil.File({
                    contents: new Buffer('abufferwiththiscontent')
                }));

                proxied.once('data', function (secondFile) {
                    // Check for updated content
                    file.contents.toString().should.equal('updatedcontent');

                    // Check original handler was not called.
                    updatedFileHandler.called.should.equal(false);

                    done();
                });
            });
        });

        it('does not throw memory leak warning when proxying tasks', function (done) {
            var files = _.times(30, function (i) {
                    return new gutil.File({
                        contents: new Buffer('Test File ' + i)
                    });
                }),
                fakeTask = map(function (file, cb) {
                    setTimeout(function () {
                        file.contents = new Buffer(file.contents.toString() + ' updated');

                        cb(null, file);
                    }, 10);
                }),
                proxied = cache(fakeTask);

            var origMaxListeners = fakeTask._maxListeners;
            var errSpy = sandbox.spy(console, 'error');

            var processedCount = 0;
            proxied.on('data', function () {
                processedCount += 1;

                if (processedCount === files.length) {
                    errSpy.called.should.equal(false, 'Called console.error');
                    fakeTask._maxListeners.should.equal(origMaxListeners || 0);

                    done();
                }
            });

            _.each(files, function (file) {
                proxied.write(file);
            });
        });

        it('sets the path on cached results', function (done) {
            // create the fake file
            var filePath = path.join(process.cwd(), 'test', 'fixtures', 'in', 'file1.txt'),
                fakeFile = new gutil.File({
                    base: path.dirname(filePath),
                    path: filePath,
                    contents: new Buffer('abufferwiththiscontent')
                }),
                updatedFileHandler = sandbox.spy(function (file, cb) {
                    file.contents = new Buffer('updatedcontent');

                    cb(null, file);
                });

            fakeTask = map(updatedFileHandler);

            // Create a proxied plugin stream
            var proxied = cache(fakeTask);

            // write the fake file to it
            proxied.write(fakeFile);

            // wait for the file to come back out
            proxied.once('data', function (file) {
                // Check original handler was called
                updatedFileHandler.called.should.equal(true);

                // Check the path is on there
                file.path.should.equal(filePath);

                updatedFileHandler.reset();

                // Write the same file again, should be cached result
                proxied.write(new gutil.File({
                    contents: new Buffer('abufferwiththiscontent')
                }));

                proxied.once('data', function (secondFile) {
                    // Check for same file path
                    should.exist(secondFile.path);
                    secondFile.path.should.equal(filePath);

                    // Check original handler was not called.
                    updatedFileHandler.called.should.equal(false);

                    done();
                });
            });
        });
    });
});