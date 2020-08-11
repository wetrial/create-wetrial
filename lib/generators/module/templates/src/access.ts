import { IKeyValue } from '@wetrial/core';
import { IGlobalProps } from '@/services/global.d';
<% if (theme==='platform-admin') { %>import { MembershipPlatformAdminPermissions } from '@/modules/membership-platform-admin';
import { AuditLoggingPlatformAdminPermissions } from '@/modules/audit-logging-platform-admin';<% } %>
<% if (theme==='org-admin') { %>import { MembershipOrgAdminPermissions } from '@/modules/membership-org-admin';<% } %>
<% if (!external.isApp) { %>import { <%= external.upperCaseName %>Permissions } from '@/modules/<%= external.lowerCaseName %>';<% } %>

export default (initialState: IGlobalProps={})=> {
  const { currentUser } = initialState;
  const allPermissions = {
    <% if (theme==='platform-admin') { %>...MembershipPlatformAdminPermissions,
    ...AuditLoggingPlatformAdminPermissions,<% } %>
    <% if (theme==='org-admin') { %>...MembershipOrgAdminPermissions,<% } %>
    <% if (!external.isApp) { %>...<%= external.upperCaseName %>Permissions,<% } %>
  };
  return dgFlatPermissions(allPermissions, currentUser?.permissions);
}

function dgFlatPermissions(
  allPermissions: IKeyValue,
  curPermissions: string[] = [],
): IKeyValue<boolean> {
  let result: IKeyValue<boolean> = {};
  // eslint-disable-next-line no-restricted-syntax
  for (const key in allPermissions) {
    if (allPermissions.hasOwnProperty(key)) {
      if (typeof allPermissions[key] === 'string') {
        result[allPermissions[key]] = curPermissions.indexOf(allPermissions[key]) !== -1;
      } else {
        const subResult = dgFlatPermissions(allPermissions[key], curPermissions);
        result = {
          ...result,
          ...subResult,
        };
      }
    }
  }
  return result;
}
