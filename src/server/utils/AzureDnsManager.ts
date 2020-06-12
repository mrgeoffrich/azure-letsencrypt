import { DnsManagementClient } from "@azure/arm-dns";
import * as bunyan from "bunyan";

export class AzureDnsManager {

    public Logger: bunyan;
    public DnsClient: DnsManagementClient;

    public constructor(logger: bunyan, dnsClient: DnsManagementClient) {
        this.Logger = logger;
        this.DnsClient = dnsClient;
    }

    public DemoAddARecord = async () => {
        try
        {
            const resourceGroupName = "testresourceGroupName";
            const zoneName = "testzoneName";
            const relativeRecordSetName = "testrelativeRecordSetName";
            const recordType = "A";
            this.DnsClient.recordSets.get(resourceGroupName, zoneName, relativeRecordSetName, recordType).then((result) => {
                this.Logger.info("The result is:");
                this.Logger.info(result);
            });
        } catch (ex) {
            this.Logger.error(ex.message);
        }
    }
}
