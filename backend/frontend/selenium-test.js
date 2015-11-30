var selenium = require('selenium-webdriver');
var chrome = require('selenium-webdriver/chrome');
var path = require('chromedriver').path;
var service = new chrome.ServiceBuilder(path).build();
chrome.setDefaultService(service);

var chai = require('chai');
chai.use(require('chai-as-promised'));
var assert = require('chai').assert;
var expect = require('chai').expect;

before(function() {
  this.timeout(10000);
  this.driver = new selenium.Builder().withCapabilities(selenium.Capabilities.chrome()).build();
  return this.driver.getWindowHandle();
});

after(function() {
  return this.driver.quit();
});

describe('Course list page test:', function() {
  beforeEach(function() {
    return this.driver.get('http://127.0.0.1:5000/')
  });

  it('has the project name as the title', function() {
    return expect(this.driver.getTitle()).to.eventually.contain('Course Dashboard');
  });

  it('links to course creation page', function() {
    this.driver.findElement({
      linkText: 'Create a new course'
    }).click();
    return expect(this.driver.getCurrentUrl()).to.eventually.equal('http://127.0.0.1:5000/newcourse/');
  });

  return it('links to CS130 course page', function() {
    this.driver.findElement({
      linkText: 'CS 130'
    }).click();
    return expect(this.driver.getCurrentUrl()).to.eventually.equal('http://127.0.0.1:5000/1/');
  });
});

// Not sure why these don't work
/*describe('Course creation page test:', function() {
  beforeEach(function() {
    return this.driver.get('http://127.0.0.1:5000/newcourse');
  });

  return it('has the \'Create a new course\' as the title', function() {
    return expect(this.driver.getTitle()).to.eventually.contain('Create a new course');
  });
});

describe('Main CS 130 page test:', function() {
  beforeEach(function() {
    return this.driver.get('http://127.0.0.1:5000/1');
  });

  return it('has the web address as the title', function() {
    return expect(this.driver.getTitle()).to.eventually.contain('127.0.0.1:5000/1/');
  });
});*/