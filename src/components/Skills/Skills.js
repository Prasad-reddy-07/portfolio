import React, { useContext } from 'react';
import Marquee from "react-fast-marquee";
import { SiJavascript } from 'react-icons/si';
import { FaNodeJs } from 'react-icons/fa';

import './Skills.css';

import { ThemeContext } from '../../contexts/ThemeContext';
import { skillsData } from '../../data/skillsData';
import { skillsImage } from '../../utils/skillsImage';

function Skills() {
    const { theme } = useContext(ThemeContext);

    const skillBoxStyle = {
        backgroundColor: theme.secondary,
        boxShadow: `0px 0px 30px ${theme.primary30}`
    };

    const renderSkillIcon = (skill) => {
        const iconSrc = skillsImage(skill);
        if (iconSrc) {
            return <img src={iconSrc} alt={skill} />;
        }
        const s = skill.toLowerCase();
        if (s === 'js' || s === 'javascript') {
            return <SiJavascript style={{ fontSize: '50px', color: '#F7DF1E' }} aria-label={skill} />;
        }
        if (s === 'node js' || s === 'nodejs' || s === 'node.js' || s === 'node') {
            return <FaNodeJs style={{ fontSize: '50px', color: '#68A063' }} aria-label={skill} />;
        }
        return <img src={iconSrc} alt={skill} />;
    };

    return (
        <div className="skills" style={{backgroundColor: theme.secondary}}>
            <div className="skillsHeader">
                <h2 style={{color: theme.primary}}>Skills</h2>
            </div>
            <div className="skillsContainer">
                <div className="skill--scroll">
                    <Marquee 
                        gradient={false} 
                        speed={80} 
                        pauseOnHover={true}
                        pauseOnClick={true} 
                        delay={0}
                        play={true} 
                        direction="left"
                    >
                        {skillsData.map((skill, id) => (
                            <div className="skill--box" key={id} style={skillBoxStyle}>
                                {renderSkillIcon(skill)}
                                <h3 style={{color: theme.tertiary}}>
                                    {skill}
                                </h3>
                            </div>
                        ))}
                    </Marquee>
                </div>
            </div>
        </div>
    );
}

export default Skills;
