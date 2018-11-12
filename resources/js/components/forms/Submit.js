import React, { 
    Fragment 
}                   from 'react';

import * as cn      from 'classnames';
import FormGroup    from 'react-bootstrap/lib/FormGroup';
import FormRow      from 'react-bootstrap/lib/Row';
import FormCol      from 'react-bootstrap/lib/Col';

import Button       from '../common/Button';

export default ({ className, horizontal, label, icon, disabled, children, ...props }) => {
    const btn = 
        <Fragment>
            <Button
                variant     = "primary"
                type        = "submit"
                icon        = {icon}
                label       = {label || 'Save'}
                className   = {cn('px-5', className, { 'mr-3': children })} 
                disabled    = {disabled}
                style       = {{ minWidth: '168px' }}
                {...props}
            />
            {children}
        </Fragment>

    return (
        <FormGroup as={horizontal && FormRow} className="w-100">
            {horizontal ? (
                <FormCol sm={{ span: 9, offset: 3 }}>
                    {btn}
                </FormCol>
            ) : btn}
        </FormGroup>
    );
}
