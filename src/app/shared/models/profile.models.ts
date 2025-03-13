import { GeneralTranslation } from "./generics.models";

export interface ProfileData {
    animate?: boolean;
    name?: string;
    mainImage?: string;    
    email?: string;
    roles?: string;
    languageId?: number;
    customerId?: number;
    id?: number;
}

export interface ProfileState {
    loading: boolean;
    profileData: ProfileData;
}

export interface UserDetail {
  name?: string;
  reference?: string;
  email?: string;
  notes?: string;
  prefix?: string;
  roles?: string,
  passwordPolicy?: string,
  mainImageGuid?: string;
  mainImagePath?: string;
  mainImageName?: string;
  mainImage?: string;
  id?: number;
  customerId?: number;
  plantId?: number;
  recipientId?: number;
  recipient?: GeneralCatalogInternalData,
  approver?: GeneralCatalogInternalData,
  approverId?: number; 
  status?: string;
  createdById?: any;
  createdAt?: string;
  updatedById?: any;
  updatedAt?: string;
  deletedById?: any;
  deletedAt?: any;
  deletedBy?: any;
  updatedBy?: any;
  createdBy?: any;
  translations?: GeneralTranslation[];  
  
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

  