import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {ReactState, ImgRef, ImageData} from "../types";

import "./ImageGallery.css";

function ImageGallery({imgRefs, imgData, galleryActiveState}: {imgRefs: ImgRef[], imgData: ImageData, galleryActiveState: ReactState<boolean>}) {
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
        <div id="ImageGallery">
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

export default ImageGallery;