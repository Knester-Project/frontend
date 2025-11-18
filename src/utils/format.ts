export function truncate(text: string, limit = 20): string {
    if (text.length <= limit) return text;
    return text.slice(0, limit) + '…';
}
