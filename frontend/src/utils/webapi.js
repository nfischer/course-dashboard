import $ from 'jquery';
import * as piazza from 'piazza-api';

import Node from '../Models/node.js';

//TODO: clean up CALLBACK HELL

//this is a module exclusively for sending specific actions to the web api.
//complex actions can be defined here in terms of the basic RESTful API

//Primitive actions supported by webapi.
//----------------------------------------

// TODO(nate): This is a hardcoded <courseId>. Change this dynamically during
// runtime based on which course we're actually viewing
var courseId = "42";
var mainUrl = "";

// TODO(nate): This is a hardcoded user id. change this dynamically during
// runtime based on which user is actually viewing
var userId = 1;

//TODO: this is hardcoded. fix plz
export var classId = "if44ov1fn5a505";

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
function getTree(rootId = null, depth = null){
  let endpoint = mainUrl + `/${courseId}/tree/`;
  return $.ajax(endpoint,{
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

var piazza_class;

export function init(callback: any){
  let tree;
  Promise.resolve(
    getTree().then((data) => {
      tree = data;
      return getUserInfo(userId);
    }, (jqXHR, textStatus, errorThrown) => {
      console.error("Error requesting tree:",textStatus);
      throw errorThrown;
    }).then((userInfo) => {
      //this promise type is different than jquery promise type. need to address
        console.log(userInfo.piazza_username, userInfo.piazza_password);
        return piazza.login(userInfo.piazza_username, userInfo.piazza_password);
      }, (jqXHR, textStatus, errorThrown) => {
        console.error("Error requesting user info:", textStatus);
        throw errorThrown;
    })
  ).then((user) => {
      console.log(user);
      user.getClassById(classId).then(function(cls){
        piazza_class = cls;
      }, function(error){
        console.error("Error getting class:",error);
        throw error;
      });
      callback(tree, user);
    }, function(error){
      console.error("Error getting user:",error);
      throw error;
  });
}

var folderData = {};

export function applyTimeFilter({start, end}, callback){ //may want to make this asynchronous
  let folderData = Object.keys(folderData).length > 0 ?
    new Promise(function(resolve, reject){
      resolve( folderData );
    }) :
    Promise.all(piazza_class.folders.map(piazza_class.filterByFolder.bind(piazza_class)))
      .then(function(foldersFeedItems){
          foldersFeedItems.forEach((feedItems, i) => {
            folderData[piazza_class.folders[i]] = feedItems;
          });

          return folderData
        }, function(error){
          console.error("Error getting folders:", error);
          throw error;
      });

  folderData.then((folderData) => {
      let filtered = [];
      let startDate = Date.parse(start);
      let endDate = Date.parse(end);

      for( folder in folderData ){
        filtered = filtered.concat(folderData[folder].filter(item => {
          let date = Date.parse(item.lastModified);
          return start <= date && date <= end;
        }));
      }

      callback(filtered);
    }, (error) => {
      console.error("Error filtering folders:", error);
      throw error;
  });
}
