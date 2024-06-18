export const environment = {
    production: true,
    baseUrl: 'http://localhost:8081',
    assetsUrl: 'toyota/assets',
    imageByDefault: 'assets/images/bydefault/image-not-found.jpg',
    serverImagesPath: 'assets/images/',
    graphqlServerAddress: 'https://localhost:8089/gql/',
    webSocketAddress: 'wss://localhost:8089',
    serverUrl: 'https://localhost:8089',
    apiUploadUrl: 'http://localhost:8089/api/file/upload',
    uploadFolders: {        
        completePathToFiles: 'https://localhost:8089/files',
        catalogs: 'catalogs',
    },
    snackByDefaultDuration: 2000,
};
