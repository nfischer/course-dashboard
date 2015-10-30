/* @flow */

//internal model for a Node. used across the frontend
export default class Node {
	id: string;
	contents: string;
	renderer: string;
	children: Object;

	constructor(node: Object){
		if(typeof node.id === "string"){
			this.id = node.id;
		} else if(typeof node.id === "number"){
			this.id = node.id.toString();
		}
		this.contents = node.contents;
		this.renderer = node.renderer;
		if(typeof node.children === "string"){
			this.children = JSON.parse(node.children);
		} else {
			this.children = node.children ? node.children : {};
		}
	}
}
