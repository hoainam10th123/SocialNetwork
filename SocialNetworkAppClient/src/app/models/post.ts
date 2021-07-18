import { PhotoOfPost } from "./photoofpost";
import { Comment } from "./comment";
import { UserLikePost } from "./user-like-post";

export interface Post{
    id: number;
    content: string;
    datePosted: Date;
    username: string;
    displayName: string;
    userPhotoUrl: string;
    userId: number;
    comments: Comment[];
    photos: PhotoOfPost[];
    postLikeByUsers: UserLikePost[];
}