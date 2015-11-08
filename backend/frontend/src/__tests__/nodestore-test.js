jest.dontMock('../Stores/nodestore');
jest.dontMock('object-assign');

describe('nodestore', function() {

  var AppDispatcher;
  var nodeStore;
  var callback;
  var testNode = require('../Models/node');
  testNode.id = 'testID';
  testNode.contents = 'test contents';
  testNode.renderer = 'Renderer';
  
  var rootNode = require('../Models/node');
  rootNode.id = 'rootID';
  rootNode.contents = '';
  rootNode.renderer = 'Renderer';
  rootNode.children = {};
  rootNode.children['testID'] = testNode;
  rootNode.children['newID'] = newNode;
  
  var nodeMap = {};
  nodeMap['rootID'] = rootNode;
  nodeMap['testID'] = testNode;
  
  var newNode = require('../Models/node');
  newNode.id = 'newID';
  newNode.contents = 'new contents';
  newNode.renderer = 'Renderer';

  // mock actions 
  var actionOpen = {
    name: 'open',
    data: {rootId: 'testRootID', nodes: nodeMap}
  };
  var actionAddNode = {
    name: 'addNode',
    data: newNode
  };
/*  var actionRemoveResource = {
    name: 'removeResource',
    data: 'foo'
  };
  var actionEditResource = {
    name: 'editResource',
    data: 'foo'
  };
  var actionExpandWeek = {
    name: 'expandWeek',
    data: 'foo'
  }; */

  beforeEach(function() {
    dispatcher = require('../dispatcher');
    nodeStore = require('../Stores/nodestore');
    callback = dispatcher.register.mock.calls[0][0];
  });

  it('registers a callback with the dispatcher', function() {
    expect(dispatcher.register.mock.calls.length).toBe(1);
  });

  it('initializes with no nodes', function() {
    expect(nodeStore.nodes).toEqual({});
    expect(nodeStore.rootID).toEqual('');
  });
  
  it('Open: creates node tree using a map of nodes', function() {
    callback(actionOpen);
    var all = nodeStore.nodes;
    var keys = Object.keys(all);
    expect(keys.length).toBe(2);
    expect(nodeStore.nodes['testID']).toEqual(testNode);
    expect(nodeStore.nodes['testID'].id).toEqual('testID');
    expect(nodeStore.nodes['testID'].contents).toEqual('test contents');
    expect(nodeStore.nodes['testID'].renderer).toEqual('Renderer'); 
    expect(nodeStore.nodes['rootID']).toEqual(rootNode);
    expect(nodeStore.nodes['rootID'].id).toEqual('rootID');
    expect(nodeStore.nodes['rootID'].contents).toEqual('');
    expect(nodeStore.nodes['rootID'].renderer).toEqual('Renderer');     
    expect(nodeStore.rootID).toEqual('rootID');
  });

  it('AddNode: adds a node', function() {
    callback(actionOpen);
    callback(actionAddNode);
    var all = nodeStore.nodes;
    var keys = Object.keys(all);
    expect(keys.length).toBe(3);
    expect(nodeStore.nodes['newID']).toEqual(newNode);
    expect(nodeStore.nodes['newID'].id).toEqual('newID');
    expect(nodeStore.nodes['newID'].contents).toEqual('new contents');
    expect(nodeStore.nodes['newID'].renderer).toEqual('Renderer');
  });

/*   it('EditResource: removes a resource', function() {
    callback(actionOpen);
    var all = nodeStore.getAll();
    var keys = Object.keys(all);
    expect(keys.length).toBe(1);
    actionDestroy.id = keys[0];
    callback(actionRemoveResource);
    expect(all[keys[0]]).toBeUndefined();
  }); */

});
