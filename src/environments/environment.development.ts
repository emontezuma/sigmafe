export const environment = {
    production: false,
    baseUrl: 'localhost:4200',
    assetsUrl: 'assets',
    imageByDefault: 'assets/images/bydefault/image-not-found.jpg',
    serverImagesPath: 'assets/images/',
    graphqlServerAddress: 'https://localhost:7209/gql/',
    webSocketAddress: 'wss://localhost:7209',
    serverUrl: 'https://localhost:7209',
    apiUploadUrl: 'https://localhost:7209/api/file/upload',
    uploadFolders: {
        completePathToFiles: 'https://localhost:7209/files',
        catalogs: 'catalogs',
    },
    snackByDefaultDuration: 2000,
};
