import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Pagination } from 'src/app/models/pagination';
import { Post } from 'src/app/models/post';
import { UserLikePost } from 'src/app/models/user-like-post';
import { DataUnreadService } from 'src/app/services/data-unread.service';
import { PostService } from 'src/app/services/post.service';
import { PresenceService } from 'src/app/services/presence.service';
import { AddPostTemplateComponent } from '../modal/add-post-template/add-post-template.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  bsModalRef: BsModalRef;
  pageNumber = 1;
  pageSize = 5;
  posts: Post[];
  pagination: Pagination;
  maxSize = 5;

  constructor(private dataPostId: DataUnreadService,
    private modalService: BsModalService, 
    private postService: PostService,
    private precense:PresenceService
    ) {    

    this.dataPostId.commentId$.subscribe(commentId=>{
      this.getComment(commentId);
    })

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

    //post tra ve tu server
    this.precense.post$.subscribe(post=>{
      this.loadPosts();
      /* if(this.posts){//constructor run first ngOnInit        
        let index = this.posts.findIndex(x=>x.id === post?.id);
        if(index === -1)
          this.posts = [post, ...this.posts];
      } */
    })

    this.precense.userLikePost$.subscribe((o: UserLikePost)=>{
      if(this.posts){
        if(o){
          let post = this.posts.find(p=>p.id === o?.postId);
          if(post){
            let index = post.postLikeByUsers.findIndex(x=>x.userId === o?.userId);
            if(index === -1){
              post.postLikeByUsers.push(o);
            }else{
              post.postLikeByUsers[index] = o;
            }          
          }
        }
      }      
    })

    //comment tra ve tu server
    this.precense.comment$.subscribe(comment=>{
      if(this.posts){//constructor run first ngOnInit
        if(comment){
          let post = this.posts.find(x=>x.id === comment?.postId);
          if(post){
            let cmt = post.comments.findIndex(x=>x.id === comment?.id);
            if(cmt === -1)//ko co thi them vao
              post.comments.push(comment);
          } 
        }                                     
      }
    })

    this.precense.delUserLikePost$.subscribe(model=>{      
      if(this.posts){
        let post = this.posts.find(x=>x.id === model?.postId);
        if(post){
          let index = post.postLikeByUsers.findIndex(x=>x.username === model.username);
          if (index > -1) {
            post.postLikeByUsers.splice(index, 1);
          }
        }
      }
    })
  }

  ngOnInit(): void {    
    this.loadPosts();    
  }

  getComment(commentId: number){
    this.precense.getComment(commentId);
  }

  loadPosts(){
    this.postService.getPosts(this.pageNumber, this.pageSize).subscribe(res=>{
      this.posts = res.result;
      this.pagination = res.pagination;      
    })    
  }

  pageChanged(event: any) {
    this.pageNumber = event.page;
    this.loadPosts();
  }

  openModalWithComponent() {    
    this.bsModalRef = this.modalService.show(AddPostTemplateComponent);
    this.bsModalRef.content.closeBtnName = 'Close';
  }

}
