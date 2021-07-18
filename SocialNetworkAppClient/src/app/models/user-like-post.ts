import { eLikeReaction } from "./ereaction";

export interface UserLikePost{
    userId: number;
    username: string;
    displayName: string;
    userPhotoUrl: string;
    postId: number;
    likeReaction: eLikeReaction;
}