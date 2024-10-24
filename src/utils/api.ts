import type { Country, IpInfo } from './types';

/**
 * Fetches the list of countries from the REST Countries API.
 * @returns {Promise<Country[]>} A promise that resolves to an array of Country objects.
 * @throws {Error} If there's an HTTP error or any other issue during the fetch operation.
 */
export async function fetchCountries(): Promise<Country[]> {
  try {
    const response = await fetch('https://restcountries.com/v3.1/all');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const countries = await response.json();
    return countries;
  } catch (error) {
    console.error('Error fetching countries:', error);
    return [];
  }
}

/**
 * Fetches IP information from the ipapi.co service.
 * @returns {Promise<IpInfo | null>} A promise that resolves to an IpInfo object if successful, or null if there's an error.
 * @throws {Error} If there's an HTTP error or any other issue during the fetch operation.
 */
export async function fetchIpInfo(): Promise<IpInfo | null> {
  try {
    const response = await fetch('https://ipapi.co/json/');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const userLocation = await response.json();
    return userLocation;
  } catch (error) {
    console.error('Error fetching user location:', error);
    return null;
  }
}
