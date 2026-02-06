import { getVersion } from '../api';

export interface VersionInfo {
    version: string;
    ota_version: string;
    critical: boolean;
    message: string;
    downloadUrl: string;
    changelog: string[];
}

// Get the last successfully applied OTA version from storage
const getAppliedOtaVersion = (): string => {
    return localStorage.getItem('applied_ota_version') || '0';
};

// Save the applied OTA version after successful update
export const setAppliedOtaVersion = (version: string) => {
    localStorage.setItem('applied_ota_version', version);
};

export const checkAndUpdate = async (): Promise<VersionInfo | null> => {
    try {
        const manifest = await getVersion() as VersionInfo;
        const appliedVersion = getAppliedOtaVersion();

        // Check if server has a newer OTA version than what we've applied
        if (manifest.ota_version && manifest.ota_version !== appliedVersion) {
            console.log(`[OTA] New version found: ${manifest.ota_version} (Applied: ${appliedVersion})`);
            return manifest;
        }

        console.log(`[OTA] Up to date. Server: ${manifest.ota_version}, Applied: ${appliedVersion}`);
        return null;
    } catch (e) {
        console.error("Update check failed", e);
        return null;
    }
};
