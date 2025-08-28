import { Request, Response } from 'express';
import { settingsService } from '../services/settings.service';

export const settingsController = {
  async getSettings(req: Request, res: Response) {
    try {
      const settings = await settingsService.getSettings();
      res.status(200).json(settings);
    } catch (error) {
      res.status(500).json({ message: 'Error getting settings', error: error.message });
    }
  },

  async updateSettings(req: Request, res: Response) {
    const { shodanApiKey, wpscanApiKey, dnsdumpsterApiKey } = req.body;

    try {
      const updatedSettings = await settingsService.updateSettings({
        shodanApiKey,
        wpscanApiKey,
        dnsdumpsterApiKey,
      });
      res.status(200).json({ message: 'Settings updated successfully', settings: updatedSettings });
    } catch (error) {
      res.status(500).json({ message: 'Error updating settings', error: error.message });
    }
  },
};
