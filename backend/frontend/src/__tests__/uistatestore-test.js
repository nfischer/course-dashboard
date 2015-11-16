//
jest.autoMockOff();

var Node = require('../Models/node').default;
var List = require('immutable').List;

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

  var piazzaPostList = new List();
  
  // add nodes to list
  piazzaPostList = { // TODO: Syntax?
  	testNode: testNode, 
  	rootNode: rootNode, 
  	newNode: newNode
  }; 
  
  // mock actions
  var actionOpen = {
    name: 'open',
    data: {}
  };

  var actionPiazzaPostsFetched = {
    name: 'piazzaPostsFetched',
    data: {piazzaPostList}
  };
  
  var actionExpandWeek = {
    name: 'expandWeek',
    data: 'Week 2'
  };

  var onChange;
  var uiStateStore;
  var dispatch;

  beforeEach(function() {
    var dispatcher = require('../dispatcher').default;
    uiStateStore = require('../Stores/uistatestore').default;
    dispatch = dispatcher.dispatch.bind(dispatcher);
    onChange = uiStateStore.__emitter.emit;
  });

  it('initializes with no week expanded', function() {
    expect(uiStateStore.currentWeek).toEqual('');
    expect(uiStateStore.piazzaPosts).toEqual({});
  });

  it('Open: creates an empty UI state store', function() {
    dispatch(actionOpen);
    
    expect(uiStateStore.currentWeek).toEqual('');
    expect(uiStateStore.piazzaPosts).toEqual({});
  });
  
  it('ExpandWeek: expands a week, setting it to the current week', function() {
    dispatch(actionExpandWeek);
    
    expect(uiStateStore.currentWeek).toEqual('Week 2');
    expect(uiStateStore.piazzaPosts).toEqual({});
  });

  it('PiazzaPostsFetched: stores the fetched piazza posts', function() {
    dispatch(actionPiazzaPostsFetched);
    
    var all = nodeStore.getState().piazzaPosts;
    expect(all.size).toBe(3);
    expect(all.get('testNode')).toEqual(testNode); //Syntax?
    expect(all.get('testNode').id).toEqual('testID');
    expect(all.get('rootNode')).toEqual(rootNode);
    expect(all.get('rootNode').children['newID']).toEqual('newID');
    expect(all.get('newNode')).toEqual(newNode);
    expect(uiStateStore.getState().piazzaPosts).toEqual(piazzaPostList);
    expect(uiStateStore.getState().currentWeek).toEqual('Week 2');
  });



});