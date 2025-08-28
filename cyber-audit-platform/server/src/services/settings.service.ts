import * as fs from 'fs/promises';
import * as path from 'path';

export interface ApiSettings {
  shodanApiKey: string;
  wpscanApiKey: string;
  dnsdumpsterApiKey: string;
}

const settingsPath = path.join(__dirname, '../data/settings.json');

async function readSettings(): Promise<ApiSettings> {
  try {
    const data = await fs.readFile(settingsPath, 'utf-8');
    return JSON.parse(data) as ApiSettings;
  } catch (error) {
    if (error.code === 'ENOENT') {
      const defaultSettings: ApiSettings = {
        shodanApiKey: '',
        wpscanApiKey: '',
        dnsdumpsterApiKey: '',
      };
      await writeSettings(defaultSettings);
      return defaultSettings;
    }
    throw error;
  }
}

async function writeSettings(settings: ApiSettings): Promise<void> {
  await fs.writeFile(settingsPath, JSON.stringify(settings, null, 2), 'utf-8');
}

export const settingsService = {
  async getSettings(): Promise<ApiSettings> {
    return readSettings();
  },

  async updateSettings(newSettings: Partial<ApiSettings>): Promise<ApiSettings> {
    const currentSettings = await readSettings();
    const updatedSettings = { ...currentSettings, ...newSettings };
    await writeSettings(updatedSettings);
    return updatedSettings;
  },
};
