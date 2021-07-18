import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { take } from 'rxjs/operators';
import { ScrollToBottomDirective } from 'src/app/directive/scroll-to-bottom.directive';
import { Member } from 'src/app/models/member';
import { User } from 'src/app/models/user';
import { AccountService } from 'src/app/services/account.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,//fix error #scrollMe [scrollTop]="scrollMe.scrollHeight"
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.css'],
  providers: [MessageService]//separate services independently for every component
})
export class ChatBoxComponent implements AfterViewInit, OnInit, OnDestroy {
  @Input() user: Member;//information of chat box
  messageContent: string;
  //@ViewChild('ChatBox', { static: true }) element: ElementRef;
  userCurrent: User;
  @Input() right: number;
  @Output() removeChatBox = new EventEmitter();
  @Output() activedChatBoxEvent = new EventEmitter();
  isCollapsed = false;
  @ViewChild('messageForm') messageForm: NgForm;
  //@ViewChild(ScrollToBottomDirective) scroll: ScrollToBottomDirective;

  constructor(private accountService: AccountService, public messageService: MessageService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.userCurrent = user);
  }

  ngOnDestroy(): void {
    this.messageService.stopHubConnection();
  }

  ngOnInit(): void {
    this.messageService.createHubConnection(this.userCurrent, this.user.userName);    
  }

  ngAfterViewInit() {
    var chatBox = document.getElementById(this.user.userName);
    chatBox.style.right = this.right + "px";
  }

  @HostListener("scroll", ["$event"])
  onScroll(event) {
    let pos = event.target.scrollTop + event.target.offsetHeight;
    let max = event.target.scrollHeight;
    //pos/max will give you the distance between scroll bottom and and bottom of screen in percentage.
    if (pos == max) {
      this.messageService.seenMessage(this.user.userName);
    }
  }


  sendMessage() {
    this.messageService.sendMessage(this.user.userName, this.messageContent).then(() => {
      this.messageForm.reset();
    })
  }

  closeBoxChat() {
    this.removeChatBox.emit(this.user.userName);
  }

  onFocusEvent(event: any) {
    //console.log(event.target.value);
    this.activedChatBox();
  }

  activedChatBox() {
    this.activedChatBoxEvent.emit(this.user.userName)
  }
}
