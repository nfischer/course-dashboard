/* @flow */
import React from 'react';
import ReactDOM from 'react-dom';
import partial from 'partial';

import Input from 'react-bootstrap/lib/Input';
import Button from 'react-bootstrap/lib/Button';
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup';
import Alert from 'react-bootstrap/lib/Alert';
import marked from 'marked';
import Modal from 'react-bootstrap/lib/Modal';
import ModalBody from 'react-bootstrap/lib/ModalBody';

import Node from '../Models/node.js';

import nodeStore from '../Stores/nodestore.js';
import getRenderedElement from './createelement.js';
import expandWeek from '../Actions/expandweek.js';
import addNode from '../Actions/addnode.js';
import editNode from '../Actions/editnode.js';
import removeNode from '../Actions/removenode.js';

import titleCaps from '../utils/titlecaps.js';
import * as WebAPI from '../utils/webapi.js';

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

//Week renderer. if this week is the current one in the ui state, then the week is shown expanded.
//otherwise, a collapsedweek is shown.
export class Week extends React.Component {
  constructor(){
    super();
  }
  render() : React.Element {
    let fullyRendered = React.createElement("fullweek",
                          {className: "node"},
                          <h1 className="weektitle" onClick={this.collapse.bind(this)}>{titleCaps(this.props.tag)}</h1>,
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
          <text  x="50%" y="50%" dy="9px" textAnchor="middle" fill="black">{titleCaps(this.props.tag)}</text>
        </svg>
      </collapsedweek>
    );
  }
}

function itemInFilter(filter, item){
  let start = Date.parse(filter.start), end = Date.parse(filter.end);
  let cur = Date.parse(item.history[0].created);
  return (start <= cur && cur <= end);
}

function dateCompare(a, b){
  let dateA = Date.parse(a.history[0].created),
      dateB = Date.parse(b.history[0].created);

  if(dateA < dateB){
    return -1;
  } else if(dateA > dateB){
    return 1;
  } else {
    return 0;
  }
};

export class Announcements extends React.Component{ //this should pretty much behave like a list
  constructor(){
    super();
    this.state = {
      filter: null,
      filteredItems: []
    };
  }

  componentWillMount(){
    let filter = JSON.parse(this.props.node.contents);
    this.setState({
      filter,
      filteredItems: this.props.ui.piazzaPosts
        .filter(partial(itemInFilter, filter))
        .sort(dateCompare)
    });
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      filteredItems: this.props.ui.piazzaPosts
        .filter(partial(itemInFilter, this.state.filter))
        .sort(dateCompare)
    })
  }

  render(){
    let artificialId = -1;
    return (
      <announcements>
        <h1>{titleCaps(this.props.tag)}</h1>
        {
          this.state.filteredItems.map((item) =>{
            let latest = item.history[0];
            //create artificial node for this item
            let artificialNode = new Node({
              id: item.id,
              contents: `[${latest.subject}](http://piazza.com/class/${WebAPI.piazzaClassId}?cid=${item.id})`,
              renderer: "Piazza-Item",
              children: {}
            });

            return getRenderedElement(latest.subject, artificialNode, this.props.ui);
            // <ListElement tag={latest.subject}
            //                     key={item.id}
            //                     node={artificialNode}
            //                     ui={this.props.ui} />
          })
        }
      </announcements>
    );
  }
}


//===== MODAL LIST
//  children are expanded in a modal dialog

export class ModalList extends React.Component {
  render() : React.Element {
    return (
      <list className={this.props.tag}>
        <h1>{titleCaps(this.props.tag)}</h1>
        {
          mapObject(this.props.node.children, (id: string, tag: string) =>
            <ModalListElement tag={tag} key={id} node={nodeStore.getState().nodes.get(id)} ui={this.props.ui} />
          )
        }
      </list>
    )
  }
}

export class ModalListElement extends React.Component {
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

export class EditableModalList extends React.Component {

  render() : React.Element {
    return (
      <list>
        <h1>{titleCaps(this.props.tag)}</h1>
        <ListElementCreator onClick={this.addNewChild.bind(this)}/>
        {
          mapObject(this.props.node.children, (id: string, tag: string) =>
            <ModalListElement key={id} tag={tag} node={nodeStore.getState().nodes.get(id)} />
          )
        }
      </list>
    )
  }

  addNewChild(title: string, markdown: string){
    addNode(this.props.node, title, markdown, "Resource");
  }
}

//===== DEFAULT LIST
// children are expanded inline

export class List extends React.Component {
  render() : React.Element {
    return (
      <list className={this.props.tag}>
        <h1>{titleCaps(this.props.tag)}</h1>
        {
          mapObject(this.props.node.children, (id: string, tag: string) =>
            getRenderedElement(tag, nodeStore.getState().nodes.get(id), this.props.ui)
          )
        }
      </list>
    )
  }
}

//Editable list renderer: same as a list, except that elements can be added.
//currently only adds "Resource" nodes, but will allow for more in the future
export class EditableList extends React.Component {

