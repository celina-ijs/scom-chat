import { application } from '@ijstech/components';
const moduleDir = application.currentModuleDir;

function fullPath(path: string): string {
  return `${moduleDir}/${path}`
};

export default {
  fullPath
};
