import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { EmailService } from 'app/services/email.service';
import { HandleResponseService } from 'app/services/handle-response.service';
import Swal from 'sweetalert2';
declare var $: any;

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

  limit:number=-1;
  timeout:number=20;
  limitType:string="emailBcc";
  timeouts:any[]=[];
  sentMails:string[]=[];

  alert(msg,badge)
  {
    
    $.notify({
      icon: "notifications",
      message: msg

  },{
      type: badge,
      timer: 2000,
      placement: {
          from: "top",
          align: "center"
      },
      template: '<div data-notify="container" class="col-xl-4 col-lg-4 col-11 col-sm-4 col-md-4 alert alert-{0} alert-with-icon" role="alert">' +
        '<button mat-button  type="button" aria-hidden="true" class="close mat-button" data-notify="dismiss">  <i class="material-icons">close</i></button>' +
        '<i class="material-icons" data-notify="icon">notifications</i> ' +
        '<span data-notify="title">{1}</span> ' +
        '<span data-notify="message">{2}</span>' +
        '<div class="progress" data-notify="progressbar">' +
          '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
        '</div>' +
        '<a href="{3}" target="{4}" data-notify="url"></a>' +
      '</div>'
  });
  }

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
      if(!this.limit||this.limit<0)
        return this.sendSimpleMail(data);
      if(!this.limitType)
      {
        Swal.fire({
          title: 'Warning',
            text: "Please select limit type!",
            icon: 'warning'
        });
        return;
      } 
      if(!this.timeout)
      {
        Swal.fire({
          title: 'Warning',
            text: "Please select time out between batch!",
            icon: 'warning'
        });
        return;
      }  
      let size:number=data[this.limitType].length;
      let i:number=0;
      console.log("Sending batches");
      this.dataSent=true;
      this.submit=true;
      let flag=true;
      this.timeouts=[];
      this.sentMails=[];
      while(i*this.limit<size&&flag)
      {
        let datos=this.emailService.splitArray(data,this.limit,i,this.limitType);
          let tm = setTimeout(async()=>{
            this.sendCustomMail(datos,datos["ind"],size).then((res:string[])=>{
              for(let j of res["data"])
              {
                this.sentMails.push(j);
              }
              this.alert("Batch number "+res["ind"]+" has been sent","success");
            }).catch(error=>{
                flag=false; 
                for(let i of this.timeouts)
                {
                  clearTimeout(i);
                }
                this.dataSent=false;
                this.submit=false;
                if(i==0)
                  i=1;
                Swal.fire({
                  title: 'Warning',
                    text: "We could not send all emails ("+(i-1)*this.limit+"/"+size+"):\n "+error,
                    icon: 'warning'
                });
                let out:string=this.emailService.copyRest(data,this.sentMails,this.limitType);
                this.injectData(out);
                this.alert("We have replaced the data we didnt send in "+this.limitType+" section","info");
            });
          },i*this.timeout*1000);
          this.timeouts.push(tm);
        i++;
      }
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

  injectData(data:string)
  {
    let pp={};
    pp[this.limitType]=data;
    this.emailForm.patchValue(pp);
  }
  



  sendSimpleMail(data):void
  {
    this.dataSent=true;
    this.emailService.sendMail(data).subscribe(response=>{
        this.handleService.handleSuccess(response);
    },err=>{this.handleService.handleError(err);})
    .add(()=>{this.dataSent=false;this.submit=false;});
  }

  sendCustomMail(data,i,size)
  {
    this.alert("Batch number "+i+" is going to be treated","info");
    console.log("Sending request for a batch "+i);
    return new Promise((resolve, reject) => {
      this.emailService.sendMail(data).subscribe(response=>{
        if((i+1)*this.limit>=size)
        {
          this.dataSent=false;
          this.submit=false;
          Swal.fire({
            title: 'Warning',
              text: "Operation done with success",
              icon: 'success'
          });
        }
        resolve({data:data[this.limitType],ind:i});
      },err=>{reject(err?.error?.error);});
    });
  }

}
