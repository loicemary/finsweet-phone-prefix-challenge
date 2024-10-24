import { initDropdownList } from '$utils/helpers';

window.Webflow ||= [];
window.Webflow.push(async () => {
  // Initialize the dropdown list
  await initDropdownList();
});
