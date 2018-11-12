import React, { 
    Component 
}                           from 'react';
import PropTypes            from 'prop-types';

import styled               from 'styled-components';
import ProgressBar          from 'react-bootstrap/lib/ProgressBar';

import { unsignedInteger }  from '../../validation/props';

export default class Progress extends Component {
    static propTypes = {
        now     : unsignedInteger,
        max     : unsignedInteger,
        label   : PropTypes.string
    };
    
    static defaultProps = {
        now     : null,
        max     : null,
        label   : null
    };

    static StyledBar = styled(ProgressBar)`
        [aria-valuenow="0"], .bg-warning { color: black; }`;

    render() {
        const { now, max, label, ...props } = this.props;
        const percent = this.getPercent();

        return (
            <Progress.StyledBar 
                now     = {percent} 
                variant = {this.getVariant(percent)} 
                label   = {this.getLabel()}
                style   = {{ visibility: max ? 'visible' : 'hidden' }}
                {...props}
            />
        );
    }

    getVariant(percent) {
        switch (true) {
            case percent >= 80: return 'success';
            case percent >= 30: return 'warning';
            default:            return 'danger';
        }
    }

    getLabel() {
        const { label, now, max } = this.props;

        return label && max ? label.replace('%now%', now).replace('%max%', max) : null;
    }

    getPercent() {
        const { now, max } = this.props;

        let percent = now && max ? parseFloat(now / max) : 0;
        if (percent) {
            percent = percent.toFixed(2);
            percent *= 100;
        }

        return percent;
    }
}