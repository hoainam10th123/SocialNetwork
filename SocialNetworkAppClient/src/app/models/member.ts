import { Photo } from "./photo";
import { Post } from "./post";

export interface Member{
    userName: string;
    displayName: string;
    lastActive: Date;
    dayOfBirth: Date;
    photoUrl: string;
    photos: Photo[];
    unReadMessageCount: number;
}

export interface UserDetail{
    userName: string;
    displayName: string;
    lastActive: Date;
    dayOfBirth: Date;
    photoUrl: string;
    photos: Photo[];
    posts: Post[];
    unReadMessageCount: number;
}