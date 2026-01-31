import React from 'react';
import SideToolbar from './SideToolbar';

const SideIcon = ({ onClick }: { onClick: () => void }) => {
    return <SideToolbar onTranslateClick={onClick} />;
};

export default SideIcon;