# Jupiter

http://52.15.91.107:8080/

## Folder Structure

```bash
Jupiter
  |
  \Dockerfile # Docker build时会用到，用来build Jupiter的docker image
  \package.tson # node项目文件
  \shipitfile.ts # shipit 配置文件
  \tsconfig.tson # typescript 配置文件
  \ISSUE_TEMPLATE.md # github issue 模版
  \dist # Typescript变异后的js文件都在这个目录下
  \ops # 运维相关文件和脚本都在这个目录下
    |
    \api # Jupiter 项目的运维脚本
      |
      \docker-compose.yaml # Jupiter项目和swagger server的docker-compose文件
      \swagger.yaml # Jupiter项目的swagger文档
    \network # 区块链网络
      |
      \crypto-config # 由crypto-config.yaml生成的区块链证书文件
      \crypto-config.yaml # 区块链网络初始证书生成的配置文件，用于cryptogen.sh
      \cryptogen.sh # 根据crypto-config.yaml生成区块链证书信息，即crypto-config目录
      \docker-compose.yml # 区块链网络的docker-compose文件
      \channel.tx # channel的配置信息，由configtx.sh生成
      \configtx.yaml # 区块链配置信息
      \configtxgen.sh # 用configtx.yaml和crypto-config生成channel的配置信息和创世区块
      \genesis.block # 创世区块，由configtx.sh生成
      \network.yaml # 配置文件，用来描述这个区块链网络的组成
      \org1.yaml # 配置文件，用来描述org1的信息
      \org2.yaml # 配置文件，用来描述org2的信息
    \scripts # 脚本都在这个目录下
      |
      \build.sh # 删除jupiter docker container，重新build jupiter镜像
      \client-store.js # util方法，用来创建fabric-client
      \config.js # util文件，所有的配置都在这里
      \create-channel.js # 创建channel
      \install.js # 安装cc到区块链网络
      \instantiate.js # 实例化cc
      \join-channel.js # join peer to fabric channel
      \setup.sh # 启动区块链网络，依次create-channel，join-channel，install-cc，instantiate-cc
      \start.sh # 启动Jupiter和swagger server
      \tearDown.sh # 彻底删除区块链网络
      \upgrade.js # 升级区块链的chaincode
      \upgrade.sh # 升级区块链的chaincode，会调用upgrade.js
  \src # Typescript 源文件都在这个目录下, 编译后的文件都在dist目录下
    |
    \config # Access Control Limit, 权限控制相关代码
      |
      \constants.ts # Jupiter项目里所有的常数与配置信息都在这个文件里
      \network.yaml # 区块链网络定义
      \org1.yaml # org1定义
    \interfaces # 定义接口类型，data schema
    \routers # 这个目录包含Express的路由
      |
      \admin.router.ts # 所有/api/v1/grant路由的controller
      \auth.router.ts # 所有/api/v1/auth路由的controller
      \identity.router.ts # 所有/api/v1/identity路由的controller
      \token.router.ts # 所有/api/v1/token路由的controller
      \user.router.ts # 所有/api/v1/user路由的controller
    \services
      |
      \FabricService.ts # 访问区块链服务
      \MspWrapper.ts # 访问MSP服务
    \utils # 这个目录提供一些util方法
      |
      \Response.ts # 生成标准化的返回结果
      \Validator.ts # 验证某个请求的参数是否有效
  \test # 测试文件都在这个目录下, 测试框架采用mocha，所有的测试文件都以*.test.ts命名
    \routers # 这个目录包含了所有REST API的单元测试
    \services # 这个目录包含lib/model目录下对应文件的测试
```

## 运维相关

### 区块链网络

我们启动了了一个测试区块链网络，由一个orderer，两个org组成，每个org有一个peer，每个peer会接couchdb作为区块链的statedb。

在启动区块链网络时，每个peer都需要配置证书，证书由fabric项目提供的工具`cryptogen`来生成，配置文件为`ops/network/crypto-config.yaml`，执行`ops/network/cryptogen.sh`就可以生成区块链网络的证书了，证书文件在crypto-config文件中

当我们有了证书文件以后，就可以使用fabric项目提供的工具`configtxgen`来生成创世区块和channel的初始配置文件了。执行`ops/network/configtxgen.sh`就可以生成区块链的创世区块`genesis.block`和channel的初始配置`channel.tx`。

当上面两步都完成之后，就可以启动区块链网络了，我们使用`ops/network/docker-compose.yml`启动测试区块链网络。

网络端口
每个

peer需要开放两个端口，默认是7051（endorse）和7053（event），我们配置了两个peer，所以是7051，7053和8051，8053
orderer需要开放一个端口，默认7050（commit）
DappJupiter rest server需要开放3002端口
Venus rest server需要开放3001端口
DappSwagger API需要开放8081端口

### 开发服务器配置

开发服务器需要配置以下工具

- ssh
- git, 需要配置github ssh key，从而使git能够从github仓库里checkout代码
- docker
- docker-compose
- python2
- node 8.x
- npm 5.x
- yarn 1.7

### 本地配置

本地需要配置`~/.ssh/config`，如果`~/.ssh/config`不存在，新建该文件，配置开发服务器信息如下：
```
Host dev
    HostName 52.15.91.107
    User ubuntu
    IdentityFile ~/.ssh/XDMu.pem
```
其中IdentityFile为开发服务器的证书路径

### dev服务器部署

以下所有命令均在本机执行

copy code to dev server

```bash
yarn deploy
```

tear down dev blockchain network

```bash
yarn bc:tearDown
```

setup staging blockchain network

```bash
yarn bc:setup
```

upgrade chaincode

```
yarn bc:upgrade
```

clean, remove jupiter docker container and images. Then re-build Jupiter docker image at dev server
```bash
yarn api:build
```

start jupiter docker container

```bash
yarn api:setup
```

### 更新Chaincode

1. 在本地开发好更新，push到Earth项目的master分支
2. 运行命令`yarn deploy`
3. 运行命令`yarn bc:upgrade`

### 更新API Server

1. 在本地开发好更新，push到git master分支
2. 运行命令`yarn deploy`
3. 运行命令`yarn api:build`
4. 运行命令`yarn api:setup`

