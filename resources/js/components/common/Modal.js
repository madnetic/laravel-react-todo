import React, { 
    Component 
}                   from 'react';

import SweetAlert   from 'react-bootstrap-sweetalert';
import PropTypes    from 'prop-types';

const modalTypes = ['warning', 'danger', 'success', 'confirm', 'confirmDelete'];
const bsBtnTypes = ['default', 'primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'];

export default class Modal extends Component {
    static propTypes = {
        type                : PropTypes.oneOf(modalTypes).isRequired,
        title               : PropTypes.string,
        text                : PropTypes.string.isRequired,
        errorText           : PropTypes.string,
        showCancel          : PropTypes.bool,
        confirmBtnText      : PropTypes.string,
        confirmBtnBsStyle   : PropTypes.oneOf(bsBtnTypes),
        cancelBtnBsStyle    : PropTypes.oneOf(bsBtnTypes),
        onConfirm           : PropTypes.func,
        onConfirmConfirm    : PropTypes.func,
        onCancel            : PropTypes.func
    };

    static defaultProps = {
        type                : null,
        title               : null,
        text                : null,
        errorText           : null,
        showCancel          : false,
        confirmBtnText      : null,
        confirmBtnBsStyle   : 'primary',
        cancelBtnBsStyle    : 'default',
        onConfirm           : () => {},
        onConfirmConfirm    : () => {},
        onCancel            : () => {}
    };

    static TextWrap = ({ text }) => <p className="pb-5">{text}</p>

    constructor(props) {
        super(props);

        this.state = {
            confirmDecisionMade : false,
            confirmActionError  : false,
            closed              : false
        };
    }

    render() {
        const { confirmDecisionMade, confirmActionError } = this.state;
        const { type, text, successText, errorText, showCancel, confirmBtnText, confirmBtnBsStyle, cancelBtnBsStyle, onCancel } = this.props;

        return (
                <SweetAlert 
                    show                = {this.isVisible()}
                    warning             = {this.isType('warning')} 
                    danger              = {this.isType('danger')}
                    success             = {this.isType('success')}
                    showCancel          = {!confirmDecisionMade && (showCancel || this.isConfirm())}
                    showConfirm         = {!confirmDecisionMade}
                    title               = {this.getTitle()}
                    confirmBtnText      = {confirmBtnText || (type === 'confirmDelete' && 'Delete')} 
                    confirmBtnBsStyle   = {confirmBtnBsStyle || (type === 'confirmDelete' && 'danger') || (type === 'confirm' && 'primary')}
                    cancelBtnBsStyle    = {cancelBtnBsStyle || 'default'}
                    onConfirm           = {this.isConfirm() && confirmDecisionMade ? this.onConfirmConfirm.bind(this) : this.onConfirm.bind(this)}
                    onCancel            = {onCancel}
                >
                    {confirmActionError ? 
                        (errorText || <Modal.TextWrap text="An error occurred"/>)
                            : (this.isConfirm() && confirmDecisionMade ? <Modal.TextWrap text={successText}/> : text)}
                </SweetAlert>
        );
    }

    isConfirm() {
        return ['confirm', 'confirmDelete'].includes(this.props.type);
    }

    isVisible() {
        return !this.state.closed || this.isConfirm();
    }

    isType(type) {
        const { typeProp } = this.props;
        const { confirmDecisionMade, confirmActionError } = this.state;

        switch (type) {
            case 'warning'  : return typeProp === 'warning' || (this.isConfirm() && !confirmDecisionMade);
            case 'danger'   : return typeProp === 'danger'  || (this.isConfirm() && confirmActionError);
            case 'success'  : return typeProp === 'success' || (this.isConfirm() && confirmDecisionMade && !confirmActionError);
        }
    }

    getTitle() {
        if (this.props.title)               return this.props.title;
        if (this.state.confirmActionError)  return 'Error';
        if (this.state.confirmDecisionMade) return 'Success';
        if (this.isConfirm())               return 'Confirm Action';

        return null;
    }

    onConfirm() {
        try {
            this.setState({ confirmDecisionMade: true });
            this.props.onConfirm();
        } catch (err) {
            this.setState({ confirmActionError: true });
        }
    }

    onConfirmConfirm() {
        this.setState({ closed: true });
        this.props.onConfirmConfirm();
    }
}
