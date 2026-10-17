import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {IconName} from "@fortawesome/fontawesome-common-types";

import {ReactState, ProjectData, ImageData, Link, ImgRef} from "../types";
import * as style from "../Style";

import "./Project.css";

function Links({links}: {links: Link[]}) {
    function Icon(linkName: string) {
        let iconName: IconName = linkName.toLowerCase() as IconName;
        return <FontAwesomeIcon icon={["fab", iconName]} />
    }

    return (
        links.map((item) => <a className="Project-link" href={item.url} target="blank">{Icon(item.name)} {item.name}</a>)
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
        <div className="Project-image">
            <img src={imgUrl} alt={imgRefs[0].caption} onClick={handleGalleryClick}/>
            <div className="Project-gallery-icon">
                <FontAwesomeIcon icon={["fas", "images"]} />
            </div>
        </div>
    );
}

function Project({ currentArticle, data, galleryActiveState }: { currentArticle: string, data: [ProjectData[], ImageData], galleryActiveState: ReactState<boolean> }) {
    let article = data[0].find((item) => item.title.replaceAll(' ', '') === currentArticle) || data[0][0];
    let imageDict = data[1];
    let artID = article.title.replaceAll(' ', '');
    let [galleryActive, setGalleryActive] = galleryActiveState;

    return (
        <div className="Project-container">
            <article className="Project" id={artID}>
                <div className="Project-heading">{article.title}</div>
                <p className="subtitle Article-date"><i>{style.FormatDate(article.startDate)} - {style.FormatDate(article.endDate)}</i></p>
                <div className="Project-content">
                    <div className="Project-text">
                        <p>{article.content}</p>
                        <span className="Project-links">
                            <Links links={article.links} />
                        </span>
                    </div>
                    <style.Padding amount="20%" />
                    <ImageGalleryPreview imgRefs={article.imgRefs} imgData={imageDict} galleryActiveState={[galleryActive, setGalleryActive]} />
                </div>
            </article>
        </div>
    );
}

export default Project;