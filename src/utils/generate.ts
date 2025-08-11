import { generateUsername } from 'unique-username-generator';

export function generateCustomUsernames(userInput: string) {
    const usernames = [];

    // Clean the user input to remove any special characters
    const cleanInput = userInput.replace(/[^A-Za-z0-9]/g, '');

    // Generate three usernames
    for (let i = 0; i < 3; i++) {
        // Generate a username with a separator, random digits, and a maximum length
        const username = generateUsername(".", 0, 20, cleanInput);
        usernames.push(username);
    }

    return usernames;
}