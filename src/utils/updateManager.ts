import { getVersion } from '../api';

export interface VersionInfo {
    version: string;
    ota_version: string;
    critical: boolean;
    message: string;
    downloadUrl: string;
    changelog: string[];
}

const CURRENT_APP_VERSION = "1.1.0";
const CURRENT_OTA_VERSION = "2026.0206.A";

export const checkAndUpdate = async (): Promise<VersionInfo | null> => {
    try {
        const manifest = await getVersion() as VersionInfo;

        // Check if there's a newer version or OTA bundle
        if (manifest.version !== CURRENT_APP_VERSION || manifest.ota_version !== CURRENT_OTA_VERSION) {
            return manifest;
        }
        return null;
    } catch (e) {
        console.error("Update check failed", e);
        return null;
    }
};
