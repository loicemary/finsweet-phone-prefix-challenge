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

/**
 * Initializes the dropdown list with countries and sets up event listeners.
 * @async
 */
export const initDropdownList = async () => {
  const countries = await fetchCountries();

  currentUserLocationInfo = await fetchIpInfo();
  if (!currentUserLocationInfo) {
    console.error('User location not found');
    return;
  }

  const dropdownToggleElement = document.querySelector<HTMLDivElement>('#w-dropdown-toggle-0');
  if (!dropdownToggleElement) {
    console.error('Dropdown toggle element not found');
    return;
  }

  // Add ARIA attributes to dropdown toggle
  dropdownToggleElement.setAttribute('role', 'combobox');
  dropdownToggleElement.setAttribute('aria-haspopup', 'listbox');
  dropdownToggleElement.setAttribute('aria-expanded', 'false');
  dropdownToggleElement.setAttribute('aria-controls', 'w-dropdown-list-0');

  dropdownToggleElement.focus();

  populateCountryList(countries);
  // setDefaultSelectedCountry();
  if (!selectedCountry) {
    console.error('Default Selected country not found');
    return;
  }
  setSelectedCountry(selectedCountry);
  navigateUsingArrows();

  const prefixListWrapperElement = document.querySelector<HTMLDivElement>('#w-dropdown-list-0');
  if (!prefixListWrapperElement) {
    console.error('Prefix list element not found');
    return;
  }

  // Add ARIA attributes to prefix list wrapper
  prefixListWrapperElement.setAttribute('role', 'listbox');
  prefixListWrapperElement.setAttribute('aria-hidden', 'true');

  const prefixListElement = prefixListWrapperElement.querySelector('div');
  if (!prefixListElement) {
    console.error('Prefix list element not found');
    return;
  }

  watchPrefixList(prefixListWrapperElement, prefixListElement, dropdownToggleElement);
};

/**
 * Populates the country list in the dropdown.
 * @param {Country[]} countries - Array of country objects to populate the list.
 */
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
  countries.forEach((country, index) => {
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

    // Add ARIA attributes to prefix list item
    prefixListItemClone.setAttribute('role', 'option');
    prefixListItemClone.setAttribute('aria-selected', 'false');
    prefixListItemClone.id = `country-option-${index}`;

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

/**
 * Sets the selected country in the dropdown.
 * @param {Country} country - The country object to set as selected.
 * @param {HTMLAnchorElement} [countryNode] - The DOM element representing the country in the list.
 */
const setSelectedCountry = (country: Country, countryNode?: HTMLAnchorElement) => {
  selectedCountry = country;
  // remove w--current class from the previous selected country
  selectedCountryElement?.classList.remove('w--current');
  if (countryNode) selectedCountryElement = countryNode;

  const dropdownToggleElement = document.querySelector('#w-dropdown-toggle-0');
  if (!dropdownToggleElement) {
    console.error('Dropdown toggle element not found');
    return;
  }

  // Update ARIA attributes for dropdown toggle
  dropdownToggleElement.setAttribute('aria-activedescendant', selectedCountryElement?.id || '');

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

  if (selectedCountryElement) {
    selectedCountryElement.setAttribute('aria-selected', 'false');
  }
  if (countryNode) {
    selectedCountryElement = countryNode;
    selectedCountryElement.setAttribute('aria-selected', 'true');
  }
};

/**
 * Sets up keyboard navigation for the dropdown list.
 */
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

/**
 * Scrolls the dropdown list to show the selected country.
 */
const scrollToSelectedCountry = () => {
  selectedCountryElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

/**
 * Sets up a MutationObserver to watch for changes in the dropdown list's state.
 * @param {HTMLDivElement} element - The dropdown list wrapper element.
 * @param {HTMLDivElement} dropdownList - The dropdown list element.
 * @param {HTMLDivElement} dropdownToggle - The dropdown toggle element.
 */
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
          dropdownList.setAttribute('aria-hidden', 'false');
          dropdownToggle.setAttribute('aria-expanded', 'true');
        } else {
          dropdownToggle.focus();
          dropdownList.setAttribute('aria-hidden', 'true');
          dropdownToggle.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });
  observer.observe(element, { attributes: true });
};

/**
 * Focuses the selected country in the dropdown list and updates its attributes.
 */
const focusSelectedCountry = () => {
  selectedCountryElement?.focus();
  selectedCountryElement?.classList.add('w--current');
  selectedCountryElement?.setAttribute('tabindex', '0');
  selectedCountryElement?.setAttribute('aria-selected', 'true');
};
