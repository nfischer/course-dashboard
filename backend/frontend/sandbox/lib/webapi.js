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
  if(name === ""){
    name = CS130;
  }

  let endpoint = URL + `0/course/add/`;
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

  let endpoint = URL + `${courseId}/course/setPiazza/`;
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

//===================================

export function processSubmittedCourse(course: Object){
  //TODO: convert tree into flat set of nodes
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
      //ADD ROOT HERE
    }, handleError("Error updating node children"))
  .then(()=> {
      //BLEP
    }, handleError("Error adding root"));
}

function flatten(course: Object){
  let nodes = [];

  course.renderer = "Timeline";
  course.contents = "";
  course.children = pairsToObject(course.weeks.map((week, i)=>{
    let weekNode = {
      contents: "",
      renderer: "Week",
      //beginning to enter callback hell here. plz fix
    }
    return [`Week ${i}`, week];
  }));
}

function pairsToObject(pairs){
  return pairs.reduce((o, pair){
    o[pair[0]] = pair[1];
    return o;
  }, {});
}
