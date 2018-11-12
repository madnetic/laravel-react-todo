import React    from 'react';

import styled, { 
    keyframes 
}               from 'styled-components';

export default ({ size, color, ...props }) => {
    switch (size) {
        case 'sm': size = 12; break;
        case 'md': size = 15; break;
        default:
        case 'lg': size = 18; break;
    }

    const bounce    = keyframes`
                        0%, 80%, 100%   { transform: scale(0); }
                        40%             { transform: scale(1.0); }`,
          
          Spinner   = styled.div`
                        margin      : 0 auto;
                        width       : 70px;
                        text-align  : center;`,

          dotBase   = `
                        width               : ${size}px;
                        height              : ${size}px;
                        background-color    : ${color || '#333'};
                        border-radius       : 100%;
                        display             : inline-block;`,

            Dot1    = styled.div`
                        ${dotBase}
                        animation   : ${bounce} 1.4s ease-in-out -0.32s normal infinite both;
            `,

            Dot2    = styled.div`
                        ${dotBase}
                        animation   : ${bounce} 1.4s ease-in-out -0.16s normal infinite both;
            `,

            Dot3    = styled.div`
                        ${dotBase}            
                        animation   : ${bounce} 1.4s infinite ease-in-out both;`;

    return (
        <Spinner {...props}>
            <Dot1></Dot1>
            <Dot2></Dot2>
            <Dot3></Dot3>
        </Spinner>
    );
};