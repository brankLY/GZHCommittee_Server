const Client = require('fabric-client');
const debug = require('debug');
const LOG = debug('bc:client-store');


async function newClient({ configs, mutualTLS }) {
  try {
    let profile = configs;
    if (configs && !Array.isArray(configs)) {
      profile = [configs];
    }
    if (!profile) {
      throw new Error('Must provide config filepath for this client');
    }
    LOG('Start to load config');
    // Client.setConfigSetting('key-value-store', 'fabric-ca-kvs-mongo');
    const client = Client.loadFromConfig(profile[0]);
    LOG('load config %s', profile[0]);
    if (profile.length > 1) {
      profile.forEach((p, k) => {
        if (k !== 0) {
          client.loadFromConfig(p);
          LOG('load config %s', p);
        }
      });
    }

    if (mutualTLS) {
      const ca = client.getCertificateAuthority();
      const enrollment = await ca.enroll({
        enrollmentID: mutualTLS.enrollmentID,
        enrollmentSecret: mutualTLS.enrollmentSecret,
        profile: 'tls',
      });
      LOG('Successfully enrolled %s', mutualTLS.enrollmentID);
      client.setTlsClientCertAndKey(enrollment.certificate, enrollment.key.toBytes());
    }
    return client;
  } catch (e) {
    throw e;
  }
}

class ClientStore {
  /**
   * @typedef {object} mutualTLSOptions
   * @property {string} enrollmentID - the enrollmentID for this mutualTLS
   * @property {string} enrollmentSecret - the enrollmentSecret for this mutualTLS
   */

  /**
   * @typedef {object} CreateClientOption
   * @property {string[]} configs - the config file path array
   * @property {mutualTLSOptions} mutualTLS - use mutualTLS,
   *                                   and the enrollmentID/enrollmentSecret for this mutualTLS
   */

  /**
   * @param {string} orgName - the orgName of this client
   * @param {CreateClientOption} options - options for create new Client instance
   * @return {Promise<Client>}
   */
  static async get(orgName, options) {
    try {
      if (!this.clients) {
        LOG('no clients found, create new clients store');
        this.clients = {};
      }
      if (typeof orgName !== 'string' || !orgName) {
        throw new Error('Missing required argument orgName');
      }
      if (this.clients[orgName]) {
        LOG('found client %s from cache', orgName);
        return this.clients[orgName];
      }
      LOG('can not found client %s from cache, create new client instance', orgName);
      LOG('create new client with options :: %j', options);
      if (!options) {
        throw new Error('Can not found client from cache, try to create new Client instance, missing required argument options');
      }
      const client = await newClient(options);
      this.clients[orgName] = client;
      return client;
    } catch (e) {
      throw e;
    }
  }
}

module.exports = ClientStore;
