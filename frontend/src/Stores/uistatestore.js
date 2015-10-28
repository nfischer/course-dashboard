/* @flow */
import { ReduceStore } from 'flux/utils';
import { Dispatcher } from 'flux';
import { Map } from 'immutable';

import Action from '../Actions/action.js';
import Node from '../Models/node.js';
import dispatcher from '../dispatcher.js';

class UIState {
  currentWeek: string;

  constructor(currentWeek: string){
    this.currentWeek = currentWeek;
  }
}

class UIStateStore extends ReduceStore<?UIState> {

  getInitialState() : ?UIState {
    return new UIState("week 1");
  }

  reduce(state: ?UIState, action: Action) : ?UIState {
    switch(action.name){
    case "expandWeek":
      return new UIState(action.data);
    }

    return state;
  }
}

var uiStateStore = new UIStateStore(dispatcher);
export default uiStateStore;
