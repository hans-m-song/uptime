import {
  Api,
  App,
  Cron,
  Table,
  ViteStaticSite,
} from "@serverless-stack/resources";

export default function (app: App) {
  app.setDefaultFunctionProps({
    runtime: "nodejs16.x",
    srcPath: "services",
    bundle: { format: "esm" },
    environment: { NODE_OPTIONS: "--enable-source-maps" },
  });

  app.setDefaultRemovalPolicy(app.local ? "destroy" : "retain");

  const hostedZone = "axatol.xyz";

  const apiDomainName = app.local
    ? "uptime-api-debug.k8s.axatol.xyz"
    : "uptime-api.k8s.axatol.xyz";

  const siteDomainName = app.local
    ? "uptime-debug.k8s.axatol.xyz"
    : "uptime.k8s.axatol.xyz";

  app.stack(function stack({ app, stack }) {
    const historyTable = new Table(stack, "history-table", {
      fields: { date: "number", time: "number" },
      primaryIndex: { partitionKey: "date", sortKey: "time" },
    });

    const targetTable = new Table(stack, "target-table", {
      fields: { url: "string" },
      primaryIndex: { partitionKey: "url" },
    });

    app.setDefaultFunctionProps({
      permissions: [historyTable, targetTable],
      environment: {
        HISTORY_TABLE_NAME: historyTable.tableName,
        TARGET_TABLE_NAME: targetTable.tableName,
      },
    });

    new Cron(stack, "cron", {
      schedule: "rate(5 minutes)",
      job: "functions/heartbeat.handler",
    });

    const api = new Api(stack, "api", {
      customDomain: { domainName: apiDomainName, hostedZone },
      cors: { allowOrigins: [`https://${siteDomainName}`] },
      routes: {
        "GET    /api/targets": "functions/listTargets.handler",
        "POST   /api/targets": "functions/createTarget.handler",
        "DELETE /api/targets/{id}": "functions/deleteTarget.handler",
        "GET    /api/uptime": "functions/getUptime.handler",
      },
    });

    const site = new ViteStaticSite(stack, "web", {
      path: "web/",
      customDomain: { domainName: siteDomainName, hostedZone },
      environment: {
        REGION: stack.region,
        API_ENDPOINT: api.url,
      },
    });

    stack.addOutputs({
      ApiEndpoint: api.url,
      SiteURL: site.url,
      HistoryTableName: historyTable.tableName,
      TargetTableName: targetTable.tableName,
    });
  });
}
