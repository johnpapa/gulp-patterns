'use strict';

var chai = require('chai')
  , expect = chai.expect
  , sinon = require('sinon')
  , sinonChai = require('sinon-chai')
  , html = require('./fixtures/html.json')
  , Minimize = require('../lib/minimize')
  , minimize = new Minimize();

chai.use(sinonChai);
chai.config.includeStack = true;

describe('Minimize', function () {
  describe('is module', function () {
    it('which has a constructor', function () {
      expect(Minimize).to.be.a('function');
    });

    it('which has minifier', function () {
      expect(minimize).to.have.property('minifier');
      expect(minimize.minifier).to.be.a('function');
    });

    it('which has traverse', function () {
      expect(minimize).to.have.property('traverse');
      expect(minimize.traverse).to.be.a('function');
    });

    it('which has parse', function () {
      expect(minimize).to.have.property('parse');
      expect(minimize.parse).to.be.a('function');
    });

    it('which has walk', function () {
      expect(minimize).to.have.property('walk');
      expect(minimize.walk).to.be.a('function');
    });

    it('which has htmlparser', function () {
      expect(minimize).to.have.property('htmlparser');
      expect(minimize.htmlparser).to.be.an('object');
    });
  });

  describe('function minifier', function () {
    it('throws an error if HTML parsing failed', function () {
      function err () {
        minimize.minifier('some error', []);
      }

      expect(err).throws('Minifier failed to parse DOM');
    });

    it('should start traversing the DOM as soon as HTML parser is ready', function () {
      var emit = sinon.spy(minimize, 'emit');

      minimize.minifier(null, []);
      expect(emit).to.be.calledOnce;

      var result = emit.getCall(0).args;
      expect(result).to.be.an('array');
      expect(result[0]).to.be.equal('parsed');
      expect(result[1]).to.be.equal(null);
      expect(result[2]).to.be.equal('');

      emit.restore();
    });

    it('should handle inline flow properly', function (done) {
      minimize.parse(html.interpunction, function (error, result) {
        expect(result).to.equal('<h3>Become a partner</h3><p>Interested in being part of the solution? <a href=/company/contact>Contact Nodejitsu to discuss</a>.</p>');
        done();
      });
    });

    it('should be configurable to retain comments', function (done) {
      var commentable = new Minimize({ comments: true });
      commentable.parse(html.comment, function (error, result) {
        expect(result).to.equal('<!-- some HTML comment --><!--#include virtual=\"/header.html\" --><div class=\"slide nodejs\"><h3>100% Node.js</h3><p>We are Node.js experts and the first hosting platform to build our full stack in node. We understand your node application better than anyone.</p></div>');
        done();
      });
    });

    it('should be configurable to retain server side includes', function (done) {
      var commentable = new Minimize({ ssi: true });
      commentable.parse(html.ssi, function (error, result) {
        expect(result).to.equal('<!--#include virtual=\"/header.html\" --><div class=\"slide nodejs\"><h3>100% Node.js</h3><p>We are Node.js experts and the first hosting platform to build our full stack in node. We understand your node application better than anyone.</p></div>');
        done();
      });
    });

    it('should be configurable to retain multiple server side includes', function (done) {
      var commentable = new Minimize({ ssi: true });
      commentable.parse(html.ssimulti, function (error, result) {
        expect(result).to.equal('<!--#include virtual=\"/head.html\" --><!--#include virtual=\"/header.html\" --><div class=\"slide nodejs\"><h3>100% Node.js</h3><p>We are Node.js experts and the first hosting platform to build our full stack in node. We understand your node application better than anyone.</p></div>');
        done();
      });
    });

    it('should be configurable to retain conditional IE comments', function (done) {
      var commentable = new Minimize({ conditionals: true });
      commentable.parse(html.ie, function (error, result) {
        expect(result).to.equal('<!--[if IE 6]>Special instructions for IE 6 here<![endif]--><div class=\"slide nodejs\"><h3>100% Node.js</h3></div>');
        done();
      });
    });

    it('should be configurable to retain multiple conditional IE comments', function (done) {
      var commentable = new Minimize({ conditionals: true });
      commentable.parse(html.iemulti, function (error, result) {
        expect(result).to.equal('<!--[if IE 10]>Special instructions for IE 10 here<![endif]--><!--[if IE 6]>Special instructions for IE 6 here<![endif]--><div class=\"slide nodejs\"><h3>100% Node.js</h3></div>');
        done();
      });
    });

    it('should be configurable to retain empty attributes', function (done) {
      var empty = new Minimize({ empty: true });
      empty.parse(html.empty, function (error, result) {
        expect(result).to.equal('<h1 class="slide nodejs">a</h1><h2 name>b</h2><h3 id=lol>c</h3><h4 disabled>d</h4><h5 autofocus>e</h5><h6 itemscope>f</h6>');
        done();
      });
    });

    it('should be configurable to retain spare attributes', function (done) {
      var spare = new Minimize({ spare: true });
      spare.parse(html.empty, function (error, result) {
        expect(result).to.equal('<h1 class="slide nodejs">a</h1><h2>b</h2><h3 id=lol>c</h3><h4 disabled=disabled>d</h4><h5 autofocus=true>e</h5><h6 itemscope="">f</h6>');
        done();
      });
    });

    it('should leave structural elements (like scripts and code) intact', function (done) {
      minimize.parse(html.code, function (error, result) {
        expect(result).to.equal("<code class=copy>\n<span>var http = require('http');\nhttp.createServer(function (req, res) {\n    res.writeHead(200, {'Content-Type': 'text/plain'});\n    res.end('hello, i know nodejitsu');\n})listen(8080);</span><a href=#><s class=ss-layers role=presentation></s> copy</a></code>");
        done();
      });
    });

    it('should leave style element content intact', function (done) {
      minimize.parse(html.styles, function (error, result) {
        expect(result).to.equal("<style> .test { color: #FFF   }</style><style>.test { color: black }</style>");
        done();
      });
    });

    it('should minify script content that is not real text/javascript as much as possible', function (done) {
      minimize.parse(html.noscript, function (error, result) {
        expect(result).to.equal('<script type=imno/script id=plates-forgot><h3> Forgot your password? <a href="#" class="close ss-delete"></a> </h3> <p>Tell us your username and we will reset it for you.</p> <p class="error alert"></p> <p class="success alert"></p></script>');
        done();
      });
    });

    it('should replace newlines between text with spaces', function (done) {
      minimize.parse(html.newlines, function (error, result) {
        expect(result).to.equal("<li>We&#39;re <a href=http://nodejitsu.com>Nodejitsu</a>, and we can give you scalable, fault-tolerant cloud hosting for your Node.js apps - and we&#39;re the best you&#39;ll find.</li>");
        done();
      });
    });

    it('should prepend spaces inside structural elements if required', function (done) {
      minimize.parse(html.spacing, function (error, result) {
        expect(result).to.equal("<strong>npm</strong>. You don't have to worry about installing npm since it comes bundled with Node.js.<pre class=copy>$ <span>npm install jitsu -g</span><a href=#><s class=ss-layers role=presentation></s> copy</a></pre>");
        done();
      });
    });

    it('should not prepend spaces between inline elements if not required', function (done) {
      minimize.parse(html.scripts, function (error, result) {
        expect(result).to.equal("<script type=text/javascript src=//use.typekit.net/gmp8svh.js></script><script type=text/javascript></script>");
        done();
      });
    });

    it('should parse the full stack', function (done) {
      minimize.parse(html.full, function (error, result) {
        expect(result).to.equal("<!doctype html><html class=no-js><head></head><body class=container><section class=navigation id=navigation><nav class=row><h1><a href=\"/\" class=logo title=\"Back to the homepage\">Nodejitsu</a></h1><a href=#navigation class=\"mobile btn ss-rows\"></a> <a href=/paas>Cloud</a> <a href=/enterprise/private-cloud>Enterprise</a></nav></section><input type=text name=temp></body></html>");
        done();
      });
    });

    it('should prepend space if inline element is preluded by text', function (done) {
      minimize.parse('some text -\n <strong class="lol">keyword</strong>\n - more text', function (error, result) {
        expect(result).to.equal("some text - <strong class=lol>keyword</strong> - more text");
        done();
      });
    });

    it('should remove empty attributes which have no function', function (done) {
      minimize.parse('<strong class="">keyword</strong><p id="">text</p>', function (error, result) {
        expect(result).to.equal("<strong>keyword</strong><p>text</p>");
        done();
      });
    });

    it('should retain empty attributes of type ', function (done) {
      minimize.parse('<strong class="">keyword</strong><p id="">text</p>', function (error, result) {
        expect(result).to.equal("<strong>keyword</strong><p>text</p>");
        done();
      });
    });

    it('should remove CDATA from scripts', function (done) {
      minimize.parse(html.cdata, function (error, result) {
        expect(result).to.equal("<script type=text/javascript>\n\n...code...\n\n</script>");
        done();
      });
    });

    it('should not give empty attributes empty values if keep attributes option is set', function (done) {
      var empty = new Minimize({ empty: true });
      empty.parse('<div translate></div>', function (error, result) {
        expect(result).to.equal('<div translate></div>');
        done();
      });
    });

    it('should be configurable to retain CDATA', function (done) {
      var cdata = new Minimize({ cdata: true });
      cdata.parse(html.cdata, function (error, result) {
        expect(result).to.equal("<script type=text/javascript>\n//<![CDATA[\n...code...\n//]]>\n</script>");
        done();
      });
    });

    it('should be configurable to retain one whitespace between elements', function (done) {
      var loose = new Minimize({ loose: true });
      loose.parse(html.loose, function (error, result) {
        expect(result).to.equal("<h1>title</h1> <form>Some text: <input type=text name=test></form>");
        done();
      });
    });

    it('should be configurable to retain one whitespace after elements', function (done) {
      var loose = new Minimize({ loose: true });
      loose.parse(html.looseext, function (error, result) {
        expect(result).to.equal("<section><h1>title</h1> <span>small</span> <form>Some text: <input type=text name=test></form></section> ");
        done();
      });
    });

    it('should always quote attributes that end with / regardless of options', function (done) {
      var quote = new Minimize({ quotes: false });
      quote.parse('<a href="#/">test</a>', function (error, result) {
        expect(result).to.equal('<a href="#/">test</a>');
        done();
      });
    });

    it('should clobber space around <br> elements', function (done) {
      minimize.parse(html.br, function (error, result) {
        expect(result).to.equal("<p class=slide><span><em>Does your organization have security or licensing restrictions?</em></span><br><br><span>Your private npm registry makes managing them simple by giving you the power to work with a blacklist and a whitelist of public npm packages.</span></p>");
        done();
      });
    });

    it('should maintain flow in pre elements', function (done) {
      minimize.parse(html.pre, function (error, result) {
        expect(result).to.equal('<pre><code class=lang-bash>git clone https://github.com/cjdelisle/cjdns.git cjdns\n  <span class=hljs-built_in>cd</span> cjdns\n  ./<span class=hljs-keyword>do</span>\n</code></pre>');
        done();
      });
    });

    it('should add quotes around values containing single quotes', function (done) {
      minimize.parse('<ng-include src="\'path/to/my/template.html\'"></ng-include>', function (error, result) {
        expect(result).to.equal('<ng-include src="\'path/to/my/template.html\'"></ng-include>');
        done();
      });
    });
  });

  describe('function traverse', function () {
    it('should traverse the DOM object and return string', function () {
      var result = minimize.traverse([html.element], '');

      expect(result).to.be.a('string');
      expect(result).to.be.equal(
        '<html class=no-js><head></head><body class=container></body></html>'
      );
    });
  });

  describe('function walk', function () {
    it('should walk once if there are no children in the element', function () {
      var result = minimize.walk('', html.inline);

      expect(result).to.be.equal('<strong></strong>');
    });

    it('should traverse children and insert data', function () {
      var result = minimize.walk('', html.element);

      expect(result).to.be.equal(
        '<html class=no-js><head></head><body class=container></body></html>'
      );
    });
  });


  describe('function walk', function () {
    it('should throw an error if no callback is provided', function () {
      function err () {
        minimize.parse(html.content, null);
      }

      expect(err).throws('No callback provided');
    });

    it('applies callback after DOM is parsed', function () {
      function fn () { }
      var once = sinon.spy(minimize, 'once');

      minimize.parse(html.content, fn);
      expect(once).to.be.calledOnce;

      var result = once.getCall(0).args;
      expect(result).to.be.an('array');
      expect(result[0]).to.be.equal('parsed');
      expect(result[1]).to.be.equal(fn);
      once.restore();
    });

    it('calls htmlparser to process the DOM', function () {
      var parser = sinon.mock(minimize.htmlparser);
      parser.expects('parseComplete').once().withArgs(html.content);

      minimize.parse(html.content, function () {});
      parser.restore();
    });
  });
});
