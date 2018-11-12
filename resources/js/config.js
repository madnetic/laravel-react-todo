const appUrl = document.head.querySelector('base').getAttribute('href');

const config = {
    appName         : 'laravel-react-todo',
    apiBaseUrl      : `${appUrl}/api`,
    dateFormat      : 'YYYY-MM-DD',
    scrollOpts      : {},
    sessionDataKey  : btoa('todosession'),
    settingsKeyName : btoa('todosettings')
};

export default config;