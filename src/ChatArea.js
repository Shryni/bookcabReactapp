import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import {List, ListItem} from 'material-ui/List';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';

import ajax from 'superagent';

export default class ChatArea extends Component {
	constructor(props)
	{
		super(props);
		this.state = {
			chathistory :[{message : 'Hey',response : 'Hello'}],
			tasks : [],
			checked : [],
			style : [],
			value : '',
		};
		this.addTask = this.addTask.bind(this);
    	this.handleChange=this.handleChange.bind(this);
    	this.ajaxCall=this.ajaxCall.bind(this);
	}
	addTask(val){
    var lists = this.state.tasks;
    lists.push(val);
    this.setState({tasks:lists});
    console.log("tasks", this.state.tasks)
  	}
  	handleChecked(i){
    console.log(i)
    // var chekArr = this.state.checked;
    // chekArr[i] = true;
    // this.setState({checked: chekArr})
            
    // var styleArr = this.state.style;
    // styleArr[i] = "unstrike";
    // this.setState({style: styleArr})
  }

	handleChange(event){
		var newmessage = event.target.value;
		this.setState({value : newmessage})
	}
	ajaxCall(){
		var history = this.state.chathistory;
		var message = this.state.value;
		this.setState({value : ""});
		let url = "https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/ca5dbfdc-4629-4fe7-b050-98be83671fc6?subscription-key=a86b0e265c83446a8d9e9b54679a67b4&q="+this.state.value+"&verbose=true";
    	ajax.get(url).end((error,response)=>{
        if(response)
        {
          if(response.body.topScoringIntent.intent === "None")
          {
            history.push({message:message,response:'Oops!I did not get you!'})            
            this.setState({chathistory:history}); 
          }
          if(response.body.topScoringIntent.intent === "create note")
          {
           if(response.body.dialog.status==="Finished")
            {        
              history.push({message:message,response:'Created!Enter the tasks'});
              this.setState({chathistory:history});
            }
            if(response.body.dialog.prompt==="what?")
            {        
              history.push({message:message,response:'Oops!I did not get you!'})            
              this.setState({chathistory:history}); 
            } 
          }
          if(response.body.topScoringIntent.intent === "status")
          {
            if(response.body.dialog.status==="Finished")
            {        
              history.push({message:message,response:'That was awesome'})            
              this.setState({chathistory:history}); 
            }
          }
          if(response.body.topScoringIntent.intent === "shownote")
          {
            if(response.body.dialog.status==="Finished")
            {        
              const notelist = <Notes checked={this.state.checked} handleChecked={this.handleChecked} tasks={this.state.tasks} addTask={this.addTask}/>
              history.push({message:message,response:notelist})            
              this.setState({chathistory:history}); 
            }
          }       
        }
        else
        {
          console.log("Oops! Something went wrong!Error fetching from API");
        }
    });
  
	}  render() {
  	const chatList = this.state.chathistory.map((item,i)=>
  	{
      return(
          <div  key={i}>                
             <List>
               <ListItem style={{background:'#9d93d6'}}
                primaryText={item.message}/>
              <br/>                    
              <ListItem style={{background:'#c0d5f7'}}
                primaryText={item.response}/>
              <br/>                    
            </List>                
          </div>
       );
    });



  	 return (<div>
              <Paper style={{width:800}}>
                <div>{chatList}</div>
                <br/>
                
                <div>
                <TextField
    			  		style={{padding:10}}
      					hintText="Start Conversation"
      					value={this.state.value}
      					onChange={this.handleChange}
     					  floatingLabelText="Floating Label Text"
    			  /><br />
                  <RaisedButton label="Send" primary={true} onClick={this.ajaxCall}/>
                </div>
              </Paper>
            </div>
            );
   
  }
}

