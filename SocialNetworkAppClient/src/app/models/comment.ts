export interface Comment {
    id: number;
    content: string;
    datePosted: Date;
    username: string;
    displayName: string;
    userPhotoUrl: string;
    userId: number;
    parentId: number;
    postId: number;
    countNestComment: number;
    nestComments: Comment[];
}