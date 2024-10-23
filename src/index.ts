import { fetchCountries, fetchIpInfo } from '$utils/api';

window.Webflow ||= [];
window.Webflow.push(async () => {
  const countries = await fetchCountries();
  
  console.log('countries:', countries);

  const userLocation = await fetchIpInfo();
  console.log('user location:', userLocation);

  console.log('webflow initialized');
});
