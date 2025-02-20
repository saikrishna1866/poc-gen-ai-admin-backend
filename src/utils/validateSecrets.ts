import fs from "fs";
import path from "path";
import { getEnvVariable } from "./getEnv.js";

export const validateSecretsPath = (secretPathEnv: string): boolean => {
    try {
        const secretPath = getEnvVariable(secretPathEnv);

        // Check if the secret path exists
        if (!secretPath) {
            console.error(`❌ Environment variable "${secretPathEnv}" does not exist or is invalid.`);
            return false;
        }

        const fullPath = path.resolve(secretPath);
        
        // Check if the file exists (not the directory)
        if (!fs.existsSync(fullPath)) {
            // Create directory if it doesn't exist
            const dir = path.dirname(fullPath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
                console.log(`📁 Created directory: ${dir}`);
            }
            
            // Create empty credentials file
            fs.writeFileSync(fullPath, '', 'utf8');
            console.log(`📄 Created empty credentials file: ${fullPath}`);
        }

        // Verify file is readable and log contents
        try {
            fs.accessSync(fullPath, fs.constants.R_OK);
            const fileContent = fs.readFileSync(fullPath, 'utf8');
            
            console.log(`✅ Secrets file is valid and readable at: ${fullPath}`);
            if (fileContent.trim()) {
                try {
                    // Try to parse as JSON
                } catch {
                    // If not JSON, log as plain text
                    console.log('📝 Secrets content (text):', fileContent);
                }
            } else {
                console.log('⚠️ Secrets file is empty');
            }
            
            return true;
        } catch (err) {
            console.error(`❌ Cannot read secrets file at "${fullPath}". Check file permissions.`);
            return false;
        }

    } catch (error) {
        console.error(`⚠️ Error occurred while validating the secrets path:`, error);
        return false;
    }
};