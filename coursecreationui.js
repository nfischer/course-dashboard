class NewClassForm extends React.Component {
  render() {
    return (
      <form>
        <ClassFormDetails/>
        <ModuleInputList/>
      </form>
    );
  }
}

class ClassFormDetails extends React.Component {
  render() {
    return (
      <input type="text" name="course_name" placeholder="course name"/>
      <input type="text" name="piazza_cid" placeholder="piazza course id"/>
    );
  }
}

class ModuleInputList extends React.Component {
  render(){
    return (
      <modulelist>
        {this.state.modules.map()}
        <button className="addModule"/>
      </modulelist>
    );
  }
}

class ModuleInput extends React.Component {
  render() {
    return (
      <moduleinput>
        <input type="text" name={`${this.props.id}-title`} placeholder="module name"/>
        <DateRangeInput id={`${this.props.id}-daterangeinput`}/>
        <AssignmentInputList/>
        <TopicInputList/>
      </moduleinput>
    );
  }
}

class DateRangeInput extends React.Component {
  render() {
    return (
      <daterangeinput>
        <input type="date" name={`${this.props.id}-start`} placeholder="start date"/>
        <input type="date" name={`${this.props.id}-end`} placeholder="end date"/>
      </daterangeinput>
    );
  }
}

class AssignmentInput extends React.Component {
  render() {
    return (
      <input type="text" name={`module-`}
    );
  }
}
