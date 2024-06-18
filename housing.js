const mineflayer = require('mineflayer');
const fs = require('fs');
const path = require('path');

// Change working directory to the directory containing bedwars.txt
const accountsFilePath = path.join(__dirname, 'accounts.txt');

async function readAccounts(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return data.trim().split('\n');
    } catch (error) {
        console.error('Error reading accounts file:', error);
        return [];
    }
}

async function createBot(email) {
    try {
        const bot = mineflayer.createBot({
            host: 'hypixel.net',
            version: '1.8.9',
            auth: 'microsoft',
            username: email,
            viewDistance: 2
        });

        bot.once('login', () => {
            console.log(`${bot.username} logged in.`);
        });

        bot.once('spawn', async () => {
            console.log(`${bot.username} spawned.`);
        });

        bot.on('message', async (rawMessage) => {
            const message = rawMessage.toString();
            console.log(`[CHAT] ${bot.username}:`, message);
        });

        bot.on('end', (reason) => {
            console.log(`${bot.username} bot ended:`, reason);
            clearInterval(housingInterval);
        });

        bot.on('error', (err) => {
            console.error(`${bot.username} bot error:`, err);
        });

        const housingInterval = setInterval(() => {
            bot.chat('/housing random');
        }, 3000); // Execute /housing random every 3 seconds
    } catch (error) {
        console.error('Error creating bot:', error);
    }
}

async function main() {
    const accounts = await readAccounts(accountsFilePath);

    for (const account of accounts) {
        createBot(account);
        await new Promise(resolve => setTimeout(resolve, 5000)); // Delay between bot logins
    }
}

main();
