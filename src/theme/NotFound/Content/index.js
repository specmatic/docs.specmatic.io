import React from 'react';
import clsx from 'clsx';
import Translate from '@docusaurus/Translate';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';

export default function NotFoundContent({className}) {
  const logoUrl = useBaseUrl('/img/specmatic-logo-round.svg');

  return (
    <main className={clsx('container margin-vert--xl', className)}>
      <div className="row">
        <div className="col col--8 col--offset-2">
          <Heading as="h1" className="hero__title">
            <Translate id="theme.NotFound.title" description="The title of the 404 page">
              404: Contract Not Found
            </Translate>
          </Heading>

          <div style={{textAlign: 'center', marginBottom: '2rem'}}>
            <img
              src={logoUrl}
              alt="Specmatic Logo"
              style={{width: 120, height: 120, objectFit: 'contain'}}
            />
          </div>

          <p>
            <strong>Oops!</strong> The endpoint you're looking for doesn't exist — or maybe the contract changed and the consumer didn't get the memo.
            Welcome to the dark side of dynamic routing. But don't worry, Specmatic's got your back (just… not <em>here</em>).
          </p>

          <hr />

          <h3>🚧 Possible Root Causes</h3>
          <ul>
            <li>Someone changed the API spec and forgot to publish the contract. Classic.</li>
            <li>This page was mocked... and never implemented.</li>
            <li>You hit a flaky test in production. It happens.</li>
            <li>The request is valid. The response? Not so much.</li>
            <li>Or maybe you just mistyped the URL — we've all been there.</li>
          </ul>

          <hr />

          <h3>🔧 Next Steps</h3>
          <ul>
            <li>
              🔁 <a href="https://specmatic.io" target="_blank" rel="noopener noreferrer">Return to Home</a> — our landing page <em>does</em> exist. We tested it.
            </li>
            <li>
              📚 <Link to="/home/">Read the Docs</Link> — for contract clarity and peace of mind.
            </li>
            <li>
              🐛 <a href="https://github.com/specmatic/specmatic" target="_blank" rel="noopener noreferrer">Report an Issue</a> — unless this is the issue.
            </li>
          </ul>

          <hr />

          <h3>🧘‍♂️ Fun Fact</h3>
          <p>
            Specmatic helps your services talk to each other. Unlike this page, which clearly ghosted your request.
          </p>

          <blockquote>
            <em>P.S. If this 404 page is the only thing working in your app, maybe it's time to run Specmatic in CI.</em>
          </blockquote>

          <p style={{opacity: 0.9}}>
            👻 <em>This page is proudly mock-driven, auto-generated, and contract-compliant. Mostly.</em>
          </p>
        </div>
      </div>
    </main>
  );
}
