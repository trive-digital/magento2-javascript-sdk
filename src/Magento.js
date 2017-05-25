import Swagger from 'swagger-client';
import spec from '../spec/Magento21.json';

module.exports = {
  initialize: initialize,
  getShop: shop,
}

function initialize(url, options) {
  if (typeof url === 'string') {
    this.url = url;
    spec.schemes = [this.url.split('://')[0]];
    spec.host = this.url.substr(this.url.indexOf('://') + 3).replace(/\/$/, '');
  }

  options = options || {};
  this.username = options.username || null;
  this.password = options.password || null;
  this.token = options.token || null;
  this.options = options || {};

  var MagentoClient = new Swagger({
    spec: spec,
    usePromise: true,
  })
  .then((client) => {
    return client.integrationAdminTokenServiceV1.integrationAdminTokenServiceV1CreateAdminAccessTokenPost({
        '$body': {
          'username': this.username,
          'password': this.password
        }
      });
  })
  .then(response => response.data.replace(/\"/g, ''))
  .then((data) => {
      this.token = data;
      console.log(this.token);
  })
  .catch((error) => {
    console.error(error);
  });

  this.options.token = this.token || {};

  return MagentoClient;
};

function shop() {
  console.log('token');
  console.log(this.token);
  var MagentoClient = new Swagger({
    spec: spec,
    usePromise: true,
    authorizations : {
      'auth': new Swagger.ApiKeyAuthorization(
          'Authorization',
          'Bearer ' + ''this.token'',
          'header'
      )
    }
  });

  return MagentoClient;
};
