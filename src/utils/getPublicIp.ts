export const getPublicIp = async () => {
    try {
        const res = await fetch('https://api.ipify.org?format=json');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const { ip } = await res.json();
        return ip ?? null;
    } catch (err) {
        console.warn('Unable to fetch IP:', err);
        return null;
    }
}
