// //
// jest.autoMockOff();
var assert = require('chai').assert;
var expect = require('chai').expect;

var Node = require('../src/Models/node').default;

var sinon = require('sinon');
var mockery = require('mockery');


describe('nodestore', function() {

  before(function(){
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
    renderer: 'Renderer',
    children: {}
  });

  var updatedRootNode = new Node({
    id: 'rootID',
    contents: '',
    renderer: 'Renderer',
    children: {
      testID: "testID",
      newID: "newID"
    }
  });

  // mock actions
  var actionOpen = {
    name: 'open',
    data: {
      rootId: 'rootID', 
      nodes: [
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
    var actionUpdateParentAndChild = {
    name: 'updateParentAndChild',
    data: {
      child: newNode,
      parent: updatedRootNode
    }
  };

//TESTING:
/*
  var actionEditNode = {
    name: 'editNode',
    data: 'foo'
  };*/
  var actionRemoveNode = {
    name: 'removeNode',
    data: newNode
  };

  var onChange;
  var nodeStore;
  var dispatch;

  beforeEach(function() {
    var dispatcher = require('../src/dispatcher').default;
    nodeStore = require('../src/Stores/nodestore').default;
    dispatch = dispatcher.dispatch.bind(dispatcher);
    onChange = nodeStore.__emitter.emit;// callback = nodeStore.__invokeOnDispatch.bind(nodeStore);
  });

  it('initializes with no nodes', function(done) {
    expect(nodeStore.getState()).to.equal(null);
    done();
  });

  it('Open: creates node tree using a list of nodes', function() {
    dispatch(actionOpen);

    var all = nodeStore.getState().nodes;
    expect(all.size).to.equal(2);
    expect(all.get('testID').id).to.equal('testID');
    expect(all.get('testID').contents).to.equal('test contents');
    expect(all.get('testID').renderer).to.equal('Renderer');
    expect(all.get('rootID').id).to.equal('rootID');
    expect(all.get('rootID').contents).to.equal('');
    expect(all.get('rootID').renderer).to.equal('Renderer');
    expect(all.get('rootID').children.testID).to.equal('testID');
    expect(nodeStore.getState().rootId).to.equal('rootID');
  });

  it('AddNode: adds a node', function() {
    expect(nodeStore.getState().nodes.size).to.equal(2);

    dispatch(actionAddNode);

    var all = nodeStore.getState().nodes;

/*    console.log('Node Added:');
    for (let node of all) {
      console.log(node);
    }*/

    expect(all.size).to.equal(3);
    expect(nodeStore.getState()).to.not.equal(null);
    expect(all.get('-1').id).to.equal('-1'); // The new node's ID is -1 instead of "newID" because of our ID spoofing implementation
    expect(all.get('-1').contents).to.equal('new contents');
    expect(all.get('-1').renderer).to.equal('Renderer');
    expect(all.get('testID').id).to.equal('testID');
    expect(all.get('testID').contents).to.equal('test contents');
    expect(all.get('testID').renderer).to.equal('Renderer');
    expect(all.get('rootID').id).to.equal('rootID');
    expect(all.get('rootID').contents).to.equal('');
    expect(all.get('rootID').renderer).to.equal('Renderer');
    expect(all.get('rootID').children.testID).to.equal('testID');
    expect(all.get('rootID').children.newID).to.equal('-1');
    expect(nodeStore.getState().rootId).to.equal('rootID');
  });

  it('UpdateParentAndChild: adds a new node with the correct ID to be used in place of the spoofed node', function() {
    expect(nodeStore.getState().nodes.size).to.equal(3);
    dispatch(actionUpdateParentAndChild);
    
    var all = nodeStore.getState().nodes;

/*    console.log('Parent/child updated:');
    for (let node of all) {
      console.log(node);
    }*/

    expect(all.size).to.equal(4); // We just added a new node with the correct ID but didn't delete the spoofed node
    expect(nodeStore.getState()).to.not.equal(null);
    expect(all.get('newID').id).to.equal('newID');
    expect(all.get('newID').contents).to.equal('new contents');
    expect(all.get('newID').renderer).to.equal('Renderer');
    expect(all.get('testID').id).to.equal('testID');
    expect(all.get('testID').contents).to.equal('test contents');
    expect(all.get('testID').renderer).to.equal('Renderer');
    expect(all.get('rootID').id).to.equal('rootID');
    expect(all.get('rootID').contents).to.equal('');
    expect(all.get('rootID').renderer).to.equal('Renderer');
    expect(all.get('rootID').children.testID).to.equal('testID');
    expect(all.get('rootID').children.newID).to.equal('newID');
    expect(nodeStore.getState().rootId).to.equal('rootID');
  });

  it('RemoveNode: removes a node', function() {
    expect(nodeStore.getState().nodes.size).to.equal(4);

    dispatch(actionRemoveNode);

    var all = nodeStore.getState().nodes;

/*    console.log('Node Removed:');
    for (let node of all) {
      console.log(node);
    } */

    expect(all.size).to.equal(3);   // Remaining nodes are testID, rootID, and the spoofed node
    expect(all.get['newID']).to.be.an('undefined');
    expect(all.get('testID').id).to.equal('testID');
    expect(all.get('testID').contents).to.equal('test contents');
    expect(all.get('testID').renderer).to.equal('Renderer');
    expect(all.get('rootID').id).to.equal('rootID');
    expect(all.get('rootID').contents).to.equal('');
    expect(all.get('rootID').renderer).to.equal('Renderer');
    expect(all.get('rootID').children.testID).to.equal('testID');
    expect(nodeStore.getState().rootId).to.equal('rootID');
  });

});
