export const environment = {
    production: true,
    baseUrl: 'http://192.168.1.49:8089',
    assetsUrl: 'sigma/assets',
    imageByDefault: 'assets/images/bydefault/image-not-found.jpg',
    serverImagesPath: 'assets/images/',
    graphqlServerAddress: 'http://192.168.1.49:8089/gql/',
    webSocketAddress: 'ws://192.168.1.49:8089',
    serverUrl: 'http://192.168.1.49:8089',
    apiUploadUrl: 'http://192.168.1.49:8089/api/file/upload',
    apiDownloadUrl: 'http://192.168.1.49:8089/api/file/download',
    catalogsUrl: '',
    uploadFolders: {        
        completePathToFiles: 'files',
        catalogs: 'catalogs',
    },
    snackByDefaultDuration: 2000,
};

/* export const environment = {
    production: true,
    baseUrl: 'http://localhost:8081',
    assetsUrl: 'sigma/assets',
    imageByDefault: 'assets/images/bydefault/image-not-found.jpg',
    serverImagesPath: 'assets/images/',
    graphqlServerAddress: 'http://localhost:8089/gql/',
    webSocketAddress: 'ws://localhost:8089',
    serverUrl: 'http://localhost:8089',
    apiUploadUrl: 'http://localhost:8089/api/file/upload',
    apiDownloadUrl: 'http://localhost:8089/api/file/download',
    catalogsUrl: '',
    uploadFolders: {        
        completePathToFiles: 'http://localhost:8089/files',
        catalogs: 'catalogs',
    },
    snackByDefaultDuration: 2000,
}; */

