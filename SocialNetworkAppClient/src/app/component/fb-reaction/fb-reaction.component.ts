import { Component, Input, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { eLikeReaction } from 'src/app/models/ereaction';
import { Post } from 'src/app/models/post';
import { UserLikePost } from 'src/app/models/user-like-post';
import { PostService } from 'src/app/services/post.service';
import { PresenceService } from 'src/app/services/presence.service';
import { SoundService } from 'src/app/services/sound.service';
import { LoadLikeComponent } from '../modal/load-like/load-like.component';

@Component({
  selector: 'app-fb-reaction',
  templateUrl: './fb-reaction.component.html',
  styleUrls: ['./fb-reaction.component.css']
})
export class FbReactionComponent implements OnInit {
  isDisplay = true;
  likeReaction: eLikeReaction;
  @Input() countComment: number;
  @Input() post: Post;

  constructor(private modalService: BsModalService, private sound: SoundService, private postService: PostService, private presence: PresenceService) { }

  ngOnInit(): void {
  }

  hover() {
    this.isDisplay = false;
  }

  mOut() {
    this.isDisplay = true;
  }

  clickReaction(status: string) {
    switch (status) {
      case "like": {
        this.likeReaction = eLikeReaction.like;        
        break;
      }
      case "love": {
        this.likeReaction = eLikeReaction.love;
        break;
      }
      case "haha": {
        this.likeReaction = eLikeReaction.haha;
        break;
      }
      case "wow": {
        this.likeReaction = eLikeReaction.wow;
        break;
      }
      case "sad": {
        this.likeReaction = eLikeReaction.sad;
        break;
      }
      case "anrgy": {
        this.likeReaction = eLikeReaction.anrgy;
        break;
      }
      case "yay": {
        this.likeReaction = eLikeReaction.yay;
        break;
      }
      default: {
        console.log(status);
        break;
      }
    }
    this.postService.addReaction(this.post.id, this.likeReaction).subscribe(()=>{
      this.presence.sendReaction(this.post.id);
    })
    this.sound.playAudioReactionLike();
    //console.log(this.likeReaction)
  }

  unLike(){
    this.postService.deleteReaction(this.post.id).subscribe((userLikePost: UserLikePost)=>{      
      let index = this.post.postLikeByUsers.findIndex(x=>x.username === userLikePost.username);
      if (index > -1) {        
        this.likeReaction = eLikeReaction.none;
        this.post.postLikeByUsers.splice(index, 1);
        this.presence.sendDelReaction(userLikePost);
      }
    })
  }

  modalRef: BsModalRef;

  openModalLoadLike(){
    const initialState = {  
      userLikePosts: this.post.postLikeByUsers
    };
    this.modalRef = this.modalService.show(LoadLikeComponent, {initialState});
  }
}
