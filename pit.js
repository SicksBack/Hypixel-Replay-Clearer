const mineflayer = require('mineflayer');
const fs = require('fs');
const path = require('path');

// Change working directory to the directory containing accounts.txt
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
            
            setInterval(() => {
                bot.chat('/play pit');
                setTimeout(() => {
                    bot.chat('/lobby');
                    setTimeout(() => {
                        bot.chat('/play pit');
                    }, 6500); // Wait 6.5 seconds after /lobby and then /play pit
                }, 6500); // Wait 6.5 seconds after /play pit and then /lobby
            }, 19500); // Initial delay before starting the sequence
        });

        bot.on('message', async (rawMessage) => {
            const message = rawMessage.toString();
            console.log(`[CHAT] ${bot.username}:`, message);
        });

        bot.on('end', (reason) => {
            console.log(`${bot.username} bot ended:`, reason);
            clearInterval(sequenceInterval);
        });

        bot.on('error', (err) => {
            console.error(`${bot.username} bot error:`, err);
        });

        // Function to repeat the sequence
        const repeatSequence = () => {
            bot.chat('/play pit');
            setTimeout(() => {
                bot.chat('/lobby');
                setTimeout(() => {
                    bot.chat('/play pit');
                }, 6500); // Wait 6.5 seconds after /lobby and then /play pit
            }, 6500); // Wait 6.5 seconds after /play pit and then /lobby
        };

        // Start repeating the sequence after initial delay
        setTimeout(() => {
            repeatSequence();
            const sequenceInterval = setInterval(repeatSequence, 19500); // Repeat every 19.5 seconds
        }, 5000); // Initial delay before starting the sequence
    } catch (error) {
        console.error('Error creating bot:', error);
    }
}

async function main() {
    const accounts = await readAccounts(accountsFilePath);

    for (const account of accounts) {
        createBot(account);
        await new Promise(resolve => setTimeout(resolve, 10000)); // Delay between bot logins (10 seconds)
    }
}

main();
