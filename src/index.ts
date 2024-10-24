import { initDropdownList } from '$utils/helpers';

window.Webflow ||= [];
window.Webflow.push(async () => {
  await initDropdownList();
});
