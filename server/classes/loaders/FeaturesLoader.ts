import fs from 'fs';
import path from 'path';
import Logger from './../Logger';
import Feature from './Features';
import { Client } from 'discord.js';

export default class FeaturesLoader {
  static Features: Feature[] = [];
  static client: Client;
  static alreadyLoaded: boolean = false;

  // Load features
  static async load(): Promise<void> {
    if (!this.client) {
      Logger.log("console|file|whatsapp", "No client provided", "ERR", "FEATURES");
      return;
    }

    if (this.alreadyLoaded) {
      Logger.log("console|file|whatsapp", "Already loaded", "WARN", "FEATURES");
      return;
    }

    const dir = path.join(__dirname, '../../features');
    const files = fs.readdirSync(dir);

    for (const file of files) {
      if (file.endsWith('.ts')) {
        const module = await import(path.join(dir, file))
        FeaturesLoader.Features.push(module.default);
        await module.default.run(FeaturesLoader.client);

        Logger.log("console|file", `Loaded feature: ${file}`, "INFO", "FEATURES"); 
      }
    }

    this.alreadyLoaded = true;
  }
}
