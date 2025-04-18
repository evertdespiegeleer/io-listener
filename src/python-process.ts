import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { existsSync } from 'node:fs'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createPythonProcess = () => new Promise<ChildProcessWithoutNullStreams>((resolve, reject) => {
    let process: ChildProcessWithoutNullStreams;

    const possiblePythonExecutablePaths = [
        path.join(__dirname, 'python/main'),
        path.join(__dirname, '../python/dist/main'),
    ]
    
    const pythonExecutablePath = possiblePythonExecutablePaths.find(path => existsSync(path));
    
    if (pythonExecutablePath == null) {
        throw new Error('Python executable not found. Please build the Python project first.');
    }
    
    process = spawn(pythonExecutablePath, [], { shell: true });

    const handleData = (data: Buffer) => {
        const dataString = data.toString().trim()
        if (dataString === 'ready') {
            resolve(process);
            process.stdout.removeListener('data', handleData);
        }
    }

    process.stdout.addListener('data', handleData)

    process.stderr.on('data', (data) => {
        const dataString = data.toString().trim()
        reject(new Error(`Error from Python process: ${dataString}`));
    });
    
    process.on('close', (code) => {
        reject(new Error(`Python process exited with code ${code}`));
    });
    
    process.on('error', (err) => {
        reject(new Error(`Failed to start Python process: ${err}`));
    });
});
