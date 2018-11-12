import React, { 
    Component, 
    Fragment 
}                       from 'react';

import { 
    Link, 
    Redirect 
}                       from 'react-router-dom';
import { Formik }       from 'formik';
import * as yup         from 'yup';
import Card             from 'react-bootstrap/lib/Card';
import Form             from 'react-bootstrap/lib/Form';

import AuthContext      from '../../contexts/auth';
import { 
    emailSchema, 
    passwordSchema 
}                       from  '../../validation/forms';
import Input            from '../forms/Input';
import Submit           from '../forms/Submit';
import InputFeedback    from '../forms/InputFeedback';


const validationSchema = yup.object({
    email       : emailSchema,
    password    : passwordSchema
});

export default class Login extends Component {
    constructor(props) {
        super(props);

        this.state = { redirect: false, error: null };
    }

    render() {
        const { error } = this.state;

        return (
            <Card style={{ maxWidth: '500px', margin: '0 auto' }}>
                <Card.Header>Login</Card.Header>
                <Card.Body>
                    <AuthContext.Consumer>
                        {({ login, authenticated }) => (
                            <Fragment>
                                {authenticated && <Redirect to="/" />}
                                <Formik validationSchema={validationSchema} onSubmit={this.onSubmit.bind(this, login)}>
                                    {({
                                        values,
                                        errors,
                                        touched,
                                        handleChange,
                                        handleBlur,
                                        handleSubmit,
                                        isSubmitting
                                    }) => (
                                        <Fragment>
                                            <Form onSubmit={handleSubmit} noValidate>
                                                <Input
                                                    type        = "email" 
                                                    name        = "email" 
                                                    label       = "E-Mail" 
                                                    value       = {values.email}
                                                    placeholder = "Your E-Mail Address" 
                                                    error       = {touched.email && errors.email}
                                                    onChange    = {handleChange}
                                                    onBlur      = {handleBlur}
                                                    horizontal
                                                    required 
                                                />

                                                <Input 
                                                    type        = "password" 
                                                    name        = "password" 
                                                    label       = "Password" 
                                                    value       = {values.password}
                                                    placeholder = "Your Password" 
                                                    error       = {touched.password && errors.password}
                                                    onChange    = {handleChange}
                                                    onBlur      = {handleBlur}
                                                    horizontal 
                                                    required 
                                                />
                                
                                                <InputFeedback horizontal text={error} />
                                
                                                <Submit 
                                                    label       = "Login" 
                                                    disabled    = {!Object.keys(touched).length || Object.keys(errors).length > 0 || isSubmitting} 
                                                    processing  = {isSubmitting}
                                                    horizontal 
                                                />
                                            </Form>
                            
                                            <p className="offset-sm-3 mt-4">
                                                <span className="mr-2">No account?</span>
                                                <Link to="/register">Sign up</Link>
                                            </p>
                                        </Fragment>
                                    )}
                                </Formik>
                            </Fragment>
                        )}
                    </AuthContext.Consumer>
                </Card.Body>
            </Card>
        );
    }

    onSubmit(login, values, { setSubmitting }) {
        login(values)
            .catch(err => {
                this.setState({ error: err });
                setSubmitting(false);
            });
    }
}
