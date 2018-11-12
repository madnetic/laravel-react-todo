import React        from 'react';

import * as cn      from 'classnames';
import styled       from 'styled-components';
import FormGroup    from 'react-bootstrap/lib/FormGroup';
import FormCol      from 'react-bootstrap/lib/Col';

import 'awesome-bootstrap-checkbox/awesome-bootstrap-checkbox.css';

const StyledCheckbox = styled.div`
    &.checkbox-inline {
        display         : inline-block;
        padding-left    : 20px;
        margin-bottom   : 0;
        font-weight     : normal;
        vertical-align  : middle;
        cursor          : pointer;        
    }`;

export default ({ horizontal, inline, required, name, label, variant, checked, disabled, onChange, containerClass, containerStyle, ...props }) => {
    const checkbox = (
        <StyledCheckbox 
            className = {cn('form-check abc-checkbox', { [`abc-checkbox-${variant}`]: variant })}>

            <input 
                id          = {`${name}-checkbox`} 
                name        = {name} 
                className   = "form-check-input" 
                type        = "checkbox" 
                onChange    = {onChange}
                checked     = {checked || false} 
                disabled    = {disabled}
                {...props} />

            <label className="form-check-label" htmlFor={`${name}-checkbox`}>
                {label}
            </label>

            {required && 
                <span className="text-danger ml-2">*</span>}

        </StyledCheckbox>
    )

    return (
        <FormGroup className={cn({ 'd-inline-block' : inline, [containerClass]: containerClass })} style={containerStyle}>
            {horizontal ?
                <FormCol sm={{ span: 9, offset: 3 }}>{checkbox}</FormCol> : checkbox}
        </FormGroup>
    );
}
