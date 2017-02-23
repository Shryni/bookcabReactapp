import React from 'react';
import ReactDOM from 'react-dom';
import Conversation from './Conversation';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

ReactDOM.render(<Conversation />,document.getElementById('root'));
