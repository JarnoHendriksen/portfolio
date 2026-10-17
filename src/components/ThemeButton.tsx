import React from "react";
import styled from "@emotion/styled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./Header.css";

export const ThemeButtonStyle = styled.button(props => ({
    transform: props.name === "light" ? "rotate(0deg)" : "rotate(180deg)",
}));

function ThemeButton() {
    let initialTheme = "light";
    if (window.matchMedia){
        if (window.matchMedia('(prefers-color-scheme: dark)').matches)
            initialTheme = "dark";
    }
    const [theme, setTheme] = React.useState(initialTheme);
    const nextTheme = theme === 'light' ?'dark' : 'light';
    
    React.useEffect(() => {
        document.body.dataset.theme = theme
    }, [theme]);

    return (
        <ThemeButtonStyle className="Header-button" name={theme} onClick={() => setTheme(nextTheme)}>
            <FontAwesomeIcon icon={["fas", "circle-half-stroke"]} />
        </ThemeButtonStyle>
    );
}

export default ThemeButton;