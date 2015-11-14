class NewClassForm extends React.Component {
  render() {
    return (
      <form>
        <ClassDetailsInput/>
        <ModuleInputList/>
      </form>
    );
  }
}

class ClassDetailsInput extends React.Component {
  render() {
    return (
      <classdetailsinput>
        <input type="text" name="course_name" placeholder="course name"/>
        <input type="text" name="piazza_cid" placeholder="piazza course id"/>
      </classdetailsinput>
    );
  }
}

class ModuleInputList extends React.Component {
  render(){
    return (
      <moduleinputlist>
        {this.state.modules.map()} //ids assigned at this level
        <button className="addModule"/>
      </moduleinputlist>
    );
  }
}

class ModuleInput extends React.Component {
  render() {
    return (
      <moduleinput className={this.props.id}>
        <input type="text" name={`${this.props.id}-title`} placeholder="module name"/>
        <DateRangeInput className={`${this.props.id}-daterangeinput`}/>
        <AssignmentInputList className={`${this.props.id}-assignments`}/>
        <TopicInputList className={`${this.props.id}-topics`}/>
      </moduleinput>
    );
  }
}

class DateRangeInput extends React.Component {
  render() {
    return (
      <daterangeinput className={this.props.id}>
        <input type="date" name={`${this.props.id}-start`} placeholder="start date"/>
        <input type="date" name={`${this.props.id}-end`} placeholder="end date"/>
      </daterangeinput>
    );
  }
}

//ASSIGNMENTINPUTLIST

class AssignmentInput extends React.Component {
  render() {
    return (
      <assignmentinput className={this.props.id}>
        <input type="text" name={`${this.props.id}-title`}/>
        <textarea type="textarea" name={`${this.props.id}-markdown`} placeholder="type markdown here"></textarea>
      </assignmentinput>
    );
  }
}

//TOPICINPUTLIST

class TopicInput extends React.Component {
  render() {
    return (
      <topicinput className={this.props.id}>
        <input type="text" name={`${this.props.id}-title`}/>
        <ResourceInputList className={this.props.id}/>
      </topicinput>
    );
  }
}

//RESOURCEINPUTLIST

class ResourceInput extends React.Component {
  render() {
    return (
      <resourceinput className={this.props.id}>
        <input type="text" name={`${this.props.id}-title`}/>
        <textarea type="textarea" placeholder="type markdown here"></textarea>
      </resourceinput>
    );
  }
}
