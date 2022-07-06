import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from 'app/services/auth.service';
import { HandleResponseService } from 'app/services/handle-response.service';

@Component({
  selector: 'app-login-register',
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.css']
})
export class LoginRegisterComponent implements OnInit {

  loginSubmit:boolean=false;
  loginForm:FormGroup;
  registerSubmit:boolean=false;
  registerForm:FormGroup;
  dataSent:boolean=false;

  constructor(private formBuilder:FormBuilder,private authSerivce:AuthService,private handleResponseService:HandleResponseService) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ["", [Validators.required,Validators.email]],
      password: ["", Validators.required]
    });
    this.registerForm = this.formBuilder.group({
      email: ["", [Validators.required,Validators.email]],
      password: ["", Validators.required],
      password_confirmation: ["", Validators.required],
      name: ["", Validators.required]
    });
  }

  get form1()
  {
    return this.loginForm.controls;
  }

  get form2()
  {
    return this.registerForm.controls;
  }

  login()
  {
    this.loginSubmit=true;
    if(this.loginForm.valid)
    {
      this.dataSent=true;
      this.authSerivce.login(this.loginForm.value).subscribe(response=>{
        this.authSerivce.startSession(response);
      },err=>{
        this.handleResponseService.handleError(err);
      }).add(()=>{this.dataSent=false;this.loginSubmit=false;});
    }
  }
  register()
  {
    this.registerSubmit=true;
    if(this.registerForm.valid)
    {
      this.dataSent=true;
      this.authSerivce.register(this.registerForm.value).subscribe(response=>{
        this.handleResponseService.handleSuccess(response);
      },err=>{this.handleResponseService.handleError(err);})
      .add(()=>{this.dataSent=false;this.registerSubmit=false;});
    }
  }

}
