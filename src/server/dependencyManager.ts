import * as bunyan from "bunyan";
import * as http from "http";
import { AzureManager } from "./utils/AzureManager";
import { IAzureSubscription } from "./utils/IAzureSubscription";
import { Mongo } from "./utils/Mongo";

export interface ISettings {
    AzureSettings: string;
}

export interface IAzureAccountsSetting {
    Accounts: IAzureAccount[];
}

export interface IAzureAccount {
    AccountDetails: IAzureSubscription;
    AzureManager: AzureManager;
    LoggedIn: boolean;
}

export interface LetsEncryptSettings {
    EmailAddress : string;
}

class DependencyManager {
    public Logger: bunyan;
    public Mongo: Mongo;
    public AzureAccounts: IAzureAccountsSetting;

    public Initialise = async (server: http.Server,
                               logger: bunyan,
                               logFilePath: string,
                               firstRun: boolean) => {
        this.Logger = logger;
        this.Mongo = new Mongo(logger);
        this.Mongo.Connect();
        this.AzureAccounts = {
            Accounts: []
        }

        this.AzureAccounts.Accounts.push({
            AccountDetails: {
                ClientId: process.env.AZURE_CLIENT_ID,
                ClientSecret: process.env.AZURE_CLIENT_SECRET,
                SubscriptionId: process.env.AZURE_SUBSCRIPTION_ID,
                TenantId: process.env.AZURE_TENANT_ID
            },
            AzureManager: null,
            LoggedIn: false
        });
        await this.LogIntoAccounts();
    }

    private LogIntoAccounts = async () => {
        for (const account of this.AzureAccounts.Accounts) {
            if (!account.LoggedIn) {
                account.AzureManager = new AzureManager(this.Logger, account.AccountDetails);
                await account.AzureManager.Connect();
                account.LoggedIn = true;
            }
        }
    }
}

const dependencyManager: DependencyManager =  new DependencyManager();

// Only ever have one dependency manager
export function Dependencies() {
    return dependencyManager;
}
