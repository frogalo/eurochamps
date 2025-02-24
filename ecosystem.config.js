module.exports = {
    apps : [{
        name   : "eurochamps-server",
        cwd: "./server",
        script : "src/app.js",
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: '1G',
        env: {
            NODE_ENV: "development"
        },
        env_production: {
            NODE_ENV: "production",
        }
    }, {
        name   : "eurochamps-client",
        cwd: "./client",
        script : "npm",
        args: "start",
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: '1G',
        env: {
            NODE_ENV: "development"
        },
        env_production: {
            NODE_ENV: "production",
        }
    }]
}
