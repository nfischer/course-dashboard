/* @flow */
export default class Action{
  name: string;
  data: any;

  constructor(name: string, data: Object, links: Object){
    if(this.constructor === Action){ //TODO: make abstract class helper
      throw new Error("cannot instantiate abstract class Action");
    }
    this.name = name;
    this.data = data;
    this.links = links || {}; // empty obj if 3rd arg (links) isn't given
  }
}
