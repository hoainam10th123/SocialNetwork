import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Comment } from 'src/app/models/comment';
import { CommentService } from 'src/app/services/comment.service';
//post.component call
@Component({
  selector: 'app-add-nest-comment',
  templateUrl: './add-nest-comment.component.html',
  styleUrls: ['./add-nest-comment.component.css']
})
export class AddNestCommentComponent implements OnInit {
  form: FormGroup;
  parentId: number;
  noiDung: string;
  postId: number;
  comments: Comment[] = [];

  constructor(public bsModalRef: BsModalRef, private commentService: CommentService) { }

  ngOnInit(): void {
    this.khoiTaoForm();
    this.loadComment();
  }

  loadComment(){
    this.commentService.getChildrenComment(this.parentId).subscribe(comments=>{
      this.comments = comments;
    })
  }

  khoiTaoForm(){
    this.form = new FormGroup({
      content: new FormControl('', Validators.required)     
    })
  }

  saveChildrenComment(){
    this.commentService.addNestComment(this.postId, this.parentId, this.form.value.content).subscribe((comment: Comment)=>{
      if(comment){
        this.comments.push(comment);
        this.form.reset();
      }
    })
  }
}
