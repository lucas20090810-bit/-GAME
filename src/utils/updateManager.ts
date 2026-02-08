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

        // Auto-update: Check if server OTA version is different (no manual trigger needed)
        // This makes updates fully automatic based on Render deployments
        if (manifest.ota_version && manifest.ota_version !== appliedVersion) {
            console.log(`[OTA] Auto-update detected: ${manifest.ota_version} (Current: ${appliedVersion})`);
            return manifest;
        }

        console.log(`[OTA] Up to date. Version: ${manifest.ota_version}`);
        return null;
    } catch (e) {
        console.error("Update check failed", e);
        return null;
    }
};
