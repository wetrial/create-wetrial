import { IKeyValue } from '@wetrial/core/types';
import <%= external.upperCaseName %>Permissions from '@config/modules/<%= external.lowerCaseName %>';

export default function(initialState: { permissions: string[] } = { permissions: [] }) {
  const { permissions } = initialState;
  const allPermissions = {
    ...<%= external.upperCaseName %>Permissions,
  };

  const flatPermissions = dgFlatPermissions(allPermissions, permissions);
  return flatPermissions;
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
