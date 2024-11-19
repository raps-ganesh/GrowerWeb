import { Routes } from '@angular/router';
import { RoleGuard } from '../services/role.guard';
import { AddEditComponent } from './admin/users/add-edit/add-edit.component';
import { UsersComponent } from './admin/users/users.component';
import { DocumentListComponent } from './documents/document-list/document-list.component';
import { ManageDocumentsComponent } from './documents/manage-documents/manage-documents.component';
import { UploadDocumentComponent } from './documents/manage-documents/upload-document/upload-document.component';
import { GrowerQualitySummaryDetailedComponent } from './reports/grower-quality-summary-detailed/grower-quality-summary-detailed.component';
import { WeighMasterCertificateComponent } from './reports/grower-quality-summary-detailed/weigh-master-certificate/weigh-master-certificate.component';
import { PaymentCalculationReportComponent } from './reports/payment-calculation-report/payment-calculation-report.component';
import { ReceivingTicketsReportComponent } from './reports/receiving-tickets-report/receiving-tickets-report.component';
import { DehydratorDeliveriesByManifestReportComponent } from './reports/dehydrator-deliveries-by-manifest-report/dehydrator-deliveries-by-manifest-report.component';
import { DehydratorDeliveryByGrowerAccountComponent } from './reports/dehydrator-delivery-by-grower-account/dehydrator-delivery-by-grower-account.component';
import { ResetPasswordComponent } from './admin/users/reset-password/reset-password.component';
import { ReceivingWeighMasterCertificateComponent } from './reports/receiving-tickets-report/receiving-weigh-master-certificate/receiving-weigh-master-certificate.component';

const Routing: Routes = [
  {
    path: 'receivingticket/weighmastercertificate/:copy/:receivingTicketId',
    component: ReceivingWeighMasterCertificateComponent,
  },
  {
    path: 'change-password',
    //canActivate: [RoleGuard],
    data: {
      expectedRole: ['', ''],
    },
    component: ResetPasswordComponent,
  },
  {
    path: 'documents/growers',
    //canActivate: [RoleGuard],
    data: {
      expectedRole: ['', ''],
    },
    component: DocumentListComponent,
  },
  {
    path: 'documents/dehydrators',
    //canActivate: [RoleGuard],
    data: {
      expectedRole: ['', ''],
    },
    component: DocumentListComponent,
  },
  {
    path: 'documents/Upload/:id1',
    canActivate: [RoleGuard],
    data: {
      expectedRole: ['Administrators', 'Internal Users'],
    },
    component: UploadDocumentComponent,
  },
  {
    path: 'documents/Upload',
    canActivate: [RoleGuard],
    data: {
      expectedRole: ['Administrators', 'Internal Users'],
    },
    component: UploadDocumentComponent,
  },
  {
    path: 'documents',
    canActivate: [RoleGuard],
    data: {
      expectedRole: ['Administrators', 'Internal Users'],
    },
    component: ManageDocumentsComponent,
  },
  {
    path: 'users',
    canActivate: [RoleGuard],
    data: {
      expectedRole: ['Administrators', 'Internal Users'],
    },
    component: UsersComponent,
  },
  {
    path: 'users/add',
    canActivate: [RoleGuard],
    data: {
      expectedRole: ['Administrators', 'Internal Users'],
    },
    component: AddEditComponent,
  },
  {
    path: 'users/edit/:id1',
    canActivate: [RoleGuard],
    data: {
      expectedRole: ['Administrators', 'Internal Users'],
    },
    component: AddEditComponent,
  },
  {
    path: 'reports/delivery',
    //canActivate: [RoleGuard],
    data: {
      expectedRole: ['', ''],
    },
    component: PaymentCalculationReportComponent,
  },
  {
    path: 'reports/december',
    //canActivate: [RoleGuard],
    data: {
      expectedRole: ['', ''],
    },
    component: PaymentCalculationReportComponent,
  },
  {
    path: 'reports/february',
    //canActivate: [RoleGuard],
    data: {
      expectedRole: ['', ''],
    },
    component: PaymentCalculationReportComponent,
  },
  {
    path: 'reports/may',
    //canActivate: [RoleGuard],
    data: {
      expectedRole: ['', ''],
    },
    component: PaymentCalculationReportComponent,
  },
  {
    path: 'reports/final',
    //canActivate: [RoleGuard],
    data: {
      expectedRole: ['', ''],
    },
    component: PaymentCalculationReportComponent,
  },
  {
    path: 'reports/trueup',
    //canActivate: [RoleGuard],
    data: {
      expectedRole: ['', ''],
    },
    component: PaymentCalculationReportComponent,
  },
  {
    path: 'reports/spot',
    //canActivate: [RoleGuard],
    data: {
      expectedRole: ['', ''],
    },
    component: PaymentCalculationReportComponent,
  },
  {
    path: 'reports/deferred',
    //canActivate: [RoleGuard],
    data: {
      expectedRole: ['', ''],
    },
    component: PaymentCalculationReportComponent,
  },
  {
    path: 'reports/yearend',
    //canActivate: [RoleGuard],
    data: {
      expectedRole: ['', ''],
    },
    component: PaymentCalculationReportComponent,
  },
  {
    path: 'reports/deliveryprogression',
    //canActivate: [RoleGuard],
    data: {
      expectedRole: ['', ''],
    },
    component: PaymentCalculationReportComponent,
  },
  {
    path: 'reports/receivingticket',
    //canActivate: [RoleGuard],
    data: {
      expectedRole: ['', ''],
    },
    component: ReceivingTicketsReportComponent,
  },
  {
    path: 'reports/gradingdatareport',
    //canActivate: [RoleGuard],
    data: {
      expectedRole: ['', ''],
    },
    component: GrowerQualitySummaryDetailedComponent,
  },
  {
    path: 'reports/dehehydratordeliverybymanifest',
    //canActivate: [RoleGuard],
    data: {
      expectedRole: ['', ''],
    },
    component: DehydratorDeliveriesByManifestReportComponent,
  },
  {
    path: 'reports/dehydratordeliverybygroweraccount',
    //canActivate: [RoleGuard],
    data: {
      expectedRole: ['', ''],
    },
    component: DehydratorDeliveryByGrowerAccountComponent,
  },
  {
    path: 'reports/gradingdatareport/weighmastercertificate/:id',
    component: WeighMasterCertificateComponent,
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
