export const ADVERT_CATEGORIES = {
    digital: [
        "Electronics & Gadgets",
        "Computers & Accessories",
        "Software & Digital Goods",
        "Video Games & Consoles"
    ],
    services: [
        "Graphic Design & Media",
        "Web & App Development",
        "Marketing & SEO",
        "Writing & Translation",
        "Consulting & Business"
    ],
    fashion: [
        "Clothing & Apparel",
        "Shoes & Footwear",
        "Jewelry & Accessories",
        "Health & Beauty Products"
    ],
    lifestyle: [
        "Furniture & Home Decor",
        "Real Estate & Rentals",
        "Automotive (Cars, Bikes, Parts)",
        "Fitness & Sports Equipment"
    ],
    entertainment: [
        "Music & Audio",
        "Tickets & Event Passes",
        "Art & Collectibles"
    ],
    health: [
        "Health Advisor",
        "Online Medical Concierge",
        "Care Guidance Physician",
        "Symptom Navigator"
    ],
    others: [
        "Compensated Companionship",
        "Consensual Adult Services",
        "Sexual Health Specialist"
    ]
};

export const ALL_VALID_CATEGORIES = Object.values(ADVERT_CATEGORIES).flat();