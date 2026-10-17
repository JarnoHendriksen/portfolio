import React from "react";

import Header from "./components/Header";
import MenuBar from "./components/MenuBar";
import Project from "./components/Project";
import ImageGallery from "./components/ImageGallery";

import {ProjectData, ImageData, Link} from "./types";

import "./vars.css";
import "./App.css";

export function App() {
    const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);
    const [screenOrientation, setOrientation] = React.useState(window.screen.orientation);
    const [projectData, setProjectData] = React.useState([] as ProjectData[]);
    const [projectImages, setProjectImages] = React.useState({} as ImageData);
    const [currentArticle, setCurrentArticle] = React.useState("");
    const menuActiveState = React.useState(false);
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

    let article = projectData?.find((item) => item.title.replaceAll(' ', '') === currentArticle) || projectData[0];

    return (
        <div className="App">
            {projectData.length > 0 && <ImageGallery imgRefs={article.imgRefs} imgData={projectImages} galleryActiveState={galleryActiveState}/>}
            <Header screenProps={[isMobile, portraitMode]} menuActiveState={menuActiveState}/>
            <div className="App-middleSection">
                {projectData.length > 0 && <MenuBar projectData={projectData} isMobile={isMobile} activeState={menuActiveState} setCurrentArticle={setCurrentArticle} />}
                {projectData.length > 0 && <Project currentArticle={currentArticle} data={[projectData, projectImages]} galleryActiveState={galleryActiveState} />}
            </div>
        </div>
    );
}
