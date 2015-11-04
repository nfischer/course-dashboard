/* @flow */
import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-bootstrap/lib/Modal';
import ModalBody from 'react-bootstrap/lib/ModalBody';
import Input from 'react-bootstrap/lib/Input';
import ButtonInput from 'react-bootstrap/lib/ButtonInput';
import Alert from 'react-bootstrap/lib/Alert';
import marked from 'marked';

import nodeStore from '../Stores/nodestore.js';
import getRenderedElement from './createelement.js';
import expandWeek from '../Actions/expandweek.js';
import addNode from '../Actions/addnode.js';

import titleCaps from '../utils/titlecaps.js';

var mdRenderer = new marked.Renderer();
mdRenderer.link = function(href: string, title: string, text: string){
  return `<a href="${href}" title="${title}" target="_blank">${text}</a>`;
};
marked.setOptions({
  renderer: mdRenderer
});


function mapObject(obj: Object, callback: any) : Array<any> { // replace any
    return Object.keys(obj).sort().map(function(value, index, array) {
        return callback(obj[value], value, obj);
    });
}

//Default renderer. this is the component that is added if no component is specified for a given renderer
export class Renderer extends React.Component{
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
                            <contents dangerouslySetInnerHTML={{__html: marked(this.props.node.contents)}}/>,
                            <children>
                                {mapObject(this.props.node.children, (id: string, tag: string, obj: Object) =>
                                  getRenderedElement(tag, nodeStore.getState().nodes.get(id), this.props.ui)
                                )}
                            </children>
                           )
      );
    }
  }
}

//Week renderer. if this week is the current one in the ui state, then the week is shown expanded. otherwise, a collapsedweek is shown.
export class Week extends React.Component {
  constructor(){
    super();
  }
  render() : React.Element {
    let fullyRendered = React.createElement("fullweek",
                          {className: "node"},
                          <h1 onClick={this.collapse.bind(this)}>{titleCaps(this.props.tag)}</h1>,
                          <contents dangerouslySetInnerHTML={{__html: marked(this.props.node.contents)}}/>,
                          <children>
                              {mapObject(this.props.node.children, (id: string, tag: string, obj: Object) =>
                                getRenderedElement(tag, nodeStore.getState().nodes.get(id), this.props.ui)
                              )}
                          </children>
                          );

    return (
      <week>{
        this.props.ui.currentWeek !== this.props.tag ?
          <WeekCollapsed tag={this.props.tag} onClick={this.expand.bind(this)}/> :
          fullyRendered
      }</week>
    );
  }

  expand(event){
    expandWeek(this.props.tag);
  }

  collapse(event){
    expandWeek("");
  }
}

export class WeekCollapsed extends React.Component{
  render() : React.Component {
    let w = 160;
    return (
      <collapsedweek onClick={this.props.onClick}>
        <svg height={w} width={w}>
          <circle cx={w/2} cy={w/2} r={w/2-5} stroke="black" strokeWidth="3" fill="white" />
          <text  x="50%" y="50%" dy="5px" textAnchor="middle" fill="black">{this.props.tag}</text>
        </svg>
      </collapsedweek>
    );
  }
}

//List renderer. List items are shown in a modal dialog
export class List extends React.Component {
  render() : React.Element {
    return (
      <list>
        <h1>{titleCaps(this.props.tag)}</h1>
        {
          mapObject(this.props.node.children, (id: string, tag: string) =>
            <ListElement tag={tag} key={id} node={nodeStore.getState().nodes.get(id)} ui={this.props.ui} />
          )
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
                          <h2>{titleCaps(this.props.tag)}</h2>,
                          <Modal show={this.state.show} onHide={this.close.bind(this)}>
                            <ModalBody>
                              {getRenderedElement(this.props.tag, this.props.node, this.props.ui)}
                            </ModalBody>
                          </Modal>
                          )
    );
  }

  handleClick(event){
    this.setState({show: true});
  }

  close(){
    this.setState({show: false});
  }
}

//Editable list renderer: same as a list, except that elements can be added.
//currently only adds "Resource" nodes, but will allow for more in the future
export class EditableList extends React.Component {

  render() : React.Element {
    return (
      <list>
        <h1>{titleCaps(this.props.tag)}</h1>
        <ListElementInput onClick={this.addNewChild.bind(this)}/>
        {
          mapObject(this.props.node.children, (id: string, tag: string) =>
            <ListElement key={id} tag={tag} node={nodeStore.getState().nodes.get(id)} />
          )
        }
      </list>
    )
  }

  addNewChild(title: string, markdown: string){
    addNode(this.props.node, title, markdown, "Resource");
  }
}

class ListElementInput extends React.Component {
  constructor(){
    super();
    this.state = {
      alert: null
    };
  }

  render() : React.Component { //add type that is element or component
    return (
      <listelementinput>
        {this.state.alert ? this.state.alert : <placeholder/>}
        <form ref="formelement">
          <Input type="text" ref="title" placeholder="title"/>
          <Input type="textarea" ref="contents" placeholder="type markdown here"/>
          <ButtonInput value="Create" onClick={this.clickWrapper.bind(this)}/>
        </form>
      </listelementinput>
    );
  }

  clickWrapper(){
    let title=this.refs["title"].getValue().trim(), value=this.refs["contents"].getValue();
    if(title === ""){
      this.setState({alert: <AlertDismissable text="ERROR: must have a title"
                                              onDismiss={this.onDismiss.bind(this)}/>});
    } else {
      ReactDOM.findDOMNode(this.refs["formelement"]).reset();
      this.props.onClick(title, value);
    }
  }

  onDismiss(){
    this.setState({alert: []});
  }
}

class AlertDismissable extends React.Component {
  constructor(){
    super();
    this.state = {
      alertVisible: true
    };
  }

  render(){
    if(this.state.alertVisible){
      return (
        <Alert bsStyle="danger" onDismiss={this.handleAlertDismiss.bind(this)} dismissAfter={2000}>
          <p>{this.props.text}</p>
        </Alert>
      );
    } else {
      return <placeholder/>;
    }
  }

  handleAlertDismiss(){
    this.setState({alertVisible: false});
    this.props.onDismiss();
  }
}
