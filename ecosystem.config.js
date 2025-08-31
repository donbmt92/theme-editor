module.exports = {
  apps: [{
    name: 'onghoangdohieu-theme-editor',
    script: 'npm',
    args: 'start',
    cwd: '/root/theme-editor',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3080
    },
    error_file: '/root/logs/onghoangdohieu-error.log',
    out_file: '/root/logs/onghoangdohieu-out.log',
    log_file: '/root/logs/onghoangdohieu.log',
    time: true,
    max_memory_restart: '1G',
    min_uptime: '10s',
    max_restarts: 10
  }]
}
