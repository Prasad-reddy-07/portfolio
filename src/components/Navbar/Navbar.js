import React, { useContext, useState, useEffect } from 'react';
import { NavHashLink as NavLink } from 'react-router-hash-link';
import { IoMenuSharp, IoHomeSharp } from 'react-icons/io5';
import { HiChip } from 'react-icons/hi';
import { BsFillGearFill } from 'react-icons/bs';
import { MdPhone } from 'react-icons/md';
import {
    FaUser,
    FaFolderOpen,
    FaBriefcase,
    FaGraduationCap,
} from 'react-icons/fa';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CloseIcon from '@material-ui/icons/Close';

import './Navbar.css';
import { headerData } from '../../data/headerData';
import { ThemeContext } from '../../contexts/ThemeContext';

const SCROLL_SECTION_IDS = [
    'home',
    'about',
    'experience',
    'skills',
    'projects',
    'education',
    'services',
    'contacts',
];

function Navbar() {
    const { theme, setHandleDrawer } = useContext(ThemeContext);

    const [open, setOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('home');

    const handleDrawerOpen = () => {
        setOpen(true);
        setHandleDrawer(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
        setHandleDrawer(false);
    };

    useEffect(() => {
        const detectActiveSection = () => {
            const scrollBottom = window.innerHeight + window.scrollY;
            const docHeight = document.documentElement.scrollHeight;
            if (scrollBottom >= docHeight - 20) {
                setActiveSection('contacts');
                return;
            }

            const triggerOffset = window.innerHeight * 0.35;
            let current = 'home';

            for (const id of SCROLL_SECTION_IDS) {
                const el = document.getElementById(id);
                if (el) {
                    const rect = el.getBoundingClientRect();
                    if (rect.top <= triggerOffset) {
                        current = id;
                    }
                }
            }

            setActiveSection(current);
        };

        detectActiveSection();
        window.addEventListener('scroll', detectActiveSection, { passive: true });
        return () => window.removeEventListener('scroll', detectActiveSection);
    }, []);

    const navItems = [
        { id: 'home', label: 'Home', to: '/#home', Icon: IoHomeSharp },
        { id: 'about', label: 'About', to: '/#about', Icon: FaUser },
        {
            id: 'experience',
            label: 'Experience',
            to: '/#experience',
            Icon: FaBriefcase,
        },
        { id: 'skills', label: 'Skills', to: '/#skills', Icon: HiChip },
        {
            id: 'projects',
            label: 'Projects',
            to: '/#projects',
            Icon: FaFolderOpen,
        },
        {
            id: 'education',
            label: 'Education',
            to: '/#education',
            Icon: FaGraduationCap,
        },
        {
            id: 'services',
            label: 'Services',
            to: '/#services',
            Icon: BsFillGearFill,
        },
        { id: 'contacts', label: 'Contact', to: '/#contacts', Icon: MdPhone },
    ];

    const handleNavItemClick = (id) => {
        setActiveSection(id);
        handleDrawerClose();
    };

    const scrollToTarget = (el) => {
        if (!el) return;
        setTimeout(() => {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 60);
    };

    const useStyles = makeStyles((t) => ({
        navMenu: {
            fontSize: '2.5rem',
            color: theme.tertiary,
            cursor: 'pointer',
            transform: 'translateY(-10px)',
            transition: 'color 0.3s',
            '&:hover': {
                color: theme.primary,
            },
            [t.breakpoints.down('sm')]: {
                fontSize: '2.5rem',
            },
            [t.breakpoints.down('xs')]: {
                fontSize: '2rem',
            },
        },
        MuiDrawer: {
            padding: '1.25em 1.5em',
            width: '14em',
            maxWidth: '85vw',
            fontFamily: 'var(--primaryFont)',
            fontStyle: 'normal',
            fontWeight: 'normal',
            fontSize: '20px',
            background: theme.secondary,
            overflowX: 'hidden',
            overflowY: 'auto',
            borderTopRightRadius: '40px',
            borderBottomRightRadius: '40px',
            [t.breakpoints.down('sm')]: {
                width: '13em',
                padding: '1em 1.2em',
            },
        },
        closebtnIcon: {
            fontSize: '2rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            color: theme.primary,
            transition: 'color 0.2s',
            '&:hover': {
                color: theme.tertiary,
            },
        },
        drawerItem: {
            margin: '0.7rem auto',
            borderRadius: '78.8418px',
            background: theme.secondary,
            color: theme.primary,
            width: '100%',
            height: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            gap: '16px',
            padding: '0 22px',
            boxSizing: 'border-box',
            border: '2px solid',
            borderColor: theme.primary,
            transition: 'background-color 0.2s, color 0.2s',
            '&:hover': {
                background: theme.primary,
                color: theme.secondary,
            },
            [t.breakpoints.down('sm')]: {
                width: '100%',
                padding: '0 18px',
                height: '46px',
                margin: '0.55rem auto',
            },
        },
        activeDrawerItem: {
            background: theme.primary,
            color: theme.secondary,
        },
        drawerLinks: {
            fontFamily: 'var(--primaryFont)',
            fontSize: '1.15rem',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            [t.breakpoints.down('sm')]: {
                fontSize: '1.05rem',
            },
        },
        drawerIcon: {
            fontSize: '1.4rem',
            flexShrink: 0,
            [t.breakpoints.down('sm')]: {
                fontSize: '1.25rem',
            },
        },
    }));

    const classes = useStyles();

    return (
        <div className='navbar'>
            <div className='navbar--container'>
                <h1 style={{ color: theme.secondary }}>{headerData.name}</h1>

                <button
                    type='button'
                    className='nav-icon-btn'
                    onClick={handleDrawerOpen}
                    aria-label='Menu'
                    aria-expanded={open}
                >
                    <IoMenuSharp className={classes.navMenu} />
                </button>
            </div>
            <Drawer
                variant='temporary'
                onClose={handleDrawerClose}
                anchor='left'
                open={open}
                classes={{ paper: classes.MuiDrawer }}
                className='drawer'
                disableScrollLock={true}
                ModalProps={{
                    disableRestoreFocus: true,
                    disableAutoFocus: true,
                }}
            >
                <div className='div-closebtn'>
                    <button
                        type='button'
                        className='nav-icon-btn'
                        onClick={handleDrawerClose}
                        aria-label='Close'
                    >
                        <CloseIcon className={classes.closebtnIcon} />
                    </button>
                </div>

                <nav aria-label='Portfolio navigation'>
                    <div className='navLink--container'>
                        {navItems.map(({ id, label, to, Icon }) => {
                            const isActive = activeSection === id;
                            return (
                                <NavLink
                                    key={id}
                                    to={to}
                                    smooth
                                    scroll={scrollToTarget}
                                    onClick={() => handleNavItemClick(id)}
                                    aria-current={isActive ? 'location' : undefined}
                                >
                                    <div
                                        className={`${classes.drawerItem} ${
                                            isActive
                                                ? classes.activeDrawerItem
                                                : ''
                                        }`}
                                    >
                                        <Icon className={classes.drawerIcon} />
                                        <span className={classes.drawerLinks}>
                                            {label}
                                        </span>
                                    </div>
                                </NavLink>
                            );
                        })}
                    </div>
                </nav>
            </Drawer>
        </div>
    );
}

export default Navbar;
