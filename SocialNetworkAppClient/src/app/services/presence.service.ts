import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Comment } from '../models/comment';
import { Member } from '../models/member';
import { Post } from '../models/post';
import { User } from '../models/user';
import { UserLikePost } from '../models/user-like-post';
import { Notification } from '../models/notification';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {
  hubUrl = environment.hubUrl;
  private hubConnection: HubConnection;
  private onlineUsersSource = new BehaviorSubject<Member[]>([]);
  onlineUsers$ = this.onlineUsersSource.asObservable();

  private messageUsernameSource = new ReplaySubject<Member>(1);
  messageUsername$ = this.messageUsernameSource.asObservable();

  private postSource = new ReplaySubject<Post>(1);
  post$ = this.postSource.asObservable();

  private commentSource = new ReplaySubject<Comment>(1);
  comment$ = this.commentSource.asObservable();

  private userLikePostSource = new ReplaySubject<UserLikePost>(1);
  userLikePost$ = this.userLikePostSource.asObservable();

  private delUserLikePostSource = new ReplaySubject<UserLikePost>(1);
  delUserLikePost$ = this.delUserLikePostSource.asObservable();

  private notificationSource = new ReplaySubject<Notification>(1);
  notification$ = this.notificationSource.asObservable();

  constructor(private toastr: ToastrService, private router: Router) { }
  
  //endpoints.MapHub<PresenceHub>("hubs/presence") at startup file of backend
  createHubConnection(user: User) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'presence', {
        accessTokenFactory: () => user.token
      })
      .withAutomaticReconnect()
      .build()

    this.hubConnection
      .start()
      .catch(error => console.log(error));

    this.hubConnection.on('UserIsOnline', (username: Member) => {
      this.onlineUsers$.pipe(take(1)).subscribe(usernames => {
        this.onlineUsersSource.next([...usernames, username])
      })
      //this.toastr.info(username.displayName+ ' has connect')
    })

    this.hubConnection.on('UserIsOffline', (username: Member) => {
      this.onlineUsers$.pipe(take(1)).subscribe(usernames => {
        this.onlineUsersSource.next([...usernames.filter(x => x.userName !== username.userName)])
      })
      //this.toastr.warning(username.displayName + ' disconnect')
    })

    this.hubConnection.on('GetOnlineUsers', (usernames: Member[]) => {
      this.onlineUsersSource.next(usernames);
    })

    this.hubConnection.on('GetaPost', (post: Post) => {
      this.postSource.next(post);
    })

    this.hubConnection.on('GetaComment', (comment: Comment) => {
      this.commentSource.next(comment);
    })

    this.hubConnection.on('GetReaction', (comment: UserLikePost) => {
      this.userLikePostSource.next(comment);
    })

    this.hubConnection.on('DelReaction', (comment: UserLikePost) => {
      this.delUserLikePostSource.next(comment);
    })

    // this.hubConnection.on('NewMessageReceived', ({username, diplayName}) => {
    //   this.toastr.info(diplayName + ' has sent you a new message!')
    // })

    this.hubConnection.on('NewMessageReceived', (username: Member) => {
      this.messageUsernameSource.next(username)
    })

    this.hubConnection.on('Notification', (notification: Notification) => {
      this.notificationSource.next(notification)
    })
  }

  async getPost(postId: number){    
    return this.hubConnection.invoke('SendPost', postId)
      .catch(error => console.log(error));
  }

  async getComment(commentId: number){    
    return this.hubConnection.invoke('GetComment', commentId)
      .catch(error => console.log(error));
  }

  async sendReaction(postId: number){    
    return this.hubConnection.invoke('SendReaction', postId)
      .catch(error => console.log(error));
  }

  async sendDelReaction(userLikePost: UserLikePost){    
    return this.hubConnection.invoke('SendDelReaction', userLikePost)
      .catch(error => console.log(error));
  }

  async tagFriend(usernames, content){    
    return this.hubConnection.invoke('SendNotification', usernames,content)
      .catch(error => console.log(error));
  }

  stopHubConnection() {
    this.hubConnection.stop().catch(error => console.log(error));
  }
}
