# Austin Rainwater's Scriptable Modules

## About

These are some TypeScript modules I've written to be used with the 
[Scriptable](https://scriptable.app) app for iOS. 

They do not show up as standalone scripts in the Scriptable app, nor do they add TypeScript 
compatibility to Scriptable. However, they do abstract away a lot of complex logic, allowing me to
write simple scripts either in Scriptable or in Shortcuts inline scripts.

For example:

```javascript
const { ExampleClass } = importModule('modules/example');

const example = new ExampleClass();
await example.doSomething();
```

This takes advantage of how [importModule](https://docs.scriptable.app/importmodule/) works to find
modules in various locations.

## Usage

The recommended way to use this repo is to fork it, clone your fork into the Scriptable folder
on your iCloud drive. 

```bash
# The path may be different on your device
cd ~/Library/Mobile\ Documents/iCloud\~dk\~simonbs\~Scriptable/Documents

git clone https://github.com/yourusername/scriptable-modules.git modules
```

If you just want to use the code as is, the compiled JavaScript files are included, so you do not 
need to install anything. However, if you make changes to TypeScript files, or just want fresh 
copies of the modules, you will need to make sure you have NodeJS installed. Then, you can run 
the tsx compiler to generate the JavaScript files:

```bash
npm run build
```

Finally, you can import the modules you want to use in your scripts. To use the 
[example module](example/index.ts), you would do the following in Scriptable or an inline script:

```javascript
const ExampleClass = importModule('modules/example');

const example = new ExampleClass();
let result = await example.doSomething();
Script.complete(result)
```