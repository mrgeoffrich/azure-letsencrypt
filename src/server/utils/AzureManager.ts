import { DnsManagementClient } from "@azure/arm-dns";
import { ClientSecretCredential } from "@azure/identity";
import * as msRestNodeAuth from "@azure/ms-rest-nodeauth";
import * as bunyan from "bunyan";
import { IAzureSubscription } from "./IAzureSubscription";

export class AzureManager {

    public Logger: bunyan;
    public AzureSettings: IAzureSubscription;
    public DnsClient: DnsManagementClient;
    public Auth: msRestNodeAuth.AuthResponse;
    public AuthTwo: ClientSecretCredential;

    public constructor(logger: bunyan, azureSettings: IAzureSubscription) {
        this.Logger = logger;
        this.AzureSettings = azureSettings;
    }

    public Connect = async () => {
        try {
            this.Auth = await msRestNodeAuth.loginWithServicePrincipalSecretWithAuthResponse(
                this.AzureSettings.ClientId, this.AzureSettings.ClientSecret,  this.AzureSettings.TenantId);
            this.AuthTwo = new ClientSecretCredential(this.AzureSettings.TenantId, this.AzureSettings.ClientId, this.AzureSettings.ClientSecret);
            this.DnsClient = new DnsManagementClient(this.Auth.credentials, this.AzureSettings.SubscriptionId);
            this.Logger.info(`Logged into Tenant ${this.AzureSettings.TenantId} and subscription  ${this.AzureSettings.SubscriptionId}`);
        } catch (ex) {
            this.Logger.error(ex.message);
        }
    }
}
