import { Injectable } from '@angular/core';
import Swal from "sweetalert2";

@Injectable({
  providedIn: 'root'
})
export class HandleResponseService {

  constructor() { }

  public handleError(error:any)
  {
    let msg="Something went wrong";
    if([422,401,403].includes(error?.status))
    {
      msg=error?.error?.error;
      if(error?.status==401)
      {
        Swal.fire(
          'Session',
          "Session has been expired or deleted",
          'warning'
        );
        return;
      }
    }
    Swal.fire(
      'Error',
        msg,
      'error'
    );
  }

  public handleSuccess(response)
  {
    let msg = response?.done;
    Swal.fire(
      'Success',
        msg,
      'success'
    );
  }
}
