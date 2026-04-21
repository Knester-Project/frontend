// Utils and Types
import { generateVariants } from "@/utils/generate";
import { type StyleConfig } from "@/pages/User/Profile/PictureEditor";

const diversifiedBackgroundColors = [
    // Your Original Pastels (Soft & Clean)
    "b6e3f4", "c0aede", "d1d4f9", "ffd5dc", "ffdfbf", "a3e4d7",

    // Vibrant & Energetic (Makes avatars "pop")
    "ff4757", // Vibrant Red
    "ff9f43", // Bright Orange
    "feca57", // Bright Yellow
    "1dd1a1", // Mint Bright
    "54a0ff", // Sky Blue
    "5f27cd", // Purple

    // Dark & Sleek (Great contrast for light-themed avatars)
    "222f3e", // Dark Slate/Black
    "2c3e50", // Midnight Blue
    "833471", // Deep Magenta
    "b33939", // Dark Crimson
    "01a3a4", // Deep Teal

    // Earthy & Warm (Natural and grounded)
    "d35400", // Pumpkin/Burnt Orange
    "c0392b", // Brick Red
    "27ae60", // Forest Green
    "8e44ad", // Deep Plum

    // Neutrals (Minimalist and professional)
    "ffffff", // Pure White
    "f1f2f6", // Very Light Grey
    "c8d6e5", // Cool Grey
    "576574"  // Slate Grey
];

const diversifiedSkinColors = [
    // Natural Human Skin Tones (Light to Dark)
    "ffeaec", // Very Light (Cool undertone)
    "ffdbac", // Light (Warm undertone)
    "f1c27d", // Medium Light
    "e0ac69", // Medium
    "c68642", // Medium Dark / Olive
    "8d5524", // Dark
    "5c3a21", // Very Dark
    "321b0f", // Deepest Dark

    // Fantasy / Expressive Tones (Optional, great for fun avatars!)
    "7bdcb5", // Mint Green
    "92a8d1", // Pale Blue
    "b39ddb", // Soft Purple
    "ffffff", // Pure White
    "e0e0e0"  // Ash Grey
];

const diversifiedHairColors = [
    // Natural Hair Colors
    "111111", // Soft Black (Better than pure black for details)
    "2c1b18", // Dark Brown
    "4a2f24", // Medium Brown
    "7c4a3a", // Light Brown / Chestnut
    "b55239", // Red / Ginger
    "e8b923", // Golden Blonde
    "f5e7a1", // Platinum Blonde
    "b2bec3", // Silver / Grey
    "ffffff", // Pure White

    // Vibrant / "Dyed" Hair Colors
    "ff4757", // Bright Red
    "fc5c65", // Coral Pink
    "fd79a8", // Bubblegum Pink
    "6c5ce7", // Vibrant Purple
    "0984e3", // Electric Blue
    "00b894", // Emerald Green
    "00cec9"  // Teal / Cyan
];

