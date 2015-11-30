var selenium = require('selenium-webdriver');
var chai = require('chai');
var assert = require('chai').assert;
var expect = require('chai').expect;

before(function() {
  this.timeout(10000);
  var childProcess = require('child_process');
 /*   var setup;
  var addData;
  var cd;

  cd = childProcess.exec('cd ..', function (error, stdout, stderr) {
    if (error) {
      console.log(error.stack);
      console.log('Error code: '+error.code);
      console.log('Signal received: '+error.signal);
    }

    setup = childProcess.exec('./setup.sh', function (error, stdout, stderr) {
      if (error) {
        console.log(error.stack);
        console.log('Error code: '+error.code);
        console.log('Signal received: '+error.signal);
      }
      console.log('setup child process STDERR: '+stderr);
    });

    setup.on('exit', function (code) {
      console.log('setup child process exited with exit code '+code);
    });

    addData = childProcess.exec('./addSampleData.py', function (error, stdout, stderr) {
      if (error) {
        console.log(error.stack);
        console.log('Error code: '+error.code);
        console.log('Signal received: '+error.signal);
      }
      console.log('addData child process STDERR: '+stderr);
    });

    addData.on('exit', function (code) {
      console.log('addData child process exited with exit code '+code);
    });

    console.log('cd child process STDERR: '+stderr);
  });

  cd.on('exit', function (code) {
    console.log('cd child process exited with exit code '+code);
  });*/


  this.driver = new selenium.Builder().withCapabilities(selenium.Capabilities.chrome()).build();
  return this.driver.getWindowHandle();
});

after(function() {
  return this.driver.quit();
});

describe('Landing page test', function() {
  beforeEach(function() {
    return this.driver.get('http://127.0.0.1:5000/');
  });
  it('has the project name as the title', function() {
    return expect(this.driver.getTitle()).to.eventually.contain('Course Dashboard');
  });

  return it('links to CS130 page', function() {
    this.driver.findElement({
      linkText: 'CS130'
    }).click();
    return expect(this.driver.getCurrentUrl()).to.eventually.equal('http://127.0.0.1:5000/1/');
  });

  // Example function
/*  it('has publication date', function() {
    var text;
    text = this.driver.findElement({
      css: '.post .meta time'
    }).getText();
    return expect(text).to.eventually.equal('December 30th, 2014');
  });
*/

});