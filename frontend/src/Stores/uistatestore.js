/* @flow */
import { ReduceStore } from 'flux/utils';
import { Dispatcher } from 'flux';
import { Map } from 'immutable';

import Action from '../Actions/action.js';
import Node from '../Models/node.js';
import dispatcher from '../dispatcher.js';

class UIState {
  currentWeek: string;
  piazza_user: Object;

  constructor(currentWeek: string){
    this.currentWeek = currentWeek;
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
      //TODO: this is really ugly. may want to use Object.assign
      newState = new UIState(state.currentWeek);
      newState.piazza_user = action.data.user;
      break;
    case "expandWeek":
      //TODO: this is really ugly. may want to use Object.assign
      newState = new UIState(action.data);
      newState.piazza_user = state.piazza_user;
      break;
    }

    return newState;
  }
}

var uiStateStore = new UIStateStore(dispatcher);
export default uiStateStore;
