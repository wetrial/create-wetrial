import { IBestAFSRoute } from '@umijs/plugin-layout';
import { MembershipShareRoutes } from '../src/modules/membership-share';
<% if (theme==='platform-admin') { %>import { AuditLoggingPlatformAdminRoutes } from '../src/modules/audit-logging-platform-admin';
import { MembershipPlatformAdminRoutes } from '../src/modules/membership-platform-admin';<% } %>
<% if (theme==='org-admin') { %>import { MembershipOrgAdminRoutes } from '../src/modules/membership-org-admin';<% } %>
<% if (!external.isApp) { %>import { <%= external.upperCaseName %>Routes } from '../src/modules/<%= external.lowerCaseName %>';<% } %>

// umi routes: https://umijs.org/zh/guide/router.html
const routes: IBestAFSRoute[]= [
  {
    path: '/',
    menu: {
      name: '欢迎',
      flatMenu: true,
    },
    routes: [
      {
        path: '/',
        redirect: '/<%= external.trimThemeLowerCaseName %>',
      },
      ...MembershipShareRoutes,
      <% if (theme==='platform-admin') { %>...MembershipPlatformAdminRoutes,
      ...AuditLoggingPlatformAdminRoutes,<% } %>
      <% if (theme==='org-admin') { %>...MembershipOrgAdminRoutes,<% } %>
      <% if (!external.isApp) { %>...<%= external.upperCaseName %>Routes,<% } %>
    ],
  },
      {
        component: '@/pages/exception/404',
      },
];

export default routes;
