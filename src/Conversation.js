import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import {List, ListItem} from 'material-ui/List';
import Paper from 'material-ui/Paper';
import AppBar from 'material-ui/AppBar';
import ajax from 'superagent';

export default class Conversation extends Component {
	componentDidMount(){
		localStorage.setItem('chatItems',JSON.stringify(this.state.chat));

	}

	constructor(props)
	{
		super(props);
		this.state = {
			chat :[],
 			value : '',
			index : 0,
		};
		this.handleChange = this.handleChange.bind(this);
		this.fetchOutput = this.fetchOutput.bind(this);
		
	}
	
	
	handleChange(event){
		var newMessage = event.target.value;
		this.setState({value : newMessage});
		
	}
	fetchOutput(event){

		event.preventDefault();
		var chatHistory = this.state.chat;
		var newInput = this.state.value;
		var i = this.state.index;
		this.setState({index : i+1});
		let url = "https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/ca5dbfdc-4629-4fe7-b050-98be83671fc6?subscription-key=a86b0e265c83446a8d9e9b54679a67b4&q="+this.state.value+"&verbose=true";
		ajax.get(url).end((error,response)=>{
			if(response)
			{

				if(response.body.topScoringIntent.intent === "None")
				{
					chatHistory.push({input : newInput , output : 'I didnt understand you'})
					this.setState({chat : chatHistory});
					this.setState({value : ''});
					
				}
				if(response.body.topScoringIntent.intent === "Bookings")
				{
					if(response.body.dialog.status === "Finished")
					{
						chatHistory.push({input : newInput , output : "Your trip is booked. Have a safe Journey!"})
						this.setState({chat : chatHistory});
						this.setState({value : ''});
						
					}
					if(response.body.dialog.status === "Question")
					{
						chatHistory.push({input : newInput ,output : response.body.dialog.prompt});
						this.setState({chat : chatHistory});
						this.setState({value : newInput});
					}
				}
				if(response.body.topScoringIntent.intent === "Greetings")
				{
					chatHistory.push({input : newInput, output :'Hello! What can I do for you?'});
					this.setState({chat : chatHistory});
					this.setState({value : ''});

				}
				if(response.body.topScoringIntent.intent==="clear chat")
					{
					this.setState({chat :[]});
					this.setState({value : ''});
					}
				
			}
			else
			{
				chatHistory.push({input : newInput , output : 'Try again'})
				this.setState({chat : chatHistory});
				this.setState({value : ''});
				
			}

		});
	}
	render(){
		//var arr =JSON.parse(localStorage.getItem('chatItems'));
		
		const localChat = this.state.chat.map((item, i)=>
		{
			
			return(
				<div key={i}>
				
				<List>
				<Paper style={{background:'#c5f9d9'}}>
                <ListItem 
                 innerDivStyle={{marginLeft:300}}
                 primaryText={item.input}/>
                 </Paper>
                 <Paper style={{background:'#ede5b4'}}>                 
                <ListItem 
                 innerDivStyle={{marginRight:300}}
                 primaryText={item.output}/>
                 </Paper>                  
                </List> 
                
				</div>
				);

		});
		return(
			<Paper style={{width:600}}>
			<AppBar
    		title="Chat Window"
    		iconClassNameRight="muidocs-icon-navigation-expand-more"/>
    		<div>
			{localChat}
			
			<form onSubmit={this.fetchOutput}>
			<TextField
    			  		fullWidth={true}
      					value={this.state.value}
      					onChange={this.handleChange}
     					floatingLabelText="Start Conversation"/>
    		
    		</form>
    		</div>
			</Paper>
			);
	}
}