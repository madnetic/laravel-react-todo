import React, { 
    Fragment 
}                   from 'react';

import Container    from 'react-bootstrap/lib/Container';
import Navbar       from 'react-bootstrap/lib/Navbar';

import cfg          from '../../config';
import AuthContext  from '../../contexts/auth';

export default () => (
    <Container>
        <Navbar bg="light" expand="lg">
            <AuthContext.Consumer>
                {({ logout, authenticated, user }) => (
                    <Fragment>
                        <Navbar.Brand href="/">{cfg.appName}</Navbar.Brand>
                        <Navbar.Toggle aria-controls="navbarCollapse" />
                        <Navbar.Collapse id="navbarCollapse" className="justify-content-end">
                            {authenticated && (
                                <Navbar.Text>
                                    Logged in as {user.email}
                                    <a href="true" onClick={e => { e.preventDefault(); logout(); }} className="ml-3">Logout</a>
                                </Navbar.Text>
                            )}
                        </Navbar.Collapse>
                    </Fragment>
                )}
            </AuthContext.Consumer>
        </Navbar>
    </Container>
);
