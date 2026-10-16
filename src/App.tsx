import React from "react";
import "./App.css";
import "./vars.css";
import {ProjectData, Project, ImageGallery, ImgRef, Link, ImageData} from "./Projects";
import * as style from "./Style";
import face from "./images/face.jpg";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

type ReactState<T> = [T, React.Dispatch<React.SetStateAction<T>>];
type StateSetFn<T> = React.Dispatch<React.SetStateAction<T>>;

function ThemeToggler(){
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
        <style.ThemeBtn className="App-theme-button" name={theme} onClick={() => setTheme(nextTheme)}>
            <FontAwesomeIcon icon={["fas", "circle-half-stroke"]} />
        </style.ThemeBtn>
    );
}

function MenuButton({activeState, isMobile}: {activeState: ReactState<boolean>, isMobile: boolean}) {
    let [isActive, setActive] = activeState;
    if (!isMobile) return null;
    
    let handleButtonClick = () => {
        setActive(!isActive);
    }

    return <style.MenuBtn className="App-theme-button" onClick={handleButtonClick}>{isActive ? <>&times;</> : <>&#9776;</>}</style.MenuBtn>
}

function PersonPhoto({isMobile}: {isMobile: boolean}) {
    let className = "App-photo-wrapper";
    if (isMobile) className += " narrow-screen";
    return (
        <style.CroppedPhoto className={className}>
            <img src={face} className="App-photo" alt="Jarno" />
        </style.CroppedPhoto>
    )
}

function PersonData({isMobile}: {isMobile: boolean}) {
    let educ = [];
    if (isMobile){
        educ = [
            <style.PrimaryText key="0" className="subtitle">Game and Media Technology</style.PrimaryText>,
            <style.PrimaryText key="1" className="subtitle">at Utrecht University</style.PrimaryText>
        ];
    }
    else{
        educ = [
            <style.PrimaryText key="0" className="subtitle">Game and Media Technology at Utrecht University</style.PrimaryText>
        ]
    }
    return (
        <div className="App-person-data">
            <style.PrimaryText>Jarno Hendriksen</style.PrimaryText>
            {educ}
            <style.Link className="subtitle" href="mailto:jarno.hendriksen@proton.me"> jarno.hendriksen@proton.me</style.Link>
        </div>
    )
}

function Content({currentArticle, data, galleryActiveState}: {currentArticle: string, data: [ProjectData[], ImageData], galleryActiveState: ReactState<boolean>}){
    let article = data[0].find((item) => item.title.replaceAll(' ', '') === currentArticle) || data[0][0];
    return (
        
        <section className="App-mainContent">
            <Project data={[article, data[1]]} galleryActiveState={galleryActiveState} />
        </section>
    )
}

function ListLinkItem({idx, setActive, setCurrentArticle, txt}: {idx: number, setActive: StateSetFn<boolean>, setCurrentArticle: StateSetFn<string>, txt: string}) {
    let artID = txt.replaceAll(' ', '');

    let handleLinkClick = () => {
        setCurrentArticle(artID);
        setActive(false);
    };

    return (
        <li key={idx}><style.Link onClick={handleLinkClick}>{txt}</style.Link></li>
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
        <div className="App-sidebar" id="menubar">
            <div className="App-sidebar-content">
                <ArticleList setActive={setActive} setCurrentArticle={setCurrentArticle} data={projectData} />
                {isMobile && <ThemeToggler />}
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

export function App() {
    const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);
    const [screenOrientation, setOrientation] = React.useState(window.screen.orientation);
    const [projectData, setProjectData] = React.useState([] as ProjectData[]);
    const [projectImages, setProjectImages] = React.useState({} as ImageData);
    const [currentArticle, setCurrentArticle] = React.useState("");
    const [isActive, setActive] = React.useState(false);
    const galleryActiveState = React.useState(false);

    React.useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    React.useEffect(() => {
        const handleOrient = () => {
            setOrientation(window.screen.orientation);
        };

        window.addEventListener("orientationchange", handleOrient);

        return () => {
            window.removeEventListener("orientationchange", handleOrient);
        };
    }, []);

    React.useEffect(() => {
        let gallery = document.getElementById("ImageGallery");
        if (!gallery) return;
        gallery.dataset.active = galleryActiveState[0].toString();
    }, [galleryActiveState]);

    React.useEffect(() => {
        let execOnce = false;
        if (execOnce) return;
        fetch(`${window.location.href}content`)
        .then((res) => {
            return res.json();
        })
        .then((res) => {
            let projects: ProjectData[] = [];
            for (let p of res) {
                projects.push({
                    title: p.title,
                    startDate: new Date(p.startDate),
                    endDate: new Date(p.endDate),
                    imgRefs: p.imgRefs,
                    links: p.links as Link[],
                    content: p.content,
                });
            }

            projects.sort(function (a: ProjectData, b: ProjectData) {
                return b.endDate.getTime() - a.endDate.getTime()
            });

            setProjectData(projects);
        });

        return () => {execOnce = true;};
    }, []);

    React.useEffect(() => {
        let execOnce = false;
        if (execOnce) return;
        fetch(`${window.location.href}images`)
        .then((res) => {
            return res.json();
        })
        .then((res) => {
            let images: ImageData = {};
            for (let i of res) {
                images[i.name] = i.key;
            }

            setProjectImages(images);
        });

        return () => {execOnce = true;};
    }, []);

    let isMobile = windowWidth < 1000;
    let portraitMode = screenOrientation.type === "portrait-primary" || screenOrientation.type === "portrait-secondary";
    let headerClass = "App-header";
    if (isMobile) headerClass += " narrow-screen";

    let article = projectData?.find((item) => item.title.replaceAll(' ', '') === currentArticle) || projectData[0];

    return (
        <style.AppBody className="App">
            {projectData.length > 0 && <ImageGallery imgRefs={article.imgRefs} imgData={projectImages} galleryActiveState={galleryActiveState}/>}
            <style.Header className={headerClass}>
                <PersonPhoto isMobile={isMobile}/>
                <style.Padding amount={"0.75em"} />
                <PersonData isMobile={portraitMode}/>
                <div className="App-header-content">
                    <MenuButton activeState={[isActive, setActive]} isMobile={isMobile} />
                    {!isMobile && <ThemeToggler />}
                </div>
            </style.Header>
            <div className="App-middleSection">
                {projectData.length > 0 && <MenuBar projectData={projectData} isMobile={isMobile} activeState={[isActive, setActive]} setCurrentArticle={setCurrentArticle} />}
                {projectData.length > 0 && <Content currentArticle={currentArticle} data={[projectData, projectImages]} galleryActiveState={galleryActiveState} />}
            </div>
        </style.AppBody>
    );
}
