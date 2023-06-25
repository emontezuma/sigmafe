export interface Mold {
    id: string;
    name: string;
    hits: number;    
}

export interface MoldsData {
    loading: boolean;
    molds: Mold[];
    page: number;
    pageSize: number;
    moreData: boolean;
}
