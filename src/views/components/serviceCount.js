const SERVICE_COUNT_KEY = 'daka_service_count';

export const getServiceCount = () => {
    const count = localStorage.getItem(SERVICE_COUNT_KEY);
    return count ? parseInt(count, 10) : 0;
};

export const incrementServiceCount = () => {
    const currentCount = getServiceCount();
    localStorage.setItem(SERVICE_COUNT_KEY, (currentCount + 1).toString());
};
