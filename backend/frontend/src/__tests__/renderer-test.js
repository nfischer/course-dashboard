//
jest.autoMockOff();

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';

var Node = require('../Models/node').default;

const renderer = require('../Components/renderer.js');

describe('renderer', function() {
		
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
  });
		
});
