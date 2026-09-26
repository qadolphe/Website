/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "earlyotter-website",
      removal: input?.stage === "prod" ? "retain" : "remove",
      home: "aws",
      providers: {
        cloudflare: "6.6.0",
      },
    };
  },
  async run() {
    $transform(sst.aws.Function, (args) => {
      if (args.runtime === "nodejs20.x") {
        args.runtime = "nodejs22.x";
      }
    });

    const serverActionsKey = new sst.Secret("NextServerActionsEncryptionKey");
    const webAcl =
      $app.stage === "prod"
        ? new aws.wafv2.WebAcl("EarlyOtterWebAcl", {
            scope: "CLOUDFRONT",
            defaultAction: { allow: {} },
            rules: [
              {
                name: "RateLimitServerActions",
                priority: 0,
                action: { block: {} },
                statement: {
                  rateBasedStatement: {
                    aggregateKeyType: "IP",
                    evaluationWindowSec: 300,
                    limit: 100,
                    scopeDownStatement: {
                      sizeConstraintStatement: {
                        comparisonOperator: "GT",
                        fieldToMatch: {
                          singleHeader: { name: "next-action" },
                        },
                        size: 0,
                        textTransformations: [{ priority: 0, type: "NONE" }],
                      },
                    },
                  },
                },
                visibilityConfig: {
                  cloudwatchMetricsEnabled: true,
                  metricName: "EarlyOtterRateLimitedServerActions",
                  sampledRequestsEnabled: true,
                },
              },
              {
                name: "RateLimitApi",
                priority: 1,
                action: { block: {} },
                statement: {
                  rateBasedStatement: {
                    aggregateKeyType: "IP",
                    evaluationWindowSec: 300,
                    limit: 60,
                    scopeDownStatement: {
                      byteMatchStatement: {
                        fieldToMatch: { uriPath: {} },
                        positionalConstraint: "STARTS_WITH",
                        searchString: "/api/",
                        textTransformations: [{ priority: 0, type: "NONE" }],
                      },
                    },
                  },
                },
                visibilityConfig: {
                  cloudwatchMetricsEnabled: true,
                  metricName: "EarlyOtterRateLimitedApi",
                  sampledRequestsEnabled: true,
                },
              },
            ],
            visibilityConfig: {
              cloudwatchMetricsEnabled: true,
              metricName: "EarlyOtterWebAcl",
              sampledRequestsEnabled: true,
            },
          })
        : undefined;

    const feedback = new sst.aws.Bucket("EarlyOtterFeedback", {
      cors: false,
    });
    new aws.s3.BucketLifecycleConfigurationV2("EarlyOtterFeedbackLifecycle", {
      bucket: feedback.name,
      rules: [
        {
          id: "expire-feedback",
          filter: { prefix: "feedback/" },
          expiration: { days: 365 },
          status: "Enabled",
        },
      ],
    });
    const feedbackViewerPassword = new sst.Secret("FeedbackViewerPassword");
    const telemetry = new sst.aws.Dynamo("EarlyOtterTelemetry", {
      fields: { installId: "string" },
      primaryIndex: { hashKey: "installId" },
      ttl: "expireAt",
    });

    const site = new sst.aws.Nextjs("EarlyOtterWeb", {
      path: ".",
      openNextVersion: "4.0.3",
      link: [feedbackViewerPassword],
      environment: {
        FEEDBACK_BUCKET_NAME: feedback.name,
        TELEMETRY_TABLE_NAME: telemetry.name,
        NEXT_SERVER_ACTIONS_ENCRYPTION_KEY: serverActionsKey.value,
      },
      server: {
        runtime: "nodejs22.x",
      },
      permissions: [
        {
          actions: ["s3:GetObject", "s3:PutObject"],
          resources: [$interpolate`${feedback.arn}/*`],
        },
        {
          actions: ["s3:ListBucket"],
          resources: [feedback.arn],
        },
        {
          actions: ["dynamodb:UpdateItem", "dynamodb:Scan"],
          resources: [telemetry.arn],
        },
      ],
      domain:
        $app.stage === "prod"
          ? {
              name: "earlyotter.com",
              redirects: ["www.earlyotter.com"],
              dns: sst.cloudflare.dns(),
            }
          : undefined,
      transform: webAcl
        ? {
            cdn: (args) => {
              args.transform = {
                distribution: (distributionArgs) => {
                  distributionArgs.webAclId = webAcl.arn;
                },
              };
            },
          }
        : undefined,
    });

    return {
      url: site.url,
    };
  },
});
