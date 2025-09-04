# SARP_Web_App_Server
Web application designed to give service to whoever owns a SARP module by giving feedback from the module peripherals.

## How to Run the Project Locally

This project uses [Bun](https://bun.sh/) as its runtime. To run the server locally, follow these steps:

1. **Install Bun**  
  If you don't have Bun installed, follow the instructions at [bun.sh/docs/install](https://bun.sh/docs/install).

2. **Install Dependencies**  
  In the project directory, run:
  ```bash
  bun install
  ```

3. **Create your own .env**
  This project contains a .env with the necessary environment variables to make it run.
  variables are:
  ```bash
  DATABASE_PORT=
  DATABASE_USER=
  DATABASE_PWD=
  DATABASE_HOST=
  DATABASE_NAME=
  DATABASE_URL=postgresql://{database_user}:{database_pwd}@{database_host}:{port}/{database_name}
  BACKEND_URL=
  JWT_SECRET=
  JWT_EXPIRATION=
  PUBLIC_DIR=
  ```

4. **Start the Server**  
  Run the following command to start the server:
  ```bash
  bun run dev
  ```
  or, if a different entry point is specified in `package.json`, use the appropriate script.

5. **Access the Application**  
  By default, the server will be available at `http://localhost:3000` (unless configured otherwise).

Refer to the project documentation or source code for additional configuration options.


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
