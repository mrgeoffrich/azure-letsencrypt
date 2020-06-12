import { SecretClient } from "@azure/keyvault-secrets";
import * as msRestNodeAuth from "@azure/ms-rest-nodeauth";
import * as bunyan from "bunyan";

export class AzureKeyVaultManager {

    public Logger: bunyan;
    public Auth: msRestNodeAuth.AuthResponse;
    public KeyVaultName: string;

    public constructor(logger: bunyan, auth: msRestNodeAuth.AuthResponse, keyVaultName: string) {
        this.Logger = logger;
        this.Auth = auth;
        this.KeyVaultName = keyVaultName;
    }

    public Connect = async () => {
        try {
            const vaultUrl = `https://${this.KeyVaultName}.vault.azure.net`;
            const secretClient = new SecretClient(vaultUrl, null);
        } catch (ex) {
            this.Logger.error(ex.message);
        }
    }
}
