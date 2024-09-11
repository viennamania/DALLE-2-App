/*
警报

由于未支付服务开发和运营费用，该服务将于2024年9月9日24:00起永久停止。

red color: #ff0000
large font size: 24px
bold font weight: bold
center text align: center
vertical center: middle
left right padding: 20px
*/

import React from 'react';

export default function Warning() {

    return (
        <div style={{
            color: '#ff0000',
            fontSize: '24px',
            fontWeight: 'bold',
            textAlign: 'center',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            padding: '0 20px'
        }}>
            由于未支付服务开发和运营费用，该服务将于2024年9月9日24:00起永久停止。
        </div>
    );

}