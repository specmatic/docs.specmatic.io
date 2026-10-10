// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

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
  /** @type {any} */ ([
      require.resolve("@easyops-cn/docusaurus-search-local"),
      {
        hashed: true,
        indexDocs: true,
        indexBlog: false,
        indexPages: false,
        language: ["en"],
      },
    ]),
  ],

  // Set the production url of your site here
  url: 'https://your-docusaurus-site.example.com',
  trailingSlash: true,
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'facebook', // Usually your GitHub org/user name.
  projectName: 'docusaurus', // Usually your repo name.

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
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/specmatic/specmatic-documentation',
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
      image: 'img/docusaurus-social-card.jpg',
      colorMode: {
        respectPrefersColorScheme: true,
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
      },
    }),

  plugins: [
        [
              '@docusaurus/plugin-client-redirects',
              {
                redirects: [
                  {
                    from: [
                      '/backward_compatibility',
                      '/backward_compatibility.html',
                      '/documentation/backward_compatibility',
                      '/documentation/backward_compatibility.html',
                      '/documentation/tutorials/backward_compatibility',
                      '/documentation/tutorials/backward_compatibility.html'
                    ],
                    to: '/docs/contract_driven_development/backward_compatibility/'
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
                    to: '/docs/contract_driven_development/backward_compatibility_rules/'
                  },
                  {
                    from: [
                      '/documentation/central_contract_repository',
                      '/documentation/central_contract_repository.html',
                      '/documentation/tutorials/central_contract_repository',
                      '/documentation/tutorials/central_contract_repository.html'
                    ],
                    to: '/docs/contract_driven_development/central_contract_repository/'
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
                    to: '/docs/contract_driven_development/contract_testing/'
                  },
                  {
                    from: [
                      '/documentation/authoring_contracts',
                      '/documentation/authoring_contracts.html',
                      '/documentation/tutorials/generating_api_specifications',
                      '/documentation/tutorials/generating_api_specifications.html'
                    ],
                    to: '/docs/contract_driven_development/generating_api_specifications/'
                  },
                  {
                    from: [
                      '/contract_driven_development',
                      '/contract_driven_development.html',
                      '/documentation/contract_driven_development',
                      '/documentation/contract_driven_development.html',
                      '/documentation/tutorials',
                      '/documentation/tutorials.html',
                      '/documentation/tutorials/'
                    ],
                    to: '/docs/contract_driven_development/contract_testing/'
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
                    to: '/docs/contract_driven_development/service_virtualization/'
                  },
                  {
                    from: [
                      '/documentation/insights',
                      '/documentation/insights.html',
                      '/documentation/references/insights',
                      '/documentation/references/insights.html'
                    ],
                    to: '/docs/enterprise_onboarding/insights/'
                  },
                  {
                    from: [
                      '/documentation/license_key',
                      '/documentation/license_key.html'
                    ],
                    to: '/docs/enterprise_onboarding/license_key/'
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
                    to: '/docs/features/authentication/'
                  },
                  {
                    from: [
                      '/documentation/authentication-by-reaching-another-service',
                      '/documentation/authentication-by-reaching-another-service.html',
                      '/documentation/features/authentication-by-reaching-another-service',
                      '/documentation/features/authentication-by-reaching-another-service.html'
                    ],
                    to: '/docs/references/configuration/authentication/'
                  },
                  {
                    from: [
                      '/documentation/convert_gherkin_to_openapi',
                      '/documentation/convert_gherkin_to_openapi.html'
                    ],
                    to: '/docs/features/overlays/'
                  },
                  {
                    from: [
                      '/documentation/dictionary',
                      '/documentation/dictionary.html',
                      '/documentation/features/dictionary',
                      '/documentation/features/dictionary.html'
                    ],
                    to: '/docs/features/dictionary/'
                  },
                  {
                    from: [
                      '/documentation/external_examples',
                      '/documentation/external_examples.html',
                      '/documentation/features/external_examples',
                      '/documentation/features/external_examples.html'
                    ],
                    to: '/docs/features/external_example3/'
                  },
                  {
                    from: [
                      '/documentation/api_gateways',
                      '/documentation/api_gateways.html',
                      '/documentation/features/hooks_to_modify_specs',
                      '/documentation/features/hooks_to_modify_specs.html',
                      '/features/hooks_to_modify_specs',
                      '/features/hooks_to_modify_specs.html'
                    ],
                    to: '/docs/features/hooks/hooks_to_modify_specs/'
                  },
                  {
                    from: [
                      '/features/processor_hooks',
                      '/features/processor_hooks.html'
                    ],
                    to: '/docs/features/hooks/processor_hooks/'
                  },
                  {
                    from: [
                      '/documentation/features',
                      '/documentation/features.html',
                      '/documentation/features/'
                    ],
                    to: '/docs/features/authentication/'
                  },
                  {
                    from: [
                      '/documentation/anyOf-support',
                      '/documentation/anyOf-support.html',
                      '/documentation/features/json_schema/anyOf-support',
                      '/documentation/features/json_schema/anyOf-support.html'
                    ],
                    to: '/docs/features/json_schema/anyOf_support/'
                  },
                  {
                    from: [
                      '/documentation/discriminator',
                      '/documentation/discriminator.html',
                      '/documentation/features/json_schema/discriminator',
                      '/documentation/features/json_schema/discriminator.html'
                    ],
                    to: '/docs/features/json_schema/discriminator/'
                  },
                  {
                    from: [
                      '/documentation/features/json_schema',
                      '/documentation/features/json_schema.html',
                      '/documentation/features/json_schema/'
                    ],
                    to: '/docs/features/json_schema/discriminator/'
                  },
                  {
                    from: [
                      '/documentation/features/stubbing_featurehub',
                      '/documentation/features/stubbing_featurehub.html',
                      '/documentation/stubbing_featurehub',
                      '/documentation/stubbing_featurehub.html'
                    ],
                    to: '/docs/features/feature-hub-stubbing/'
                  },
                  {
                    from: [
                      '/documentation/getting_started/cli_quick_start',
                      '/documentation/getting_started/cli_quick_start.html',
                      '/getting_started',
                      '/getting_started.html'
                    ],
                    to: '/docs/getting_started/cli-quick-start/'
                  },
                  {
                    from: [
                      '/documentation/getting_started',
                      '/documentation/getting_started.html',
                      '/documentation/getting_started/'
                    ],
                    to: '/docs/getting_started/cli-quick-start/'
                  },
                  {
                    from: [
                      '/documentation/getting_started/mcp_auto_test',
                      '/documentation/getting_started/mcp_auto_test.html',
                      '/documentation/mcp_auto_test',
                      '/documentation/mcp_auto_test.html'
                    ],
                    to: '/docs/getting_started/mcp-auto-test/'
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
                    to: '/docs/getting_started/studio-quick-start/'
                  },
                  {
                    from: [
                      '/documentation',
                      '/documentation.html',
                      '/documentation/'
                    ],
                    to: '/docs/home/'
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
                      '/references/configuration',
                      '/references/configuration.html',
                      '/specmatic_json',
                      '/specmatic_json.html',
                      '/supported_protocols/asyncapi/references/configuration',
                      '/supported_protocols/asyncapi/references/configuration.html'
                    ],
                    to: '/docs/references/configuration/'
                  },
                  {
                    from: [
                      '/documentation/configuration_v1',
                      '/documentation/configuration_v1.html',
                      '/documentation/references/configuration_v1',
                      '/documentation/references/configuration_v1.html'
                    ],
                    to: '/docs/references/configuration/'
                  },
                  {
                    from: [
                      '/documentation/continuous_integration',
                      '/documentation/continuous_integration.html',
                      '/documentation/references/continuous_integration',
                      '/documentation/references/continuous_integration.html'
                    ],
                    to: '/docs/references/continuous_integration/'
                  },
                  {
                    from: [
                      '/documentation/docker_images',
                      '/documentation/docker_images.html',
                      '/documentation/references/docker_images',
                      '/documentation/references/docker_images.html'
                    ],
                    to: '/docs/references/using_docker_image/'
                  },
                  {
                    from: [
                      '/documentation/older_configuration_versions',
                      '/documentation/older_configuration_versions.html',
                      '/documentation/references/older_configuration_versions',
                      '/documentation/references/older_configuration_versions.html'
                    ],
                    to: '/docs/references/configuration/'
                  },
                  {
                    from: [
                      '/documentation/references/troubleshooting',
                      '/documentation/references/troubleshooting.html',
                      '/documentation/troubleshooting',
                      '/documentation/troubleshooting.html'
                    ],
                    to: '/docs/references/troubleshooting/'
                  },
                  {
                    from: [
                      '/documentation/reading_reports',
                      '/documentation/reading_reports.html',
                      '/documentation/references/understanding_errors',
                      '/documentation/references/understanding_errors.html'
                    ],
                    to: '/docs/references/understanding_errors/'
                  },
                  {
                    from: [
                      '/documentation/sample_projects',
                      '/documentation/sample_projects.html'
                    ],
                    to: '/docs/sample_projects/'
                  },
                  {
                    from: [
                      '/documentation/arazzo',
                      '/documentation/arazzo.html',
                      '/documentation/supported_protocols/arazzo',
                      '/documentation/supported_protocols/arazzo.html'
                    ],
                    to: '/docs/supported_protocols/arazzo/'
                  },
                  {
                    from: [
                      '/documentation/supported_protocols/asyncapi/google-pub-sub',
                      '/documentation/supported_protocols/asyncapi/google-pub-sub.html'
                    ],
                    to: '/docs/supported_protocols/asyncapi/google-pub-sub/'
                  },
                  {
                    from: [
                      '/documentation/supported_protocols/asyncapi',
                      '/documentation/supported_protocols/asyncapi.html',
                      '/documentation/supported_protocols/asyncapi/'
                    ],
                    to: '/docs/supported_protocols/asyncapi/'
                  },
                  {
                    from: [
                      '/documentation/stubbing-jms',
                      '/documentation/stubbing-jms.html',
                      '/documentation/supported_protocols/asyncapi/jms',
                      '/documentation/supported_protocols/asyncapi/jms.html'
                    ],
                    to: '/docs/supported_protocols/asyncapi/jms/'
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
                    to: '/docs/supported_protocols/asyncapi/kafka/'
                  },
                  {
                    from: [
                      '/documentation/migrate-from-specmatic-kafka-to-async',
                      '/documentation/migrate-from-specmatic-kafka-to-async.html',
                      '/documentation/supported_protocols/asyncapi/migrate-from-specmatic-kafka-to-async',
                      '/documentation/supported_protocols/asyncapi/migrate-from-specmatic-kafka-to-async.html'
                    ],
                    to: '/docs/supported_protocols/asyncapi/migrate-from-specmatic-kafka-to-async/'
                  },
                  {
                    from: [
                      '/documentation/stubbing-kafka',
                      '/documentation/stubbing-kafka.html',
                      '/documentation/supported_protocols/asyncapi/stubbing-kafka',
                      '/documentation/supported_protocols/asyncapi/stubbing-kafka.html'
                    ],
                    to: '/docs/supported_protocols/asyncapi/kafka/'
                  },
                  {
                    from: [
                      '/documentation/graphql',
                      '/documentation/graphql.html',
                      '/documentation/supported_protocols/graphql',
                      '/documentation/supported_protocols/graphql.html'
                    ],
                    to: '/docs/supported_protocols/graphql/'
                  },
                  {
                    from: [
                      '/documentation/grpc',
                      '/documentation/grpc.html',
                      '/documentation/supported_protocols/grpc',
                      '/documentation/supported_protocols/grpc.html'
                    ],
                    to: '/docs/supported_protocols/grpc/'
                  },
                  {
                    from: [
                      '/documentation/language',
                      '/documentation/language.html',
                      '/documentation/supported_protocols',
                      '/documentation/supported_protocols.html',
                      '/documentation/supported_protocols/'
                    ],
                    to: '/docs/supported_protocols/'
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
                    to: '/docs/supported_protocols/jdbc/'
                  },
                  {
                    from: [
                      '/documentation/stubbing-redis',
                      '/documentation/stubbing-redis.html',
                      '/documentation/supported_protocols/redis',
                      '/documentation/supported_protocols/redis.html'
                    ],
                    to: '/docs/supported_protocols/redis/'
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
                    to: '/docs/supported_protocols/soap/'
                  }
                ]
              }
        ]
  ],
};

export default config;
