import { User, Teacher } from '@/types';

// Default admin users
export const DEFAULT_ADMINS = [
  { username: 'saeed', password: 'Archimedes', role: 'admin' as const },
  { username: 'hassan', password: 'Archimedes', role: 'admin' as const }
];

// Default SMC user
export const DEFAULT_SMC = {
  username: 'school',
  password: 'sunnah',
  role: 'smc' as const
};

// School location for GPS verification
export const SCHOOL_LOCATION = {
  latitude: 7.743379,
  longitude: -2.082991,
  radius: 100 // meters
};

export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c;
};

export const isWithinSchoolRadius = (userLat: number, userLon: number): boolean => {
  const distance = calculateDistance(
    userLat, userLon,
    SCHOOL_LOCATION.latitude, SCHOOL_LOCATION.longitude
  );
  return distance <= SCHOOL_LOCATION.radius;
};

export const getCurrentTime = (): string => {
  return new Date().toLocaleTimeString('en-US', {
    hour12: true,
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getCurrentDate = (): string => {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const isLate = (time: string): boolean => {
  const [timeStr, period] = time.split(' ');
  const [hours, minutes] = timeStr.split(':').map(Number);
  const hour24 = period === 'PM' && hours !== 12 ? hours + 12 : 
                 period === 'AM' && hours === 12 ? 0 : hours;
  
  // Late if after 7:30 AM
  return hour24 > 7 || (hour24 === 7 && minutes > 30);
};