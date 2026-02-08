import Tabs from "@theme/Tabs";
import {v4 as uuidv4} from 'uuid';
import TabItem from "@theme/TabItem";
import {JsonDisplay, YamlDisplay} from "./JsonYamlDisplay";
import {useMemo} from "react";

interface Props {
  v2Object: unknown
  v2ObjectWithoutConfig?: unknown
  v3Object: unknown
}

export function V2V3SpecmaticConfigTabs({v2Object, v3Object, v2ObjectWithoutConfig}: Props) {
  const uuid = useMemo(() => uuidv4(), []);

  return (
    <Tabs groupId={`tab-${uuid}`}>
      <TabItem value="v3" label="Version 3 (recommended)">
        <Tabs groupId="v3-tabs">
          <TabItem value={`specmatic-yaml-v3-${uuid}`} label="specmatic.yaml">
            <YamlDisplay object={v3Object}/>
          </TabItem>
          <TabItem value="{`specmatic-json-v3-${uuid}`}" label="specmatic.json">
            <JsonDisplay object={v3Object}/>
          </TabItem>
        </Tabs>

      </TabItem>
      <TabItem value="v2" label="Version 2">
        <Tabs groupId="v2-tabs">
          <TabItem value={`specmatic-yaml-v2-${uuid}`} label="specmatic.yaml">
            <YamlDisplay object={v2Object}/>
          </TabItem>

          <TabItem value={`specmatic-json-v2-${uuid}`} label="specmatic.json">
            <JsonDisplay object={v2Object}/>
          </TabItem>
        </Tabs>
      </TabItem>

      {
        v2ObjectWithoutConfig && (
          <TabItem value="v2-no-config" label="Version 2 (without config)">
            <Tabs groupId="v2-no-config-tabs">
              <TabItem value={`specmatic-yaml-v2-no-config-${uuid}`} label="specmatic.yaml">
                <YamlDisplay object={v2ObjectWithoutConfig}/>
              </TabItem>

              <TabItem value={`specmatic-json-v2-no-config-${uuid}`} label="specmatic.json">
                <JsonDisplay object={v2ObjectWithoutConfig}/>
              </TabItem>
            </Tabs>

          </TabItem>
        )
      }
    </Tabs>
  )
}