/* @flow */
import { ReduceStore } from 'flux/utils';
import { Dispatcher } from 'flux';
import { Map, List } from 'immutable';

import Action from '../Actions/action.js';
import Node from '../Models/node.js';
import dispatcher from '../dispatcher.js';

class UIState {
  currentWeek: string;
  piazzaPosts: List<Object>;
  error: string;

  constructor(currentWeek: string){
    this.currentWeek = currentWeek;
    this.piazzaPosts = new List();
    this.error = null;
  }
}

//stores global UI state, which is made available to all nodes in the render tree.
class UIStateStore extends ReduceStore<?UIState> {

  getInitialState() : ?UIState {
    return new UIState("");
  }

  reduce(state: ?UIState, action: Action) : ?UIState {
    let newState;
    switch(action.name){
    case "open":
      return new UIState("");
    case "piazzaPostsFetched":
      newState = new UIState(state.currentWeek);
      newState.piazzaPosts = action.data.posts;
      return newState;
    case "expandWeek":
      //TODO: this is really ugly. may want to use Object.assign
      newState = new UIState(action.data);
      newState.piazzaPosts = state.piazzaPosts;
      return newState;
    case "error":
      newState = new UIState(state.currentWeek);
      newState.piazzaPosts = state.piazzaPosts;
      newState.error = action.data.err;
      return newState;
    }

    return state;
  }
}

var uiStateStore = new UIStateStore(dispatcher);
export default uiStateStore;
