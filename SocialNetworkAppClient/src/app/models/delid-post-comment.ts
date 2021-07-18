export class DelIdPostComment{
    id: number;
    isPost: boolean;
    postId: number;
    constructor(id: number, isPost: boolean, postId: number){
        this.id = id;
        this.isPost = isPost;
        this.postId = postId;
    }
}