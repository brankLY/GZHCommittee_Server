const path = require('path');
const util = require('util');

module.exports = shipit => {
  require('shipit-deploy')(shipit);

  shipit.initConfig({
    default: {
      ignores: ['.git', 'node_modules'],
      keepReleases: 10,
      deleteOnRollback: false,
      branch: 'master',
      deployTo: '/home/ubuntu/api/Dapp',
      repositoryUrl: 'git@github.com:XDMu/DappJupiter.git',
    },
    staging: {
      servers: 'ubuntu@dev',
    }
  });

  shipit.on('deployed', () => {
    console.log('#######################');
    console.log('Success.');
    console.log('Run "yarn bc:tearDown" to destory blockchain network');
    console.log('Run "yarn bc:setup" to re-start blockchain network');
    console.log('Run "yarn bc:upgrade" to upgrade blockchain network');
    console.log('Run "yarn api:build" to build new DappJupiter docker image');
    console.log('Run "yarn api:setup" to destory and re-start DappJupiter docker container');
    console.log('#######################');
  });

  shipit.task('dappswagger', async() => {
    const baseDir = shipit.config.deployTo;
    const dockerComposePath = util.format('%s/current/ops/dappswagger/docker-compose.yaml', baseDir);
    await shipit.remote(util.format('docker-compose -f %s down', dockerComposePath));
    await shipit.remote(util.format('docker-compose -f %s up -d', dockerComposePath));
    await shipit.remote('docker ps -a | grep "dappswagger"')
  });

  shipit.task('tearDown', async () => {
    const baseDir = shipit.config.deployTo;
    const currentDir = util.format('%s/current/', baseDir);
    await shipit.remote(util.format('cd %s && yarn tearDown', currentDir));
  });

  shipit.task('setup', async () => {
    const baseDir = shipit.config.deployTo;
    const currentDir = util.format('%s/current/', baseDir);
    await shipit.remote(util.format('cd %s && yarn setup', currentDir));
  });

  shipit.task('bc:upgrade', async () => {
    const baseDir = shipit.config.deployTo;
    const currentDir = util.format('%s/current/', baseDir);
    await shipit.remote(util.format('cd %s && yarn upgradeBc', currentDir));
  });

  shipit.task('api:build', async () => {
    const baseDir = shipit.config.deployTo;
    const currentDir = util.format('%s/current/', baseDir);
    await shipit.remote(util.format('cd %s && yarn build', currentDir));
  });

  shipit.task('api:setup', async () => {
    const baseDir = shipit.config.deployTo;
    const currentDir = util.format('%s/current/', baseDir);
    await shipit.remote(util.format('cd %s && yarn startServer', currentDir));
  });
};
