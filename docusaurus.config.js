// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';
import {VERSIONS} from './src/constants/versions';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const specmaticCore = {
  toolVersion: VERSIONS['specmatic-core-version'],
  downloadTarget: "specmatic",
  toolName: "Specmatic",
  siteUrl: "https://docs.specmatic.io",
  pageName: "install-specmatic.sh",
  downloadUrls: [
    `https://repo1.maven.org/maven2/io/specmatic/specmatic-executable-all/${VERSIONS['specmatic-core-version']}/specmatic-executable-all-${VERSIONS['specmatic-core-version']}.jar`,
    `https://github.com/specmatic/specmatic/releases/download/${VERSIONS['specmatic-core-version']}/specmatic.jar`,
    `https://repo.specmatic.io/releases/io/specmatic/specmatic-executable-all/${VERSIONS['specmatic-core-version']}/specmatic-executable-all-${VERSIONS['specmatic-core-version']}.jar`,
  ]
};

const specmaticEnterprise = {
  toolVersion: VERSIONS['specmatic-enterprise-version'],
  downloadTarget: "specmatic-enterprise",
  toolName: "Specmatic Enterprise",
  siteUrl: "https://docs.specmatic.io",
  pageName: "install-specmatic-enterprise.sh",
  downloadUrls: [
    `https://repo1.maven.org/maven2/io/specmatic/enterprise/executable-all/${VERSIONS['specmatic-enterprise-version']}/executable-all-${VERSIONS['specmatic-enterprise-version']}.jar`
  ]
}

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Specmatic',
  tagline: 'Dinosaurs are cool',
  favicon: 'img/specmatic-logo-round.svg',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },
  markdown: {
    mermaid: true,
  },

  themes: [
    "@docusaurus/theme-mermaid",
    [
      require.resolve("@easyops-cn/docusaurus-search-local"),
      /** @type {import("@easyops-cn/docusaurus-search-local").PluginOptions} */
      ({
        hashed: true,
        indexDocs: true,
        indexBlog: false,
        indexPages: false,
        language: ["en"],
        docsRouteBasePath: "/",
      }),
    ],
  ],

  // Set the production url of your site here
  url: 'https://docs.specmatic.io',
  trailingSlash: false,
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'specmatic', // Usually your GitHub org/user name.
  projectName: 'docs.specmatic.io', // Usually your repo name.

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/', // Serve docs at root instead of /docs
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            `https://github.com/specmatic/docs.specmatic.io/edit/main`,
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
  /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/specmatic-logo-round.svg',
      colorMode: {
        defaultMode: 'light',
        respectPrefersColorScheme: false,
      },
      navbar: {
        title: 'Specmatic',
        logo: {
          alt: 'My Site Logo',
          src: 'img/specmatic-logo-round.svg',
        },
        items: [
          {
            type: 'search',
            position: 'right'
          },
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Docs',
          },
          {
            href: 'https://github.com/specmatic/docs.specmatic.io.git',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['groovy', 'kotlin', 'java', 'yaml', 'json', 'properties', 'bash', 'powershell'],
      },
    }),

  plugins: [
    function rawTextPlugin() {
      return {
        name: 'raw-text-loader',
        configureWebpack() {
          return {
            module: {
              rules: [
                {
                  resourceQuery: /raw/, // *.yml?raw
                  type: 'asset/source',
                },
              ],
            },
          };
        },
      };
    },
    [
      '@docusaurus/plugin-client-redirects',
      {
        redirects: [
          // === Redirects from /docs/* to /* (docs prefix redirects) ===
          // contract_driven_development
          { from: '/docs/contract_driven_development/backward_compatibility/', to: '/contract_driven_development/backward_compatibility' },
          { from: '/docs/contract_driven_development/backward_compatibility_rules/', to: '/contract_driven_development/backward_compatibility_rules' },
          { from: '/docs/contract_driven_development/central_contract_repository/', to: '/contract_driven_development/central_contract_repository' },
          { from: '/docs/contract_driven_development/contract_testing/', to: '/contract_driven_development/contract_testing' },
          { from: '/docs/contract_driven_development/generating_api_specifications/', to: '/contract_driven_development/generating_api_specifications' },
          { from: '/docs/contract_driven_development/service_virtualization/', to: '/contract_driven_development/service_virtualization' },
          // enterprise_onboarding
          {from: '/docs/enterprise_onboarding/insights/', to: '/enterprise_onboarding/insights'},
          {from: '/docs/enterprise_onboarding/license_key/', to: '/enterprise_onboarding/license_key'},
          { from: '/docs/enterprise_onboarding/offline_license_set_up/', to: '/enterprise_onboarding/offline_license_set_up' },
          { from: '/docs/enterprise_onboarding/SSO/entra-integration/', to: '/enterprise_onboarding/SSO/entra-integration' },
          { from: '/docs/enterprise_onboarding/SSO/okta-integration/', to: '/enterprise_onboarding/SSO/okta-integration' },
          // features
          {from: '/docs/features/authentication/', to: '/features/authentication'},
          {from: '/docs/features/dictionary/', to: '/features/dictionary'},
          { from: '/docs/features/testing_event_flows-and_behaviors/', to: '/features/testing_event_flows-and_behaviors' },
          {from: '/docs/features/external_examples/', to: '/features/external_examples'},
          {from: '/docs/features/stubbing_featurehub/', to: '/features/stubbing_featurehub'},
          {from: '/docs/features/overlays/', to: '/features/overlays'},
          {from: '/docs/features/hooks', to: '/features/adapters/'},
          {from: '/docs/features/hooks/hooks_to_modify_specs', to: '/features/adapters/adapters_to_modify_specs'},
          {from: '/docs/features/hooks/processor_hooks', to: '/features/adapters/request_response_adapters'},
          {from: '/docs/features/adapters/processor_adapters/', to: '/features/adapters/request_response_adapters'},
          {from: '/docs/features/json_schema/anyOf-support/', to: '/features/json_schema/anyOf-support'},
          {from: '/docs/features/json_schema/discriminator/', to: '/features/json_schema/discriminator'},
          // getting_started
          {from: '/docs/getting_started/cli_quick_start/', to: '/getting_started/cli_quick_start'},
          {from: '/docs/getting_started/mcp_auto_test/', to: '/getting_started/mcp_auto_test'},
          {from: '/docs/getting_started/studio_quick_start/', to: '/getting_started/studio_quick_start'},
          // references
          {from: '/docs/references/configuration/', to: '/references/configuration'},
          { from: '/docs/references/configuration/complete-examples/', to: '/references/configuration/complete-examples' },
          { from: '/docs/references/configuration/contract-management/', to: '/references/configuration/contract-management' },
          {from: '/docs/references/configuration/getting-started/', to: '/references/configuration/getting-started'},
          {from: '/docs/references/configuration/hooks/', to: '/references/configuration/adapters'},
          {from: '/references/configuration/hooks/', to: '/references/configuration/adapters'},
          {from: '/docs/references/configuration/adapters/', to: '/references/configuration/adapters'},
          {from: '/docs/references/configuration/reports/', to: '/references/configuration/reports'},
          { from: '/docs/references/configuration/stub-configuration/', to: '/references/configuration/mock-configuration' },
          {from: '/docs/references/configuration/telemetry/', to: '/references/configuration/telemetry'},
          {from: '/docs/references/configuration/template-values/', to: '/references/configuration/template-values'},
          { from: '/docs/references/configuration/test-configuration/', to: '/references/configuration/test-configuration' },
          { from: '/docs/references/configuration/upgrade-specmatic-config/', to: '/references/configuration/upgrade-specmatic-config' },
          {from: '/docs/references/continuous_integration/', to: '/references/continuous_integration'},
          {from: '/docs/references/troubleshooting/', to: '/references/troubleshooting'},
          {from: '/docs/references/understanding_errors/', to: '/references/understanding_errors'},
          {from: '/docs/references/docker_images/', to: '/references/docker_images'},
          // supported_protocols
          {from: '/docs/supported_protocols/', to: '/supported_protocols'},
          {from: '/docs/supported_protocols/arazzo/', to: '/supported_protocols/arazzo'},
          {from: '/docs/supported_protocols/graphql/', to: '/supported_protocols/graphql'},
          {from: '/docs/supported_protocols/grpc/', to: '/supported_protocols/grpc'},
          {from: '/docs/supported_protocols/jdbc/', to: '/supported_protocols/jdbc'},
          {from: '/docs/supported_protocols/redis/', to: '/supported_protocols/redis'},
          {from: '/docs/supported_protocols/soap/', to: '/supported_protocols/soap'},
          {from: '/docs/supported_protocols/asyncapi/', to: '/supported_protocols/asyncapi'},
          {from: '/docs/supported_protocols/asyncapi/active-mq/', to: '/supported_protocols/asyncapi/active-mq'},
          { from: '/docs/supported_protocols/asyncapi/aws-event-bridge/', to: '/supported_protocols/asyncapi/aws-event-bridge' },
          {from: '/docs/supported_protocols/asyncapi/aws-sns/', to: '/supported_protocols/asyncapi/aws-sns'},
          {from: '/docs/supported_protocols/asyncapi/aws-sqs/', to: '/supported_protocols/asyncapi/aws-sqs'},
          { from: '/docs/supported_protocols/asyncapi/google-pub-sub/', to: '/supported_protocols/asyncapi/google-pub-sub' },
          {from: '/docs/supported_protocols/asyncapi/jms/', to: '/supported_protocols/asyncapi/jms'},
          {from: '/docs/supported_protocols/asyncapi/kafka/', to: '/supported_protocols/asyncapi/kafka'},
          { from: '/docs/supported_protocols/asyncapi/migrate-from-specmatic-kafka-to-async/', to: '/supported_protocols/asyncapi/migrate-from-specmatic-kafka-to-async' },
          {from: '/docs/supported_protocols/asyncapi/mqtt/', to: '/supported_protocols/asyncapi/mqtt'},
          {from: '/docs/supported_protocols/asyncapi/rabbit-mq/', to: '/supported_protocols/asyncapi/rabbit-mq'},
          {from: '/docs/supported_protocols/asyncapi/web-sockets/', to: '/supported_protocols/asyncapi/web-sockets'},
          // top-level pages
          {from: '/docs/home/', to: '/home'},
          {from: '/docs/download/', to: '/download'},
          {from: '/docs/sample_projects/', to: '/sample_projects'},
          {from: '/docs/security-disclosure/', to: '/security-disclosure'},
          {from: '/docs/vulnerability-remediation-sla/', to: '/vulnerability-remediation-sla'},

          // === Legacy redirects (from old documentation paths) ===
          {
            from: [
              '/backward_compatibility',
              '/backward_compatibility.html',
              '/documentation/backward_compatibility',
              '/documentation/backward_compatibility.html',
              '/documentation/tutorials/backward_compatibility',
              '/documentation/tutorials/backward_compatibility.html'
            ],
            to: '/contract_driven_development/backward_compatibility'
          },
          {
            from: [
              '/backward_compatibility_rules',
              '/backward_compatibility_rules.html',
              '/documentation/backward_compatibility_rules',
              '/documentation/backward_compatibility_rules.html',
              '/documentation/tutorials/backward_compatibility_rules',
              '/documentation/tutorials/backward_compatibility_rules.html'
            ],
            to: '/contract_driven_development/backward_compatibility_rules'
          },
          {
            from: [
              '/documentation/central_contract_repository',
              '/documentation/central_contract_repository.html',
              '/documentation/tutorials/central_contract_repository',
              '/documentation/tutorials/central_contract_repository.html'
            ],
            to: '/contract_driven_development/central_contract_repository'
          },
          {
            from: [
              '/contract_tests',
              '/contract_tests.html',
              '/documentation/contract_testing',
              '/documentation/contract_testing.html',
              '/documentation/contract_tests',
              '/documentation/contract_tests.html',
              '/documentation/supported_protocols/contract_tests',
              '/documentation/supported_protocols/contract_tests.html',
              '/documentation/tutorials/contract_testing',
              '/documentation/tutorials/contract_testing.html'
            ],
            to: '/contract_driven_development/contract_testing'
          },
          {
            from: [
              '/documentation/authoring_contracts',
              '/documentation/authoring_contracts.html',
              '/documentation/tutorials/generating_api_specifications',
              '/documentation/tutorials/generating_api_specifications.html'
            ],
            to: '/contract_driven_development/generating_api_specifications'
          },
          {
            from: [
              '/documentation/contract_driven_development',
              '/documentation/contract_driven_development.html',
              '/documentation/tutorials',
              '/documentation/tutorials.html'
            ],
            to: '/contract_driven_development'
          },
          {
            from: [
              '/documentation/service_virtualisation',
              '/documentation/service_virtualisation.html',
              '/documentation/service_virtualization_tutorial',
              '/documentation/service_virtualization_tutorial.html',
              '/documentation/tutorials/service_virtualization',
              '/documentation/tutorials/service_virtualization.html',
              '/service_virtualization_tutorial',
              '/service_virtualization_tutorial.html'
            ],
            to: '/contract_driven_development/service_virtualization'
          },
          {
            from: [
              '/documentation/insights',
              '/documentation/insights.html',
              '/documentation/references/insights',
              '/documentation/references/insights.html'
            ],
            to: '/enterprise_onboarding/insights'
          },
          {
            from: [
              '/documentation/license_key',
              '/documentation/license_key.html'
            ],
            to: '/enterprise_onboarding/license_key'
          },
          {
            from: [
              '/authentication',
              '/authentication.html',
              '/documentation/authentication',
              '/documentation/authentication.html',
              '/documentation/features/authentication',
              '/documentation/features/authentication.html'
            ],
            to: '/features/authentication'
          },
          {
            from: [
              '/features/convert_gherkin_to_openapi',
              '/features/convert_gherkin_to_openapi.html',
              '/documentation/convert_gherkin_to_openapi',
              '/documentation/convert_gherkin_to_openapi.html'
            ],
            to: '/features/overlays'
          },
          {
            from: [
              '/documentation/dictionary',
              '/documentation/dictionary.html',
              '/documentation/features/dictionary',
              '/documentation/features/dictionary.html'
            ],
            to: '/features/dictionary'
          },
          {
            from: [
              '/documentation/external_examples',
              '/documentation/external_examples.html',
              '/documentation/features/external_examples',
              '/documentation/features/external_examples.html'
            ],
            to: '/features/external_examples'
          },
          {
            from: [
              '/documentation/api_gateways',
              '/documentation/api_gateways.html',
              '/documentation/features/hooks_to_modify_specs',
              '/documentation/features/hooks_to_modify_specs.html',
              '/features/hooks_to_modify_specs',
              '/features/hooks_to_modify_specs.html',
              '/features/hooks/hooks_to_modify_specs',
              '/features/hooks/hooks_to_modify_specs.html',
              '/documentation/features/adapters_to_modify_specs',
              '/documentation/features/adapters_to_modify_specs.html',
              '/features/adapters_to_modify_specs',
              '/features/adapters_to_modify_specs.html'
            ],
            to: '/features/overlays'
          },
          {
            from: [
              '/features/processor_hooks',
              '/features/processor_hooks.html',
              '/features/hooks/processor_hooks',
              '/features/hooks/processor_hooks.html',
              '/features/processor_adapters',
              '/features/processor_adapters.html'
            ],
            to: '/features/adapters/request_response_adapters'
          },
          {
            from: [
              '/documentation/features',
              '/documentation/features.html'
            ],
            to: '/features'
          },
          {
            from: [
              '/documentation/anyOf-support',
              '/documentation/anyOf-support.html',
              '/documentation/features/json_schema/anyOf-support',
              '/documentation/features/json_schema/anyOf-support.html'
            ],
            to: '/features/json_schema/anyOf-support'
          },
          {
            from: [
              '/documentation/discriminator',
              '/documentation/discriminator.html',
              '/documentation/features/json_schema/discriminator',
              '/documentation/features/json_schema/discriminator.html'
            ],
            to: '/features/json_schema/discriminator'
          },
          {
            from: [
              '/documentation/features/json_schema',
              '/documentation/features/json_schema.html'
            ],
            to: '/features/json_schema'
          },
          {
            from: [
              '/documentation/features/stubbing_featurehub',
              '/documentation/features/stubbing_featurehub.html',
              '/documentation/stubbing_featurehub',
              '/documentation/stubbing_featurehub.html'
            ],
            to: '/features/stubbing_featurehub'
          },
          {
            from: [
              '/documentation/getting_started/cli_quick_start',
              '/documentation/getting_started/cli_quick_start.html'
            ],
            to: '/getting_started/cli_quick_start'
          },
          {
            from: [
              '/documentation/getting_started',
              '/documentation/getting_started.html'
            ],
            to: '/getting_started'
          },
          {
            from: [
              '/documentation/getting_started/mcp_auto_test',
              '/documentation/getting_started/mcp_auto_test.html',
              '/documentation/mcp_auto_test',
              '/documentation/mcp_auto_test.html'
            ],
            to: '/getting_started/mcp_auto_test'
          },
          {
            from: [
              '/Specmatic Studio',
              '/Specmatic Studio.html',
              '/documentation/getting_started/studio_quick_start',
              '/documentation/getting_started/studio_quick_start.html',
              '/studio_quick_start',
              '/studio_quick_start.html'
            ],
            to: '/getting_started/studio_quick_start'
          },
          {
            from: [
              '/documentation.html',
              '/documentation'
            ],
            to: '/home'
          },
          {
            from: [
              '/documentation/configuration',
              '/documentation/configuration.html',
              '/documentation/references',
              '/documentation/references.html',
              '/documentation/references/configuration',
              '/documentation/references/configuration.html',
              '/documentation/specmatic_json',
              '/documentation/specmatic_json.html',
              '/specmatic_json',
              '/specmatic_json.html',
              '/supported_protocols/asyncapi/references/configuration',
              '/supported_protocols/asyncapi/references/configuration.html'
            ],
            to: '/references/configuration'
          },
          {
            from: [
              '/documentation/configuration_v1',
              '/documentation/configuration_v1.html',
              '/documentation/references/configuration_v1',
              '/documentation/references/configuration_v1.html'
            ],
            to: '/references/configuration'
          },
          {
            from: [
              '/documentation/continuous_integration',
              '/documentation/continuous_integration.html',
              '/documentation/references/continuous_integration',
              '/documentation/references/continuous_integration.html'
            ],
            to: '/references/continuous_integration'
          },
          {
            from: [
              '/documentation/docker_images',
              '/documentation/docker_images.html',
              '/documentation/references/docker_images',
              '/documentation/references/docker_images.html'
            ],
            to: '/references/docker_images'
          },
          {
            from: [
              '/documentation/older_configuration_versions',
              '/documentation/older_configuration_versions.html',
              '/documentation/references/older_configuration_versions',
              '/documentation/references/older_configuration_versions.html'
            ],
            to: '/references/configuration'
          },
          {
            from: [
              '/documentation/references/troubleshooting',
              '/documentation/references/troubleshooting.html',
              '/documentation/troubleshooting',
              '/documentation/troubleshooting.html'
            ],
            to: '/references/troubleshooting'
          },
          {
            from: [
              '/documentation/reading_reports',
              '/documentation/reading_reports.html',
              '/documentation/references/understanding_errors',
              '/documentation/references/understanding_errors.html'
            ],
            to: '/references/understanding_errors'
          },
          {
            from: [
              '/documentation/sample_projects',
              '/documentation/sample_projects.html'
            ],
            to: '/sample_projects'
          },
          {
            from: [
              '/documentation/arazzo',
              '/documentation/arazzo.html',
              '/documentation/supported_protocols/arazzo',
              '/documentation/supported_protocols/arazzo.html'
            ],
            to: '/supported_protocols/arazzo'
          },
          {
            from: [
              '/documentation/supported_protocols/asyncapi/google-pub-sub',
              '/documentation/supported_protocols/asyncapi/google-pub-sub.html'
            ],
            to: '/supported_protocols/asyncapi/google-pub-sub'
          },
          {
            from: [
              '/documentation/supported_protocols/asyncapi',
              '/documentation/supported_protocols/asyncapi.html'
            ],
            to: '/supported_protocols/asyncapi'
          },
          {
            from: [
              '/documentation/stubbing-jms',
              '/documentation/stubbing-jms.html',
              '/documentation/supported_protocols/asyncapi/jms',
              '/documentation/supported_protocols/asyncapi/jms.html'
            ],
            to: '/supported_protocols/asyncapi/jms'
          },
          {
            from: [
              '/documentation/kafka',
              '/documentation/kafka.html',
              '/documentation/supported_protocols/asyncapi/kafka',
              '/documentation/supported_protocols/asyncapi/kafka.html',
              '/kafka',
              '/kafka.html'
            ],
            to: '/supported_protocols/asyncapi/kafka'
          },
          {
            from: [
              '/documentation/migrate-from-specmatic-kafka-to-async',
              '/documentation/migrate-from-specmatic-kafka-to-async.html',
              '/documentation/supported_protocols/asyncapi/migrate-from-specmatic-kafka-to-async',
              '/documentation/supported_protocols/asyncapi/migrate-from-specmatic-kafka-to-async.html'
            ],
            to: '/supported_protocols/asyncapi/migrate-from-specmatic-kafka-to-async'
          },
          {
            from: [
              '/documentation/stubbing-kafka',
              '/documentation/stubbing-kafka.html',
              '/documentation/supported_protocols/asyncapi/stubbing-kafka',
              '/documentation/supported_protocols/asyncapi/stubbing-kafka.html'
            ],
            to: '/supported_protocols/asyncapi/kafka'
          },
          {
            from: [
              '/documentation/graphql',
              '/documentation/graphql.html',
              '/documentation/supported_protocols/graphql',
              '/documentation/supported_protocols/graphql.html'
            ],
            to: '/supported_protocols/graphql'
          },
          {
            from: [
              '/documentation/grpc',
              '/documentation/grpc.html',
              '/documentation/supported_protocols/grpc',
              '/documentation/supported_protocols/grpc.html'
            ],
            to: '/supported_protocols/grpc'
          },
          {
            from: [
              '/documentation/language',
              '/documentation/language.html',
              '/documentation/supported_protocols',
              '/documentation/supported_protocols.html'
            ],
            to: '/supported_protocols'
          },
          {
            from: [
              '/documentation/stubbing-database',
              '/documentation/stubbing-database.html',
              '/documentation/stubbing_database',
              '/documentation/stubbing_database.html',
              '/documentation/supported_protocols/jdbc',
              '/documentation/supported_protocols/jdbc.html'
            ],
            to: '/supported_protocols/jdbc'
          },
          {
            from: [
              '/documentation/stubbing-redis',
              '/documentation/stubbing-redis.html',
              '/documentation/supported_protocols/redis',
              '/documentation/supported_protocols/redis.html'
            ],
            to: '/supported_protocols/redis'
          },
          {
            from: [
              '/documentation/soap',
              '/documentation/soap.html',
              '/documentation/supported_protocols/soap',
              '/documentation/supported_protocols/soap.html',
              '/documentation/wsdl',
              '/documentation/wsdl.html'
            ],
            to: '/supported_protocols/soap'
          },
          {
            from: [
              '/faqs.html'
            ],
            to: '/faqs'
          },
          {
            from: [
              '/original_petstore_spec.html'
            ],
            to: '/original_petstore_spec'
          },
          {
            from: [
              '/rules/index'
            ],
            to: '/rules'
          },

        ]
      }
    ],
    [
      './plugins/textFilePlugin',
      {
        templates: [
          {
            templateFile: './templates/install-specmatic-tool.ps1.ejs',
            outputFiles: [
              {
                filename: 'install-specmatic.ps1',
                data: specmaticCore
              },
              {
                filename: 'install-specmatic-enterprise.ps1',
                data: specmaticEnterprise
              },
            ]
          },
          {
            templateFile: './templates/install-specmatic-tool.sh.ejs',
            outputFiles: [
              {
                filename: 'install-specmatic.sh',
                data: specmaticCore
              },
              {
                filename: 'install-specmatic-enterprise.sh',
                data: specmaticEnterprise
              },
            ]
          },
        ]
      }
    ]
  ],
};

export default config;
