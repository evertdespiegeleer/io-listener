import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { existsSync } from 'node:fs'
import { readdir } from 'node:fs/promises';
import { platform as getPlatform } from 'node:os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supportedPlatforms = ['win32', 'darwin', 'linux'] satisfies NodeJS.Platform[]

export const createPythonProcess = () => new Promise<ChildProcessWithoutNullStreams>(async (resolve, reject) => {
    //#region Find the executable
    let process: ChildProcessWithoutNullStreams;

    const searchExecutablesInDir = async (directoryPath: string) => {
        const dirExists = existsSync(directoryPath)
        if (!dirExists) {
            return []
        }
        const files = await readdir(directoryPath)
        return files.map(file => path.join(directoryPath, file))
    }

    const executables = [
        ...await searchExecutablesInDir(path.join(__dirname, 'python')),
        ...await searchExecutablesInDir(path.join(__dirname, '../python/dist')),
    ]

    const platform = getPlatform();

    if (!(supportedPlatforms as string[]).includes(platform)) {
        throw new Error(`Unsupported platform: ${platform}. Supported platforms are: ${supportedPlatforms.join(', ')}`);
    }

    const pythonExecutablePath = executables.find(path => path.includes(platform));
    
    if (pythonExecutablePath == null) {
        throw new Error('Python executable not found. Please build the Python project first.');
    }
    //#endregion
    
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
