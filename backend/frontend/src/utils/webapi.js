import $ from 'jquery';
import * as piazza from 'piazza-api';
import * as http from 'stream-http';
import { Map, List } from 'immutable';
import URL from 'url-parse';
import pathParse from 'path-parse';

import Node from '../Models/node.js';
import piazzaPostsFetched from '../Actions/piazzapostsfetched.js'
import error from '../Actions/error.js';

//TODO: clean up CALLBACK HELL

//this is a module exclusively for sending specific actions to the web api.
//complex actions can be defined here in terms of the basic RESTful API

//Primitive actions supported by webapi.
//----------------------------------------

// TODO(nate): This is a hardcoded <courseId>. Change this dynamically during
// runtime based on which course we're actually viewing
var courseId = pathParse(new URL(window.location.href).pathname).name; //this should be part of global ui state
var mainUrl = "";

// TODO(nate): This is a hardcoded user id. change this dynamically during
// runtime based on which user is actually viewing
var userId = 1;

//TODO: this is not the right place to put this. we might want to add this to global ui state
export var piazzaClassId = null;//"if44ov1fn5a505"

function getNode(nodeId: string){
  let endpoint = mainUrl + `/${courseId}/node/${nodeId}/`;
  return Promise.resolve($.ajax(endpoint,{
    method: "GET",
    dataType: "json"
  }));
}

function overwriteNode(node: Node){
  let endpoint = mainUrl + `/${courseId}/node/update/${node.id}/`;
  let data = {contents: node.contents, renderer: node.renderer, children: JSON.stringify(node.children)};
  return Promise.resolve($.ajax(endpoint, {
    method: "POST",
    data: data,
    dataType: "json"
  }));
}

function deleteNode(nodeId: string){
  let endpoint = mainUrl + `/${courseId}/node/delete/${nodeId}/`;
  return Promise.resolve($.ajax(endpoint, {
    method: "POST",
    dataType: "json"
  }));
}
// @deprecated
function overwriteChildren(node: Node){
  let endpoint = mainUrl + `/${courseId}/node/update/${node.id}/`;
  let data = {children: JSON.stringify(node.children)};
  return Promise.resolve($.ajax(endpoint, {
    method: "POST",
    data: data,
    dataType: "json"
  }));
}

function createNode(node: Node){
  let endpoint = mainUrl + `/${courseId}/node/add/`;
  return Promise.resolve($.ajax(endpoint, {
    method: "POST",
    data: {
      contents: node.contents,
      renderer: node.renderer
    },
    dataType: "json"
  }));
}

//currently rootId and depth are ignored
function getTree(){
  let endpoint = mainUrl + `/${courseId}/tree/`;
  return Promise.resolve($.ajax(endpoint,{
    method: "GET",
    dataType: "json"
  }));
}

function getRoot(){
  let endpoint = mainUrl + `/${courseId}/root/get/`;
  return Promise.resolve($.ajax(endpoint, {
    method: "GET",
    dataType: "json"
  }));
}

//gets user credentials
function getUserInfo(userId: number){
  let endpoint = mainUrl + `/static/piazza-credentials.json`;
  return Promise.resolve($.ajax(endpoint, {
    method: "GET",
    dataType: "json"
  }));
}

function getPiazzaClassId(courseId: number){
  let endpoint = mainUrl + `/${courseId}/course/getpiazza/`;
  return Promise.resolve($.ajax(endpoint, {
    method: "GET",
    dataType: "json"
  }));
}

var posts = new Map();
var cached = null;
function getPiazzaPosts(courseId: number){
  let endpoint = mainUrl + `/${courseId}/course/getpiazzaposts/`;
  let ignoredata = false;
  var req = http.get(endpoint, function(res){
    res.on('data', function(buf){
      if(ignoredata){
        return;
      }
      // console.log(buf.toString());
      if(!posts.has(courseId)){
        posts = posts.set(courseId, List());
      }

      let toparse;
      try{
        if(cached){
          toparse = cached + buf.toString();
          cached = null;
        } else {
          toparse = buf.toString();
        }

        let json = JSON.parse(buf.toString())
        if(json.hasOwnProperty("message")){
          error(`fetchpiazzaposts failed: ${json.message}`);
          ignoredata = true;
          return;
        }

        posts = posts.set(courseId,
          posts.get(courseId).push(JSON.parse(buf.toString()))
        );

        piazzaPostsFetched(posts.get(courseId));
      } catch(e) {
        cached = toparse;
      }
    });

    res.on('end', function(){
      if(this.statusCode === 200){
        piazzaPostsFetched(posts.get(courseId));
      }
    });

  });

  req.on('error', function(e){
    console.error(e);
    throw e;
  })
}

// getPiazzaPostsWorker


//More complex actions defined in terms of primitives
// promises are used to make the order of asynchronous steps more transparent
//---------------------------------------------------
export function addNewChild(parent: Node, child: Node, callback: any){
  let initializedChild, updatedParent;

  createNode(child) //create node
  .then((data) => { //modify parent
      data.contents = child.contents;
      data.renderer = child.renderer;
      data.children = {};

      initializedChild = new Node(data);
      updatedParent = Object.assign({}, parent);
      updatedParent.children = Object.assign({}, parent.children);
      for(var tag in updatedParent.children){
        if(updatedParent.children[tag] === child.id){
          updatedParent.children[tag] = initializedChild.id;
        }
      }

      return overwriteNode(updatedParent);
    }, handleError("addNewChild: Error creating new node:"))
  .then((data) => { //call passed in callback
      callback(initializedChild, updatedParent);
    }, handleError("addNewChild: Error overwriting parent:"));
}

export function editNode(node: Node, callback: any){
  overwriteNode(node)
  .then((data) => {
      callback(node);
    }, handleError("editNode: Error updating node:"));
}

export function removeNode(node: Node, parents: Array<Node>, callback: any){
  deleteNode(node.id).then(() => {
      //wait for all the parents to be updated
      return Promise.all(parents.map((parent_node) => overwriteNode(parent_node)));
    }, handleError("removeNode: Error deleting node:"))
  .then(()=>{
      callback(node, parents);
    }, handleError("removeNode: Error updating children for deleted node:"));
}

export function init(callback: any){
  let nodes, rootId;
  getTree().then((data) => {
      nodes = data.nodes;
      return getRoot();
    }, handleError("init: Error requesting tree:"))
  .then((data) => {
      rootId = data[0].id.toString();
      return getPiazzaClassId(courseId);
    }, handleError("init: Error requesting roots:"))
  .then((data) => {
      piazzaClassId = data.piazza_cid;
      // setTimeout(function(){
        getPiazzaPosts(courseId);
      // }, 2000);
      callback({rootId, nodes});
    }, handleError("init: Error getting piazza class id:"));
}

function handleError(errorStr){
  return (jqXHR, textStatus, errorThrown) => {
    console.error(errorStr, textStatus);
    error(`${errorStr} ${textStatus}`);
    throw errorThrown;
  }
}
