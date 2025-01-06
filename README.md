# Configuração de Ambiente no Cloud Foundry

Este guia fornece as etapas para configurar e implantar um aplicativo Node.js no Cloud Foundry, incluindo serviços de autenticação (XSUAA) e autoscaler. Siga as instruções abaixo para completar a configuração.

---

## **1. Configurar a API do Cloud Foundry**

1. Configure a API do Cloud Foundry:
   ```bash
   cf api https://api.cf.us10-001.hana.ondemand.com
   ```

2. Faça login no Cloud Foundry:
   ```bash
   cf login
   ```

---

## **2. Criar os Serviços Necessários**

1. Navegue até a pasta `SERVICES`:
   ```bash
   cd SERVICES
   ```

2. Crie o serviço de autenticação XSUAA:
   ```bash
   cf create-service xsuaa application oracle-db-app-xsuaa -c xs-security.json
   ```

3. Crie o serviço de autoscaler:
   ```bash
   cf create-service autoscaler standard oracle-db-app-autoscaler
   ```

---

## **3. Fazer o Deploy do Aplicativo Principal**

1. Navegue até a pasta `SERVER`:
   ```bash
   cd SERVER
   ```

2. Faça o deploy do aplicativo principal:
   ```bash
   cf push
   ```

3. Obtenha a rota (URL) do aplicativo:
   ```bash
   cf app node-oracle-app | findstr routes
   ```
   **Nota:** Copie a URL fornecida pelo comando acima. Você precisará dela para configurar o AppRouter.

---

## **4. Configurar e Vincular o Autoscaler**

1. Volte para a pasta `SERVICES`:
   ```bash
   cd ../SERVICES
   ```

2. Vincule o serviço de autoscaler ao aplicativo principal e atribua a política:
   ```bash
   cf bind-service node-oracle-app oracle-db-app-autoscaler -c autoscaler.json
   ```

---

## **5. Configurar o AppRouter**

1. Navegue até a pasta `APPROUTER`:
   ```bash
   cd ../APPROUTER
   ```

2. Abra o arquivo `manifest.yml` em um editor de texto.

3. Ajuste a variável `destination` com a URL do aplicativo `node-oracle-app` (obtida anteriormente):
   ```yaml
   destinations:
     - name: node-backend
       url: https://node-oracle-app.cfapps.us10-001.hana.ondemand.com
       forwardAuthToken: true
   ```

4. Salve o arquivo.

---

## **6. Fazer o Deploy do AppRouter**

1. Execute o seguinte comando para fazer o deploy do AppRouter:
   ```bash
   cf push
   ```

---

## **Resumo dos Comandos**

```bash
# Configurar a API e fazer login no Cloud Foundry
cf api https://api.cf.us10-001.hana.ondemand.com
cf login

# Criar os serviços
cd SERVICES
cf create-service xsuaa application oracle-db-app-xsuaa -c xs-security.json
cf create-service autoscaler standard oracle-db-app-autoscaler

# Fazer o deploy do app principal
cd SERVER
cf push
cf app node-oracle-app | findstr routes

# Vincular o autoscaler
cd ../SERVICES
cf bind-service node-oracle-app oracle-db-app-autoscaler -c autoscaler.json

# Configurar e fazer deploy do AppRouter
cd ../APPROUTER
cf push
```

---

# Cloud Foundry Environment Setup

This guide provides steps to configure and deploy a Node.js application on Cloud Foundry, including authentication (XSUAA) and autoscaler services. Follow the instructions below to complete the setup.

---

## **1. Set the Cloud Foundry API**

1. Configure the Cloud Foundry API:
   ```bash
   cf api https://api.cf.us10-001.hana.ondemand.com
   ```

2. Log in to Cloud Foundry:
   ```bash
   cf login
   ```

---

## **2. Create the Necessary Services**

1. Navigate to the `SERVICES` folder:
   ```bash
   cd SERVICES
   ```

2. Create the XSUAA authentication service:
   ```bash
   cf create-service xsuaa application oracle-db-app-xsuaa -c xs-security.json
   ```

3. Create the autoscaler service:
   ```bash
   cf create-service autoscaler standard oracle-db-app-autoscaler
   ```

---

## **3. Deploy the Main Application**

1. Navigate to the `SERVER` folder:
   ```bash
   cd SERVER
   ```

2. Deploy the main application:
   ```bash
   cf push
   ```

3. Obtain the application route (URL):
   ```bash
   cf app node-oracle-app | findstr routes
   ```
   **Note:** Copy the URL provided by the command above. You will need it to configure the AppRouter.

---

## **4. Configure and Bind the Autoscaler**

1. Return to the `SERVICES` folder:
   ```bash
   cd ../SERVICES
   ```

2. Bind the autoscaler service to the main application and assign the policy:
   ```bash
   cf bind-service node-oracle-app oracle-db-app-autoscaler -c autoscaler.json
   ```

---

## **5. Configure the AppRouter**

1. Navigate to the `APPROUTER` folder:
   ```bash
   cd ../APPROUTER
   ```

2. Open the `manifest.yml` file in a text editor.

3. Update the `destination` variable with the URL of the `node-oracle-app` application (obtained earlier):
   ```yaml
   destinations:
     - name: node-backend
       url: https://node-oracle-app.cfapps.us10-001.hana.ondemand.com
       forwardAuthToken: true
   ```

4. Save the file.

---

## **6. Deploy the AppRouter**

1. Run the following command to deploy the AppRouter:
   ```bash
   cf push
   ```

---

## **Command Summary**

```bash
# Set the API and log in to Cloud Foundry
cf api https://api.cf.us10-001.hana.ondemand.com
cf login

# Create the services
cd SERVICES
cf create-service xsuaa application oracle-db-app-xsuaa -c xs-security.json
cf create-service autoscaler standard oracle-db-app-autoscaler

# Deploy the main application
cd SERVER
cf push
cf app node-oracle-app | findstr routes

# Bind the autoscaler
cd ../SERVICES
cf bind-service node-oracle-app oracle-db-app-autoscaler -c autoscaler.json

# Configure and deploy the AppRouter
cd ../APPROUTER
cf push
```

---