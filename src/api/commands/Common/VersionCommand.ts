import * as yargs from 'yargs';

export class VersionCommand implements yargs.CommandModule {
  public command = 'version';

  public describe = 'Prints application version.';

  public async handler() {
    console.log(process.env.npm_package_version);
  }
}
