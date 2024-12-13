// Import necessary Node.js modules for file system operations, path handling, executing shell commands, and HTTP requests.
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const axios = require('axios');

function copyAndWaitForUpload(source, destination) {
    return new Promise((resolve, reject) => {
        // Use `rsync` for copying files on macOS/Linux. 
        // -a: archive mode; preserves permissions, timestamps, etc.
        // -v: verbose output, useful for debugging
        const copyCommand = `rsync -av "${source}/" "${destination}"`;

        exec(copyCommand, (error, stdout, stderr) => {
            if (error) {
                // If there's an error with the copy command, log it and reject the promise.
                console.error(`Copy command failed: ${error.message}`);
                reject(error);
                return;
            }
            console.log('Files copied to LucidLink Filespace. Waiting for upload to complete...');

            // After copying, wait for the upload to finish.
            waitForUploadToFinish().then(() => {
                // Once upload is complete, sync the file index.
                syncFileIndex().then(() => {
                    console.log('Upload and sync completed successfully.');
                    resolve();
                }).catch(syncError => reject(syncError));
            }).catch(waitError => reject(waitError));
        });
    });
}

function waitForUploadToFinish() {
    return new Promise((resolve, reject) => {
        // Function to check if the upload has finished by checking for 'dirtyBytes' in the LucidLink cache info.
        const checkUpload = () => {
            axios.get('http://localhost:8279/cache/info')
                .then(response => {
                    if (response.data.dirtyBytes === 0) {
                        // When dirtyBytes is 0, all uploads are complete.
                        resolve();
                    } else {
                        // If not complete, check again in 5 seconds.
                        setTimeout(checkUpload, 5000);
                    }
                })
                .catch(error => {
                    console.error('Failed to check upload status:', error.message);
                    reject(error);
                });
        };
        checkUpload();
    });
}

function syncFileIndex() {
    // Send an empty PUT request to synchronize the file index with the cloud.
    return axios.put('http://localhost:8279/app/sync', {});
}

// Main execution block
if (process.argv.length < 4) {
    // Check if the user has provided both source and destination paths
    console.error('Usage: node script.js <source> <destination>');
    process.exit(1);
}

// Extract source and destination from command line arguments
const [source, destination] = process.argv.slice(2);

// Start the copy, upload wait, and sync process
copyAndWaitForUpload(source, destination)
    .then(() => console.log('Operation completed.'))
    .catch(err => console.error('Operation failed:', err));