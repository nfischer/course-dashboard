/* @flow */
import { Map } from 'immutable';

import Action from './action.js';
import dispatcher from '../dispatcher.js';
import Node from '../Models/node.js';


class Open extends Action{
  constructor(rootId: string, nodes: Array<Node>){
    super("open", {rootId, nodes});
  }
}

export default function open(rootId: string, nodes: Array<Node>) {
  let action = new Open(rootId, nodes);
  dispatcher.dispatch(action);
}
