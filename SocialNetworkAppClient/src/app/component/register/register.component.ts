import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';
import { User } from 'src/app/models/user';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  validationErrors: string[] = [];
  user: User;

  constructor(private fb: FormBuilder, public accountService: AccountService, private router: Router, private toastr: ToastrService) { 
    this.accountService.currentUser$.pipe(take(1)).subscribe(user=> this.user = user);
  }
  
  ngOnInit(): void {
    if(this.user){
      this.router.navigateByUrl('/');
    }
    this.khoiTaoForm();
  }

  khoiTaoForm(){
    this.registerForm = this.fb.group({
      displayName: ['', Validators.required],
      userName: ['', Validators.required],            
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]]     
    })
  }
  
  register(){
    this.accountService.register(this.registerForm.value).subscribe(response => {
      this.router.navigateByUrl('/');//home page
      this.toastr.success("Register success");
    }, error => {
      console.log(error);
      this.validationErrors = error;
    })
  }

}
