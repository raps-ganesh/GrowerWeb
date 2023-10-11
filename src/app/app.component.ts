import { ChangeDetectionStrategy, Component, HostListener, OnInit } from '@angular/core';
import { TranslationService } from './modules/i18n';
// language list
import { locale as enLang } from './modules/i18n/vocabs/en';
import { locale as chLang } from './modules/i18n/vocabs/ch';
import { locale as esLang } from './modules/i18n/vocabs/es';
import { locale as jpLang } from './modules/i18n/vocabs/jp';
import { locale as deLang } from './modules/i18n/vocabs/de';
import { locale as frLang } from './modules/i18n/vocabs/fr';
import { ThemeModeService } from './_metronic/partials/layout/theme-mode-switcher/theme-mode.service';
import { Router } from '@angular/router';
import { AuthService } from './modules/auth';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { Console } from 'console';

@Component({
  // tslint:disable-next-line:component-selector
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'body[root]',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class AppComponent implements OnInit {
  timeoutId: any;
  userInactive: Subject<any> = new Subject();
  constructor(
    private translationService: TranslationService,
    private modeService: ThemeModeService,
    private auth: AuthService,
    private router: Router
  ) {
    // register translations
    this.translationService.loadTranslations(
      enLang,
      chLang,
      esLang,
      jpLang,
      deLang,
      frLang
    );
    this.checkTimeOut();
    this.userInactive.subscribe((message: any) => {
      var closeInSeconds = 10;
      Swal.fire({
        html: message,
        icon: 'warning',
        buttonsStyling: false,
        confirmButtonText: 'Log Out',
        customClass: {
          confirmButton: 'btn btn-danger',
          cancelButton: 'btn btn-success'
        },
        showCancelButton: true,
        cancelButtonText: 'Stay Signed In'
      }).then(function (result) {
        if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire("Activated!", "Session Reactivated", "success");
          closeInSeconds = 10;
        } else {
          localStorage.removeItem('loggedinUser');
          localStorage.removeItem('UserId');
          localStorage.removeItem('JDENumber');
          localStorage.removeItem('loggedinUserRoles');
          localStorage.removeItem('loggedinData');
          localStorage.removeItem('apitkn');
          localStorage.removeItem('AuthenticationType');
          localStorage.removeItem('SelectedAccount');
        }
      });

      (document.getElementById("timer") as HTMLInputElement).value = closeInSeconds.toString();
      setInterval(function () {
        (document.getElementById("timer") as HTMLInputElement).value = closeInSeconds.toString();
        closeInSeconds--;
        console.log(closeInSeconds);
        if (closeInSeconds < 0) {
          localStorage.removeItem('loggedinUser');
          localStorage.removeItem('UserId');
          localStorage.removeItem('JDENumber');
          localStorage.removeItem('loggedinUserRoles');
          localStorage.removeItem('loggedinData');
          localStorage.removeItem('apitkn');
          localStorage.removeItem('AuthenticationType');
          localStorage.removeItem('SelectedAccount');
        }
      }, 1000);
    });

  }

  ngOnInit() {
    this.modeService.init();
  }
  checkTimeOut() {
    this.timeoutId = setTimeout(
      () => {
        this.router.url != "/auth/login" ? this.userInactive.next("<div class='alert alert-warning' style='border: 0px !important;'>You\'re being timed out due to inactivity. Please choose to stay signed in or to logoff. </div> <div class='alert alert-danger' style='border: 0px !important;'>You will logged off automatically in<input type='text' readonly id='timer' class='alert-danger fw-bold' style='border: none!important;width: 20px;text-align:right;'/>seconds.<div>") : null;
      }, 1800000);
  }
  @HostListener('window:keydown')
  @HostListener('window:mousedown')
  checkUserActivity() {
    clearTimeout(this.timeoutId);
    localStorage.setItem("LastActive", new Date().toString());
    this.checkTimeOut();
  }
  @HostListener('window:beforeunload')
  async ngOnDestroy() {
    localStorage.removeItem('loggedinUser');
    localStorage.removeItem('UserId');
    localStorage.removeItem('JDENumber');
    localStorage.removeItem('loggedinUserRoles');
    localStorage.removeItem('loggedinData');
    localStorage.removeItem('apitkn');
    localStorage.removeItem('AuthenticationType');
    localStorage.removeItem('SelectedAccount');
  }
}
