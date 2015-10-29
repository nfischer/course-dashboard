//this is a module exclusively for sending specific actions to the web api.
//more specific actions can be implemented here in terms of a general api

function getNode(nodeId: string){}
function overwriteNode(node: Node){}
function createNode(node: Node){} //undefined id becomes defined. same with children

export function addNewChild(node: Node, tag: string, markdown: string, renderer: string, callback: any){
  let child = new Node({
    contents: markdown,
    renderer
  });
  let initialized_child;

  createNode(child) //create node
    .then((data) => { //modify parent
      initialized_child = new Node(data);
      node.children[tag] = initialized_child.id;
      return overwriteNode(node);
    }, (jqXHR, textStatus, errorThrown) => {
      console.error(textStatus);
    })
    .then((data) => { //call passed in callback
      callback(initialized_child);
    }, (jqXHR, textStatus, errorThrown) => {
      console.error(textStatus);
    });
}
