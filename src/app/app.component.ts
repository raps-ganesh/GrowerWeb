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
      alert(message);
      this.auth.logout();
      window.location.reload();
    }
    );
  }

  ngOnInit() {
    this.modeService.init();
  }
  checkTimeOut() {
    this.timeoutId = setTimeout(
      () => {
        this.router.url != "/auth/login" ? this.userInactive.next("User has been inactive for 20 minutes") : null;
        localStorage.removeItem('loggedinUser');
        localStorage.removeItem('UserId');
        localStorage.removeItem('JDENumber');
        localStorage.removeItem('loggedinUserRoles');
        localStorage.removeItem('loggedinData');
        localStorage.removeItem('apitkn');
        localStorage.removeItem('AuthenticationType');
        localStorage.removeItem('SelectedAccount');
      }, 1200000);
  }
  @HostListener('window:keydown')
  @HostListener('window:mousedown')
  checkUserActivity() {
    clearTimeout(this.timeoutId);
    localStorage.setItem("LastActive", new Date().toString());
    this.checkTimeOut();
  }
}