  render() : React.Element {
    return (
      <list>
        <h1>{titleCaps(this.props.tag)}</h1>
        <ListElementCreator onClick={this.addNewChild.bind(this)}/>
        {
          mapObject(this.props.node.children, (id: string, tag: string) =>
            getRenderedElement(tag, nodeStore.getState().nodes.get(id), this.props.ui)
          )
        }
      </list>
    )
  }

  addNewChild(title: string, markdown: string){
    addNode(this.props.node, title, markdown, "Resource");
  }
}

export class Topic extends React.Component{
  render() : React.Element {
    return (
      <topic>
        <contents dangerouslySetInnerHTML={{__html: marked(this.props.node.contents)}}/>
        <children>
          {mapObject(this.props.node.children, (id: string, tag: string, obj: Object) =>
            getRenderedElement(tag, nodeStore.getState().nodes.get(id), this.props.ui)
          )}
        </children>
      </topic>
    );
  }
}

export class Resource extends React.Component{
  constructor(){
    super();
    this.state = {
      editing: false
    }
  }

  render() : React.Element {
    return (
      this.props.node.id < 0 ?
        <resource>
          <contents dangerouslySetInnerHTML={{__html: marked(this.props.node.contents)}}/>
        </resource> :
        this.state.editing ?
          <resource>
            <Input type="textarea" ref="contents" defaultValue={this.props.node.contents}/>
            <Button onClick={this.endEdit.bind(this)}>Save</Button>
            <Button onClick={this.deleteNode.bind(this)}>Delete</Button>
          </resource> :
          <resource>
            <contents dangerouslySetInnerHTML={{__html: marked(this.props.node.contents)}}/>
            <Button onClick={this.startEdit.bind(this)}>Edit</Button>
            <Button onClick={this.deleteNode.bind(this)}>Delete</Button>
          </resource>
    );
  }

  startEdit(event){
    this.setState({editing: true});
  }

  endEdit(event){
    this.setState({editing: false});
    editNode(this.props.node, this.refs["contents"].getValue());
  }

  deleteNode(event){
    removeNode(this.props.node);
  }
}

export class Assignment extends React.Component{
  render() : React.Element {
    return (
      <assignment>
        <contents dangerouslySetInnerHTML={{__html: marked(this.props.node.contents)}}/>
      </assignment>
    );
  }
}

class ListElementCreator extends React.Component {
  constructor(){
    super();
    this.state = {
      visible: false,
      alert: false
    };
  }

  render() : React.Component { //add type that is element or component
    return (
      <listelementinput>
        {this.state.alert ?
          <Alert bsStyle="danger">
            <p>Error: No title specified</p>
          </Alert> :
          <placeholder/>}
        {this.state.visible ?
          <creator>
            <Input type="text" ref="title" placeholder="title"/>
            <Input type="textarea" ref="contents" placeholder="type markdown here"/>
            <Button onClick={this.createResource.bind(this)}>Create</Button>
            <Button onClick={this.hideCreator.bind(this)}>Cancel</Button>
          </creator> :
          <Button onClick={this.showCreator.bind(this)}>Create</Button>}
      </listelementinput>
    );
  }

  showCreator(){
    this.setState({visible: true, alert: false});
  }

  hideCreator(){
    this.setState({visible: false, alert: false});
  }

  createResource(){
    let title = this.refs["title"].getValue().trim();
    let value = this.refs["contents"].getValue();
    if(title === ""){
      this.setState({visible: true, alert: true});
    } else {
      this.props.onClick(title, value);
      this.setState({visible: false, alert: false})
    }
  }
}

// deprecated
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

// deprecated
class ListElementEditor extends React.Component {
  constructor(){
    super();
    this.state = {};
  }

  render() : React.Component { //add type that is element or component
    return (
      <listelementinput>
        <form ref="formelement">
          <Input type="textarea" ref="contents" defaultValue={this.props.contents} />
          <Button onClick={this.save.bind(this)}>Save</Button>
        </form>
      </listelementinput>
    );
  }

  save(){
    let newContents=this.refs["contents"].getValue();
    this.props.onClick(newContents);
  }
}

// deprecated
export class ListElement extends React.Component {
  constructor(){
    super();
    this.state = {
      editing: false
    }
  }

  render() : React.Element {
    return (
      React.createElement(this.props.node.renderer,
                          {className: "listelement"},
                          this.state.editing ? <ListElementEditor onClick={this.endEdit.bind(this)}
                                                                  contents={this.props.node.contents} /> :
                                               getRenderedElement(this.props.tag, this.props.node, this.props.ui),
                          this.state.editing ? <placeholder/> : <h2 onClick={this.startEdit.bind(this)}>Edit</h2>,
                          <h2 onClick={this.deleteNode.bind(this)}>Delete</h2>
                          )
    );
  }

  startEdit(event){
    this.setState({editing: true});
  }

  endEdit(contents: string){
    this.setState({editing: false});
    editNode(this.props.node, contents);
  }

  deleteNode(event){
    removeNode(this.props.node);
  }
}
