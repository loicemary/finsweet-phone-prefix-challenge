import type { Country, IpInfo } from './types';

/**
 * Get the list of countries
 * @returns {Promise<Country[]>}
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
 * Get all countries from the server and return them
 * @returns {Promise<IpInfo | null>}
 */
export async function fetchIpInfo(): Promise<IpInfo | null> {
  try {
    const response = await fetch('https://ipapi.co/json/');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const userLocation = await response.json(); // Store the response in a variable
    return userLocation; // Return the user location
  } catch (error) {
    console.error('Error fetching user location:', error);
    return null;
  }
}
