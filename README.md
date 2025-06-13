# SARP_Web_App_Server
Web application designed to give service to whoever owns a SARP module by giving feedback from the module peripherals.


# Deploy

## Ensure you can connect to the production server using ssh.

```text
# .ssh/config
Host sarp
  HostName sarp01.westeurope.cloudapp.azure.com
  IdentityFile ~/.ssh/sarp01_key.pem # depends on how you name the file
  User marc
```

_Example to connect to the server_
```bash
ssh sarp
```

```bash
bun deploy
```
