//Truncating of Texts
export function truncate(text: string, limit = 20): string {
    if (text.length <= limit) return text;
    return text.slice(0, limit) + '…';
}

//Trending Count
export const formatTrendingCount = (num: number) => {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
};

// Convert to ISO Date and Time
export function isoDateTime(value: string): string | null {
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
  const videoExtensions = [".mp4", ".mov", ".webm", ".ogg", ".mkv"];
  const lower = url.toLowerCase();

  return videoExtensions.some((ext) => lower.endsWith(ext)) ? "video" : "image";
};