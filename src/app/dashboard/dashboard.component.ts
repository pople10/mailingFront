import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { EmailService } from 'app/services/email.service';
import { HandleResponseService } from 'app/services/handle-response.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  emailForm:FormGroup;
  dataSent:boolean=false;
  submit:boolean=false;

  body:string;
  isConfiguration:boolean=false;

  host:string=null;
  port:number=null;
  ssl:boolean=null;
  user:string=null;
  password:string=null;

  constructor(private formBuilder:FormBuilder,private emailService:EmailService,private handleService:HandleResponseService) { }
  ngOnInit() {
    this.emailForm=this.formBuilder.group ({
      subject: ["", [Validators.required]],
      sentMail: ["", [Validators.required,Validators.email]],
      sentName: ["", Validators.required],
      replyMail: [""],
      replyName:[""],
      emailRecipient:[""],
      emailCc:[""],
      emailBcc:[""]
    });
  }

  toggleConf(event:MatCheckboxChange)
  {
    this.isConfiguration=event.checked;
  }

  toggleSsl(event:MatCheckboxChange)
  {
    this.ssl=event.checked;
  }

  get form()
  {
    return this.emailForm.controls;
  }

  send()
  {
    this.submit=true;
    if(this.emailForm.valid)
    {
      if(!this.body||this.body.trim()=="")
      {
        Swal.fire({
            title: 'Are you sure?',
            text: "The body is empty!",
            icon: 'warning'
        });
        return;
      }
      let data:object= {}
      if(this.isConfiguration)
        {
              if(this.ssl!=null)
                data["isSSL"]=""+this.ssl;
              if(this.host!=null&&this.host.trim()!="")
                data["host"]=this.host;
              if(this.port!=null&&this.port!=0)
                data["port"]=this.port;
              if(this.user!=null&&this.user.trim()!="")
                data["user"]=this.user;
              if(this.password!=null&&this.password.trim()!="")
                data["pass"]=this.password;
        }
      data["body"]=this.body;
      data={...data,...this.emailForm.value};
      data={...data,emailRecipient:data["emailRecipient"].split("\n").filter(e=>e.trim()!="")};
      data={...data,emailCc:data["emailCc"].split("\n").filter(e=>e.trim()!="")};
      data={...data,emailBcc:data["emailBcc"].split("\n").filter(e=>e.trim()!="")};
      this.dataSent=true;
      this.emailService.sendMail(data).subscribe(response=>{
          this.handleService.handleSuccess(response);
      },err=>{this.handleService.handleError(err);})
      .add(()=>{this.dataSent=false;this.submit=false;});
    }
    else
    {
      Swal.fire({
        title: 'Warning',
        text: "The form is not fully valid, check fields!",
        icon: 'warning'
    });
    }
  }

}
