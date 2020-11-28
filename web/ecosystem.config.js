module.exports = {
    apps : [{
        script: './bin/www',
        watch: 'true',
        exp_backoff_restart_delay: 100,
        env: {
            "NODE_ENV": "production"
        },
    }],
};
