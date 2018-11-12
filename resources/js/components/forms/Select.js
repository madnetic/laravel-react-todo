import React    from 'react';

import styled   from 'styled-components';

import Input    from '../forms/Input';

export default ({ values, placeholder, hidePlaceholder, onChange, ...props }) => {
    const StyledInput = styled(Input)`&:hover { cursor: pointer; }`;

    return (
        <StyledInput type="select" onChange={e => onChange(e)} {...props}>
            {!hidePlaceholder &&
                <option value="" disabled>{placeholder || 'Select value'}</option>}

            {values.length && typeof values[0] === 'object' ?
                values.map((v, i) => <option key={i} value={v.value}>{v.label}</option>)
                : values.map((v, i) => <option key={i}>{v}</option>)}
        </StyledInput>
    )
}
