import { formatDistanceToNow } from "date-fns";

export const getTimeAgo = (date) => {
    if (!date) return "Unknown date";

    const createdAt = new Date(date);
    const now = new Date();

    const diffInHours = Math.abs(now - createdAt) / 36e5;

    if (diffInHours < 1) {
        return formatDistanceToNow(createdAt, { addSuffix: true }); 
    } else if (diffInHours < 24) {
        return `${Math.floor(diffInHours)} hour${Math.floor(diffInHours) !== 1 ? "s" : ""} ago`;
    } else {
        return createdAt.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    }
};
