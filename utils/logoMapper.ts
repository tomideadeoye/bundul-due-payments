// Map service names to their corresponding logo imports
export const serviceLogoMap: { [key: string]: any } = {
  'Netflix': require('../assets/images/logos/netflix.png'),
  'Spotify': require('../assets/images/logos/spotify-logo-png-7053.png'),
  'Disney+': require('../assets/images/disney .webp'),
  'Amazon Prime': require('../assets/images/logos/Amazon_Prime_logo_(2024).svg.webp'),
  'Apple One': require('../assets/images/logos/Apple_One (1).svg'),
  'Hulu': require('../assets/images/logos/hulu.png'),
  'Microsoft 365': require('../assets/images/logos/microsoft-365-copilot-logo-png_seeklogo-621257.png'),
  'Adobe Creative Suite': require('../assets/images/logos/adob.jpeg'),
};

// Function to get logo for a service
export const getLogoForService = (service: string) => {
  return serviceLogoMap[service] || null;
};