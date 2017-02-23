import React,{ Component} from 'react';
import {List, ListItem} from 'material-ui/List';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import Subheader from 'material-ui/Subheader';
import Checkbox from 'material-ui/Checkbox';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';


export default class Notes extends Component{
  componentWillMount(){
    this.setState({tasks:JSON.parse(localStorage.getItem('localtasks'))||[]});
    this.setState({decoration:JSON.parse(localStorage.getItem('localdecor'))||[]});
  }
  constructor(props){
    super(props);
    this.state ={
      tasks:[],
      decoration:[],
      value:'',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
  }
  storeTaskInLocalStorage(newTask){
    var prevTasks=JSON.parse(localStorage.getItem('localtasks'))||[];
    prevTasks.push(newTask);
    localStorage.setItem('localtasks',JSON.stringify(prevTasks));
    this.setState({tasks:prevTasks});
    var prevState=JSON.parse(localStorage.getItem('localdecor'))||[];
    prevState.push('onuncheck');
    localStorage.setItem('localdecor',JSON.stringify(prevState));
    this.setState({decoration:prevState});
}
storeCheckedInLocalStorage(index,newDecor){
    var prevStyle = JSON.parse(localStorage.getItem('localdecor'))||[];
    prevStyle.splice(index,1,newDecor);
    localStorage.setItem('localdecor',JSON.stringify(prevStyle));
    this.setState({decoration:prevStyle});
}
  handleChange(event){
    var nextTask = event.target.value;
    this.setState({value: nextTask});
  }
  handleSubmit(event){
    event.preventDefault();
    var newTask = this.state.value;
    this.setState({value:''});
    this.storeTaskInLocalStorage(newTask);
  }
  handleCheck(index){

    
    if(this.state.decoration[index] === 'oncheck'){
      this.storeCheckedInLocalStorage(index,'onuncheck');
      // style.splice(index,1,'onuncheck');
      // this.setState({decoration:style});
    }
    else if (this.state.decoration[index] === 'onuncheck'){
      this.storeCheckedInLocalStorage(index,'oncheck');
      // style.splice(index,1,'oncheck');
      // this.setState({decoration:style});
      console.log('called onchange');
    }
  }
  render(){
    const list = this.state.tasks.map((item,i)=>
    {
      //var time ={this.state.time[i]}
      return(
        <div key={i}>
        <List>
        <ListItem 
        className={this.state.decoration[i]}
        primaryText={item+' '}
        leftCheckbox={<Checkbox  
        onCheck={this.handleCheck.bind(this,i)} />}/>
        </List>
        </div>
        );
    });
    return(
      <MuiThemeProvider>
      
      <Paper style={{width:450}}>
      <form onSubmit={this.handleSubmit}>
      <TextField style={{width:300,padding:10}}hintText="Add tasks" value={this.state.value} onChange={this.handleChange}/>
      </form>
      <List>
      <Subheader>TODOLIST</Subheader>
      {list}
      </List>
      </Paper>
      </MuiThemeProvider>
    );
  }
}