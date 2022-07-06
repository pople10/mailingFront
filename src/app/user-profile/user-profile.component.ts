import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'app/services/auth.service';
import { HandleResponseService } from 'app/services/handle-response.service';
import { response } from 'express';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  passwordForm:FormGroup;
  passwordSubmit:boolean=false;
  dataSent:boolean=false;

  constructor(private formBuilder:FormBuilder,private authService:AuthService,private handleRequestService:HandleResponseService) { }

  ngOnInit() {
    this.passwordForm=this.formBuilder.group({
      old_password: ["", [Validators.required]],
      password: ["", Validators.required],
      password_confirmation: ["", Validators.required]
    });
  }

  get formPass()
  {
    return this.passwordForm.controls;
  }

  changePassword()
  {
    this.passwordSubmit=true;
    if(this.passwordForm.valid)
    {
      this.dataSent=true;
        this.authService.changePassword(this.passwordForm.value).subscribe(response=>{
          this.handleRequestService.handleSuccess(response);
        },err=>{this.handleRequestService.handleError(err);})
        .add(()=>{this.passwordSubmit=false;this.dataSent=false;})
    }
  }

}
