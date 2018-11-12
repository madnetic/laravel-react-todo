import React, { 
    Component, 
    Fragment 
}                   from 'react';
import PropTypes    from 'prop-types';

import * as cn      from 'classnames';
import styled       from 'styled-components';

const bsThemeModifiers = ['default', 'primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'];

export default class Radio extends Component {
    static propTypes = {
        name        : PropTypes.string.isRequired,
        values      : PropTypes.arrayOf(PropTypes.string).isRequired,
        variant     : PropTypes.oneOf(bsThemeModifiers),
        onChange    : PropTypes.func.isRequired
    };

    static defaultProps = {
        name        : null,
        values      : null,
        variant     : null,
        onChange    : () => {}
    };

    static StyledRadio = styled.div`
        &.radio-inline {
            display         : inline-block;
            padding-left    : 20px;
            margin-bottom   : 0;
            font-weight     : normal;
            vertical-align  : middle;
            cursor          : pointer;
        }`;

    constructor(props) {
        super(props);

        this.state = { pristine: true, selectedValue: null };
    }

    render() {
        const   { name, values, variant }   = this.props,
                defaultValue                = this.props.defaultValue ? this.props.defaultValue : values[0];

        const   { pristine, selectedValue } = this.state;

        return (
            <Fragment>
                {values.map((val, idx) => (
                    <Radio.StyledRadio
                        key         = {idx}
                        className   = {cn('form-check radio-inline abc-radio', { [`abc-radio-${variant}`]: variant })}
                    >
                        <input
                            id          = {`${name}-${val}-radio`} 
                            className   = "form-check-input" 
                            type        = "radio" 
                            name        = {name} 
                            onChange    = {this.onChange.bind(this, val)} 
                            checked     = {(pristine && val === defaultValue) || val === selectedValue}
                        />
                        <label
                            className   = "form-check-label"
                            htmlFor     = {`${name}-${val}-radio`}
                        >
                            {val}
                        </label>
                    </Radio.StyledRadio>        
                ))}
            </Fragment>
        );
    }

    onChange(val) {
        this.setState({ pristine: false, selectedValue: val });
        this.props.onChange(val);
    }
}