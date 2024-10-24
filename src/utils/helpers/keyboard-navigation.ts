/**
 * Get the focused item in the prefix list.
 * @param {HTMLDivElement} prefixListElement - The prefix list element.
 * @returns {HTMLAnchorElement | null} The focused item or the first item if no item is focused.
 */
export const getFocusedItem = (prefixListElement: HTMLDivElement): HTMLAnchorElement | null => {
  const focusedItem = document.activeElement as HTMLElement;

  // if focused item is not a dropdown item
  if (!focusedItem?.matches('.prefix-dropdown_item') && focusedItem?.tagName !== 'A') {
    // return first item in dropdown
    return prefixListElement.querySelector<HTMLAnchorElement>('.prefix-dropdown_item');
  }

  return focusedItem as HTMLAnchorElement;
};

/**
 * Handle the arrow down keydown event for the prefix list.
 * @param {HTMLDivElement | null} prefixListElement - The prefix list element.
 */
export const handleArrowDownKeydown = (prefixListElement: HTMLDivElement | null) => {
  if (!prefixListElement) return;

  const focusedItem = getFocusedItem(prefixListElement);

  if (!focusedItem) return;

  const nextItem = focusedItem.nextElementSibling as HTMLAnchorElement | null;
  if (nextItem) {
    nextItem.focus();
  }
};

/**
 * Handle the arrow up keydown event for the prefix list.
 * @param {HTMLDivElement | null} prefixListElement - The prefix list element.
 */
export const handleArrowUpKeydown = (prefixListElement: HTMLDivElement | null) => {
  if (!prefixListElement) return;

  const focusedItem = getFocusedItem(prefixListElement);

  if (!focusedItem) return;

  const previousItem = focusedItem.previousElementSibling as HTMLAnchorElement | null;
  if (previousItem) {
    previousItem.focus();
  }
};

/**
 * Handle the Enter keydown event for the prefix list.
 * @param {HTMLDivElement | null} prefixListElement - The prefix list element.
 */
export const handleEnterKeydown = (prefixListElement: HTMLDivElement | null) => {
  if (!prefixListElement) return;

  const focusedItem = getFocusedItem(prefixListElement);
  if (!focusedItem) return;

  focusedItem.click();
};

/**
 * Handle the Space keydown event for the prefix list.
 * @param {HTMLDivElement | null} prefixListElement - The prefix list element.
 */
export const handleSpaceKeydown = (prefixListElement: HTMLDivElement | null) => {
  if (!prefixListElement) return;

  const focusedItem = getFocusedItem(prefixListElement);
  if (!focusedItem) return;

  focusedItem.click();
};

/**
 * Handle the Tab keydown event for the prefix list.
 * @param {HTMLDivElement | null} prefixListElement - The prefix list element.
 */
export const handleTabKeydown = (prefixListElement: HTMLDivElement | null) => {
  if (!prefixListElement) return;

  const focusedItem = getFocusedItem(prefixListElement);
  if (!focusedItem) return;

  focusedItem.blur();
};

/**
 * Handle the search for the country by the input value.
 * @param {HTMLDivElement} prefixListElement - The prefix list element.
 * @param {string} key - The key pressed.
 */
export const handleSearchCountry = (prefixListElement: HTMLDivElement, key: string) => {
  if (!prefixListElement || !key) return;
  if (key.match(/^[a-z]$/i)) {
    const firstItemWithLetter = searchCountry(prefixListElement, key.toUpperCase());

    if (firstItemWithLetter) {
      firstItemWithLetter.focus();
    }
  }
};

/**
 * Search for a country in the dropdown list by the first letter.
 * @param {HTMLDivElement | null} dropdownList - The dropdown list element.
 * @param {string} searchQuery - The search query (first letter of the country name).
 * @returns {HTMLAnchorElement | undefined} The first matching country item, or undefined if not found.
 */
export const searchCountry = (dropdownList: HTMLDivElement | null, searchQuery: string) => {
  if (!dropdownList) return;
  const listItems = dropdownList.querySelectorAll<HTMLAnchorElement>('.prefix-dropdown_item');

  // find all items that start with the search query and go to next when the same letter is pressed
  for (const item of listItems) {
    const label = item.querySelector<HTMLDivElement>('[data-element="value"]');

    if (!label) continue;

    const labelText = label.textContent || '';

    if (labelText.startsWith(searchQuery)) {
      return item;
    }
  }
};
