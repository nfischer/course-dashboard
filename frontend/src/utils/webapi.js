import $ from 'jquery';

import Node from '../Models/node.js';

//this is a module exclusively for sending specific actions to the web api.
//complex actions can be defined here in terms of the basic RESTful API

//Primitive actions supported by webapi.
//----------------------------------------

var mainUrl = "";

function getNode(nodeId: string){
  let endpoint = mainUrl + `/node/${nodeId}/`;
  return $.ajax(endpoint,{
    method: "GET",
    dataType: "json"
  });
}

function overwriteNode(node: Node){
  let endpoint = mainUrl + `/node/update/${node.id}/`;
  return $.ajax(endpoint, {
    method: "POST",
    data: node,
    dataType: "json"
  });
}

function overwriteChildren(node: Node){
  let endpoint = mainUrl + `/node/update/${node.id}/`;
  let data = {children: JSON.stringify(node.children)};
  return $.ajax(endpoint, {
    method: "POST",
    data: data,
    dataType: "json"
  })
}

function createNode(node: Node){ //mock for creation process
  let endpoint = mainUrl + "/node/add/";
  return $.ajax(endpoint, {
    method: "POST",
    data: node,
    dataType: "json"
  });
}

//currently rootId and depth are ignored
function getTree(rootId = null, depth = null){
  let endpoint = mainUrl + "/tree/";
  return $.ajax(endpoint,{
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
      console.log(data);

      data.contents = child.contents;
      data.renderer = child.renderer;
      data.children = {};

      initialized_child = new Node(data);
      node.children[tag] = initialized_child.id;
      return overwriteChildren(node);
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

export function getInitialTree(callback: any){
  getTree().then((data) => {
    callback(data);
  }, (jqXHR, textStatus, errorThrown) => {
    console.error(textStatus);
    throw errorThrown;
  });
}
