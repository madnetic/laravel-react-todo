import React,{ 
    Component, 
    Fragment 
}                       from 'react';

import { Redirect }     from 'react-router-dom';
import { Formik }       from 'formik';
import * as yup         from 'yup';
import Card             from 'react-bootstrap/lib/Card';
import Form             from 'react-bootstrap/lib/Form';

import AuthContext      from '../../contexts/auth';
import Input            from '../forms/Input';
import InputFeedback    from '../forms/InputFeedback';
import Checkbox         from '../forms/Checkbox';
import Submit           from '../forms/Submit';
import {
    validate,
    emailSchema, 
    passwordSchema 
}                       from '../../validation/forms';

export default class Registration extends Component {
    constructor(props) {
        super(props);

        this.state = { redirect: false, error: null };
    }

    render() {
        const { error } = this.state;

        return (
            <Card style={{ maxWidth: '500px', margin: '0 auto' }}>
                <Card.Header>Register</Card.Header>
                <Card.Body>
                    <AuthContext.Consumer>
                        {({ register }) => (
                            <Fragment>
                                {this.state.redirect && <Redirect to="/" />}
                                <Formik validate={validate.bind(this)} onSubmit={this.onSubmit.bind(this, register)}>
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
                                                    label        = "E-Mail" 
                                                    value       = {values.email}
                                                    placeholder = "Your E-Mail Address" 
                                                    error       = {touched.email && errors.email}
                                                    onChange    = {handleChange}
                                                    onBlur      = {handleBlur}
                                                    horizontal 
                                                    required 
                                                    autoFocus 
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

                                                <Input 
                                                    type        = "password" 
                                                    name        = "password_confirmation" 
                                                    label       = "Confirm Password" 
                                                    value       = {values.password_confirmation}
                                                    placeholder = "Repeat Password" 
                                                    error       = {touched.password_confirmation && errors.password_confirmation}
                                                    onChange    = {handleChange}
                                                    onBlur      = {handleBlur}
                                                    horizontal 
                                                    required 
                                                />

                                                <Checkbox 
                                                    name        = "terms" 
                                                    label       = "I accept terms and conditions" 
                                                    checked     = {values.terms}
                                                    error       = {touched.terms && errors.terms}
                                                    onChange    = {handleChange}
                                                    onBlur      = {handleBlur}
                                                    horizontal 
                                                    required 
                                                />

                                                <InputFeedback horizontal text={error} className="offset-sm-3" />

                                                <Submit 
                                                    label       = "Register" 
                                                    disabled    = {!Object.keys(touched).length || Object.keys(errors).length > 0 || isSubmitting} 
                                                    processing  = {isSubmitting}
                                                    horizontal 
                                                />
                                            </Form>
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

    getValidationSchema(values) {
        return yup.object({
            email:                  emailSchema,
            password:               passwordSchema,
            password_confirmation:  yup.string()
                                        .oneOf([values.password], 'Passwords doesn\'t match')
                                        .required('This field is required'),
            terms:                  yup.bool()
                                        .test('terms', 'Accepting terms is required', val => val === true)
                                        .required('This field is required')
        });
    }

    onSubmit(register, values, { setSubmitting }) {
        register(values)
            .then(() => {
                this.setState({ redirect: true });
            })
            .catch(err => {
                this.setState({ error: err });
                setSubmitting(false);    
            });
    }
}
