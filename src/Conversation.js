import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import TextField from 'material-ui/TextField';
import {List, ListItem} from 'material-ui/List';
import Paper from 'material-ui/Paper';

import ajax from 'superagent';
import Notes from './Notes';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar, {FlexibleSpace, TabBar, ToolBar} from 'material-ui-scrolling-techniques/AppBar';
import ScrollingTechniques from 'material-ui-scrolling-techniques/AppBar/ScrollingTechniques';

export default class Conversation extends Component {
	componentWillMount(){
		console.log('componentWillMount');
		this.setState({chat: JSON.parse(localStorage.getItem('chatItems'))||[]});
		
	}

	constructor(props)
	{
		console.log('constuctor');
		super(props);
		this.state = {
			chat :[],
 			value : '',
			index : 0,
			show : false,
		};
		this.handleChange = this.handleChange.bind(this);
		this.fetchOutput = this.fetchOutput.bind(this);
		this.storeInLocalStorage = this.storeInLocalStorage.bind(this);
	}
	
	storeInLocalStorage(newChat){
		var chatHistory=JSON.parse(localStorage.getItem('chatItems') ) || [];
		chatHistory.push(newChat);
		localStorage.setItem('chatItems',JSON.stringify(chatHistory));
		this.setState({chat: chatHistory});
	}

	handleChange(event){
		var newMessage = event.target.value;
		this.setState({value : newMessage});
		
	}
	fetchOutput(event){

		event.preventDefault();
		var newInput = this.state.value;
		var i = this.state.index;
		this.setState({index : i+1});
		let url = "https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/ca5dbfdc-4629-4fe7-b050-98be83671fc6?subscription-key=a86b0e265c83446a8d9e9b54679a67b4&q="+this.state.value+"&verbose=true";
		ajax.get(url).end((error,response)=>{
			if(response)
			{

				if(response.body.topScoringIntent.intent === "None")
				{
					// chatHistory.push({input : newInput , output : 'I didnt understand you'})
					this.storeInLocalStorage({input : newInput , output : 'I am sorry, I dont understand! TRY with simple keywords'});
					this.setState({value : ''});
					
				}
				if(response.body.topScoringIntent.intent === "ToDoList")
				{
					if(response.body.dialog.status === "Finished")
					{
						this.storeInLocalStorage({input : newInput , output : 'Here is your list'});
						this.setState({value: ''});
						this.setState({show : true});
						this.newRender();
						
					}
					if(response.body.dialog.status ==="Question")
					{
					this.storeInLocalStorage({input : newInput , output : response.body.dialog.prompt});
					this.setState({value : newInput});
					
					}
					
				}
				if(response.body.topScoringIntent.intent === "Bookings")
				{
					if(response.body.dialog.status === "Finished")
					{
						this.storeInLocalStorage({input : newInput , output : "Your trip is booked. Have a safe Journey!"});
						this.setState({value : ''});
						
					}
					if(response.body.dialog.status === "Question")
					{
						this.storeInLocalStorage({input : newInput ,output : response.body.dialog.prompt});
						this.setState({value : newInput});
					}
				}
				if(response.body.topScoringIntent.intent === "Greetings")
				{
					this.storeInLocalStorage({input : newInput, output :'Hello! What can I do for you?'});
					this.setState({value : ''});

				}
				if(response.body.topScoringIntent.intent==="clear chat")
					{
					localStorage.setItem('chatItems',JSON.stringify(''));
					this.setState({chat :[]});
					this.setState({value : ''});
					}
				
			}
			else
			{
				this.storeInLocalStorage({input : newInput , output : 'Try again'})
				this.setState({value : ''});
				
			}

		});
	}
	newRender(){
		console.log('newRender');
		ReactDOM.render(<Notes />,document.getElementById('more'));
	}
	render(){
		console.log('render');
		const localChat = this.state.chat.map((item, i)=>
		{
			
			return(
				<div key={i}>			
				<List>
				<Paper style={{background:'#c5f9d9'}}>
                <ListItem 
                 innerDivStyle={{textAlign:'right'}}
                 primaryText={item.input}/>
                 </Paper>
                 <Paper style={{background:'#ede5b4'}}>                 
                <ListItem 
                 innerDivStyle={{textAlign:'left'}}
                 primaryText={item.output}/>
                 </Paper>                  
                </List> 
                
				</div>
				);

		});
		return(
			<ScrollingTechniques>
			<MuiThemeProvider>
			<Paper >
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
			</MuiThemeProvider>
			</ScrollingTechniques>
			);
	}
}