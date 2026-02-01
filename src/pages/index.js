import React from 'react';
import Layout from '@theme/Layout';
import styles from './index.module.css';
import Link from '@docusaurus/Link';

export default function Home() {
  return (
    <Layout
      title="Ship AI-Ready APIs 10x Faster"
      description="Design, test, and govern AI-ready APIs with Specmatic"
    >
      <main className={styles.home}>
        <section className={styles.hero}>
          <h1>Ship AI-Ready APIs 10x Faster with Zero Integration Headaches</h1>
        </section>

        <section className={styles.block}>
          <h2>🪄 Design and build your APIs with <a href="https://specmatic.io/genie/">Genie</a></h2>
          <p>
            Go from idea to AI-ready API, instantly. Describe your business
            requirements in plain English, and Genie generates complete,
            production-grade API specifications, tests, and mocks.
          </p>
          <a href="https://specmatic.io/genie/" className="button button--primary">
            Ask Genie
          </a>
        </section>

        <section className={styles.block}>
          <h2>🖥️ Contract Test your APIs Visually with <a href="https://specmatic.io/specmatic-studio/">Studio</a></h2>
          <p>
            Powerful API workflow and contract testing at your fingertips.
            Visually configure tests, validate contract compliance, and
            seamlessly integrate with CI/CD — all with #NoCode.
          </p>
          <div className={styles.actions}>
            <a href="https://specmatic.io/specmatic-studio/" className="button button--primary">Try Online</a>
            <a href="https://hub.docker.com/extensions/specmatic/specmatic-docker-desktop-extension" className="button button--secondary">
              Docker Desktop Extension
            </a>
            <Link className="button button--secondary homeCtaButton" to="/getting_started/studio_quick_start">
              5 Minute Tutorial
            </Link>
          </div>
        </section>

        <section className={styles.block}>
          <h2>📊 Establish your API Governance with <a href="https://specmatic.io/insights/">Insights</a></h2>
          <p>
            Govern and optimize your API ecosystem with contract adoption,
            dependency tracking, and early problem detection.
          </p>
          <a href="https://specmatic.io/insights/" className="button button--primary">
            View Insights
          </a>
        </section>

        <section className={styles.block}>
          <h2>💻 Try Specmatic Locally with CLI or Programmatic Approach</h2>
          <p>
            Use Specmatic locally, in CI pipelines, Docker, and Kubernetes.
          </p>
          <div className={styles.actions}>
            <Link className="button button--primary homeCtaButton" to="/getting_started/cli_quick_start">
              Get started in less than 5 min
            </Link>
            <a href="https://github.com/specmatic/specmatic" className="button button--secondary">
              View it on GitHub
            </a>
          </div>
        </section>

        <section className={styles.block}>
          <h2>🧪 Automatically Test Your MCP Servers with MCP Auto Tests</h2>
          <ul>
            <li>Run automatic compliance checks</li>
            <li>Detect schema drift and broken contracts</li>
            <li>Ensure agent integrations remain stable</li>
          </ul>
          <div className={styles.actions}>

            <Link className="button button--primary homeCtaButton" to="/getting_started/mcp_auto_test">
              Get started
            </Link>
            <a href="https://github.com/specmatic/specmatic" className="button button--secondary">
              View it on GitHub
            </a>
          </div>
        </section>

        <section className={styles.block}>
          <h2>🤖 Establish Guardrails for your Coding Agents with our MCP</h2>
          <p>
            Specmatic MCP acts as intelligent guardrails for coding agents like
            Claude, Copilot, and Codex CLI.
          </p>
          <div className={styles.actions}>
            <a href="https://github.com/specmatic/specmatic-mcp-server" className="button button--primary">
              Try it Out
            </a>
            <a href="https://github.com/specmatic/specmatic-mcp-sample" className="button button--secondary">
              Sample Project
            </a>
          </div>
        </section>
      </main>
    </Layout>
  );
}
