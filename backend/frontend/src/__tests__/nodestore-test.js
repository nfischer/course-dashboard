//
jest.autoMockOff();

var Node = require('../Models/node').default;

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
    var dispatcher = require('../dispatcher').default;
    nodeStore = require('../Stores/nodestore').default;
    dispatch = dispatcher.dispatch.bind(dispatcher);
    onChange = nodeStore.__emitter.emit;// callback = nodeStore.__invokeOnDispatch.bind(nodeStore);
  });

  it('initializes with no nodes', function() {
    expect(nodeStore.getState()).toEqual(null);
  });

  it('Open: creates node tree using a list of nodes', function() {
    dispatch(actionOpen);

    var all = nodeStore.getState().nodes;
    expect(all.size).toBe(2);
    expect(all.get('testID')).toEqual(testNode);
    expect(all.get('testID').id).toEqual('testID');
    expect(all.get('testID').contents).toEqual('test contents');
    expect(all.get('testID').renderer).toEqual('Renderer');
    expect(all.get('rootID')).toEqual(rootNode);
    expect(all.get('rootID').id).toEqual('rootID');
    expect(all.get('rootID').contents).toEqual('');
    expect(all.get('rootID').renderer).toEqual('Renderer');
    expect(all.get('rootID').children.testID).toEqual('testID');
    expect(nodeStore.getState().rootId).toEqual('testRootID');
  });

  it('AddNode: adds a node', function() {
    //dispatch(actionOpen);
    dispatch(actionAddNode);
    
    var all = nodeStore.getState().nodes;
    expect(all.size).toBe(3);
    expect(nodeStore.getState()).toNotEqual(null);
    expect(all.get['newID']).toEqual(newNode);
    expect(all.get['newID'].id).toEqual('newID');
    expect(all.get['newID'].contents).toEqual('new contents');
    expect(all.get['newID'].renderer).toEqual('Renderer');
    expect(all.get('testID').id).toEqual('testID');
    expect(all.get('rootID').id).toEqual('rootID');
    expect(all.get('rootID').children.testID).toEqual('testID');
    expect(all.get('rootID').children.newID).toEqual('newID');
    expect(nodeStore.getState().rootId).toEqual('testRootID');
  });

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
