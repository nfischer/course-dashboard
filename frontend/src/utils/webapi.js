import $ from 'jquery';

import Node from '../Models/node.js';

//this is a module exclusively for sending specific actions to the web api.
//complex actions can be defined here in terms of the basic RESTful API

//Primitive actions supported by webapi.
//currently, most of these are mocked out.
//----------------------------------------
function getNode(nodeId: string){}

function overwriteNode(node: Node){
  var deferred = $.Deferred();
  setTimeout(function(){
    deferred.resolve({message: "overwritten"});
  }, 100);
  return deferred.promise();
}

var nextid = 5000;
function createNode(node: Node){ //mock for creation process
  var deferred = $.Deferred();
  setTimeout(function(){
    let newnode = Object.assign({}, node);
    newnode.id = (nextid++).toString();
    newnode.children = {};
    deferred.resolve(newnode);
  }, 100);
  return deferred.promise();
} //undefined id becomes defined. same with children

var filename = "http://localhost:8000/sampledata.json";
function getTree(rootId = null, depth = null){
  return $.ajax({
    url: filename,
    dataType: 'json',
  });
}


//More complex actions defined in terms of primitives
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

export function getInitialTree(callback: any){
  getTree().then((data) => {
    callback(data);
  }, (jqXHR, textStatus, errorThrown) => {
    console.error(textStatus);
    throw errorThrown;
  });
}
