const util = require('util');

module.exports = shipit => {
  require('shipit-deploy')(shipit);

  shipit.initConfig({
    default: {
      workspace: '/home/ubuntu/GZHCommittee/github-monitor',
      deployTo: '/home/ubuntu/GZHCommittee',
      repositoryUrl: 'git@github.com:XDMu/GZHCommittee.git',
      ignores: ['.git', 'node_modules'],
      keepReleases: 10,
      deleteOnRollback: false,
      branch: 'master',
      key: '/Users/liuyang/.ssh',
    },
    staging: {
      servers: 'ubuntu@dev',
    }
  });

  shipit.on('deployed', () => {
    console.log('#######################');
    console.log('Success.');
    console.log('#######################');
  });

  shipit.task('committeeSwagger', async() => {
    const baseDir = shipit.config.deployTo;
    const dockerComposePath = util.format('%s/current/ops/committeeSwagger/docker-compose.yaml', baseDir);
    await shipit.remote(util.format('docker-compose -f %s down', dockerComposePath));
    await shipit.remote(util.format('docker-compose -f %s up -d', dockerComposePath));
    await shipit.remote('docker ps -a | grep "committeeSwagger"')
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
