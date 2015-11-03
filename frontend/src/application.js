/* @flow */
import React from 'react';
import { Container } from 'flux/utils';
import jQuery from 'jquery';

import open from './Actions/open.js';
import * as WebAPI from './utils/webapi.js';

import nodeStore from './Stores/nodestore.js';
import uiStateStore from './Stores/uistatestore.js';

import Node from './Models/node.js';

import getRenderedElement from './Components/createelement.js';

class ApplicationComponent extends React.Component{
  constructor(){
    super();
    this.state = {nodes: null, ui: null};
  }

  componentDidMount() : void {
    WebAPI.getInitialTree(function(data){
      open(data.rootId, data.nodes);
    });
  }

  static getStores(){
    return [nodeStore, uiStateStore];
  }

  static calculateState(prevState){
    console.log("global state changed");
    return {
      nodes: nodeStore.getState(),
      ui: uiStateStore.getState()
    };
  }

  render() : React.Component {
    if(this.state.nodes && this.state.ui){
      let root = this.state.nodes.nodes.get(this.state.nodes.rootId);
      return getRenderedElement("root", root, this.state.ui);
    } else {
      return <span/>
    }
  }
}

const ApplicationContainer = Container.create(ApplicationComponent);
export default ApplicationContainer;
