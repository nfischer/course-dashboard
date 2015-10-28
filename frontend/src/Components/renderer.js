/* @flow */
import React from 'react';
import Modal from 'react-bootstrap/lib/Modal';
import ModalBody from 'react-bootstrap/lib/ModalBody';
import Input from 'react-bootstrap/lib/Input';
import ButtonInput from 'react-bootstrap/lib/ButtonInput';
import marked from 'marked';

import nodeStore from '../Stores/nodestore.js';
import getRenderedElement from './createelement.js';

import titleCaps from '../utils/titlecaps.js';

function mapObject(obj: Object, callback: any) : Array<any> { // replace any
    return Object.keys(obj).map(function(value, index, array) {
        return callback(obj[value], value, obj);
    });
}

export class Renderer extends React.Component{ //default renderer
  render() : React.Element {
    if (Object.keys(this.props.node.children).length == 0) { //leaf
      return (
        React.createElement(this.props.node.renderer,
                            {className: "node"},
                            <contents dangerouslySetInnerHTML={{__html: marked(this.props.node.contents)}}/>
                          )
      );
    } else {
      return (
        React.createElement(this.props.node.renderer,
                            {className: "node"},
                            [
                              <contents dangerouslySetInnerHTML={{__html: marked(this.props.node.contents)}}/>,
                              <children>
                                  {mapObject(this.props.node.children, function(id: string, tag: string, obj: Object) {
                                    return getRenderedElement(tag, nodeStore.getState().nodes.get(id));
                                  })}
                              </children>
                            ])
      );
    }
  }
}

export class List extends React.Component {
  render() : React.Element {
    return (
      <list>
        <h1>{titleCaps(this.props.tag)}</h1>
        {
          mapObject(this.props.node.children, function(id: string, tag: string){
            return <ListElement tag={tag} node={nodeStore.getState().nodes.get(id)} />;
          })
        }
      </list>
    )
  }
}

export class ListElement extends React.Component {
  constructor(){
    super();
    this.state = {
      show: false
    }
  }

  render() : React.Element {
    return (
      React.createElement(this.props.node.renderer,
                          {onClick: this.handleClick.bind(this),
                           className: "listelement"},
                          [
                            <h2>{titleCaps(this.props.tag)}</h2>,
                            <Modal show={this.state.show} onHide={this.close.bind(this)}>
                              <ModalBody>
                                {getRenderedElement(this.props.tag, this.props.node)}
                              </ModalBody>
                            </Modal>
                          ])
    );
  }

  handleClick(event){
    console.log(event);
    this.setState({show: true});
  }

  close(){
    this.setState({show: false});
  }
}

export class EditableList extends React.Component {
  render() : React.Element {
    return (
      <list>
        <h1>{titleCaps(this.props.tag)}</h1>
        <ListElementInput onClick={this.addNewChild.bind(this)}/>
        {
          mapObject(this.props.node.children, function(id: string, tag: string){
            return <ListElement tag={tag} node={nodeStore.getState().nodes.get(id)} />;
          })
        }
      </list>
    )
  }

  addNewChild(title: string, markdown: string){
    console.log("addNewChild", title, markdown);
    //call action to add resource
  }
}

export class ListElementInput extends React.Component {
  render() : React.Component { //add type that is element or component
    return (
      <form>
        <Input type="text" ref="title" placeholder="title"/>
        <Input type="textarea" ref="contents" placeholder="type markdown here"/>
        <ButtonInput type="reset" value="Create" onClick={this.clickWrapper.bind(this)}/>
      </form>
    );
  }

  clickWrapper(){
    let title=this.refs["title"].getValue(), value=this.refs["contents"].getValue();

    console.log("clickwrapper");
    console.log(title, value);
    this.props.onClick(title, value);
  }
}
