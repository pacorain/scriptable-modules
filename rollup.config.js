import path from 'path';
import glob from 'glob';
import fs from 'fs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

const moduleJsonFiles = glob.sync('src/**/module.json');
const directories = moduleJsonFiles.map(file => path.dirname(file));

// Get output directory from environment variable SCRIPTABLE_OUTPUT_DIR or default to 'dist'
const outputDir = process.env.MODULE_OUTPUT_DIR || 'dist';

export default directories.map(directory => {
    const moduleConfig = JSON.parse(fs.readFileSync(path.join(directory, 'module.json'), 'utf-8'));

    // Add some automatic flexibility -- try to infer the type, input filename, or both
    // If neither is specified, we can infer both from the presence of index.js or index.ts
    // If only the input is specified, we can infer the type from the file extension
    if (moduleConfig.input === undefined && moduleConfig.type === undefined) {
        let has_js = fs.existsSync(path.join(directory, 'index.js'));
        let has_ts = fs.existsSync(path.join(directory, 'index.ts'));

        if (has_js && has_ts) {
            throw new Error('Cannot infer module type, as both index.js and index.ts exist. Please specify module type in module.json');
        }

        if (has_js) {
            moduleConfig.type = 'javascript';
            moduleConfig.input = 'index.js';
        } else if (has_ts) {
            moduleConfig.type = 'typescript';
            moduleConfig.input = 'index.ts';
        } else {
            throw new Error('Cannot infer module type and input. Please create either index.js or index.ts in the module directory, or specify module input in module.json');
        }
    } else if (moduleConfig.type === undefined) {
        if (moduleConfig.input.endsWith('.ts')) {
            moduleConfig.type = 'typescript';
        } else {
            moduleConfig.type = 'javascript';
        }
    }

    return {
        input: path.join(directory, moduleConfig.input || (moduleConfig.type === 'typescript' ? 'index.ts' : 'index.js')),
        output: {
            file: path.join(outputDir, `${moduleConfig.output || moduleConfig.name || path.basename(directory)}.js`),
            format: moduleConfig.format || 'cjs',
            strict: moduleConfig.strict !== undefined ? moduleConfig.strict : false,
            name: moduleConfig.name || path.basename(directory)
        },
        plugins: moduleConfig.type === 'typescript' ? [typescript(), terser()] : [terser()]
    };
});