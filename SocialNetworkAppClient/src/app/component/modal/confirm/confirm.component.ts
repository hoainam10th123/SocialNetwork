import { Component, EventEmitter, OnInit, Output, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Comment } from 'src/app/models/comment';
import { DelIdPostComment } from 'src/app/models/delid-post-comment';
import { CommentService } from 'src/app/services/comment.service';
import { DataUnreadService } from 'src/app/services/data-unread.service';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent {
  postId: number;
  isPost: boolean;

  constructor(private delId:DataUnreadService, public bsModalRef: BsModalRef, private postService: PostService, private commentService: CommentService) {}
 
  confirm(): void {
    if(this.isPost){//true: xoa bai viet
      this.postService.deletePost(this.postId).subscribe(()=>{
        this.delId.delIdPostComment = new DelIdPostComment(this.postId, true, 0);
      })
    }else{//xoa binh luan
      this.commentService.deleteComment(this.postId).subscribe((comment: Comment)=>{
        this.delId.delIdPostComment = new DelIdPostComment(this.postId, false, comment.postId);
      })
    }
    this.bsModalRef.hide();
  }
}
