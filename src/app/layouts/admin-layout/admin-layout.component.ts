import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy, PopStateEvent } from '@angular/common';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import PerfectScrollbar from 'perfect-scrollbar';
import * as JQUERY from "jquery";
import { filter, Subscription } from 'rxjs';
import { UserService } from 'app/services/user.service';
import { HandleResponseService } from 'app/services/handle-response.service';
import { AfterContentInit } from '@angular/core';

declare var $: any;
@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit {
  private _router: Subscription;
  private lastPoppedUrl: string;
  private yScrollStack: number[] = [];

  constructor( public location: Location, private router: Router,private userService:UserService,private handleService:HandleResponseService) {}

  ngOnInit() {
      const isWindows = navigator.platform.indexOf('Win') > -1 ? true : false;

      if (isWindows && !document.getElementsByTagName('body')[0].classList.contains('sidebar-mini')) {
          // if we are on windows OS we activate the perfectScrollbar function

          document.getElementsByTagName('body')[0].classList.add('perfect-scrollbar-on');
      } else {
          document.getElementsByTagName('body')[0].classList.remove('perfect-scrollbar-off');
      }
      const elemMainPanel = <HTMLElement>document.querySelector('.main-panel');
      const elemSidebar = <HTMLElement>document.querySelector('.sidebar .sidebar-wrapper');

      this.location.subscribe((ev:PopStateEvent) => {
          this.lastPoppedUrl = ev.url;
      });
       this.router.events.subscribe((event:any) => {
          if (event instanceof NavigationStart) {
             if (event.url != this.lastPoppedUrl)
                 this.yScrollStack.push(window.scrollY);
         } else if (event instanceof NavigationEnd) {
             if (event.url == this.lastPoppedUrl) {
                 this.lastPoppedUrl = undefined;
                 window.scrollTo(0, this.yScrollStack.pop());
             } else
                 window.scrollTo(0, 0);
         }
      });
      this._router = this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
           elemMainPanel.scrollTop = 0;
           elemSidebar.scrollTop = 0;
      });
      if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
          let ps = new PerfectScrollbar(elemMainPanel);
          ps = new PerfectScrollbar(elemSidebar);
      }

      const window_width = JQUERY(window).width();
      let JQUERYsidebar = JQUERY('.sidebar');
      let JQUERYsidebar_responsive = JQUERY('body > .navbar-collapse');
      let JQUERYsidebar_img_container = JQUERYsidebar.find('.sidebar-background');


      if(window_width > 767){
          if(JQUERY('.fixed-plugin .dropdown').hasClass('show-dropdown')){
              JQUERY('.fixed-plugin .dropdown').addClass('open');
          }

      }

      JQUERY('.fixed-plugin a').click(function(event){
        // Alex if we click on switch, stop propagation of the event, so the dropdown will not be hide, otherwise we set the  section active
          if(JQUERY(this).hasClass('switch-trigger')){
              if(event.stopPropagation){
                  event.stopPropagation();
              }
              else if(window.event){
                 window.event.cancelBubble = true;
              }
          }
      });

      JQUERY('.fixed-plugin .badge').click(function(){
          let JQUERYfull_page_background = JQUERY('.full-page-background');


          JQUERY(this).siblings().removeClass('active');
          JQUERY(this).addClass('active');

          var new_color = JQUERY(this).data('color');

          if(JQUERYsidebar.length !== 0){
              JQUERYsidebar.attr('data-color', new_color);
          }

          if(JQUERYsidebar_responsive.length != 0){
              JQUERYsidebar_responsive.attr('data-color',new_color);
          }
      });

      JQUERY('.fixed-plugin .img-holder').click(function(){
          let JQUERYfull_page_background = JQUERY('.full-page-background');

          JQUERY(this).parent('li').siblings().removeClass('active');
          JQUERY(this).parent('li').addClass('active');


          var new_image = JQUERY(this).find("img").attr('src');

          if(JQUERYsidebar_img_container.length !=0 ){
              JQUERYsidebar_img_container.fadeOut('fast', function(){
                 JQUERYsidebar_img_container.css('background-image','url("' + new_image + '")');
                 JQUERYsidebar_img_container.fadeIn('fast');
              });
          }

          if(JQUERYfull_page_background.length != 0){

              JQUERYfull_page_background.fadeOut('fast', function(){
                 JQUERYfull_page_background.css('background-image','url("' + new_image + '")');
                 JQUERYfull_page_background.fadeIn('fast');
              });
          }

          if(JQUERYsidebar_responsive.length != 0){
              JQUERYsidebar_responsive.css('background-image','url("' + new_image + '")');
          }
      });
  }
  ngAfterViewInit() {
      this.runOnRouteChange();
  }
  isMaps(path){
      var titlee = this.location.prepareExternalUrl(this.location.path());
      titlee = titlee.slice( 1 );
      if(path == titlee){
          return false;
      }
      else {
          return true;
      }
  }
  runOnRouteChange(): void {
    if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
      const elemMainPanel = <HTMLElement>document.querySelector('.main-panel');
      const ps = new PerfectScrollbar(elemMainPanel);
      ps.update();
    }
  }
  isMac(): boolean {
      let bool = false;
      if (navigator.platform.toUpperCase().indexOf('MAC') >= 0 || navigator.platform.toUpperCase().indexOf('IPAD') >= 0) {
          bool = true;
      }
      return bool;
  }

  showNotification(from, align,name){
    $.notify({
        icon: "notifications",
        message: `Welcome back JQUERY{name}, do a great job!`

    },{
        type: 'success',
        timer: 4000,
        placement: {
            from: from,
            align: align
        },
        template: '<div data-notify="container" class="col-xl-4 col-lg-4 col-11 col-sm-4 col-md-4 alert alert-{0} alert-with-icon" role="alert">' +
          '<button mat-button  type="button" aria-hidden="true" class="close mat-button" data-notify="dismiss">  <i class="material-icons">close</i></button>' +
          '<i class="material-icons" data-notify="icon">notifications</i> ' +
          '<span data-notify="title">{1}</span> ' +
          '<span data-notify="message">{2}</span>' +
          '<div class="progress" data-notify="progressbar">' +
            '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
          '</div>'  +
        '</div>'
    });
}


}
