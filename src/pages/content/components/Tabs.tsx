
import React, { useState } from 'react';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
    tabs: {
        display: 'flex',
        borderBottom: '1px solid #e0e0e0',
    },
    tab: {
        padding: '10px 15px',
        cursor: 'pointer',
        border: 'none',
        background: 'none',
        fontSize: '14px',
        fontWeight: 500,
        color: '#666',
        '&:hover': {
            color: '#000',
        },
    },
    activeTab: {
        color: '#000',
        borderBottom: '2px solid #000',
    },
    tabContent: {
        padding: '15px',
    },
});

interface Tab {
    label: string;
    content: React.ReactNode;
}

interface TabsProps {
    tabs: Tab[];
}

export function Tabs({ tabs }: TabsProps) {
    const classes = useStyles();
    const [activeTab, setActiveTab] = useState(0);

    return (
        <div>
            <div className={classes.tabs}>
                {tabs.map((tab, index) => (
                    <button
                        key={index}
                        className={`${classes.tab} ${index === activeTab ? classes.activeTab : ''}`}
                        onClick={() => setActiveTab(index)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className={classes.tabContent}>
                {tabs[activeTab].content}
            </div>
        </div>
    );
}
