import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { ChatPageComponent } from './chat-page/chat-page.component';
import { ChatNavbarComponent } from './chat-navbar/chat-navbar.component';
import { ChatThreadsComponent } from './chat-threads/chat-threads.component';
import { ChatWindowComponent } from './chat-window/chat-window.component';
import {MessagesService} from './message/messages.service';
import {ThreadsService} from './thread/threads.service';
import {UsersService} from './user/users.service';
import { ChatThreadComponent } from './chat-thread/chat-thread.component';
import { ChatMessageComponent } from './chat-message/chat-message.component';
import {FormsModule} from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent,
    ChatPageComponent,
    ChatNavbarComponent,
    ChatThreadsComponent,
    ChatWindowComponent,
    ChatThreadComponent,
    ChatMessageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [
    MessagesService,
    ThreadsService,
    UsersService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
