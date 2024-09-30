import { parse } from "jsr:@std/yaml";

const DefaultConfigFile = "mc.config.yaml";

export interface Config {
  name?: string
  description?: string;
  version?: string;
}

export class Config {
  name?: string = "mc";
  description?: string = "run a suite of one or more programs and report failures";
  version?: string = "0.0.0";

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
