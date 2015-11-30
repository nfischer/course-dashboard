// //
// jest.autoMockOff();

var Node = require('../src/Models/node').default;
var List = require('immutable').List;

var assert = require('chai').assert;
var expect = require('chai').expect;

var sinon = require('sinon');
var mockery = require('mockery');

describe('uistatestore', function() {

  // Using nodes for test instead of actual piazza posts
  var testNode = new Node({
    id: 'testID',
    contents: 'test contents',
    renderer: 'Renderer'
  });

  var rootNode = new Node({
    id: 'rootID',
    contents: '',
    renderer: 'Renderer',
    children: {
      testID: "testID",
      newID: "newID"
    }
  });

  var newNode = new Node({
    id: 'newID',
    contents: 'new contents',
    renderer: 'Renderer'
  });

  var tempList = new List();

  var piazzaPostList = new List([testNode, rootNode, newNode]);

  // mock actions
  var actionOpen = {
    name: 'open',
    data: {rootId: "0", nodes: []}
  };

  var actionPiazzaPostsFetched = {
    name: 'piazzaPostsFetched',
    data: {posts: piazzaPostList}
  };

  var actionExpandWeek = {
    name: 'expandWeek',
    data: 'Week 2'
  };

  var onChange;
  var uiStateStore;
  var dispatch;

  beforeEach(function() {
    var dispatcher = require('../src/dispatcher').default;
    uiStateStore = require('../src/Stores/uistatestore').default;
    dispatch = dispatcher.dispatch.bind(dispatcher);
    onChange = uiStateStore.__emitter.emit;
  });

  it('initializes with no week expanded', function() {
    var all = uiStateStore.getState();

    expect(all.currentWeek).to.equal('');
    expect(all.piazzaPosts.size).to.equal(tempList.size);
  });

  it('Open: creates an empty UI state store', function() {
    dispatch(actionOpen);

    var all = uiStateStore.getState();
    expect(all.currentWeek).to.equal('');
    expect(all.piazzaPosts.size).to.equal(tempList.size);
  });

  it('ExpandWeek: expands a week, setting it to the current week', function() {
    dispatch(actionExpandWeek);

    var all = uiStateStore.getState();
    expect(all.currentWeek).to.equal('Week 2');
    expect(all.piazzaPosts.size).to.equal(tempList.size);
  });

  it('PiazzaPostsFetched: stores the fetched piazza posts', function() {
    dispatch(actionPiazzaPostsFetched);

    var all = uiStateStore.getState().piazzaPosts;
    // console.log(all);
    expect(all.size).to.equal(3);
    // expect(all.get('testNode')).to.equal(testNode); //Syntax?
    expect(all.get(0).id).to.equal('testID');
    expect(all.get(1).id).to.equal('rootID');
    expect(all.get(1).children['newID']).to.equal('newID');
    expect(all.get(2).id).to.equal('newID');
    expect(uiStateStore.getState().currentWeek).to.equal('Week 2');
  });

});
