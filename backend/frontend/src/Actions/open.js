/* @flow */
import { Map } from 'immutable';

import Action from './action.js';
import dispatcher from '../dispatcher.js';
import Node from '../Models/node.js';


class Open extends Action{
  constructor(rootId: string, nodes: Map<string, Node>, userInfo: Object){
    super("open", {rootId, nodes, userInfo});
  }
}

export default function open(rootId: string, nodes: Map<string, Node>, userInfo: Object) {
  let action = new Open(rootId, nodes, userInfo);
  dispatcher.dispatch(action);
}
