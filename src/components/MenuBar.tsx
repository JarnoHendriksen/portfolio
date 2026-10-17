import React from "react";

import ThemeButton from "./ThemeButton";

import {ReactState, StateSetFn, ProjectData} from "../types";

import "./MenuBar.css";

function ListLinkItem({idx, setActive, setCurrentArticle, txt}: {idx: number, setActive: StateSetFn<boolean>, setCurrentArticle: StateSetFn<string>, txt: string}) {
    let artID = txt.replaceAll(' ', '');

    let handleLinkClick = () => {
        setCurrentArticle(artID);
        setActive(false);
    };

    return (
        <li key={idx}><a onClick={handleLinkClick}>{txt}</a></li>
    )
}

function ArticleList({setActive, setCurrentArticle, data}: {setActive: StateSetFn<boolean>, setCurrentArticle: StateSetFn<string>, data: ProjectData[]}) {
    if (data.length === 0) return null;

    let currentYear = Infinity;
    let links: React.JSX.Element[] = [];
    let idx = 0;
    for (let d of data) {
        let newYear = d.endDate.getFullYear();
        if (newYear !== currentYear){
            links.push((<h3 key={newYear}>{newYear}</h3>));
            currentYear = newYear;
        }
        links.push((<ListLinkItem key={idx} idx={idx} setActive={setActive} setCurrentArticle={setCurrentArticle} txt={d.title} />));
        idx++;
    }

    return (
        <ul>
            {links}
        </ul>
    )
}

function MenuBar({projectData, isMobile, activeState, setCurrentArticle}: 
    {projectData: ProjectData[], isMobile: boolean, activeState: ReactState<boolean>, setCurrentArticle: StateSetFn<string>}) {
    let [isActive, setActive] = activeState;
    let menubar = (
        <div className="MenuBar" id="menubar">
            <div className="MenuBar-content">
                <ArticleList setActive={setActive} setCurrentArticle={setCurrentArticle} data={projectData} />
                {isMobile && <ThemeButton />}
            </div>
        </div>
    );

    React.useEffect(() => {
        let element = document.getElementById("menubar");
        if (!element) return;

        element.dataset.active = isActive.toString();
    }, [isActive]);
    
    return menubar;
}

export default MenuBar;