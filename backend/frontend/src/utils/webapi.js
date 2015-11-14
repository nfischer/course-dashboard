import $ from 'jquery';
import * as piazza from 'piazza-api';
import * as http from 'stream-http';
import { Map, List } from 'immutable';

import Node from '../Models/node.js';
import piazzaPostsFetched from '../Actions/piazzapostsfetched.js'

//TODO: clean up CALLBACK HELL

//this is a module exclusively for sending specific actions to the web api.
//complex actions can be defined here in terms of the basic RESTful API

//Primitive actions supported by webapi.
//----------------------------------------

// TODO(nate): This is a hardcoded <courseId>. Change this dynamically during
// runtime based on which course we're actually viewing
var courseId = "1";
var mainUrl = "";

// TODO(nate): This is a hardcoded user id. change this dynamically during
// runtime based on which user is actually viewing
var userId = 1;

//TODO: this is not the right place to put this. we might want to add this to global ui state
export var piazzaClassId = null;//"if44ov1fn5a505"

function getNode(nodeId: string){
  let endpoint = mainUrl + `/${courseId}/node/${nodeId}/`;
  return $.ajax(endpoint,{
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
function getTree(){
  let endpoint = mainUrl + `/${courseId}/tree/`;
  return $.ajax(endpoint,{
    method: "GET",
    dataType: "json"
  });
}

function getRoot(){
  let endpoint = mainUrl + `/${courseId}/root/get/`;
  return $.ajax(endpoint, {
    method: "GET",
    dataType: "json"
  });
}

//gets user credentials
function getUserInfo(userId: number){
  let endpoint = mainUrl + `/static/piazza-credentials.json`;
  return $.ajax(endpoint, {
    method: "GET",
    dataType: "json"
  });
}

function getPiazzaClassId(courseId: number){
  let endpoint = mainUrl + `/${courseId}/course/getpiazza/`;
  return $.ajax(endpoint, {
    method: "GET",
    dataType: "json"
  });
}

var posts = new Map();
var cached = null;
function getPiazzaPosts(courseId: number){
  let endpoint = mainUrl + `/${courseId}/course/getpiazzaposts/`;
  http.get(endpoint, function(res){
    res.on('data', function(buf){
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

        posts = posts.set(courseId,
          posts.get(courseId).push(JSON.parse(buf.toString()))
        );

        piazzaPostsFetched(posts.get(courseId));
      } catch(e) {
        cached = toparse;
      }
    });

    res.on('end', function(){
      piazzaPostsFetched(posts.get(courseId));
    });
  })
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

export function init(callback: any){
  let nodes, rootId;
  getTree().then((data) => {
      nodes = data.nodes;
      return getRoot();
    }, (jqXHR, textStatus, errorThrown) => {
      console.error("Error requesting tree:",textStatus);
      throw errorThrown;
  }).then((data) => {
      rootId = data[0].id.toString();
      return getPiazzaClassId(courseId);
    }, (jqXHR, textStatus, errorThrown) => {
      console.error("Error requesting roots:", textStatus);
      throw errorThrown;
  }).then((data) => {
      piazzaClassId = data.piazza_cid;
      setTimeout(function(){
        getPiazzaPosts(courseId);
      }, 2000);
      callback({rootId, nodes});
    }, (jqXHR, textStatus, errorThrown) => { //make this a separate function
      console.error(textStatus);
      throw errorThrown;
  });
}
