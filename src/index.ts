import { closeDropdown } from '@finsweet/ts-utils';

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
  const prefixListWrapperElement = document.querySelector<HTMLDivElement>('#w-dropdown-list-0');
  if (!prefixListWrapperElement) {
    console.error('Prefix list element not found');
    return;
  }
  const prefixListElement = prefixListWrapperElement.querySelector('div');
  if (!prefixListElement) {
    console.error('Prefix list element not found');
    return;
  }

  const prefixListItemElement = prefixListElement.querySelector('a');

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
    prefixListElement.appendChild(prefixListItemClone);

    // add event listener to the prefix list item
    prefixListItemClone.addEventListener('click', () => {
      // close the dropdown and focus the dropdown toggle after selecting a country
      closeDropdown(prefixListWrapperElement, true);
      // set the value of the input[name=countryCode] to the country code
      const countryCodeInputElement =
        document.querySelector<HTMLInputElement>('input[name=countryCode]');
      if (!countryCodeInputElement) {
        console.error('Country code input element not found');
        return;
      }
      countryCodeInputElement.value = country.cca2;

      // Change dropdown toggle text to the country idd root and suffix
      setSelectedValueOnDropdownToggle(country);
    });
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

// set selected value on dropdown toggle
const setSelectedValueOnDropdownToggle = (country: Country) => {
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

  itemFlagElement.src = country.flags.png;
  itemValueElement.textContent = country.idd.root + country.idd.suffixes[0];
};
