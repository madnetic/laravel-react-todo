import React, { 
    Fragment 
}                       from 'react';

import FormGroup        from 'react-bootstrap/lib/FormGroup';
import FormLabel        from 'react-bootstrap/lib/FormLabel';
import FormControl      from 'react-bootstrap/lib/FormControl';
import FormRow          from 'react-bootstrap/lib/Row';
import FormCol          from 'react-bootstrap/lib/Col';

import InputFeedback    from './InputFeedback';

export default ({ type, id, horizontal, required, label, error, value, containerClass, containerStyle, children, ...props }) => {
    const control = 
        <Fragment>
            <FormControl 
                    id      = {id} 
                    as      = {['select', 'textarea'].includes(type) ? type : undefined} 
                    type    = {['text', 'date', 'email', 'number', 'password'].includes(type) ? type : undefined}
                    value   = {value ? String(value) : ''} 
                    {...props}
                >
                    {children}
                </FormControl>
            {error && <InputFeedback text={error} />}
        </Fragment>

    return (
        <FormGroup as={horizontal && FormRow} controlId={id} className={containerClass} style={containerStyle}>
            {label && <FormLabel column={horizontal} sm={horizontal && 3}>
                {label}
                {required && <span className="text-danger ml-2">*</span>}
            </FormLabel>}
            {horizontal ? <FormCol sm={9}>{control}</FormCol> : control}
        </FormGroup>
    )
};
