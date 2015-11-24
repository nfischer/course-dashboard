// //
// jest.autoMockOff();
var assert = require('chai').assert;
var expect = require('chai').expect;

var Node = require('../src/Models/node').default;

var sinon = require('sinon');
var mockery = require('mockery');


describe('nodestore', function() {

  before(function(){
    console.error("before called");
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });

    var WebAPI = {
      addNewChild: function(){},
      editNode: function(){},
      removeNode: function(){},
      init: function(){}
    };
    sinon.stub(WebAPI, "addNewChild");
    sinon.stub(WebAPI, "editNode");
    sinon.stub(WebAPI, "removeNode");
    sinon.stub(WebAPI, "init");

    // console.log(WebAPI);

    mockery.registerMock('../utils/webapi.js', WebAPI);
    mockery.registerMock('../src/utils/webapi.js', WebAPI);
  })

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
      testID: "testID"
    }
  });

  var newNode = new Node({
    id: 'newID',
    contents: 'new contents',
    renderer: 'Renderer'
  });

  // mock actions
  var actionOpen = {
    name: 'open',
    data: {rootId: 'testRootID', nodes: [
      rootNode,
      testNode
    ]}
  };

  var actionAddNode = {
    name: 'addNode',
    data: {
      parent: rootNode,
      title: 'newID',
      markdown: 'new contents',
      renderer: 'Renderer'
    }
  };

/*  TODO:
	var actionUpdateParentAndChild = {
    name: 'updateParentAndChild',
    data: 'foo'
  };
  var actionEditNode = {
    name: 'editNode',
    data: 'foo'
  };
  var actionRemoveNode = {
    name: 'removeNode',
    data: 'foo'
  }; */

  var onChange;
  var nodeStore;
  var dispatch;

  beforeEach(function() {
    var dispatcher = require('../src/dispatcher').default;
    nodeStore = require('../src/Stores/nodestore').default;
    dispatch = dispatcher.dispatch.bind(dispatcher);
    onChange = nodeStore.__emitter.emit;// callback = nodeStore.__invokeOnDispatch.bind(nodeStore);
  });

  it('initializes with no nodes', function() {
    expect(nodeStore.getState()).to.equal(null);
  });

  it('Open: creates node tree using a list of nodes', function() {
    dispatch(actionOpen);

    var all = nodeStore.getState().nodes;
    expect(all.size).to.equal(2);
    // expect(all.get('testID')).to.equal(testNode);
    expect(all.get('testID').id).to.equal('testID');
    expect(all.get('testID').contents).to.equal('test contents');
    expect(all.get('testID').renderer).to.equal('Renderer');
    // expect(all.get('rootID')).to.equal(rootNode);
    expect(all.get('rootID').id).to.equal('rootID');
    expect(all.get('rootID').contents).to.equal('');
    expect(all.get('rootID').renderer).to.equal('Renderer');
    expect(all.get('rootID').children.testID).to.equal('testID');
    expect(nodeStore.getState().rootId).to.equal('testRootID');
  });

/*  it('AddNode: adds a node', function() {
    //dispatch(actionOpen);
    dispatch(actionAddNode);

    var all = nodeStore.getState().nodes;
    expect(all.size).to.equal(3);
    expect(nodeStore.getState()).to.not.equal(null);
    expect(all.get['newID']).to.equal(newNode);
    expect(all.get['newID'].id).to.equal('newID');
    expect(all.get['newID'].contents).to.equal('new contents');
    expect(all.get['newID'].renderer).to.equal('Renderer');
    expect(all.get('testID').id).to.equal('testID');
    expect(all.get('rootID').id).to.equal('rootID');
    expect(all.get('rootID').children.testID).to.equal('testID');
    expect(all.get('rootID').children.newID).to.equal('newID');
    expect(nodeStore.getState().rootId).to.equal('testRootID');
  });*/

/*   it('RemoveNode: removes a node', function() {
    callback(actionOpen);
    var all = nodeStore.getAll();
    var keys = Object.keys(all);
    expect(keys.length).toBe(2);
    actionRemoveNode.id = keys[1];
    callback(actionRemoveNode);
    expect(all[keys[1]]).toBeUndefined();
  }); */

});
