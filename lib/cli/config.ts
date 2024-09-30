import { parse } from "jsr:@std/yaml";

const DefaultConfigFile = "mc.config.yaml";

export class Config {
  name?: string;
  description?: string;
  version?: string;

  constructor(yaml: string) {
    const config = parse(yaml) as Config;
    this.name = config.name;
    this.description = config.description;
    this.version = config.version;
  }

  static load(): Config {
    const configFile = DefaultConfigFile;
    try {
      const yaml = Deno.readTextFileSync(configFile);
      return new Config(yaml);
    } catch (err) {
      throw new Error(`can't read ${configFile}: ${err}`);
    }
  }
}
