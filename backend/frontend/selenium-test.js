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

describe('Landing page test', function() {
  beforeEach(function() {
    return this.driver.get('http://127.0.0.1:5000/')
    // WebDriverWait wait = new WebDriverWait(driver, 5);
    // wait.until(ExpectedConditions.titleContains('Course Dashboard')); 
  });

  it('has the project name as the title', function() {
    return expect(this.driver.getTitle()).to.eventually.contain('Course Dashboard');
  });

  return it('links to CS130 page', function() {
    this.driver.findElement({
      linkText: 'CS 130'
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