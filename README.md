# unhash-mpesa-number

A Node.js utility for processing and storing numbers with optional hash generation and MongoDB integration.

## Features

- Generate SHA256 hashes for numbers
- Configurable batch processing for MongoDB insertions
- Customizable batch sizes for optimal performance

## Installation

```bash
npm install
```

## Prerequisites

- Node.js (v12 or higher recommended)
- MongoDB (if using database features)

## Usage

Basic command syntax:

```bash
node index.js [OPTIONS]
```

### Options

| Option | Description |
|--------|-------------|
| `--generate-hashes` | Generate SHA256 hashes for each number |
| `--batch-size <number>` | Set the batch size for MongoDB inserts (default: 10000) |
| `--help`, `-h`, `-H` | Display help message |

### Examples

Generate hashes with default batch size:
```bash
node index.js --generate-hashes
```

Generate hashes with custom batch size:
```bash
node index.js --generate-hashes --batch-size 5000
```

Display help message:
```bash
node index.js --help
```

## Configuration

The default batch size is set to 10000, but can be adjusted based on your system's performance requirements and available resources.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

mukileta za kabej tutanunua server na domain.
domain ni $10 server monthly ni $20 baas api inaeza run for everyone. 
