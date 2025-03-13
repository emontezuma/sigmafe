import {  GeneralCatalogInternalData, GeneralTranslation, PageInfo, UserDetail } from 'src/app/shared/models';

export interface UsersData {
  usersPaginated?: Users;
}

export interface UserData {
  oneUser?: UserItem;
  translations?: any;
}

export interface Users {
  items?: UserItem[];
  pageInfo?: PageInfo;
  totalCount?: number;
}

export interface UserItem {
  friendlyStatus?: string;
  isTranslated?: boolean;
  data: UserDetail;
}

export interface UsersState {
  loading: boolean;
  usersData: UsersData;
}

export interface UserState {
  loading: boolean;
  moldDetail: UserDetail;
}

export interface UserCatalog {
  id: string;
  name: string;
  mainImagePath: string;
  status: string;
  updatedAt: string;
}

export const emptyUserCatalog = {  
  friendlyStatus: null,
  data: {
    id: null,
    customerId: null,
    recipientId: null,
    approverId: null,
    plantId:null,
    name: null,
    mainImagePath: null,    
    updatedBy: null,
    status: null,
    updatedAt: null,
  },
};

export const emptyUserItem: UserDetail = {  
  name: null,
  id: null,
  email: '',
  customerId: null,
  roles: 'team-member',
  passwordPolicy: 'basic',
  plantId: null,
  recipientId: null,
  approverId: null, 
  mainImagePath: null,    
  prefix: null,
  status: null,
  createdById: null,
  createdAt: null,
  updatedById: null,
  updatedAt: null,
  deletedById: null,
  deletedAt: null,
  deletedBy: null,
  updatedBy: null,
  createdBy: null,

  translations: [],
};
