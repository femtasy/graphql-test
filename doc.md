# Project Scalability
- for this project future we should add an infinite scroll system that does the pagination as you scroll
- if there is images we should add lazyloading to the project
- if there is event listeners like for comments and chat we should add them and not forgot to remove them in the return function of our UseEffect hooks
- if there is no connection we should add web workers to display a filler data and add spinners/loaders for laggy connection
# Technical documentation
- the App.tsx file contain a in-code documentation related to every function, mutation and query used
# Jest
- there was an error with jest configuration that requires to install Babel and configure it
- the Error: Jest: Failed to parse the TypeScript config file D:\graphql-test\jest.config.ts
  Error: Must use import to load ES Module: D:\graphql-test\jest.config.ts
require() of ES modules is not supported.
require() of D:\graphql-test\jest.config.ts from d:\graphql-test\node_modules\jest-config\build\readConfigFileAndSetRootDir.js is an ES module file as it is a .ts file whose nearest parent package.json contains "type": "module" which defines all .ts files in that package scope as ES modules.
Instead change the requiring code to use import(), or remove "type": "module" from D:\graphql-test\package.json.

    at readConfigFileAndSetRootDir (d:\graphql-test\node_modules\jest-config\build\readConfigFileAndSetRootDir.js:116:13)
    at async readInitialOptions (d:\graphql-test\node_modules\jest-config\build\index.js:403:13)
    at async readConfig (d:\graphql-test\node_modules\jest-config\build\index.js:147:48)
    at async readConfigs (d:\graphql-test\node_modules\jest-config\build\index.js:424:26)
    at async runCLI (d:\graphql-test\node_modules\@jest\core\build\cli\index.js:151:59)
    at async Object.run (d:\graphql-test\node_modules\jest-cli\build\run.js:130:37)
error Command failed with exit code 1.
 