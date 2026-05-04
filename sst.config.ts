/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "earlyotter-website",
      removal: input?.stage === "prod" ? "retain" : "remove",
      home: "aws",
      providers: {
        cloudflare: true,
      },
    };
  },
  async run() {
    const site = new sst.aws.Nextjs("EarlyOtterWeb", {
      path: ".",
      domain: {
        name: "earlyotter.com",
        redirects: ["www.earlyotter.com"],
        dns: sst.cloudflare.dns(),
      },
    });

    return {
      url: site.url,
    };
  },
});
