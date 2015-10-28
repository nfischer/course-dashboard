/* @flow */
import React from 'react';
import { Container } from 'flux/utils';
import jQuery from 'jquery';

import open from './Actions/open.js';
import nodeStore from './Stores/nodestore.js';
import Node from './Models/node.js';
import getRenderedElement from './Components/createelement.js';

var filename = "http://localhost:8000/sampledata.json";

class ApplicationComponent extends React.Component{
  constructor(){
    super();
    this.state = {rootId: null, nodes: null};
  }

  componentDidMount() : void {
    jQuery.ajax({
      url: filename,
      dataType: 'json',
    }).then((data) => {
      open(data.rootId, data.nodes);
    }, (jqXHR, textStatus, errorThrown) => {
      console.error(textStatus);
    });
  }

  static getStores(){
    return [nodeStore];
  }

  static calculateState(prevState){
    return nodeStore.getState();
  }

  render() : React.Component {
    if(this.state && this.state.rootId){
      let root = this.state.nodes.get(this.state.rootId);
      return getRenderedElement("root", root);
    } else {
      return <span/>
    }
  }
}

const ApplicationContainer = Container.create(ApplicationComponent);
export default ApplicationContainer;
