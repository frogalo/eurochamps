// ~/apps/eurochamps/ecosystem.config.js
module.exports = {
    apps: [
        {
            name: 'eurochamps-server',
            cwd: './server',
            script: 'src/app.js',
            env: {
                NODE_ENV: 'production',
                PORT: 5000
            },
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '1G'
        }
    ]
};