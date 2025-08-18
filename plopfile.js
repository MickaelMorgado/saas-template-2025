const { resolve } = require('path');

const basePath = resolve(__dirname, 'src');
const plopTemplatePath = resolve(__dirname, 'plop-templates');
const paths = {
  components: resolve(basePath, 'app/components'),
  pages: resolve(basePath, 'app'),
  pageComponents: resolve(basePath, 'pagesComponents'),
};

module.exports = plop => {
  plop.setGenerator('component', {
    description: 'Create a component',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Enter component name',
      },
    ],
    actions: () => {
      const componentPath = resolve(paths.components, '{{pascalCase name}}');
      const componentTemplatePath = resolve(plopTemplatePath, 'Component');
      const actions = [
        {
          type: 'add',
          path: resolve(componentPath, 'types.ts'),
          templateFile: resolve(componentTemplatePath, 'types.jsx.hbs'),
        },
        {
          type: 'add',
          path: resolve(componentPath, 'index.ts'),
          templateFile: resolve(componentTemplatePath, 'index.jsx.hbs'),
        },
        {
          type: 'add',
          path: resolve(componentPath, '{{pascalCase name}}.tsx'),
          templateFile: resolve(componentTemplatePath, 'component.jsx.hbs'),
        },
      ];
      return actions;
    },
  });

  plop.setGenerator('page', {
    description: 'Generate a new page',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Enter the page name:',
      },
    ],
    actions: () => {
      const pagePlopTemplatePath = resolve(plopTemplatePath, 'Page');
      const actions = [
        {
          type: 'add',
          path: resolve(
            paths.pages,
            '(pages)/[lang]/{{kebabCase name}}/page.tsx'
          ),
          templateFile: resolve(pagePlopTemplatePath, 'page.jsx.hbs'),
        },
      ];
      return actions;
    },
  });
};
