/**
 * Represents a country with various properties.
 */
export interface Country {
  /** The name of the country in different formats */
  name: {
    /** The common name of the country */
    common: string;
    /** The official name of the country */
    official: string;
    /** The native name of the country in different languages */
    nativeName: {
      eng: {
        official: string;
        common: string;
      };
    };
  };
  /** Top-level domains for the country */
  tld: string[];
  /** ISO 3166-1 alpha-2 country code */
  cca2: string;
  /** ISO 3166-1 numeric country code */
  ccn3: string;
  /** ISO 3166-1 alpha-3 country code */
  cca3: string;
  /** Whether the country is independent */
  independent: boolean;
  /** The status of the country */
  status: string;
  /** Whether the country is a member of the United Nations */
  unMember: boolean;
  /** The currencies used in the country */
  currencies: {
    [key: string]: {
      name: string;
      symbol: string;
    };
  };
  /** International Direct Dialing information */
  idd: {
    root: string;
    suffixes: string[];
  };
  /** The capital city(ies) of the country */
  capital: string[];
  /** Alternative spellings of the country name */
  altSpellings: string[];
  /** The region where the country is located */
  region: string;
  /** The languages spoken in the country */
  languages: {
    [key: string]: string;
  };
  /** Translations of the country name in various languages */
  translations: {
    [key: string]: {
      official: string;
      common: string;
    };
  };
  /** The latitude and longitude coordinates of the country */
  latlng: number[];
  /** Whether the country is landlocked */
  landlocked: boolean;
  /** The area of the country in square kilometers */
  area: number;
  /** Demonyms for the country's inhabitants */
  demonyms: {
    eng: {
      f: string;
      m: string;
    };
  };
  /** The country's flag emoji */
  flag: string;
  /** Links to maps of the country */
  maps: {
    googleMaps: string;
    openStreetMaps: string;
  };
  /** The population of the country */
  population: number;
  /** Information about car usage in the country */
  car: {
    signs: string[];
    side: string;
  };
  /** The timezones observed in the country */
  timezones: string[];
  /** The continents where the country is located */
  continents: string[];
  /** Links to the country's flag images */
  flags: {
    png: string;
    svg: string;
  };
  /** The coat of arms of the country */
  coatOfArms: object;
  /** The day when the week starts in the country */
  startOfWeek: string;
  /** Information about the capital city */
  capitalInfo: {
    latlng: number[];
  };
}

/**
 * Represents IP-related information for a location.
 */
export interface IpInfo {
  /** The IP address */
  ip: string;
  /** The network associated with the IP */
  network: string;
  /** The IP version (IPv4 or IPv6) */
  version: string;
  /** The city associated with the IP */
  city: string;
  /** The region associated with the IP */
  region: string;
  /** The region code */
  region_code: string;
  /** The country associated with the IP */
  country: string;
  /** The full name of the country */
  country_name: string;
  /** The two-letter country code */
  country_code: string;
  /** The three-letter country code */
  country_code_iso3: string;
  /** The capital city of the country */
  country_capital: string;
  /** The top-level domain of the country */
  country_tld: string;
  /** The continent code */
  continent_code: string;
  /** Whether the location is in the European Union */
  in_eu: boolean;
  /** The postal code (if available) */
  postal: string | null;
  /** The latitude of the location */
  latitude: number;
  /** The longitude of the location */
  longitude: number;
  /** The timezone of the location */
  timezone: string;
  /** The UTC offset of the timezone */
  utc_offset: string;
  /** The country calling code */
  country_calling_code: string;
  /** The currency code used in the country */
  currency: string;
  /** The name of the currency used in the country */
  currency_name: string;
  /** The languages spoken in the country */
  languages: string;
  /** The area of the country in square kilometers */
  country_area: number;
  /** The population of the country */
  country_population: number;
  /** The Autonomous System Number */
  asn: string;
  /** The organization associated with the IP */
  org: string;
}
