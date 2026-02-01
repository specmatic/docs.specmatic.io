import React from 'react';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

interface CommercialDownloadProps {
    imageName: string;
    toolVersion: string;
    jarUrl: string;
    repoUrl: string;
    installScript: string;
    mavenGroupId?: string;
    mavenArtifactId?: string;
}

export default function CommercialDownload({
    imageName,
    toolVersion,
    jarUrl,
    repoUrl,
    installScript,
    mavenGroupId,
    mavenArtifactId,
}: CommercialDownloadProps) {
    // Extract tab name from image name (e.g., "specmatic/specmatic-openapi" -> "specmatic-openapi")
    const tabName = imageName.replace('specmatic/', '');

    return (
        <Tabs groupId={`download-${tabName}`}>
            {/* Docker Linux/macOS */}
            <TabItem value="docker-linux" label="Docker (Linux/macOS)">
                <p>To run the latest version:</p>
                <pre><code className="language-bash">{`docker run -it --rm ${imageName} --help`}</code></pre>

                <p>To mount the license file when using Docker, use the <code>-v</code> option to map the host directory containing the license file to <code>/root/.specmatic</code> in the container.</p>

                <pre><code className="language-bash">{`docker run -v "$(pwd):/app" -w /app -v ~/.specmatic:/root/.specmatic -it --rm ${imageName} --help`}</code></pre>

                <p>For older versions, replace <code>VERSION</code> with the desired version number from the <a href={`https://hub.docker.com/r/${imageName}/tags`}>Docker Hub</a> page:</p>
                <pre><code className="language-bash">{`docker run -it --rm ${imageName}:VERSION --help`}</code></pre>
            </TabItem>

            {/* Docker Windows PowerShell */}
            <TabItem value="docker-win-ps" label="Docker (Win PowerShell)">
                <p>To run the latest version:</p>
                <pre><code className="language-powershell">{`docker run -it --rm ${imageName} --help`}</code></pre>

                <p>To mount the license file when using Docker, use the <code>-v</code> option to map the host directory containing the license file to <code>/root/.specmatic</code> in the container.</p>

                <p>If running in PowerShell, use the following command:</p>
                <pre><code className="language-powershell">{`docker run -v "\${PWD}:/app" -w /app -v "\${env:USERPROFILE}/.specmatic:/root/.specmatic" -it --rm ${imageName} --help`}</code></pre>

                <p>For older versions, replace <code>VERSION</code> with the desired version number from the <a href={`https://hub.docker.com/r/${imageName}/tags`}>Docker Hub</a> page:</p>
                <pre><code className="language-powershell">{`docker run -it --rm ${imageName}:VERSION --help`}</code></pre>
            </TabItem>

            {/* Docker Windows Command Prompt */}
            <TabItem value="docker-win-cmd" label="Docker (Win CMD)">
                <p>To run the latest version:</p>
                <pre><code className="language-batch">{`docker run -it --rm ${imageName} --help`}</code></pre>

                <p>To mount the license file when using Docker, use the <code>-v</code> option to map the host directory containing the license file to <code>/root/.specmatic</code> in the container.</p>

                <p>If running in Command Prompt, use the following command:</p>
                <pre><code className="language-batch">{`docker run -v "%cd%:/app" -w /app -v "%USERPROFILE%\\.specmatic:/root/.specmatic" -it --rm ${imageName} --help`}</code></pre>

                <p>For older versions, replace <code>VERSION</code> with the desired version number from the <a href={`https://hub.docker.com/r/${imageName}/tags`}>Docker Hub</a> page:</p>
                <pre><code className="language-batch">{`docker run -it --rm ${imageName}:VERSION --help`}</code></pre>
            </TabItem>

            <TabItem value="maven" label="Maven">
                {mavenGroupId && mavenArtifactId ? (
                    <>
                        <p>Add this dependency to your project:</p>

                        <pre>
                            <code className="language-xml">{`<dependency>
  <groupId>${mavenGroupId}</groupId>
  <artifactId>${mavenArtifactId}</artifactId>
  <version>${toolVersion}</version>
</dependency>`}</code>
                        </pre>
                    </>
                ) : (
                    <p>Maven coordinates are not available for this tool.</p>
                )}
            </TabItem>



            {/* JAR */}
            <TabItem value="jar" label="JAR">
                <p>The standalone JAR file can be downloaded from the following sources:</p>
                <ul>
                    <li><a href={jarUrl}>Specmatic Repository</a></li>
                </ul>
                <p>For older versions, please refer to the <a href={repoUrl}>Releases</a> page.</p>
            </TabItem>

            {/* Linux/macOS */}
            <TabItem value="linux-macos" label="Linux/macOS">
                <p>If you have Java 17 or above installed, you can install the executable using the following command and follow the onscreen instructions:</p>
                <p>To run the latest version:</p>
                <pre><code className="language-bash">{`curl https://docs.specmatic.io/${installScript}.sh | bash`}</code></pre>
                <p>To install an older version, replace <code>VERSION</code> with the desired version number from the <a href={repoUrl}>Releases</a> page.</p>
                <pre><code className="language-bash">{`curl https://docs.specmatic.io/${installScript}.sh | bash -- --version VERSION`}</code></pre>
            </TabItem>

            {/* Windows */}
            <TabItem value="windows" label="Windows">
                <p>If you have Java 17 or above installed, you can install the executable using the following PowerShell command and follow the onscreen instructions:</p>
                <p>To install the latest version:</p>
                <pre><code className="language-powershell">{`irm https://docs.specmatic.io/${installScript}.ps1 | iex`}</code></pre>
                <p>To install an older version, replace <code>VERSION</code> with the desired version number from the <a href={repoUrl}>Releases</a> page.</p>
                <pre><code className="language-powershell">{`iex "& { $(irm 'https://docs.specmatic.io/${installScript}.ps1') } --version VERSION"`}</code></pre>
            </TabItem>
        </Tabs>
    );
}
