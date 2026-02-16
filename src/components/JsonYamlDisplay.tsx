import React from 'react';
import CodeBlock from '@theme/CodeBlock';
import yaml from 'js-yaml';

interface JsonDisplayProps {
  object: unknown;
  title?: string;
  language?: string;
}

export function JsonDisplay({ object, title, language = 'json' }: JsonDisplayProps) {
  return (
    <div>
      <CodeBlock language={language} title={title}>
        {JSON.stringify(object, null, 2)}
      </CodeBlock>
    </div>
  );
}

export function YamlDisplay({ object, title }: JsonDisplayProps) {
  return (
    <div>
      <CodeBlock language="yaml" title={title}>
        {yaml.dump(object, {quotingType: '"', noCompatMode: true, lineWidth: 9999})}
      </CodeBlock>
    </div>
  );
}
