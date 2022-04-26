module.exports = {
  apps : [{
    name: 'PWS',
    script: 'node .',
    instances: 1,
    autorestart: true,
    watch: true,
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }]
};