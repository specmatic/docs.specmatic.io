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
      {title && <p>{title}</p>}
      <CodeBlock language={language}>
        {JSON.stringify(object, null, 2)}
      </CodeBlock>
    </div>
  );
}

export function YamlDisplay({ object, title }: JsonDisplayProps) {
  return (
    <div>
      {title && <p>{title}</p>}
      <CodeBlock language="yaml">
        {yaml.dump(object)}
      </CodeBlock>
    </div>
  );
}
