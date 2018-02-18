import {ChangeDetectionStrategy, Component, ElementRef, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Thread} from '../thread/thread.model';
import {Message} from '../message/message.model';
import {User} from '../user/user.model';
import {MessagesService} from '../message/messages.service';
import {ThreadsService} from '../thread/threads.service';
import {UsersService} from '../user/users.service';
import {forEach} from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatWindowComponent implements OnInit {
  messages: Observable<Message[]>;
  currentThread: Thread;
  draftMessage: Message;
  currentUser: User;

  constructor(
    public messagesService: MessagesService,
    public threadsService: ThreadsService,
    public usersService: UsersService,
    public el: ElementRef
  ) { }

  ngOnInit(): void {
    this.messages = this.threadsService.currentThreadMessages;
    this.draftMessage = new Message();

    this.threadsService
      .currentThread
      .subscribe((thread: Thread) => {
        this.currentThread = thread;
      });

    this.usersService
      .currentUser
      .subscribe((user: User) => {
        this.currentUser = user;
      });

    this.messages
      .subscribe((messages: Array<Message>) => {
        setTimeout(() => {
          this.scrollToBottom();
        });
      });
  }

  onEnter(event: any): void {
    this.sendMessage();
    event.preventDefault();
  }

  sendMessage(): void {
    const m: Message = this.draftMessage;
    m.author = this.currentUser;
    m.thread = this.currentThread;
    m.isRead = true;
    this.messagesService.addMessage(m);
    this.draftMessage = new Message();
  }

  scrollToBottom(): void {
    const scrollPane = this.el.nativeElement.querySelector('.msg-container-base');
    scrollPane.scrollTop = scrollPane.scrollHeight;
  }

}
