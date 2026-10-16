import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {IconName} from "@fortawesome/fontawesome-common-types";
import React from "react";

import "./vars.css"
import * as style from "./Style";

import projects from "./projects.json";

type ReactState<T> = [T, React.Dispatch<React.SetStateAction<T>>];
type StateSetFn<T> = React.Dispatch<React.SetStateAction<T>>;

export interface ProjectData {
    title: string;
    startDate: Date;
    endDate: Date;
    imgRefs: ImgRef[];
    links: Link[];
    content: string;
}

export interface ImgRef {
    url: string;
    caption: string;
}

export interface Link {
    name: string;
    url: string;
}

export type ImageData = Record<string, string>;

function Links({links}: {links: Link[]}) {
    function Icon(linkName: string) {
        let iconName: IconName = linkName.toLowerCase() as IconName;
        return <FontAwesomeIcon icon={["fab", iconName]} />
    }

    return (
        links.map((item) => <style.Link className="Article-link" href={item.url} target="blank">{Icon(item.name)} {item.name}</style.Link>)
    );
}

function ImageGalleryPreview({imgRefs, imgData, galleryActiveState}: {imgRefs: ImgRef[], imgData: ImageData, galleryActiveState: ReactState<boolean>}) {
    let [galleryActive, setGalleryActive] = galleryActiveState;
    
    if (imgRefs.length < 1 || imgRefs[0].url === "") {
        return null;
    }

    let handleGalleryClick = () => {
        setGalleryActive(true);
    }

    let imgUrl = `https://utfs.io/f/${imgData[imgRefs[0].url]}`;
    
    return (
        <div className="Article-content-image">
            <style.Image src={imgUrl} alt={imgRefs[0].caption} onClick={handleGalleryClick}/>
            <div className="Article-gallery-icon">
                <FontAwesomeIcon icon={["fas", "images"]} />
            </div>
        </div>
    );
}

export function ImageGallery({imgRefs, imgData, galleryActiveState}: {imgRefs: ImgRef[], imgData: ImageData, galleryActiveState: ReactState<boolean>}) {
    let [currentImage, setCurrentImage] = React.useState(0);
    let [galleryActive, setGalleryActive] = galleryActiveState;

    let multiple = imgRefs.length > 1;

    let handleArrowClick = (direction: number) => {
        let newImage = currentImage + direction;
        let len = imgRefs.length;
        
        setCurrentImage(((newImage % len) + len) % len); // workaround for negative mod
    }

    let handleCrossClick = () => {
        setGalleryActive(false);
        setCurrentImage(0);
    }

    let imgUrl = `https://utfs.io/f/${imgData[imgRefs[currentImage].url]}`;

    return (
        <div className="App-image-gallery" id="ImageGallery">
            <div className="Gallery-controls Gallery-exit-button"  onClick={handleCrossClick}><FontAwesomeIcon icon={["fas", "circle-xmark"]} /></div>
            <div className="Gallery-main-section">
                {multiple && <div className="Gallery-controls Gallery-arrow-back" onClick={() => handleArrowClick(-1)}><FontAwesomeIcon icon={["fas", "arrow-circle-left"]} /></div>}
                <div className="Gallery-image-container">
                    <img src={imgUrl} alt={imgRefs[currentImage].caption} />
                </div>
                {multiple && <div className="Gallery-controls Gallery-arrow-forward" onClick={() => handleArrowClick(1)}><FontAwesomeIcon icon={["fas", "arrow-circle-right"]} /></div>}
            </div>
            {multiple && <div className="Gallery-controls Gallery-counter">{imgRefs.map((item, idx) => <span key={idx}>{idx === currentImage ? <>&#9643;</> : <>&#9642;</>}</span>)}</div>}
        </div>
    );
}

export function Project({ data, galleryActiveState }: { data: [ProjectData, ImageData], galleryActiveState: ReactState<boolean> }) {
    let article = data[0];
    let imageDict = data[1];
    let artID = article.title.replaceAll(' ', '');
    let [galleryActive, setGalleryActive] = galleryActiveState;

    return (
        <article id={artID}>
            <style.H1>{article.title}</style.H1>
            <style.PrimaryText className="subtitle Article-date"><i>{style.FormatDate(article.startDate)} - {style.FormatDate(article.endDate)}</i></style.PrimaryText>
            <div className="Article-content">
                <div className="Article-text">
                    <style.PrimaryText>{article.content}</style.PrimaryText>
                    <span className="Article-links">
                        <Links links={article.links} />
                    </span>
                </div>
                <style.Padding amount="20%" />
                <ImageGalleryPreview imgRefs={article.imgRefs} imgData={imageDict} galleryActiveState={[galleryActive, setGalleryActive]} />
            </div>
        </article>
    );
}