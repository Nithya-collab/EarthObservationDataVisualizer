module.exports = {
  apps: [
    {
      name: "frontend",
      script: "npm",
      args: "run dev",
      cwd: "./frontend",
      exec_mode: "cluster",
      instances: 4
    }
  ]
}