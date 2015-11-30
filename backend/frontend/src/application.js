/* @flow */
import React from 'react';
import { Container } from 'flux/utils';
import jQuery from 'jquery';
import Alert from 'react-bootstrap/lib/Alert';

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
    WebAPI.init(function(tree){
      open(tree.rootId, tree.nodes);
    });
  }

  static getStores(){
    return [nodeStore, uiStateStore];
  }

  static calculateState(prevState){
    return {
      nodes: nodeStore.getState(),
      ui: uiStateStore.getState()
    };
  }

  render() : React.Component {
    if(this.state.nodes && this.state.ui){
      let root = this.state.nodes.nodes.get(this.state.nodes.rootId);
      return (
        <div>
          {
            this.state.ui.error ? <Alert bsStyle="danger">
                                     <p>{`ERROR: ${this.state.ui.error}`}</p>
                                  </Alert> :
                                  <div/>
          }
          {getRenderedElement("root", root, this.state.ui)}
        </div>
      );
    } else {
      return <span/>
    }
  }
}

const ApplicationContainer = Container.create(ApplicationComponent);
export default ApplicationContainer;
