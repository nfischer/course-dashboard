import $ from 'jquery';

import Node from '../Models/node.js';

//this is a module exclusively for sending specific actions to the web api.
//complex actions can be defined here in terms of the basic RESTful API

//please always import this module with "import * as WebAPI" since names may conflict

//Primitive actions supported by webapi.
//----------------------------------------

// TODO(nate): This is a hardcoded <courseId>. Change this dynamically during
// runtime based on which course we're actually viewing
var courseId = "42";
var mainUrl = "";

function getNode(nodeId: string){
  let endpoint = mainUrl + `/${courseId}/node/${nodeId}/`;
  return $.ajax(endpoint, {
    method: "GET",
    dataType: "json"
  });
}

function overwriteNode(node: Node){
  let endpoint = mainUrl + `/${courseId}/node/update/${node.id}/`;
  let data = {contents: node.contents, renderer: node.renderer, children: JSON.stringify(node.children)};
  return $.ajax(endpoint, {
    method: "POST",
    data: data,
    dataType: "json"
  });
}

function deleteNode(nodeId: string){
  let endpoint = mainUrl + `/${courseId}/node/delete/${nodeId}/`;
  return $.ajax(endpoint, {
    method: "POST",
    dataType: "json"
  });
}

// @deprecated
function overwriteChildren(node: Node){
  let endpoint = mainUrl + `/${courseId}/node/update/${node.id}/`;
  let data = {children: JSON.stringify(node.children)};
  return $.ajax(endpoint, {
    method: "POST",
    data: data,
    dataType: "json"
  })
}

function createNode(node: Node){ //mock for creation process
  let endpoint = mainUrl + `/${courseId}/node/add/`;
  return $.ajax(endpoint, {
    method: "POST",
    data: node,
    dataType: "json"
  });
}

//currently rootId and depth are ignored
function getTree(rootId = null, depth = null){
  let endpoint = mainUrl + `/${courseId}/tree/`;
  return $.ajax(endpoint, {
    method: "GET",
    dataType: "json"
  });
}


//More complex actions defined in terms of primitives
// promises are used to make the order of asynchronous steps more transparent
//---------------------------------------------------
export function addNewChild(node: Node, tag: string, markdown: string, renderer: string, callback: any){
  let child = new Node({
    contents: markdown,
    renderer
  });
  let initialized_child;

  createNode(child) //create node
    .then((data) => { //modify parent
      data.contents = child.contents;
      data.renderer = child.renderer;
      data.children = {};

      initialized_child = new Node(data);
      node.children[tag] = initialized_child.id;
      return overwriteNode(node);
    }, (jqXHR, textStatus, errorThrown) => {
      console.error(textStatus);
      throw errorThrown;
    })
    .then((data) => { //call passed in callback
      callback(initialized_child);
    }, (jqXHR, textStatus, errorThrown) => {
      console.error(textStatus);
      throw errorThrown;
    });
}

export function editNode(node: Node, markdown: string, renderer: string, children: Object, callback: any){
  let newNode = new Node({id: node.id, contents: markdown, renderer: renderer, children: children});

  overwriteNode(newNode).then((data) => {
    callback(newNode);
  }, (jqXHR, textStatus, errorThrown) => {
      console.error(textStatus);
      throw errorThrown;
  });
}

export function removeNode(node: Node, callback: any){
  deleteNode(node.id).then((data) => {
    callback(node);
  }, (jqXHR, textStatus, errorThrown) => {
      console.error(textStatus);
      throw errorThrown;
  });
}

export function getInitialTree(callback: any){
  getTree().then((data) => {
    callback(data);
  }, (jqXHR, textStatus, errorThrown) => {
    console.error(textStatus);
    throw errorThrown;
  });
}
