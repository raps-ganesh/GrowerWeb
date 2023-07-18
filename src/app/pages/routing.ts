import { Routes } from '@angular/router';
import { AddEditComponent } from './admin/users/add-edit/add-edit.component';
import { UsersComponent } from './admin/users/users.component';
import { ManageDocumentsComponent } from './documents/manage-documents/manage-documents.component';
import { PaymentCalculationReportComponent } from './reports/payment-calculation-report/payment-calculation-report.component';

const Routing: Routes = [
  {
    path: 'documents',
    //canActivate: [RoleGuard],
    data: {
      expectedRole: ['SEC_NPS_REPORT_ADMIN', 'SEC_NPS_REPORT_CROPPAYMENT']
    }, component: ManageDocumentsComponent
  },
  {
    path: 'users',
    //canActivate: [RoleGuard],
    data: {
      expectedRole: ['SEC_NPS_REPORT_ADMIN', 'SEC_NPS_REPORT_CROPPAYMENT']
    }, component: UsersComponent
  },
  {
    path: 'users/addedit',
    //canActivate: [RoleGuard],
    data: {
      expectedRole: ['SEC_NPS_REPORT_ADMIN', 'SEC_NPS_REPORT_CROPPAYMENT']
    }, component: AddEditComponent
  },
  {
    path: 'users/addedit/:id1',
    //canActivate: [RoleGuard],
    data: {
      expectedRole: ['SEC_NPS_REPORT_ADMIN', 'SEC_NPS_REPORT_CROPPAYMENT']
    }, component: AddEditComponent
  },
  {
    path: 'delivery',
    //canActivate: [RoleGuard],
    data: {
      expectedRole: ['SEC_NPS_REPORT_ADMIN', 'SEC_NPS_REPORT_CROPPAYMENT']
    }, component: PaymentCalculationReportComponent
  },
  {
    path: 'febprogress',
    //canActivate: [RoleGuard],
    data: {
      expectedRole: ['SEC_NPS_REPORT_ADMIN', 'SEC_NPS_REPORT_CROPPAYMENT']
    }, component: PaymentCalculationReportComponent
  },
  {
    path: 'spotemf',
    //canActivate: [RoleGuard],
    data: {
      expectedRole: ['SEC_NPS_REPORT_ADMIN', 'SEC_NPS_REPORT_CROPPAYMENT']
    }, component: PaymentCalculationReportComponent
  },
  {
    path: 'mayprogress',
    //canActivate: [RoleGuard],
    data: {
      expectedRole: ['SEC_NPS_REPORT_ADMIN', 'SEC_NPS_REPORT_CROPPAYMENT']
    }, component: PaymentCalculationReportComponent
  },
  {
    path: 'finalpayment',
    //canActivate: [RoleGuard],
    data: {
      expectedRole: ['SEC_NPS_REPORT_ADMIN', 'SEC_NPS_REPORT_CROPPAYMENT']
    },
    component: PaymentCalculationReportComponent,
  },
  
  
  
  
  
  
  {
    path: 'document',
    loadChildren: () =>
      import('./documents/documents.module').then((m) => m.DocumentsModule),
  },
  
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminModule),
  },
  {
    path: 'reportsdashboard',
    loadChildren: () =>
      import('./reports/reports.module').then((m) => m.ReportsModule),
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'builder',
    loadChildren: () =>
      import('./builder/builder.module').then((m) => m.BuilderModule),
  },
  {
    path: 'crafted/pages/profile',
    loadChildren: () =>
      import('../modules/profile/profile.module').then((m) => m.ProfileModule),
  },
  {
    path: 'crafted/account',
    loadChildren: () =>
      import('../modules/account/account.module').then((m) => m.AccountModule),
  },
  {
    path: 'crafted/pages/wizards',
    loadChildren: () =>
      import('../modules/wizards/wizards.module').then((m) => m.WizardsModule),
  },
  {
    path: 'crafted/widgets',
    loadChildren: () =>
      import('../modules/widgets-examples/widgets-examples.module').then(
        (m) => m.WidgetsExamplesModule
      ),
  },
  {
    path: 'apps/chat',
    loadChildren: () =>
      import('../modules/apps/chat/chat.module').then((m) => m.ChatModule),
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'error/404',
  },
];

export { Routing };
