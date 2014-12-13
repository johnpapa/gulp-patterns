module.exports = (function() {
    var exports = {
        config: getConfig()
    };
    return exports;

    function getConfig() {
        return {
            "client": "./src/client/",
            "server": "./src/server/",
            "htmltemplates": "./src/client/app/**/*.html",
            "less": [
                "./src/client/content/styles.less"
            ],
            "js": [
                "src/client/app/**/*.module.js",
                "src/client/app/**/*.js",
                "!src/client/app/**/*.spec.js"
            ],
            "specs": [
                "./src/client/app/**/*.spec.js"
            ],
            "alljs": [
                "./src/client/app/**/*.js",
                "./src/server/**/*.js",
                "./src/client/test-helpers/**/*.js"
            ],
            "appjs": "src/client/app/**/*.js",
            "fonts": [
                "./bower_components/font-awesome/fonts/**/*.*"
            ],
            "images": [
                "./src/client/content/images/**/*.*"
            ],
            "build": "./build/",
            "temp": "./.tmp/",
            "report": "./report/",
            "defaultPort": "7203",
            "templateCache": {
                "module": "app.core",
                "file": "templates.js",
                "root": "app/"
            },
            "bower": {
                "directory": "./bower_components/",
                "ignorePath": "../.."
            }
        }
    }
}());
