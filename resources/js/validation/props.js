import PropTypes    from 'prop-types';

import moment       from 'moment';

import cfg          from '../config';

const triggerError = (propName, componentName, propType, receivedType) => {
    throw new Error(`Invalid prop ${propName} supplied to component ${componentName}. Provided type must be ${propType}, but received ${receivedType}.`);
}

export const unsignedNonZeroInteger = (props, propName, componentName) => {
    if (props[propName] !== null && +props[propName] < 1)
        triggerError(propName, componentName, 'unsigned non-zero integer', props[propName]);
}

export const unsignedInteger = (props, propName, componentName) => {
    if (props[propName] !== null && (typeof props[propName] !== 'number' || props[propName] < 0))
        triggerError(propName, componentName, 'unsigned integer', props[propName]);
}

export const date = (props, propName, componentName) => {
    if (props[propName] !== null && !moment(props[propName], cfg.dateFormat, true).isValid())
        triggerError(propName, componentName, `date in ${cfg.dateFormat} format`, props[propName]);
}

export const taskSchema = PropTypes.shape({
    id          : unsignedNonZeroInteger,
    title       : PropTypes.string.isRequired,
    priority    : PropTypes.oneOf(['', 'low', 'medium', 'high']),
    notes       : PropTypes.string,
    done        : PropTypes.bool,
    expires_at  : PropTypes.date
})

export const optionSchema = PropTypes.shape({
    value   : PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    label   : PropTypes.string
})
