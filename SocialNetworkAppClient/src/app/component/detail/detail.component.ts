import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserDetail } from 'src/app/models/member';
import { DataUnreadService } from 'src/app/services/data-unread.service';
import { PresenceService } from 'src/app/services/presence.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  member: UserDetail;

  constructor(private route: ActivatedRoute, private precense:PresenceService, private dataPostId: DataUnreadService) { 
    this.precense.comment$.subscribe(comment=>{
      if(this.member){//constructor run first ngOnInit
        if(comment){
          let post = this.member.posts.find(x=>x.id === comment?.postId);
          if(post){
            let cmt = post.comments.findIndex(x=>x.id === comment?.id);
            if(cmt === -1)//ko co thi them vao
              post.comments.push(comment);
          } 
        }                                     
      }
    })
    //fix error reload page but still display comment
    this.dataPostId.commentId$.subscribe(commentId=>{
      this.getComment(commentId);
    })

    this.dataPostId.delIdPostComment$.subscribe(postCommentIdObject =>{
      if(this.member){
        if(postCommentIdObject.isPost){//xoa bai viet        
        }else{//xoa binh luan
          let post = this.member.posts.find(x=>x.id === postCommentIdObject?.postId);
          if(post){
            post.comments = post.comments.filter(c=>c.id !== postCommentIdObject?.id);
          }
        }     
      }
    })
  }

  ngOnInit(): void {
    this.route.data.subscribe(data=>{
      this.member = data.member;	  
    })//them dong nay ngoai app-routing.module.ts: resolve:{member: MemberPhotosResolver}
  }

  getComment(commentId: number){
    this.precense.getComment(commentId);
  }
}
