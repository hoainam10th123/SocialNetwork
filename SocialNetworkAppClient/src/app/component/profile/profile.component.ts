import { Component, OnInit } from '@angular/core';
import { Post } from 'src/app/models/post';
import { User } from 'src/app/models/user';
import { AccountService } from 'src/app/services/account.service';
import { DataUnreadService } from 'src/app/services/data-unread.service';
import { PostService } from 'src/app/services/post.service';
import { PresenceService } from 'src/app/services/presence.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  pageNumber = 1;
  pageSize = 4;
  posts: Post[];

  constructor(private precense:PresenceService, private dataPostId: DataUnreadService, public accountService: AccountService, private postService: PostService) { 
    this.dataPostId.delIdPostComment$.subscribe(postCommentIdObject =>{
      if(this.posts){
        if(postCommentIdObject.isPost){//xoa bai viet
          this.posts = this.posts.filter(x=>x.id !== postCommentIdObject?.id);
        }else{//xoa binh luan
          let post = this.posts.find(x=>x.id === postCommentIdObject?.postId);
          if(post){
            post.comments = post.comments.filter(c=>c.id !== postCommentIdObject?.id);
          }
        }     
      }
    })

    this.precense.comment$.subscribe(comment=>{
      if(this.posts){//constructor run first ngOnInit
        if(comment){
          let post = this.posts.find(x=>x.id === comment?.postId);
          if(post){
            var cmt = post.comments.findIndex(c=>c.id === comment?.id);
            if(cmt === -1)
              post.comments.push(comment); 
          } 
        }                                     
      }
    })

    this.dataPostId.postId$.subscribe(postId=>{
      this.loadPosts();
    })

    this.dataPostId.commentId$.subscribe(commentId=>{
      this.getComment(commentId);
    })
  }

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(){
    this.postService.getPostByUserId(this.pageNumber, this.pageSize).subscribe(res=>{
      this.posts = res.result;
      //this.pagination = res.pagination;
    })    
  }

  getComment(commentId: number){
    this.precense.getComment(commentId);
  }
}
