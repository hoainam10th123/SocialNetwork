import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Post } from 'src/app/models/post';
import { DataUnreadService } from 'src/app/services/data-unread.service';
import { PostService } from 'src/app/services/post.service';
import { PresenceService } from 'src/app/services/presence.service';

@Component({
  selector: 'app-add-post-template',
  templateUrl: './add-post-template.component.html',
  styleUrls: ['./add-post-template.component.css']
})
export class AddPostTemplateComponent implements OnInit {
  form: FormGroup;
  formData = new FormData();
  acceptedImageTypes = ['image/gif', 'image/jpeg', 'image/png'];

  constructor(private precense:PresenceService, public bsModalRef: BsModalRef, private postService: PostService) { }

  ngOnInit(): void {
    this.khoiTaoForm();
  }

  khoiTaoForm(){
    this.form = new FormGroup({
      content: new FormControl('', Validators.required)     
    })
  }

  savePost(){
    this.postService.addPost(this.form.value.content, this.formData).subscribe((postId: number)=>{
      this.bsModalRef.hide();
      this.precense.getPost(postId);
    })
  }

  notImage = {
    images:[
      //{fileName: ''}
    ],
    title:''
  }

  upload(files) {
    this.notImage.images = [];
    this.formData = new FormData();
    for (const file of files) {
      if(this.acceptedImageTypes.includes(file.type)){
        this.formData.append(file.name, file);
      }else{
        this.notImage.images.push({fileName: file.name});
      }
    }     
  }
}
