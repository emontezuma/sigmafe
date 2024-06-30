export const environment = {
    production: true,
    baseUrl: 'http://localhost:8081',
    assetsUrl: 'sigma/assets',
    imageByDefault: 'assets/images/bydefault/image-not-found.jpg',
    serverImagesPath: 'assets/images/',
    graphqlServerAddress: 'http://localhost:8089/gql/',
    webSocketAddress: 'wss://localhost:8089',
    serverUrl: 'http://localhost:8089',
    apiUploadUrl: 'http://localhost:8089/api/file/upload',
    apiDownloadUrl: 'https://localhost:8089/api/file/download',
    uploadFolders: {        
        completePathToFiles: 'http://localhost:8089/files',
        catalogs: 'catalogs',
    },
    snackByDefaultDuration: 2000,
};
