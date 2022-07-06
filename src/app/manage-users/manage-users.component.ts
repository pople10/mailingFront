import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HandleResponseService } from 'app/services/handle-response.service';
import { User } from 'app/services/models/user';
import { UserService } from 'app/services/user.service';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css']
})
export class ManageUsersComponent implements OnInit {

  userForm:FormGroup;
  userSubmit:boolean=false;
  dataSent:boolean=false;
  data:User[]=[];


  constructor(private formBuilder:FormBuilder,private userService:UserService,private handleService:HandleResponseService) { }

  ngOnInit(): void {
    this.userForm=this.formBuilder.group({
      email: ["", [Validators.required,Validators.email]],
      password: ["", Validators.required],
      password_confirmation: ["", Validators.required],
      name: ["", Validators.required],
      role:["", Validators.required]
    });
    this.retrieveUsers();
  }

  getLabel(item:User)
  {
    if(item.verified)
      return "Unverify";
    return "Verify";
  }

  toggle(id:number)
  {
    this.dataSent=true;
    this.userService.toggleVerification(id).subscribe(response=>{
      this.handleService.handleSuccess(response);
      this.retrieveUsers();
    },err=>{this.handleService.handleError(err);})
    .add(()=>{this.dataSent=false;})
  }

  retrieveUsers()
  {
    this.dataSent=true;
    this.userService.getUsers().subscribe(response=>{this.data=response}
      ,err=>{this.handleService.handleError(err)})
      .add(()=>{this.dataSent=false;});
  }

  get form()
  {
    return this.userForm.controls;
  }

  

  addUser()
  {
    this.userSubmit=true;
    if(this.userForm.valid)
    {
      this.dataSent=true;
      this.userService.addUser(this.userForm.value).subscribe(response=>{
        this.handleService.handleSuccess(response);
        this.retrieveUsers();
      },err=>{this.handleService.handleError(err);})
      .add(()=>{this.userSubmit=false;this.dataSent=false;});
    }
  }

}
