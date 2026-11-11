import React, { useContext, useState } from 'react';
import {
    Snackbar,
    IconButton,
    SnackbarContent,
    CircularProgress,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import axios from 'axios';
import isEmail from 'validator/lib/isEmail';
import { makeStyles } from '@material-ui/core/styles';
import {
    FaTwitter,
    FaLinkedinIn,
    FaGithub,
    FaYoutube,
    FaBloggerB,
    FaRedditAlien,
    FaStackOverflow,
    FaCodepen,
    FaInstagram,
    FaGitlab,
    FaMediumM,
} from 'react-icons/fa';
import { AiOutlineSend, AiOutlineCheckCircle } from 'react-icons/ai';
import { FiPhone, FiAtSign } from 'react-icons/fi';
import { HiOutlineLocationMarker } from 'react-icons/hi';

import { ThemeContext } from '../../contexts/ThemeContext';

import { socialsData } from '../../data/socialsData';
import { contactsData } from '../../data/contactsData';
import './Contacts.css';

function Contacts() {
    const [open, setOpen] = useState(false);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [honeypot, setHoneypot] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [statusType, setStatusType] = useState('error');
    const [statusMsg, setStatusMsg] = useState('');

    const { theme } = useContext(ThemeContext);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const useStyles = makeStyles((t) => ({
        input: {
            border: `4px solid ${theme.primary80}`,
            backgroundColor: `${theme.secondary}`,
            color: `${theme.tertiary}`,
            fontFamily: 'var(--primaryFont)',
            fontWeight: 500,
            transition: 'border 0.2s ease-in-out',
            '&:focus': {
                border: `4px solid ${theme.primary600}`,
            },
        },
        message: {
            border: `4px solid ${theme.primary80}`,
            backgroundColor: `${theme.secondary}`,
            color: `${theme.tertiary}`,
            fontFamily: 'var(--primaryFont)',
            fontWeight: 500,
            transition: 'border 0.2s ease-in-out',
            '&:focus': {
                border: `4px solid ${theme.primary600}`,
            },
        },
        label: {
            backgroundColor: `${theme.secondary}`,
            color: `${theme.primary}`,
            fontFamily: 'var(--primaryFont)',
            fontWeight: 600,
            fontSize: '0.9rem',
            padding: '0 5px',
            transform: 'translate(25px,50%)',
            display: 'inline-flex',
        },
        socialIcon: {
            width: '45px',
            height: '45px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '21px',
            backgroundColor: theme.primary,
            color: theme.secondary,
            transition: '250ms ease-in-out',
            '&:hover': {
                transform: 'scale(1.1)',
                color: theme.secondary,
                backgroundColor: theme.tertiary,
            },
        },
        detailsIcon: {
            backgroundColor: theme.primary,
            color: theme.secondary,
            borderRadius: '50%',
            width: '45px',
            height: '45px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '23px',
            transition: '250ms ease-in-out',
            flexShrink: 0,
            '&:hover': {
                transform: 'scale(1.1)',
                color: theme.secondary,
                backgroundColor: theme.tertiary,
            },
        },
        submitBtn: {
            backgroundColor: theme.primary,
            color: theme.secondary,
            transition: '250ms ease-in-out',
            '&:hover': {
                transform: 'scale(1.08)',
                color: theme.secondary,
                backgroundColor: theme.tertiary,
            },
            '&:disabled': {
                opacity: 0.7,
                cursor: 'not-allowed',
                transform: 'none',
            },
        },
    }));

    const classes = useStyles();

    const showFeedback = (type, msg) => {
        setStatusType(type);
        setStatusMsg(msg);
        setOpen(true);
    };

    const handleFieldChange = (setter) => (e) => {
        setter(e.target.value);
        if (success) {
            setSuccess(false);
        }
    };

    const handleContactForm = async (e) => {
        e.preventDefault();

        if (isSubmitting) {
            return;
        }

        if (honeypot) {
            return;
        }

        const trimmedName = name.trim();
        const trimmedEmail = email.trim();
        const trimmedMessage = message.trim();

        if (!trimmedName && !trimmedEmail && !trimmedMessage) {
            showFeedback('error', 'Please fill in all required fields.');
            return;
        }
        if (!trimmedName) {
            showFeedback('error', 'Please enter your full name.');
            return;
        }
        if (!trimmedEmail) {
            showFeedback('error', 'Please enter your email address.');
            return;
        }
        if (!isEmail(trimmedEmail)) {
            showFeedback('error', 'Please enter a valid email address.');
            return;
        }
        if (!trimmedMessage) {
            showFeedback('error', 'Please enter your message.');
            return;
        }

        const customEndpoint = (
            contactsData.formEndpoint ||
            contactsData.sheetAPI ||
            ''
        ).trim();
        const recipientEmail = (contactsData.email || '').trim();

        if (!customEndpoint && !recipientEmail) {
            showFeedback(
                'error',
                'Contact email service is not configured yet.'
            );
            return;
        }

        const isCustom = Boolean(customEndpoint);
        const endpointUrl = isCustom
            ? customEndpoint
            : `https://formsubmit.co/ajax/${encodeURIComponent(recipientEmail)}`;

        const payload = {
            name: trimmedName,
            email: trimmedEmail,
            message: trimmedMessage,
            _replyto: trimmedEmail,
            _subject: `New Portfolio Message from ${trimmedName}`,
        };

        if (!isCustom) {
            payload._template = 'table';
        }

        setIsSubmitting(true);
        setSuccess(false);
        setStatusMsg('');
        setOpen(false);

        try {
            const res = await axios.post(endpointUrl, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            });

            const data = res && res.data ? res.data : {};
            const confirmed = isCustom
                ? res.status >= 200 &&
                  res.status < 300 &&
                  data.ok !== false &&
                  data.success !== false &&
                  data.success !== 'false'
                : res.status >= 200 &&
                  res.status < 300 &&
                  (data.success === true || data.success === 'true');

            if (confirmed) {
                setSuccess(true);
                setName('');
                setEmail('');
                setMessage('');
                showFeedback(
                    'success',
                    'Your message has been sent successfully!'
                );
            } else {
                const serviceMsg =
                    (typeof data.message === 'string' && data.message.trim()) ||
                    (typeof data.error === 'string' && data.error.trim()) ||
                    'Failed to send your message. Please try again later.';
                setSuccess(false);
                showFeedback('error', serviceMsg);
            }
        } catch (err) {
            const errData =
                err && err.response && err.response.data
                    ? err.response.data
                    : {};
            let errorMessage =
                (typeof errData.error === 'string' && errData.error.trim()) ||
                (typeof errData.message === 'string' &&
                    errData.message.trim()) ||
                '';

            if (
                !errorMessage &&
                Array.isArray(errData.errors) &&
                errData.errors.length > 0
            ) {
                errorMessage = errData.errors
                    .map((item) => item.message)
                    .filter(Boolean)
                    .join(', ');
            }

            if (!errorMessage) {
                errorMessage = `Failed to send your message. Please try again or email ${recipientEmail} directly.`;
            }

            setSuccess(false);
            showFeedback('error', errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div
            className='contacts'
            id='contacts'
            style={{ backgroundColor: theme.secondary }}
        >
            <div className='contacts--container'>
                <h1 style={{ color: theme.primary }}>Contacts</h1>
                <div className='contacts-body'>
                    <div className='contacts-form'>
                        <form onSubmit={handleContactForm} noValidate>
                            <input
                                type='text'
                                name='_honey'
                                value={honeypot}
                                onChange={(e) => setHoneypot(e.target.value)}
                                style={{ display: 'none' }}
                                tabIndex={-1}
                                autoComplete='off'
                                aria-hidden='true'
                            />
                            <div className='input-container'>
                                <label htmlFor='Name' className={classes.label}>
                                    Full Name
                                </label>
                                <input
                                    id='Name'
                                    placeholder='Your Full Name'
                                    value={name}
                                    onChange={handleFieldChange(setName)}
                                    type='text'
                                    name='Name'
                                    required
                                    disabled={isSubmitting}
                                    className={`form-input ${classes.input}`}
                                />
                            </div>
                            <div className='input-container'>
                                <label
                                    htmlFor='Email'
                                    className={classes.label}
                                >
                                    Email Address
                                </label>
                                <input
                                    id='Email'
                                    placeholder='you@example.com'
                                    value={email}
                                    onChange={handleFieldChange(setEmail)}
                                    type='email'
                                    name='Email'
                                    required
                                    disabled={isSubmitting}
                                    className={`form-input ${classes.input}`}
                                />
                            </div>
                            <div className='input-container'>
                                <label
                                    htmlFor='Message'
                                    className={classes.label}
                                >
                                    Message
                                </label>
                                <textarea
                                    id='Message'
                                    placeholder='Type your message....'
                                    value={message}
                                    onChange={handleFieldChange(setMessage)}
                                    name='Message'
                                    required
                                    disabled={isSubmitting}
                                    className={`form-message ${classes.message}`}
                                />
                            </div>

                            <div className='submit-btn'>
                                <button
                                    type='submit'
                                    disabled={isSubmitting}
                                    aria-busy={isSubmitting}
                                    className={classes.submitBtn}
                                >
                                    <p>
                                        {isSubmitting
                                            ? 'Sending...'
                                            : success
                                            ? 'Sent'
                                            : 'Send Message'}
                                    </p>
                                    <div className='submit-icon'>
                                        {isSubmitting ? (
                                            <CircularProgress
                                                size={20}
                                                style={{
                                                    color: theme.secondary,
                                                }}
                                            />
                                        ) : (
                                            <>
                                                <AiOutlineSend
                                                    className='send-icon'
                                                    style={{
                                                        animation: !success
                                                            ? 'initial'
                                                            : 'fly 0.8s linear both',
                                                        position: success
                                                            ? 'absolute'
                                                            : 'initial',
                                                    }}
                                                />
                                                <AiOutlineCheckCircle
                                                    className='success-icon'
                                                    style={{
                                                        display: !success
                                                            ? 'none'
                                                            : 'inline-flex',
                                                        opacity: !success
                                                            ? '0'
                                                            : '1',
                                                    }}
                                                />
                                            </>
                                        )}
                                    </div>
                                </button>
                            </div>
                            {statusMsg && (
                                <p
                                    className={`contact-status ${
                                        statusType === 'success'
                                            ? 'contact-status--success'
                                            : 'contact-status--error'
                                    }`}
                                    role={
                                        statusType === 'success'
                                            ? 'status'
                                            : 'alert'
                                    }
                                >
                                    {statusMsg}
                                </p>
                            )}
                        </form>
                        <Snackbar
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'center',
                            }}
                            open={open}
                            autoHideDuration={5000}
                            onClose={handleClose}
                        >
                            <SnackbarContent
                                action={
                                    <React.Fragment>
                                        <IconButton
                                            size='small'
                                            aria-label='close'
                                            color='inherit'
                                            onClick={handleClose}
                                        >
                                            <CloseIcon fontSize='small' />
                                        </IconButton>
                                    </React.Fragment>
                                }
                                style={{
                                    backgroundColor:
                                        statusType === 'success'
                                            ? '#2e7d32'
                                            : theme.primary,
                                    color:
                                        statusType === 'success'
                                            ? '#ffffff'
                                            : theme.secondary,
                                    fontFamily: 'var(--primaryFont)',
                                    fontWeight: 500,
                                }}
                                message={statusMsg}
                            />
                        </Snackbar>
                    </div>

                    <div className='contacts-details'>
                        <a
                            href={`mailto:${contactsData.email}`}
                            className='personal-details'
                        >
                            <div className={classes.detailsIcon}>
                                <FiAtSign />
                            </div>
                            <p style={{ color: theme.tertiary }}>
                                {contactsData.email}
                            </p>
                        </a>
                        <a
                            href={`tel:${contactsData.phone}`}
                            className='personal-details'
                        >
                            <div className={classes.detailsIcon}>
                                <FiPhone />
                            </div>
                            <p style={{ color: theme.tertiary }}>
                                {contactsData.phone}
                            </p>
                        </a>
                        <div className='personal-details'>
                            <div className={classes.detailsIcon}>
                                <HiOutlineLocationMarker />
                            </div>
                            <p style={{ color: theme.tertiary }}>
                                {contactsData.address}
                            </p>
                        </div>

                        <div className='socialmedia-icons'>
                            {socialsData.twitter && (
                                <a
                                    href={socialsData.twitter}
                                    target='_blank'
                                    rel='noreferrer'
                                    className={classes.socialIcon}
                                >
                                    <FaTwitter aria-label='Twitter' />
                                </a>
                            )}
                            {socialsData.github && (
                                <a
                                    href={socialsData.github}
                                    target='_blank'
                                    rel='noreferrer'
                                    className={classes.socialIcon}
                                >
                                    <FaGithub aria-label='GitHub' />
                                </a>
                            )}
                            {socialsData.linkedIn && (
                                <a
                                    href={socialsData.linkedIn}
                                    target='_blank'
                                    rel='noreferrer'
                                    className={classes.socialIcon}
                                >
                                    <FaLinkedinIn aria-label='LinkedIn' />
                                </a>
                            )}
                            {socialsData.instagram && (
                                <a
                                    href={socialsData.instagram}
                                    target='_blank'
                                    rel='noreferrer'
                                    className={classes.socialIcon}
                                >
                                    <FaInstagram aria-label='Instagram' />
                                </a>
                            )}
                            {socialsData.medium && (
                                <a
                                    href={socialsData.medium}
                                    target='_blank'
                                    rel='noreferrer'
                                    className={classes.socialIcon}
                                >
                                    <FaMediumM aria-label='Medium' />
                                </a>
                            )}
                            {socialsData.blogger && (
                                <a
                                    href={socialsData.blogger}
                                    target='_blank'
                                    rel='noreferrer'
                                    className={classes.socialIcon}
                                >
                                    <FaBloggerB aria-label='Blogger' />
                                </a>
                            )}
                            {socialsData.youtube && (
                                <a
                                    href={socialsData.youtube}
                                    target='_blank'
                                    rel='noreferrer'
                                    className={classes.socialIcon}
                                >
                                    <FaYoutube aria-label='YouTube' />
                                </a>
                            )}
                            {socialsData.reddit && (
                                <a
                                    href={socialsData.reddit}
                                    target='_blank'
                                    rel='noreferrer'
                                    className={classes.socialIcon}
                                >
                                    <FaRedditAlien aria-label='Reddit' />
                                </a>
                            )}
                            {socialsData.stackOverflow && (
                                <a
                                    href={socialsData.stackOverflow}
                                    target='_blank'
                                    rel='noreferrer'
                                    className={classes.socialIcon}
                                >
                                    <FaStackOverflow aria-label='Stack Overflow' />
                                </a>
                            )}
                            {socialsData.codepen && (
                                <a
                                    href={socialsData.codepen}
                                    target='_blank'
                                    rel='noreferrer'
                                    className={classes.socialIcon}
                                >
                                    <FaCodepen aria-label='CodePen' />
                                </a>
                            )}
                            {socialsData.gitlab && (
                                <a
                                    href={socialsData.gitlab}
                                    target='_blank'
                                    rel='noreferrer'
                                    className={classes.socialIcon}
                                >
                                    <FaGitlab aria-label='GitLab' />
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <img
                src={theme.contactsimg}
                alt='contacts'
                className='contacts--img'
            />
        </div>
    );
}

export default Contacts;
