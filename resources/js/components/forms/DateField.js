import React, { 
    Component 
}                       from 'react';
import PropTypes        from 'prop-types';

import moment           from 'moment';
import * as cn          from 'classnames';
import FormGroup        from 'react-bootstrap/lib/FormGroup';
import FormLabel        from 'react-bootstrap/lib/FormLabel';
import DatePicker       from 'react-datepicker';

import cfg              from '../../config';
import InputFeedback    from '../forms/InputFeedback';
import { date }         from '../../validation/props';

import 'react-datepicker/dist/react-datepicker.css';

export default class DateField extends Component {
    static propTypes = {
        id              : PropTypes.string,
        label           : PropTypes.string,
        error           : PropTypes.string,
        value           : date,
        className       : PropTypes.string,
        containerClass  : PropTypes.string,
        onChange        : PropTypes.func.isRequired
    };

    static defaultProps = {
        id              : null,
        label           : null,
        error           : null,
        value           : null,
        className       : null,
        containerClass  : null,
        onChange        : () => {}
    };

    constructor(props) {
        super(props);

        this.state = { moment: moment(props.value) };
    }

    componentDidUpdate(prevProps, prevState) {
        const { value } = this.props;
        
        if (value !== this.state.moment.format(cfg.dateFormat)) {
            this.setState({ moment: moment(value) });
        }
    }

    render() {
        const { id, label, error, value, className, containerClass, onChange, ...props } = this.props;
        const { moment } = this.state;

        return (
            <FormGroup controlId={id} className={containerClass}>
                <FormLabel>{label}</FormLabel>
                <DatePicker
                    className   = {cn('form-control', { [className]: className })} 
                    selected    = {moment}
                    dateFormat  = {cfg.dateFormat}
                    onChange    = {this.onChange.bind(this)}
                    {...props}
                />
                <InputFeedback text={error}/>
            </FormGroup>
        );
    }

    componentDidMount() {
        this.onChange();
    }

    onChange(newValue) {
        const { onChange } = this.props;
        
        if (!newValue) newValue = moment();

        this.setState({ moment: newValue });
        
        const formattedValue = newValue.format(cfg.dateFormat);
        onChange(formattedValue);
    }
}
