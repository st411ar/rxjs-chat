import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Thread} from './thread.model';
import {MessagesService} from '../message/messages.service';
import {Message} from '../message/message.model';
import * as _ from 'lodash';
import {Subject} from 'rxjs/Subject';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

import 'rxjs/add/operator/combineLatest';


@Injectable()
export class ThreadsService {
  threads: Observable<{[key: string]: Thread}>;
  orderedThreads: Observable<Thread[]>;
  currentThread: Subject<Thread> = new BehaviorSubject<Thread>(new Thread());
  currentThreadMessages: Observable<Message[]>;

  constructor(public messagesService: MessagesService) {
    this.threads = messagesService.messages
      .map((messages: Message[]) => {
        const threads: {[key: string]: Thread} = {};
        messages.map((message: Message) => {
          const currentThreadId: string = message.thread.id;
          threads[currentThreadId] = threads[currentThreadId] || message.thread;
          const messagesThread: Thread = threads[currentThreadId];
          if (
              !messagesThread.lastMessage
              || messagesThread.lastMessage.sentAt < message.sentAt
          ) {
            messagesThread.lastMessage = message;
          }
        });
        return threads;
      });

    this.orderedThreads = this.threads
      .map((threadGroups: {[key: string]: Thread}) => {
        const threads: Thread[] = _.values(threadGroups);
        return _.sortBy(threads, (t: Thread) => t.lastMessage.sentAt).reverse();
      });

    this.currentThreadMessages = this.currentThread
      .combineLatest(messagesService.messages, (currentThread: Thread, messages: Message[]) => {
        if (currentThread && messages.length > 0) {
          return _.chain(messages)
            .filter((message: Message) => message.thread.id === currentThread.id )
            .map((message: Message) => {
              message.isRead = true;
              return message;
            });
        } else {
          return [];
        }
      });

    this.currentThread.subscribe(this.messagesService.markThreadAsRead);
  }

  setCurrentThread(newThread: Thread): void {
    this.currentThread.next(newThread);
  }
}

export const threadsServiceInjectables: Array<any> = [
  ThreadsService
];
