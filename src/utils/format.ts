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