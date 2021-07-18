import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Gallery } from 'angular-gallery';
import { Select2Data, Select2SearchEvent, Select2UpdateEvent } from 'ng-select2-component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { take } from 'rxjs/operators';
import { Member } from 'src/app/models/member';
import { Pagination } from 'src/app/models/pagination';
import { Post } from 'src/app/models/post';
import { User } from 'src/app/models/user';
import { AccountService } from 'src/app/services/account.service';
import { CommentService } from 'src/app/services/comment.service';
import { DataUnreadService } from 'src/app/services/data-unread.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PresenceService } from 'src/app/services/presence.service';
import { UserService } from 'src/app/services/user.service';
import { AddNestCommentComponent } from '../modal/add-nest-comment/add-nest-comment.component';
import { ConfirmComponent } from '../modal/confirm/confirm.component';
import { LoadLikeComponent } from '../modal/load-like/load-like.component';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  isDisplayTag: boolean = false;
  pagination: Pagination;
  pageNumber = 1;
  pageSize = 5;
  members:Member[] = [];
  @Input() post: Post;
  modalRef: BsModalRef;
  cmtForm: FormGroup;
  isOnline = false;
  userCurrent: User;

  constructor(private notification: NotificationService, public presence: PresenceService, private dataCommentId: DataUnreadService, private commentService: CommentService, private gallery: Gallery, private modalService: BsModalService, private userService: UserService, public accountService: AccountService) {  
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.userCurrent = user);   
  }

  public data: Select2Data = [
    // {
    //   value: 'hoainam10th1',
    //   label: 'Nguyen Hoai Nam',
    //   data: { url: './assets/user.png', name: 'Nguyen Hoai Nam' }
    // }
  ]

  ngOnInit(): void {
    this.khoiTaoForm();
    this.getMembers();
    this.presence.onlineUsers$.subscribe(elements=>{
      this.isOnline = elements.some(x=>x.userName === this.post.username); 
    })
  }

  khoiTaoForm(){
    this.cmtForm = new FormGroup({
      content: new FormControl('', Validators.required)     
    })
  }

  getMembers(){
    this.userService.getMembers(this.pageNumber, this.pageSize).subscribe(res=>{
      this.members = res.result;
      this.pagination = res.pagination;

      this.members.forEach(mem =>{
        let ob = {
          value: mem.userName,
          label: mem.displayName,
          data: { url: mem.photoUrl? mem.photoUrl:'./assets/user.png' , name: mem.displayName }
        }
        this.data.push(ob);
      })
    })
  }

  tagUsernames: any;

  updateEvent(event: Select2UpdateEvent) {
    //console.log(event.value);//event.value is array string: ['ubuntu', 'hoainam10th']
    this.tagUsernames = event.value;
  }

  searchEvent(event: Select2SearchEvent){
    //console.log(event.search.length);
    if(event.search.length >= 3){
      this.data = [];
      this.userService.searchMembers(event.search).subscribe(users=>{
        this.members = users;

        this.members.forEach(mem =>{
          let ob = {
            value: mem.userName,
            label: mem.displayName,
            data: { url: mem.photoUrl? mem.photoUrl:'./assets/user.png' , name: mem.displayName }
          }
          this.data.push(ob);
        })
      })
    }
  }

  focusEvent(){
    this.isDisplayTag = true;
  }

  //html: (focusout)="focusOutEvent()"
  focusOutEvent(){
    this.isDisplayTag = false;
  }

  openConfirmModal(id: number, isPost: boolean){
    const initialState = {  
      postId: id,
      isPost: isPost
    };
    this.modalRef = this.modalService.show(ConfirmComponent, {initialState});
  }

  showGallery(index: number) {
    let prop = {
      images: [
        // { path: './assets/db.png' },
      ],
      index
    };
    if(this.post.photos.length > 0){
      this.post.photos.forEach(p=>{
        prop.images.push({path: p.url});
      })
      this.gallery.load(prop);
    }
  }

  submitComment(postId: number){    
    if(this.tagUsernames){
      if(this.tagUsernames.length == 0){
        this.tagUsernames = '';
      }      
    }else{
      this.tagUsernames = '';
    }
    let content = this.userCurrent.displayName + ' commented on your post';
    this.commentService.addComment(postId,this.tagUsernames +' '+ this.cmtForm.value.content).subscribe((commentId: number)=>{
      this.cmtForm.reset();
      this.dataCommentId.commentId = commentId;
      this.notification.addNotification(content, this.post.username).subscribe(()=>{})
      if(this.tagUsernames != ''){
        this.presence.tagFriend(this.tagUsernames, 'You were tagged in 1 post');
      }
    })
  }

  openAddChildrenCommentModal(postId: number, parentId: number, content: string){
    const initialState = {  
      parentId: parentId,
      postId: postId,
      noiDung: content
    };
    this.modalRef = this.modalService.show(AddNestCommentComponent, {initialState});
  }  
}
