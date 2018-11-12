import React				from 'react';
import ReactDOM				from 'react-dom';

import { 
	HashRouter as Router, 
	Route 
}							from 'react-router-dom';
import { StickyContainer }	from 'react-sticky';

import Navbar				from './layout/Navbar';
import Home					from './Home';
import Auth					from './auth/Auth';

const App = () => (
	<StickyContainer>
    	<Auth>
        	<Navbar />
			<div className="container py-5">
				<Router>
					<Route path="/" component={Home} />
				</Router>
			</div>
		</Auth>
	</StickyContainer>
)

export default App;

if (document.getElementById('app')) {
    ReactDOM.render(<App />, document.getElementById('app'));
}
