const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

module.exports = function textFilePlugin(context, options = {}) {
  const config = {
    templates: options.templates || [],
    outputDir: options.outputDir || '',
  };

  return {
    name: "text-file-plugin",
    async postBuild({ outDir }) {
      const outputDirectory = config.outputDir ? path.join(outDir, config.outputDir) : outDir;

      // Ensure output directory exists
      if (!fs.existsSync(outputDirectory)) {
        fs.mkdirSync(outputDirectory, { recursive: true });
      }

      // Process each template configuration
      for (const templateConfig of config.templates) {
        const {
          templateFile,
          outputFiles = [],
          globalData = {}
        } = templateConfig;

        console.log('[textFilePlugin] Processing template:', templateFile);

        // Read the template file
        const templatePath = path.resolve(templateFile);
        console.log('[textFilePlugin] Resolved template path:', templatePath);

        if (!fs.existsSync(templatePath)) {
          console.warn(`[textFilePlugin] Template file not found: ${templatePath}`);
          continue;
        }

        const templateContent = fs.readFileSync(templatePath, 'utf8');
        console.log('[textFilePlugin] Template loaded, length:', templateContent.length);

        // Generate files for each configuration
        for (const fileConfig of outputFiles) {
          const {
            filename,
            data = {},
            subDir = ''
          } = fileConfig;

          console.log('[textFilePlugin] Generating file:', filename);

          // Merge global data with file-specific data
          const mergedData = { ...globalData, ...data };

          try {
            // Render the template
            const renderedContent = ejs.render(templateContent, mergedData);

            // Determine output path
            const finalOutputDir = subDir ? path.join(outputDirectory, subDir) : outputDirectory;
            if (!fs.existsSync(finalOutputDir)) {
              fs.mkdirSync(finalOutputDir, { recursive: true });
            }

            const outputPath = path.join(finalOutputDir, filename);

            // Write the rendered content
            fs.writeFileSync(outputPath, renderedContent);
            console.log(`[textFilePlugin] Generated: ${path.relative(outDir, outputPath)}`);
          } catch (error) {
            console.error(`[textFilePlugin] Error generating ${filename}:`, error.message);
            throw error
          }
        }
      }

      console.log('[textFilePlugin] File generation complete.');
    },
  };
};
