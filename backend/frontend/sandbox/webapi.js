import $ from 'jquery';

var URL = 'http://localhost:5000';

//uses the backend API to create a node
function createNode(courseId, contents, renderer){
  let node_value = {
    contents,
    renderer
  };

  let endpoint = URL + `/${courseId}/node/add/`;
  return Promise.resolve($.ajax(endpoint, {
    method: "POST",
    data: node_values,
    dataType: "json"
  }));
}

function getNode(courseId, nodeId){
  let endpoint = URL + `/${courseId}/node/${nodeId}/`;
  return Promise.resolve($.ajax(endpoint,{
    method: "GET",
    dataType: "json"
  }));
}

function updateNode(courseId, node){
  let endpoint = mainUrl + `/${courseId}/node/update/${id}/`;
  let data = {contents: node.contents, renderer: node.renderer, children: JSON.stringify(node.children)};
  return Promise.resolve($.ajax(endpoint, {
    method: "POST",
    data: data,
    dataType: "json"
  }));
}

function deleteNode(courseId, nodeId: string){
  let endpoint = mainUrl + `/${courseId}/node/delete/${nodeId}/`;
  return Promise.resolve($.ajax(endpoint, {
    method: "POST",
    dataType: "json"
  }));
}

function addRoot(courseId, rootId){
  rootId = rootId.toString();

  let endpoint = URL + `/${courseId}/root/set/${rootId}/`;
  return Promise.resolve($.ajax(endpoint, {
    method: "POST"
  }));
}

function initializeCourse(courseName){
  if(courseName === ""){
    courseName = "CS130";
  }

  let endpoint = URL + `/0/course/add/`;
  return Promise.resolve($.ajax(endpoint, {
    method: "POST",
    data: {name},
    dataType: "json"
  }));
}

function setPiazza(courseId, piazzaId){
  let data = {
    "piazza_cid": piazzaId
  };

  let endpoint = URL + `/${courseId}/course/setPiazza/`;
  return Promise.resolve($.ajax(endpoint, {
    method: "POST",
    data,
    dataType: "json"
  }));
}

//===================================

function handleError(errorStr){
  return (jqXHR, textStatus, errorThrown) => {
    console.error(errorStr, textStatus);
    throw errorThrown;
  }
}


//=================================

function flatten(course: Object){
  let nodes = [];

  let courseNode = {};
  courseNode.renderer = "Timeline";
  courseNode.contents = "";
  courseNode.children = pairsToObject(course.weeks.map((week, i)=> weekToNode(week, i)));

  return bfs(courseNode);
}

function bfs(root){
  let workingQueue = [root];
  let returnQueue = [];

  while(!(workingQueue.length === 0)){
    let current = workingQueue.shift();
    returnQueue.push(current);

    for(let tag in current.children){
      workingQueue.push(current.children[tag]);
    }
  }

  return returnQueue;
}

function weekToNode(week, i){
  let weekNode = {
    contents: "",
    renderer: "Week",
    children: {
      announcements : {
        contents: JSON.stringify(week.dateRangeInput),
        renderer: "Announcements",
        children: {}
      },
      assignments : assignmentsToNode(week.assignments),
      topics : topicsToNode(week.topics)
    }
  }
  return [`Week ${i}`, weekNode];
}

function assignmentsToNode(assignments){
  return {
    contents: "Assignments\n==",
    renderer: "ModalList",
    children: pairsToObject(assignments.map((assign)=> [assign.title, {
      contents: assign.markdown,
      renderer: "Assignment",
      children: {}
    }]))
  };
}

function topicsToNode(topics){
  return {
    contents: "",
    renderer: "ModalList",
    children: pairsToObject(topics.map(topicToNode))
  };
}

function topicToNode(topic){
  return [topic.title.toLowerCase(), {
    contents: `${topic.title}\n==`,
    renderer: "Topic",
    children: {
      resources: resourcesToNode(topic.resources)
    }
  }];
}

function resourcesToNode(resources){
  return {
    contents: "",
    renderer: "EditableList",
    children: pairsToObject(resources.map((resource)=> [resource.title, {
      contents: resource.markdown,
      renderer: "Resource",
      children: {}
    }]))
  };
}

function pairsToObject(pairs){
  return pairs.reduce((o, pair) => {
    o[pair[0]] = pair[1];
    return o;
  }, {});
}

//===================================

export function processSubmittedCourse(course: Object){
  //convert the tree to a flat list of nodes
  let nodes = flatten(course);
  let courseId;
  //call appropriate primitives to create the course
  initializeCourse(course.courseDetails.title)
  .then((cId)=>{
      courseId = cId;
      return setPiazza(courseId, course.courseDetails.piazzaCourseId);
    }, handleError("Error initializing course:"))
  .then(()=> {
      return Promise.all(nodes.map((node) => createNode(courseId, node.contents, node.renderer)))
    }, handleError("Error setting course piazza ID:"))
  .then((ids)=> {
      //HANDLE LACK OF STRINGINESS
      ids = ids.map((obj)=> (typeof obj.id === "string") ?
                               obj.id :
                               obj.id.toString());
      //REPLACE MAPPING TO NODE WITH MAPPING TO ID
      nodes.forEach((node, i)=> node.id = ids[i]);
      nodes.forEach((node)=> {
        for(var tag in node.children){
          node.children[tag] = node.children[tag].id;
        }
      });

      return Promise.all(nodes.map((node)=> updateNode(courseId, node)));
    }, handleError("Error creating nodes:"))
  .then(()=> {
      return addRoot(nodes[0].id)
    }, handleError("Error updating node children:"))
  .then(()=> {
      //BLEP
    }, handleError("Error adding root:"));
}

global.processSubmittedCourse = processSubmittedCourse;
