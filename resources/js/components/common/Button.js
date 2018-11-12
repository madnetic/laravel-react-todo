import React    from 'react';

import * as cn  from 'classnames';
import Button   from 'react-bootstrap/lib/Button';

import Spinner  from '../common/Spinner';

export default ({ variant, label, labelClass, labelStyle, icon, link, tooltip, disabled, children, processing, ...props }) => (
    <Button 
        variant     = {(!link && variant) || null} 
        disabled    = {disabled || processing} 
        className   = {cn({ 'btn-link': link, 'text-dark': link && !variant, [`text-${variant}`]: link && variant })} 
        {...props}
    >
        {!processing && icon && 
            <i className={`fa fa-${icon}${(label ? ' mr-2' : '')}`}></i>}
        
        {!processing && label && 
            <span className={labelClass} style={labelStyle}>{label}</span>} 
        
        {processing && 
            <Spinner size="sm" color="white" />}
        
        {children}                       
    </Button>
)
