jest.dontMock('../Stores/nodestore');
jest.dontMock('object-assign');
jest.dontMock('immutable');

var Node = require('../Models/node').default;
var Map = require('immutable').Map;

describe('nodestore', function() {


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
      testID: testNode,
      newID: newNode
    }
  });

  var nodeMap = new Map({
    rootID: rootNode,
    testID: testNode
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

  // var actionAddNode = {
  //   name: 'addNode',
  //   data: newNode
  // };
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

  var dispatcher;
  var nodeStore;
  var callback;

  beforeEach(function() {
    dispatcher = require('../dispatcher').default;
    nodeStore = require('../Stores/nodestore').default;
    callback = dispatcher.register.mock.calls[0][0];
  });

  it('registers a callback with the dispatcher', function() {
    expect(dispatcher.register.mock.calls.length).toBe(1);
  });

  it('initializes with no nodes', function() {
    expect(nodeStore.getState().nodes.size).toBe(0);
    expect(nodeStore.getState().rootID).toEqual('');
  });

  it('Open: creates node tree using a map of nodes', function() {
    callback(actionOpen);
    var all = nodeStore.getState().nodes;
    expect(all.size).toBe(2);
    expect(all['testID']).toEqual(testNode);
    expect(all['testID'].id).toEqual('testID');
    expect(all['testID'].contents).toEqual('test contents');
    expect(all['testID'].renderer).toEqual('Renderer');
    expect(all['rootID']).toEqual(rootNode);
    expect(all['rootID'].id).toEqual('rootID');
    expect(all['rootID'].contents).toEqual('');
    expect(all['rootID'].renderer).toEqual('Renderer');
    expect(nodeStore.getState().rootID).toEqual('rootID');
  });
  //
  // it('AddNode: adds a node', function() {
  //   callback(actionOpen);
  //   callback(actionAddNode);
  //   var all = nodeStore.nodes;
  //   var keys = Object.keys(all);
  //   expect(keys.length).toBe(3);
  //   expect(nodeStore.nodes['newID']).toEqual(newNode);
  //   expect(nodeStore.nodes['newID'].id).toEqual('newID');
  //   expect(nodeStore.nodes['newID'].contents).toEqual('new contents');
  //   expect(nodeStore.nodes['newID'].renderer).toEqual('Renderer');
  // });

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
