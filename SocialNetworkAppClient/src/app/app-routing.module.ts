import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './component/about/about.component';
import { AvartaManageComponent } from './component/avarta-manage/avarta-manage.component';
import { ChatMobileComponent } from './component/chat-mobile/chat-mobile.component';
import { DetailComponent } from './component/detail/detail.component';
import { HomeComponent } from './component/home/home.component';
import { LoginComponent } from './component/login/login.component';
import { ProfileComponent } from './component/profile/profile.component';
import { RegisterComponent } from './component/register/register.component';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';
import { AuthGuard } from './guards/auth.guard';
import { MemberDetailedResolver } from './resolvers/member-detailed.resolver';

const routes: Routes = [  
  {
    path:'',
    runGuardsAndResolvers:'always',
    canActivate: [AuthGuard],
    children:[
      {path: '', component: HomeComponent},
      {path: 'profile', component: ProfileComponent},
      {path: 'detail/:username', component: DetailComponent, resolve:{member: MemberDetailedResolver}},
      {path: 'chat', component: ChatMobileComponent},
      {path: 'avarta-managed', component: AvartaManageComponent},
    ]
  },
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},  
  {path: 'about', component: AboutComponent},
  {path: 'not-found', component: NotFoundComponent},
  {path: 'server-error', component: ServerErrorComponent},
  {path: '**', component: NotFoundComponent, pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
