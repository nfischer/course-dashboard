export default class Node {
	
	constructor(id, contents, renderer){
		this.id = id;
		this.contents = contents;
		this.renderer = renderer;
		this.children = {};
	}
}