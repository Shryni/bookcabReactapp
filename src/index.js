import React from 'react';
import ReactDOM from 'react-dom';
import Conversation from './Conversation';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

const App = () => (
	<MuiThemeProvider>
  
    <Conversation/>
  </MuiThemeProvider>
);

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
