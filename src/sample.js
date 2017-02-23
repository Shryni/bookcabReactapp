import React,{ Component} from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

export default class Sample extends Component
{
	constructor(props){
		super(props);
		this.state={value:0}
		this.update=this.update.bind(this)
		// console.log('constructor is being called');
	}
	componentWillMount(){
		console.log('componentWillmount is called');
		
	}
	componentDidMount(){
		console.log('componentDidmount is called');
		
	}
	update(){ 
		
		this.setState({value:this.state.value+1});
	}
	render(){
		console.log('render is being called');
		return(
			<MuiThemeProvider>
			<button onClick={this.update}>
			{this.state.value}
			</button>
			</MuiThemeProvider>
			);
	}

}