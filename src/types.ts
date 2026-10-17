import React from "react";

export type ReactState<T> = [T, React.Dispatch<React.SetStateAction<T>>];
export type StateSetFn<T> = React.Dispatch<React.SetStateAction<T>>;

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
