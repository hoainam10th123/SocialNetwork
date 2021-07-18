import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { DelIdPostComment } from '../models/delid-post-comment';

@Injectable({
  providedIn: 'root'
})
export class DataUnreadService {
  private isChatActive = false;
  private unreadmessageSource = new ReplaySubject<number>(1);
  countUnreadMessage$ = this.unreadmessageSource.asObservable();

  private postIdSource = new ReplaySubject<number>(1);
  postId$ = this.postIdSource.asObservable();

  private commentIdSource = new ReplaySubject<number>(1);
  commentId$ = this.commentIdSource.asObservable();

  private delIdPostCommentSource = new ReplaySubject<DelIdPostComment>(1);
  delIdPostComment$ = this.delIdPostCommentSource.asObservable();

  constructor() { }

  set countUnreadMessage(value: number) {
    this.unreadmessageSource.next(value);
  }

  set postId(value: number) {
    this.postIdSource.next(value);
  }

  set commentId(value: number) {
    this.commentIdSource.next(value);
  }

  set delIdPostComment(value: DelIdPostComment) {
    this.delIdPostCommentSource.next(value);
  }

  get chatActive(){
    return this.isChatActive;
  }

  set chatActive(value: boolean){
    this.isChatActive = value;
  }
}
