# LucidLink-SyncScript
 This script automates the process of copying files to a LucidLink filespace, waiting for all uploads to complete, and then syncing the file index with the cloud. It's designed for macOS but can be adapted for other Unix-like systems.

## Prerequisites

- **Node.js**: This script runs on Node.js. Ensure you have Node.js installed on your system. Download from [nodejs.org](https://nodejs.org/).
- **rsync**: The script uses `rsync` for file copying. It's usually pre-installed on macOS, but you might need to install it on other Unix systems.
- **LucidLink Daemon**: Ensure LucidLink is installed and running with its API accessible via `localhost:8279` (or adjust the port accordingly).

## Installation

1. Clone this repository:
   ```bash
   git clone [your-repo-url]
   cd [your-repo-name]


2. Install dependencies:
bash
```
npm install
```


Usage
Run the script with two arguments: the source directory and the destination directory within your LucidLink filespace:

bash
```
node lucidSync.js "/path/to/source/directory/" "/path/to/destination/in/lucidlink/"
```


Example:

bash
```
node lucidSync.js "/Users/username/Documents/Photos/" "/Volumes/LucidSpace/PhotosBackup/"
```

## Arguments:
*source: The path to the directory containing files you want to copy.
*destination: The path in the LucidLink filespace where you want to copy the files to.

## How It Works
Copy Files: Uses rsync to copy files from source to destination.
Wait for Upload: Continuously checks the LucidLink daemon's status via an HTTP GET request until dirtyBytes becomes zero, indicating all files have been uploaded to the cloud.
Sync File Index: Sends an HTTP PUT request to ensure the file index is synchronized with cloud storage.

## Troubleshooting
Permission Issues: Ensure you have the necessary read/write permissions for both source and destination paths.
Network Issues: If the script can't connect to the LucidLink daemon, check if the daemon is running and the correct port is used.
rsync Not Found: On systems other than macOS, you might need to install rsync manually.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## Acknowledgements
LucidLink for their file synchronization technology.
The Node.js community.
