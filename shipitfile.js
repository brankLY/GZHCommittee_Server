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
      deployTo: '/root/api/GZHCommittee_server',
      repositoryUrl: 'git@github.com:brankLY/GZHCommittee_server.git',
    },
    staging: {
      servers: 'root@dev',
    }
  });

  shipit.on('deployed', () => {
    console.log('#######################');
    console.log('Success.');
    console.log('Run "yarn bc:tearDown" to destory blockchain network');
    console.log('Run "yarn bc:setup" to re-start blockchain network');
    console.log('Run "yarn bc:upgrade" to upgrade blockchain network');
    console.log('Run "yarn api:build" to build new GZHCommittee_Server docker image');
    console.log('Run "yarn api:setup" to destory and re-start GZHCommittee_Server docker container');
    console.log('#######################');
  });

  shipit.task('gzhcommittee_serverswagger', async() => {
    const baseDir = shipit.config.deployTo;
    const dockerComposePath = util.format('%s/current/ops/gzhcommittee_serverswagger/docker-compose.yaml', baseDir);
    await shipit.remote(util.format('docker-compose -f %s down', dockerComposePath));
    await shipit.remote(util.format('docker-compose -f %s up -d', dockerComposePath));
    await shipit.remote('docker ps -a | grep "gzhcommittee_serverswagger"')
  });

  shipit.task('tearDown', async () => {
    const baseDir = shipit.config.deployTo;
    const currentDir = util.format('%s/current/', baseDir);
    await shipit.remote(util.format('cd %s && yarn tearDown', currentDir));
  });

  shipit.task('setup', async () => {
    const baseDir = shipit.config.deployTo;
    const currentDir = util.format('%s/current/', baseDir);
    await shipit.remote(util.format('cd %s && yarn && yarn setup', currentDir));
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
