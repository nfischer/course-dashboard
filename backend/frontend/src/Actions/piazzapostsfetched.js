/* @flow */
import { List } from 'immutable';

import Action from './action.js';
import dispatcher from '../dispatcher.js';

class PiazzaPostsFetched extends Action {
  constructor(posts: List<Object>){
    super("piazzaPostsFetched", {posts});
  }
}

export default function piazzaPostsFetched(posts: List<Object> ) {
  let action = new PiazzaPostsFetched(posts);
  dispatcher.dispatch(action);
}
