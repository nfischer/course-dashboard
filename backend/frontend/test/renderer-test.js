// //
// jest.autoMockOff();

var React = require('react');
var ReactDOM = require('react-dom');
var TestUtils = require('react-addons-test-utils');

var Node = require('../src/Models/node').default;

var assert = require('chai').assert;
var expect = require('chai').expect;

var sinon = require('sinon');
var mockery = require('mockery');

// Tests createelement.js as well
var CreateElement;
var Renderer;

var sinon = require('sinon');
var mockery = require('mockery');

describe('Renderer', function() {

	before(function(){
    // console.error("before called");
    // mockery.enable({
    //   warnOnReplace: false,
    //   warnOnUnregistered: false,
    //   useCleanCache: true
    // });
		//
    // var WebAPI = sinon.stub(require('../src/utils/webapi.js'));
		//
    // mockery.registerMock('../utils/webapi.js', WebAPI);
    // mockery.registerMock('../src/utils/webapi.js', WebAPI);

		CreateElement = require('../src/Components/createelement.js').default;
		Renderer = require('../src/Components/renderer.js').default;
  })

  var testUI = {}; // ???

  var testNode = new Node({
    id: 'testID',
    contents: 'test contents',
    renderer: ''
  });

  it('Renders a node that has no renderer specified', function() {
	var defaultRenderer = CreateElement('testTag', testNode, testUI);
	var component = TestUtils.renderIntoDocument(defaultRenderer.render());

	var foundNode = TestUtils.findRenderedDOMComponentWithTag(
	  component, 'test'
	);

	expect(foundNode.getDOMNode()[1].className).toEqual('node');
	expect(foundNode.getDOMNode()[1].key).toEqual('testID');
	expect(foundNode.getDOMNode()[1][2]).toEqual('testTag');
	expect(foundNode.getDOMNode()[1][3]).toEqual('node');
	expect(foundNode.getDOMNode()[1][4]).toEqual({});

/* return React.createElement(renderClass,
					 {
					   className: "node",
					   key: node.id, //this should work because a node cannot link to another node twice
					   tag,
					   node,
					   ui
					 },
					 []); */

  });

/*

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
    data: newNode
  };

  var onChange;
  var nodeStore;
  var dispatch;

  beforeEach(function() {
    var dispatcher = require('../dispatcher').default;
    renderer = require('../Components/renderer').default;
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
    expect(nodeStore.getState().rootId).toEqual('testRootID');
  });

  it('AddNode: adds a node', function() {
    dispatch(actionAddNode);

    var all = nodeStore.getState().nodes;
    expect(all.size).toBe(3);
    expect(all.get['newID']).toEqual(newNode);
    expect(all.get['newID'].id).toEqual('newID');
    expect(all.get['newID'].contents).toEqual('new contents');
    expect(all.get['newID'].renderer).toEqual('Renderer');
    expect(all.get('testID').id).toEqual('testID');
    expect(all.get('rootID').id).toEqual('rootID');
    expect(nodeStore.getState().rootId).toEqual('testRootID');
  }); */

});
