import React from 'react';

const SideIcon = ({ onClick }: { onClick: () => void }) => {
    const styles: React.CSSProperties = {
        position: 'fixed',
        top: '50%',
        right: '10px',
        transform: 'translateY(-50%)',
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        backgroundColor: '#fff',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        zIndex: '9999',
    };

    return (
        <div style={styles} onClick={onClick}>
            <img src={chrome.runtime.getURL("assets/img/magic-stick.svg")} alt="Translate" style={{ width: '60%', height: '60%' }} />
        </div>
    );
};

export default SideIcon;