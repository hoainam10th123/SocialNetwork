import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './component/home/home.component';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';
import { NavComponent } from './component/nav/nav.component';
import { ProfileComponent } from './component/profile/profile.component';

import {ToastrModule} from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import {FileUploadModule} from 'ng2-file-upload';
import { TimeagoModule } from 'ngx-timeago';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { LoadingInterceptor } from './interceptors/loading.interceptor';
import { AboutComponent } from './component/about/about.component';
import { PostComponent } from './component/post/post.component';
import { DetailComponent } from './component/detail/detail.component';
import { TextInputComponent } from './component/form/text-input/text-input.component';
import { ChatBoxComponent } from './component/chat-box/chat-box.component';
import { FriendListComponent } from './friend-list/friend-list.component';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { InternetCheckInterceptor } from './interceptors/internet-check.interceptor';
import { ShortNumberPipe } from './pipes/short-number.pipe';
import { FbReactionComponent } from './component/fb-reaction/fb-reaction.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ChatMobileComponent } from './component/chat-mobile/chat-mobile.component';
import { Select2Module } from "ng-select2-component";
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { AvartaManageComponent } from './component/avarta-manage/avarta-manage.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import {IvyGalleryModule} from 'angular-gallery';
import { ScrollToBottomDirective } from './directive/scroll-to-bottom.directive';
import { AvatarEditorComponent } from './component/avatar-editor/avatar-editor.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AddPostTemplateComponent } from './component/modal/add-post-template/add-post-template.component';
import { ConfirmComponent } from './component/modal/confirm/confirm.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import {ScrollingModule, CdkScrollableModule} from '@angular/cdk/scrolling';
import { AddNestCommentComponent } from './component/modal/add-nest-comment/add-nest-comment.component';
import { LoadLikeComponent } from './component/modal/load-like/load-like.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    NavComponent,
    ProfileComponent,
    NotFoundComponent,
    ServerErrorComponent,
    AboutComponent,
    PostComponent,
    DetailComponent,
    TextInputComponent,
    ChatBoxComponent,
    FriendListComponent,
    ShortNumberPipe,
    FbReactionComponent,
    ChatMobileComponent,
    AvartaManageComponent,
    ScrollToBottomDirective,
    AvatarEditorComponent,
    AddPostTemplateComponent,
    ConfirmComponent,
    AddNestCommentComponent,
    LoadLikeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    FileUploadModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    Select2Module,
    InfiniteScrollModule,
    IvyGalleryModule,
    ScrollingModule,    
    CdkScrollableModule,
    PaginationModule.forRoot(),
    TimeagoModule.forRoot(),
    TabsModule.forRoot(),
    BsDatepickerModule.forRoot(),
    ToastrModule.forRoot({
      positionClass: 'toast-top-right'
    }),
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),
    TooltipModule.forRoot()
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi:true},
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi:true},   
    {provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi:true},
    {provide: HTTP_INTERCEPTORS, useClass: InternetCheckInterceptor, multi:true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
