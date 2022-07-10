import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BACK_END_DOMAIN } from 'environments/env';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Clipboard } from '@angular/cdk/clipboard';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(private clipboard: Clipboard,private http:HttpClient,private router:Router) { }

  sendMail(loginData:any){
    return this.http.post<any>(`${BACK_END_DOMAIN}/mail/send`,loginData, 
    { headers: new HttpHeaders().set('Content-type', 'application/json') });
  }

  splitArray(data:any,limit:number,ind:number,comp:string):any
  {
    console.log("Spliting data for "+comp);
    let arr:string[]=data[comp];
    if(limit*ind>arr.length)
      {
        let fin =  {...data};
        fin[comp]=[];
        return fin;
      }
    let out:string[]=[];
    for(let i=ind*limit;i<(ind+1)*limit;i++)
    {
      if(i>arr.length)
        break;
      out.push(arr[i]);
    }
    let fin =  {...data,ind:ind};
    fin[comp]=out.filter(e=>e!=null);
    return fin;
  }

  copyRest(data:any,notCopy:string[],comp:string):string
  {
    console.log("Copying rest");
    let arr:string[]=data[comp];
    let out:string="";
    console.log(arr,notCopy);
    for(let i=0;i<arr.length;i++)
    {
      if(notCopy.includes(arr[i]))
        continue;
      out+=arr[i]+"\n";
    }
    return out;
  }
}
