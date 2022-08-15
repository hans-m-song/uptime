import * as sst from "@serverless-stack/resources";

export default function (app: sst.App) {
  app.setDefaultFunctionProps({
    runtime: "nodejs16.x",
    srcPath: "services",
    bundle: { format: "esm" },
    environment: { NODE_OPTIONS: "--enable-source-maps" },
  });

  app.setDefaultRemovalPolicy(app.local ? "destroy" : "retain");

  const hostedZone = "axatol.xyz";

  const apiDomainName = app.local
    ? "uptime-api-debug.axatol.xyz"
    : "uptime-api.axatol.xyz";

  const siteDomainName = app.local
    ? "uptime-debug.axatol.xyz"
    : "uptime.axatol.xyz";

  const allowOrigins = app.local
    ? ["http://127.0.0.1:5173"]
    : [`https://${siteDomainName}`];

  app.stack(function stack({ stack }) {
    const historyTable = new sst.Table(stack, "history-table", {
      fields: { day: "number", minute: "number" },
      primaryIndex: { partitionKey: "day", sortKey: "minute" },
    });

    const targetTable = new sst.Table(stack, "target-table", {
      fields: { slug: "string" },
      primaryIndex: { partitionKey: "slug" },
    });

    stack.addDefaultFunctionPermissions([historyTable, targetTable]);
    stack.addDefaultFunctionEnv({ HISTORY_TABLE_NAME: historyTable.tableName });
    stack.addDefaultFunctionEnv({ TARGET_TABLE_NAME: targetTable.tableName });

    new sst.Cron(stack, "cron", {
      schedule: "rate(5 minutes)",
      job: "functions/createHeartbeat.handler",
    });

    const api = new sst.Api(stack, "api", {
      customDomain: { domainName: apiDomainName, hostedZone },
      cors: { allowOrigins },
      routes: {
        "GET    /api/targets": "functions/listTargets.handler",
        "POST   /api/targets": "functions/createTarget.handler",
        // "DELETE /api/targets/{slug}": "functions/deleteTarget.handler",
        "GET    /api/uptime": "functions/getUptime.handler",
        "POST   /api/heartbeat": "functions/submitHeartbeat.handler",
      },
    });

    const site = new sst.ViteStaticSite(stack, "web", {
      path: "web/",
      customDomain: { domainName: siteDomainName, hostedZone },
      environment: {
        REGION: stack.region,
        VITE_API_ENDPOINT: apiDomainName, // api.url,
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
