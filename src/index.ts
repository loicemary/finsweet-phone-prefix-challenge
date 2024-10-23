import { fetchCountries, fetchIpInfo } from '$utils/api';
import type { Country, IpInfo } from '$utils/types';

window.Webflow ||= [];
window.Webflow.push(async () => {
  const countries = await fetchCountries();
  console.log('countries:', countries);

  const userLocation = await fetchIpInfo();
  if (!userLocation) {
    console.error('User location not found');
    return;
  }
  console.log('user location:', userLocation);

  populateCountryList(countries);
  setDefaultSelectedValue(userLocation, countries);
});

const populateCountryList = (countries: Country[]) => {
  const prefixListWrapperElement = document.querySelector('#w-dropdown-list-0 > div');
  if (!prefixListWrapperElement) {
    console.error('Prefix list element not found');
    return;
  }
  const prefixListItemElement = prefixListWrapperElement.querySelector('a');

  if (!prefixListItemElement) {
    console.error('Prefix list item element not found');
    return;
  }

  // sort countries by country.cca2 alphabetically from A-Z
  countries.sort((a, b) => a.cca2.localeCompare(b.cca2));

  // loop through countries and set the prefix
  countries.forEach((country) => {
    const prefixListItemClone = prefixListItemElement.cloneNode(true) as HTMLElement; // todo: use HTMLAnchorElement
    // flag element
    const itemFlagElement =
      prefixListItemClone.querySelector<HTMLImageElement>('[data-element="flag"]');
    // value element
    const itemValueElement = prefixListItemClone.querySelector('[data-element="value"]');

    if (!itemFlagElement || !itemValueElement) {
      console.error('Prefix list item element not found');
      return;
    }

    itemFlagElement.src = country.flags.png;
    itemValueElement.textContent = country.cca2;
    prefixListWrapperElement.appendChild(prefixListItemClone);
  });

  // remove the original prefix list item template
  prefixListItemElement.remove();
};

// Set the current user location as the default selected value
const setDefaultSelectedValue = (userLocation: IpInfo, countries: Country[]) => {
  const dropdownToggleElement = document.querySelector('#w-dropdown-toggle-0');
  if (!dropdownToggleElement) {
    console.error('Dropdown toggle element not found');
    return;
  }
  // flag element
  const itemFlagElement =
    dropdownToggleElement.querySelector<HTMLImageElement>('[data-element="flag"]');
  // value element
  const itemValueElement = dropdownToggleElement.querySelector('[data-element="value"]');

  if (!itemFlagElement || !itemValueElement) {
    console.error('Prefix list item element not found');
    return;
  }

  const currentCountry = countries.find((country) => country.cca2 === userLocation.country_code);
  if (!currentCountry) {
    console.error('Current country not found');
    return;
  }

  itemFlagElement.src = currentCountry.flags.png;
  itemValueElement.textContent = currentCountry.idd.root + currentCountry.idd.suffixes[0];
};
