// Constants
import { ALL_VALID_CATEGORIES } from "@/assets/categories";

// Trending Count
export const formatTrendingCount = (num: number) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

// Convert to ISO Date and Time
export const isoDateTime = (value: string): string | null => {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return date.toISOString();
}

// Date Converter
export const dateConverter = (timestamp: string): string => {

  const date = new Date(timestamp);
  const now = new Date();

  // Difference in seconds
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  // Handle very recent or future dates
  if (diffInSeconds < 60) return 'Just now';

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInMonths = Math.floor(diffInDays / 30.44);
  const diffInYears = Math.floor(diffInDays / 365.25);

  // Helper for singular/plural
  const pluralize = (value: number, unit: string) =>
    `${value} ${unit}${value === 1 ? '' : 's'} ago`;

  // Logic Chain (Order matters!)
  if (diffInYears >= 1) {
    return pluralize(diffInYears, 'year');
  }
  if (diffInMonths >= 1) {
    return pluralize(diffInMonths, 'month');
  }
  if (diffInDays >= 7) {
    return pluralize(Math.floor(diffInDays / 7), 'week');
  }
  if (diffInDays === 1) {
    return 'Yesterday';
  }
  if (diffInDays > 1) {
    return pluralize(diffInDays, 'day');
  }
  if (diffInHours >= 1) {
    return pluralize(diffInHours, 'hour');
  }

  return pluralize(diffInMinutes, 'minute');
};

// Detect media type
export const detectMediaType = (url: string): "image" | "video" => {

  if (!url) return "image";
  const videoExtensions = [".mp4", ".mov", ".webm", ".ogg", ".mkv", ".m4v", ".qt", ".hevc"];
  const lower = url.toLowerCase();

  // Check if the URL contains any of the video extensions 
  const isVideo = videoExtensions.some((ext) => lower.includes(ext));

  return isVideo ? "video" : "image";
};

// Format currency
export const formatAmount = (value: number, max = 2) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: max,
  }).format(value)
}

// Make sure the files are unique
export const makeFilesUnique = (files: File[]): File[] => {
  return files.map((file) => {
    const uniqueId = crypto.randomUUID();

    // Clean the original filename
    const cleanName = file.name.replace(/\s+/g, "_");

    // Create a new filename
    const newFileName = `${uniqueId}-${cleanName}`;

    // Return a new File object
    return new File([file], newFileName, {
      type: file.type,
      lastModified: file.lastModified,
    });
  });
};

// Clean Up Data
export const cleanUpdateData = <T extends object>(data: T): Partial<T> => {
  return Object.entries(data).reduce((acc, [key, value]) => {
    // Only keep values that aren't null, undefined, or empty strings
    if (value !== undefined && value !== null && value !== "") {
      acc[key as keyof T] = value;
    }
    return acc;
  }, {} as Partial<T>);
};

// Format Age 
export const formatAgeCategorized = (dateString: string | Date): string => {
  const birthDate = new Date(dateString);
  const today = new Date();

  // Calculate Age
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  // 18+ Safety Check
  if (age < 18) {
    return "Under 18";
  }

  // Extract the decade (e.g., 20, 30, 40)
  const decade = Math.floor(age / 10) * 10;
  const lastDigit = age % 10;

  // Determine prefix
  let prefix = "";
  if (lastDigit <= 4) {
    prefix = "Early";
  } else if (lastDigit >= 5 && lastDigit <= 6) {
    prefix = "Mid";
  } else {
    prefix = "Late";
  }

  return `${prefix} ${decade}s`;
}

// Shuffle Array of String
export const shuffle = <T,>(array: T[]): T[] => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

// Format Distance
export const formatDist = (km: number): string => {
  if (km < 1) return `${km * 1000}m`;
  return `${km} km`;
}

// Validate Category
export const areCategoriesValid = (selectedCategories: string[]): boolean => {
  // Ensure it's an array and not empty
  if (!Array.isArray(selectedCategories) || selectedCategories.length === 0) {
    return false;
  }

  return selectedCategories.every(category => ALL_VALID_CATEGORIES.includes(category));
};

// Format Number in Thousands
export function format(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return `${n}`;
}

// Format Last Seen
export function formatLastSeen(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    
    // Ensure valid date
    if (isNaN(date.getTime())) return "Unknown";

    const diffMs = now.getTime() - date.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    // Time Formatter
    const timeFormat = new Intl.DateTimeFormat('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
    }).format(date);

    // Day checks
    const isToday = date.toDateString() === now.toDateString();
    
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    // Within the last hour
    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;

    // Today and Yesterday
    if (isToday) return `Today at ${timeFormat}`;
    if (isYesterday) return `Yesterday at ${timeFormat}`;

    // Within the last week
    if (diffDays < 7) return `${diffDays} days ago`;

    // Older than a week, but same year
    const isSameYear = date.getFullYear() === now.getFullYear();
    const shortDateFormat = new Intl.DateTimeFormat('en-US', { 
        month: 'long', 
        day: 'numeric' 
    }).format(date); // e.g., "Jul 20"

    if (isSameYear) return `${shortDateFormat} at ${timeFormat}`;

    // Different year
    const fullDateFormat = new Intl.DateTimeFormat('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    }).format(date);

    return fullDateFormat;
}

// Parse Incoming Message
export const parseRedisMessage = (redisMsg: RedisMessage): Message => ({
    ...redisMsg,
    createdAt: Number(redisMsg.createdAt),
    editedAt: redisMsg.editedAt ? Number(redisMsg.editedAt) : undefined,
    isSystem: redisMsg.isSystem === "true",
    edited: redisMsg.edited === "true",
    syncStatus: 'sent'
});

// Format Media Size
export function formatBytes(bytes: number) {
  if (!bytes) return '—';
  const units = ['B', 'KB', 'MB', 'GB'];
  let i = 0; let n = bytes;
  while (n >= 1024 && i < units.length - 1) { n /= 1024; i++; }
  return `${n.toFixed(n < 10 && i > 0 ? 1 : 0)} ${units[i]}`;
}