require('dotenv').config();
const mongoose = require("mongoose");
const fs = require('fs');
const crypto = require('crypto');
const express = require('express');
// Import the Hash model
const HashModel = require('./models/hash');

const app = express();
app.use(express.json());

const {MONGO_URI,PORT = 3000 } = process.env;

// IIFE to give access to async/await
(async () => {
// Configure MongoDB and Mongoose
    try {
        await mongoose
            .connect(MONGO_URI, {})
            .then(async () => {
                console.log("MongoDB >> Connected!");

            });
    } catch (error) {
        console.log(`MongoDB ERROR >> ${error.message}`);

        // Exit current process with failure
        process.exit(1);
    }
})();

function generateNumbers(prefix) {
    const numbers = [];
    const start = parseInt(`254${prefix}000000`);
    const end = parseInt(`254${prefix}999999`);

    for (let i = start; i <= end; i++) {
        numbers.push(i.toString());
    }

    return numbers;
}

function generateHashedNumbers(numbers) {
    return numbers.map(number => {
            const hash = crypto.createHash('sha256').update(number).digest('hex');
            return { phoneNumber: number, hash: hash };
    });
}

function writeNumbersToFile(hashedNumbers, prefix) {
    const filename = `safaricom_numbers_${prefix}_hashed.json`;
    fs.writeFileSync(filename, JSON.stringify(hashedNumbers, null, 2));
    console.log(`Numbers for prefix ${prefix} written to ${filename}`);
}

async function saveNumbersToMongo(hashedNumbers, prefix, batchSize) {
    console.log(`Saving numbers for prefix ${prefix} to MongoDB...`);
    const totalRecords = hashedNumbers.length;
    const batches = Math.ceil(totalRecords / batchSize);

    for (let i = 0; i < batches; i++) {
        const start = i * batchSize;
        const end = Math.min((i + 1) * batchSize, totalRecords);
        const batch = hashedNumbers.slice(start, end);

        try {
            await HashModel.insertMany(batch, { ordered: false });
            console.log(`Batch ${i + 1}/${batches} for prefix ${prefix} saved to MongoDB`);
        } catch (error) {
            console.error(`Error saving batch ${i + 1} for prefix ${prefix} to MongoDB:`, error);
        }
    }

    console.log(`All numbers for prefix ${prefix} saved to MongoDB`);
}

function displayHelp() {
    console.log(`
Usage: node index.js [OPTIONS]

Options:
  --generate-hashes           Generate SHA256 hashes for each number
  --batch-size <number>       Set the batch size for MongoDB inserts (default: 10000)
  --help, -h, -H              Display this help message

Example:
  node index.js --generate-hashes --batch-size 5000
    `);
}

async function main() {
    const args = process.argv.slice(2);

    if (args.includes('--help') || args.includes('-h') || args.includes('-H')) {
        displayHelp();
        return;
    }

    const generateHashes = args.includes('--generate-hashes');
    const batchSizeIndex = args.indexOf('--batch-size');
    const batchSize = batchSizeIndex !== -1 ? parseInt(args[batchSizeIndex + 1]) : 10000;

    if (generateHashes) {
        const prefixes = [
            '0112', '0113', '0114', '0115',
            '0700', '0701', '0702', '0703', '0704', '0705', '0706', '0707', '0708', '0709',
            '0710', '0711', '0712', '0713', '0714', '0715', '0716', '0717', '0718', '0719',
            '0720', '0721', '0722', '0723', '0724', '0725', '0726', '0727', '0728', '0729',
            '0740', '0741', '0742', '0743', '0745', '0746', '0748',
            '0757', '0758', '0759',
            '0768', '0769',
            '0790', '0791', '0792', '0793', '0794', '0795', '0796', '0797', '0798', '0799'
        ];

        for (const prefix of prefixes) {
            const numbers = generateNumbers(prefix.substring(1)); // Remove the leading '0'
            const hashedNumbers = generateHashedNumbers(numbers);
            await saveNumbersToMongo(hashedNumbers, prefix, batchSize);
        }

        console.log('All number generation complete.');
    }
    // Start the Express server
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

app.get('/search/:hash', async (req, res) => {
    try {
        const { hash } = req.params;
        const result = await HashModel.findOne({ hash });
        if (result) {
            res.json({ found: true, phoneNumber: result.phoneNumber });
        } else {
            res.status(404).json({ found: false });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred while searching' });
    }
});

main().then();