const STYLES: StyleConfig[] = [
    {
        id: "adventurer",
        label: "Adventurer",
        options: {
            backgroundColor: {
                label: "Background",
                type: "color",
                values: diversifiedBackgroundColors,
            },
            hair: {
                label: "Hair",
                type: "swatch",
                values: [...generateVariants(26, "long"), ...generateVariants(19, "short")],
            },
            hairColor: {
                label: "Hair Color",
                type: "swatch",
                values: diversifiedHairColors,
            },
            skinColor: {
                label: "Skin",
                type: "color",
                values: diversifiedSkinColors,
            },
            eyes: {
                label: "Eyes",
                type: "swatch",
                values: generateVariants(26),
            },
            eyebrows: {
                label: "Eyebrows",
                type: "swatch",
                values: generateVariants(15),
            },
            mouth: {
                label: "Mouth",
                type: "swatch",
                values: generateVariants(30),
            },
            earrings: {
                label: "Earrings",
                type: "swatch",
                values: ["none", ...generateVariants(6)],
            },
            features: {
                label: "Features",
                type: "swatch",
                values: ["none", "birthmark", "blush", "freckles", "mustache"],
            },
            glasses: {
                label: "Eye Glasses",
                type: "swatch",
                values: ["none", ...generateVariants(5)],
            },
        },
    },
    // {
    //     id: "bottts",
    //     label: "Bottts",
    //     options: {
    //         mouth: {
    //             label: "Mouth",
    //             type: "swatch",
    //             values: ["bite", "diagram", "grill01", "grill02", "square01", "square02"],
    //         },
    //         eyes: {
    //             label: "Eyes",
    //             type: "swatch",
    //             values: ["bulging", "dizzy", "eva", "frame1", "glow", "happy", "robocop", "round"],
    //         },
    //         backgroundColor: {
    //             label: "Background",
    //             type: "color",
    //             values: ["b6e3f4", "c0aede", "d1d4f9", "ffd5dc", "ffdfbf", "a3e4d7", "f0f0f0"],
    //         },
    //     },
    // },
    {
        id: "croodles",
        label: "Croodles",
        options: {
            backgroundColor: {
                label: "Background",
                type: "color",
                values: diversifiedBackgroundColors,
            },
            face: {
                label: "Face",
                type: "swatch",
                values: generateVariants(8),
            },
            eyes: {
                label: "Eyes",
                type: "swatch",
                values: generateVariants(16),
            },
            top: {
                label: "Hair",
                type: "swatch",
                values: generateVariants(29),
            },
            topColor: {
                label: "Hair Color",
                type: "swatch",
                values: diversifiedHairColors,
            },
            nose: {
                label: "Nose",
                type: "swatch",
                values: generateVariants(9),
            },
            mouth: {
                label: "Mouth",
                type: "swatch",
                values: generateVariants(18),
            },
            mustache: {
                label: "Mustache",
                type: "swatch",
                values: ["none", ...generateVariants(4)],
            },
            beard: {
                label: "Beard",
                type: "swatch",
                values: ["none", ...generateVariants(5)],
            },
        },
    },
    {
        id: "adventurer-neutral",
        label: "Adventure Neutral",
        options: {
            backgroundColor: {
                label: "Background",
                type: "color",
                values: diversifiedBackgroundColors,
            },
            eyes: {
                label: "Eyes",
                type: "swatch",
                values: generateVariants(26),
            },
            eyebrows: {
                label: "Eyebrows",
                type: "swatch",
                values: generateVariants(15),
            },
            glasses: {
                label: "Eye Glasses",
                type: "swatch",
                values: ["none", ...generateVariants(5)],
            },
            mouth: {
                label: "Mouth",
                type: "swatch",
                values: generateVariants(30),
            },
        },
    },
    {
        id: "toon-head",
        label: "Toon Head",
        options: {
            backgroundColor: {
                label: "Background",
                type: "color",
                values: diversifiedBackgroundColors,
            },
            hair: {
                label: "Hair",
                type: "swatch",
                values: ["bun", "sideCombed", "spiky", "undercut"],
            },
            hairColor: {
                label: "Hair color",
                type: "color",
                values: diversifiedHairColors,
            },
            beard: {
                label: "Beard",
                type: "swatch",
                values: ["chin", "chinMoustache", "fullBeard", "longBeard", "moustacheTwirl"],
            },
            eyes: {
                label: "Eyes",
                type: "swatch",
                values: ["bow", "happy", "humble", "wide", "wink"],
            },
            eyebrows: {
                label: "Eye Brows",
                type: "swatch",
                values: ["angry", "happy", "neutral", "raised", "sad"],
            },
            mouth: {
                label: "Mouth",
                type: "swatch",
                values: ["agape", "angry", "laugh", "sad", "smile"],
            },
            skinColor: {
                label: "Hair color",
                type: "color",
                values: diversifiedSkinColors,
            },
            clothes: {
                label: "Clothes",
                type: "swatch",
                values: ["dress", "openJacket", "shirt", "tShirt", "turtleNeck"],
            },
            clothesColor: {
                label: "Clothes Colour",
                type: "swatch",
                values: diversifiedSkinColors,
            },
            rearHair: {
                label: "Rear Hair",
                type: "swatch",
                values: ["none", "longStraight", "longWavy", "neckHigh", "shoulderHigh"],
            },
        },
    }
];

export default STYLES;