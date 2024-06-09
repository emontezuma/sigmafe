export interface GeneralTranslation {
    languageId: number;
    languageName: string;
    languageIso: string;
    updatedByUserName: string;
    updatedAt: string;
    description: string;
    name: string;
    reference: string;
    notes: string;
    status: string;
  }

  export interface GeneralCatalogTranslation {
    id?: number;
    customerId?: number;
    isTranslated?: boolean;
    languageId?: number;
    name?: string;
    reference: string;
    description?: string;
    notes?: string;
    prefix?: string;    
    status?: string;    
  }

  export interface GeneralCatalogInternalData {  
    id?: number;
    customerId?: number,
    name?: string;
    description?: string;
    reference?: string;
    notes?: string;
    prefix?: string;
    status?: string;
    translations: GeneralCatalogTranslation[];
  }
  
  export interface GqlParameters {
    settingType: string,
    skipRecords?: number,
    takeRecords?: number,
    filter?: any,
    order?: any,
    id?: number,
    customerId?: number,
    status?: string,
  }
  

