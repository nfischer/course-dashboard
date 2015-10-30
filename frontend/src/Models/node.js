/* @flow */

//internal model for a Node. used across the frontend
export default class Node {
	id: string;
	contents: string;
	renderer: string;
	children: Object;

	constructor(node: Object){
		this.id = node.id;
		this.contents = node.contents;
		this.renderer = node.renderer;
		if(typeof node.children === "string"){
			this.children = JSON.parse(node.children);
		}
		this.children = node.children;
	}
}
