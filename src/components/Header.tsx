import styled from "@emotion/styled";

import ThemeButton from "./ThemeButton";

import {ReactState} from "../types";
import * as style from "../Style";

import "./Header.css";
import face from "../images/face.jpg";

const HeaderStyle = styled.div(props => ({
    color: 'var(--color-primary)',
    backgroundColor: 'var(--color-bg-header)',
    '&:after': {
        borderBottom: '2px solid var(--color-primary)',
        backgroundColor: props.className?.includes("narrow-screen") ? "var(--color-bg-header)" : "transparent",
    }
}));

const CroppedPhoto = styled.div( props => ({
    ":before, :after":{
        backgroundColor: props.className?.includes("narrow-screen") ? "var(--color-bg-primary)" : "var(--color-bg-header)",
        borderColor: "var(--color-primary)",
    },
}));

function PersonPhoto({isMobile}: {isMobile: boolean}) {
    let className = "PersonPhoto";
    if (isMobile) className += " narrow-screen";
    return (
        <CroppedPhoto className={className}>
            <img src={face} alt="Jarno" />
        </CroppedPhoto>
    )
}

function PersonData({isMobile}: {isMobile: boolean}) {
    let educ = [];
    if (isMobile){
        educ = [
            <p key="0" className="subtitle">Game and Media Technology</p>,
            <p key="1" className="subtitle">at Utrecht University</p>
        ];
    }
    else{
        educ = [
            <p key="0" className="subtitle">Game and Media Technology at Utrecht University</p>
        ]
    }
    return (
        <div className="Header-info">
            <p>Jarno Hendriksen</p>
            {educ}
            <a className="subtitle" href="mailto:jarno.hendriksen@proton.me"> jarno.hendriksen@proton.me</a>
        </div>
    )
}

function MenuButton({activeState}: {activeState: ReactState<boolean>}) {
    let [isActive, setActive] = activeState;
    
    let handleButtonClick = () => {
        setActive(!isActive);
    }

    return <button className="Header-button" onClick={handleButtonClick}>{isActive ? <>&times;</> : <>&#9776;</>}</button>
}

function Header({screenProps, menuActiveState}: {screenProps: [boolean, boolean], menuActiveState: ReactState<boolean>}) {
    let [isMobile, portraitMode] = screenProps;
    let headerClass = "Header";
    if (isMobile) headerClass += " narrow-screen";

    return (
        <HeaderStyle className={headerClass}>
            <PersonPhoto isMobile={isMobile}/>
            <style.Padding amount={"0.75em"} />
            <PersonData isMobile={portraitMode}/>
            <div className="Header-content">
                {isMobile ? <MenuButton activeState={menuActiveState} /> : <ThemeButton />}
            </div>
        </HeaderStyle>
    );
}

export default Header;