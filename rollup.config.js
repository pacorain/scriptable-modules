import path from 'path';
import glob from 'glob';
import fs from 'fs';
import typescript from '@rollup/plugin-typescript';

const moduleJsonFiles = glob.sync('**/module.json');
const directories = moduleJsonFiles.map(file => path.dirname(file));

export default directories.map(directory => {
    const moduleConfig = JSON.parse(fs.readFileSync(path.join(directory, 'module.json'), 'utf-8'));

    return {
        input: path.join(directory, moduleConfig.input || (moduleConfig.type === 'typescript' ? 'index.ts' : 'index.js')),
        output: {
            file: path.join('dist', `${moduleConfig.output || path.basename(directory)}.js`),
            format: moduleConfig.format || 'iife',
            strict: moduleConfig.strict !== undefined ? moduleConfig.strict : false,
            name: moduleConfig.name || path.basename(directory)
        },
        plugins: [typescript()]
    };
});