module.exports = {
  apps : [{
    name   : "sarp-webapp",
    interpreter: "bun",
    node_args: "--env-file /etc/sarp-webapp/.env",
    script : "/opt/sarp-webapp/index.js"
  }]
}