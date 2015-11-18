//
jest.autoMockOff();

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';

var Node = require('../Models/node').default;

// Tests createelement.js as well
var CreateElement = require('../Components/createelement.js');

const Renderer = require('../Components/renderer.js').default;

describe('Renderer', function() {
		
  var testUI = {}; // ???
  
  var testNode = new Node({
    id: 'testID',
    contents: 'test contents',
    renderer: ''
  });
  	
  it('Renders a node that has no renderer specified', function() {
	var defaultRenderer = Renderer.getRenderedElement('testTag', testNode, testUI);
	var component = TestUtils.renderIntoDocument(
	  <defaultRenderer.render() />
	);
	
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
