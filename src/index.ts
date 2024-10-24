import { addListener, closeDropdown } from '@finsweet/ts-utils';

import { fetchCountries, fetchIpInfo } from '$utils/api';
import {
  handleArrowDownKeydown,
  handleArrowUpKeydown,
  handleEnterKeydown,
  handleSearchCountry,
  handleSpaceKeydown,
  handleTabKeydown,
} from '$utils/helpers';
import type { Country, IpInfo } from '$utils/types';

let selectedCountry: Country | null = null;
let selectedCountryElement: HTMLElement | null = null;
let currentUserLocationInfo: IpInfo | null = null;

window.Webflow ||= [];
window.Webflow.push(async () => {
  const countries = await fetchCountries();
  console.log('countries:', countries);

  currentUserLocationInfo = await fetchIpInfo();
  if (!currentUserLocationInfo) {
    console.error('User location not found');
    return;
  }
  console.log('user location:', currentUserLocationInfo);

  const dropdownToggleElement = document.querySelector<HTMLDivElement>('#w-dropdown-toggle-0');
  if (!dropdownToggleElement) {
    console.error('Dropdown toggle element not found');
    return;
  }

  dropdownToggleElement.focus();

  populateCountryList(countries);
  // setDefaultSelectedCountry();
  if (!selectedCountry) {
    console.error('Default Selected country not found');
    return;
  }
  setSelectedCountry(selectedCountry);
  // navigateUsingArrows();

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

  watchPrefixList(prefixListWrapperElement, prefixListElement, dropdownToggleElement);
});

// populate the country list
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
    const prefixListItemClone = prefixListItemElement.cloneNode(true) as HTMLAnchorElement; // todo: use HTMLAnchorElement
    // flag element
    const itemFlagElement =
      prefixListItemClone.querySelector<HTMLImageElement>('[data-element="flag"]');
    // value element
    const itemValueElement = prefixListItemClone.querySelector('[data-element="value"]');

    if (!itemFlagElement || !itemValueElement) {
      console.error('Prefix list item element not found');
      return;
    }

    itemFlagElement.src = country.flags.svg;
    itemValueElement.textContent = country.cca2;
    // set selected country node as focused / selected item
    if (currentUserLocationInfo?.country_code === country.cca2) {
      setSelectedCountry(country, prefixListItemClone);
    }
    prefixListElement.appendChild(prefixListItemClone);

    // add event listener to the prefix list item
    prefixListItemClone.addEventListener('click', () => {
      // close the dropdown and focus the dropdown toggle after selecting a country
      closeDropdown(prefixListWrapperElement, true);

      // Change dropdown toggle text to the country idd root and suffix
      setSelectedCountry(country, prefixListItemClone);
    });
  });

  // remove the original prefix list item template
  prefixListItemElement.remove();
};

// Set the current user location as the default selected value
const setSelectedCountry = (country: Country, countryNode?: HTMLAnchorElement) => {
  selectedCountry = country;
  // remove w--current class from the previous selected country
  selectedCountryElement?.classList.remove('w--current');
  if (countryNode) selectedCountryElement = countryNode;

  console.log('selectedCountry:', selectedCountry);

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

  if (!selectedCountry) {
    console.error('Current country not found');
    return;
  }

  itemFlagElement.src = selectedCountry.flags.svg;
  const callingCode =
    selectedCountry.idd.suffixes.length > 1
      ? selectedCountry.idd.root
      : `${selectedCountry.idd.root}${selectedCountry.idd.suffixes[0]}`;
  itemValueElement.textContent = callingCode;

  // set the value of the input[name=countryCode] to the country code
  const countryCodeInputElement =
    document.querySelector<HTMLInputElement>('input[name=countryCode]');
  if (!countryCodeInputElement) {
    console.error('Country code input element not found');
    return;
  }
  countryCodeInputElement.value = country.cca2;
};

// navigate using the Arrows, Enter, Space and Tab keys.
const navigateUsingArrows = () => {
  const prefixListElement = document.querySelector<HTMLDivElement>('#w-dropdown-list-0');
  if (!prefixListElement) {
    console.error('Prefix list element not found');
    return;
  }

  addListener(prefixListElement, 'keydown', (event: KeyboardEvent) => {
    event.preventDefault();
    const { key } = event;

    switch (key) {
      case 'ArrowDown':
        handleArrowDownKeydown(prefixListElement);
        break;
      case 'ArrowUp':
        handleArrowUpKeydown(prefixListElement);
        break;
      case 'Enter':
        handleEnterKeydown(prefixListElement);
        break;
      case 'Space':
        handleSpaceKeydown(prefixListElement);
        break;
      case 'Tab':
        handleTabKeydown(prefixListElement);
        break;
      default:
        // search for the country by the input value
        handleSearchCountry(prefixListElement, key);
        break;
    }
  });
};

// scroll to the selected country element
const scrollToSelectedCountry = () => {
  selectedCountryElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

// Observer for the selected country element
const watchPrefixList = (
  element: HTMLDivElement,
  dropdownList: HTMLDivElement,
  dropdownToggle: HTMLDivElement
) => {
  const observer = new MutationObserver((mutationsList) => {
    mutationsList.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        const isOpen = element.classList.contains('w--open');

        focusSelectedCountry();

        if (isOpen) {
          scrollToSelectedCountry();
          dropdownList.ariaHidden = 'false';
          dropdownToggle.ariaExpanded = 'true';
        } else {
          dropdownToggle.focus();
          dropdownList.ariaHidden = 'true';
          dropdownToggle.ariaExpanded = 'false';
        }
      }
    });
  });
  observer.observe(element, { attributes: true });
};

const focusSelectedCountry = () => {
  console.log('focusing selected country', selectedCountryElement);
  selectedCountryElement?.focus();
  selectedCountryElement?.classList.add('w--current');
  selectedCountryElement?.setAttribute('tabindex', '0');
};
