import { gql } from 'apollo-angular';

export const GET_LINES = gql`
  query LinesPaginated {
    linesPaginated {
      items {
        data {
          id
          customerId
          plantId
          name
          reference
          status
          createdBy
          createdAt
          updatedBy
          updatedAt
          deletedBy
          deletedAt
        }
      }    
    }
  }
`;

export const GET_MOLDS_HITS = gql`
query MoldsUnlimited {
  moldsUnlimited {
    data {
      serialNumber
      description
      manufacturerId
      providerId
      manufacturingDate
      startingDate
      lastMaintenanceId
      hits
      previousHits
      lastHit
      lastResettingId
      thresholdType
      thresholdYellow
      thresholdRed
      thresholdState
      thresholdDateYellow
      thresholdDateRed
      receiverId
      label
      state
      nextMaintenance
      equipmentId
      lineId
      partNumberId
      position
      mainImagePath
      strategy
      lastLocationId
      thresholdYellowDateReached
      thresholdRedDateReached
      id
      status      
    }
    isTranslated
    friendlyState
    translatedDescription
    translatedPartNumber {
      translatedReference
      translatedName
      isTranslated
    }            
  }
}
`;

export const GET_MOLDS = gql`
  query MoldsPaginated (
    $recosrdsToSkip: Int,
    $recosrdsToTake: Int,
    $orderBy: [FriendlyMoldSortInput!],
    $filterBy: FriendlyMoldFilterInput,
  ) {
  moldsPaginated (
    skip: $recosrdsToSkip,
    take: $recosrdsToTake,
    order: $orderBy,
    where: $filterBy
  ) {
      items {
        friendlyStatus
        friendlyState
        friendlyThresholdState
        friendlyThresholdType
        friendlyStrategy
        friendlyLabel
        translatedPartNumber {
          translatedName
          translatedReference
          translatedNotes
          translatedPrefix
          isTranslated            
        }
        data {
          serialNumber
          description
          hits
          lastHit
          label
          state
          partNumberId
          position
          mainImagePath
          id
          status
          updatedAt
          updatedBy {
            name
          }          
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
      }    
      totalCount    
    }
  }
`;
export const GET_HARDCODED_VALUES = gql`  
  query HardcodedValues (
      $recosrdsToSkip: Int,
      $recosrdsToTake: Int,
      $orderBy: [HardcodedValueSortInput!],
      $filterBy: HardcodedValueFilterInput
    ) {
  hardcodedValues(
    where: $filterBy, 
    order: $orderBy, 
    skip: $recosrdsToSkip, 
    take: $recosrdsToTake
  ) {
      totalCount
      items {
          languageId
          tableName
          value
          friendlyText
          status
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

export const GET_PROVIDERS_LAZY_LOADING = gql`
  query ProvidersPaginated (
      $recosrdsToSkip: Int,
      $recosrdsToTake: Int,
      $orderBy: [TranslatedProviderDtoSortInput!],
      $filterBy: TranslatedProviderDtoFilterInput
  ) {
  providersPaginated (
    where: $filterBy, 
    order: $orderBy, 
    skip: $recosrdsToSkip, 
    take: $recosrdsToTake
  ) {
      totalCount
      items {
        translatedName
        translatedReference
        isTranslated
        data {
            name
            id        
        }      
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
      }  
    }
  }
`;

export const GET_MANUFACTURERS_LAZY_LOADING = gql`
  query ManufacturersPaginated (
    $recosrdsToSkip: Int,
    $recosrdsToTake: Int,
    $orderBy: [TranslatedManufacturerDtoSortInput!],
    $filterBy: TranslatedManufacturerDtoFilterInput
  ) {
  manufacturersPaginated (
    where: $filterBy, 
    order: $orderBy, 
    skip: $recosrdsToSkip, 
    take: $recosrdsToTake
  ) {
      totalCount
      items {
        translatedName
        translatedReference
        isTranslated
        data {
            name
            id        
        }      
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
      }  
    }
  }
`;

export const GET_LINES_LAZY_LOADING = gql`
  query LinesPaginated (
    $recosrdsToSkip: Int,
    $recosrdsToTake: Int,
    $orderBy: [TranslatedLineDtoSortInput!],
    $filterBy: TranslatedLineDtoFilterInput
  ) {
  linesPaginated (
    where: $filterBy, 
    order: $orderBy, 
    skip: $recosrdsToSkip, 
    take: $recosrdsToTake
  ) {
      totalCount
      items {
        translatedName
        translatedReference
        isTranslated
        data {
            name
            id        
        }      
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
      }  
    }
  }
`;

export const GET_EQUIPMENTS_LAZY_LOADING = gql`
  query EquipmentsPaginated (
    $recosrdsToSkip: Int,
    $recosrdsToTake: Int,
    $orderBy: [TranslatedEquipmentDtoSortInput!],
    $filterBy: TranslatedEquipmentDtoFilterInput
  ) {
  equipmentsPaginated (
    where: $filterBy, 
    order: $orderBy, 
    skip: $recosrdsToSkip, 
    take: $recosrdsToTake
  ) {
      totalCount
      items {
        translatedName
        translatedReference
        isTranslated
        data {
            name
            id        
        }      
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
      }  
    }
  }
`;

export const GET_PART_NUMBERS_LAZY_LOADING = gql`
  query PartNumbersPaginated (
    $recosrdsToSkip: Int,
    $recosrdsToTake: Int,
    $orderBy: [TranslatedPartNumberDtoSortInput!],
    $filterBy: TranslatedPartNumberDtoFilterInput
  ) {
  partNumbersPaginated (
    where: $filterBy, 
    order: $orderBy, 
    skip: $recosrdsToSkip, 
    take: $recosrdsToTake
  ) {
    totalCount
    items {
      translatedName
      translatedReference
      isTranslated
      data {
          name
          id        
      }      
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
    }  
  }
}
`;

export const GET_GENERICS_LAZY_LOADING = gql`
  query GenericsPaginated (
    $recosrdsToSkip: Int,
    $recosrdsToTake: Int,
    $orderBy: [TranslatedGenericDtoSortInput!],
    $filterBy: TranslatedGenericDtoFilterInput
  ) {
  genericsPaginated (
    where: $filterBy, 
    order: $orderBy, 
    skip: $recosrdsToSkip, 
    take: $recosrdsToTake
  ) {
    totalCount
    items {
        data {
          name
          tableName
          id
        }        
        translatedTableName
        translatedName
        translatedReference
        friendlyStatus
    }
    pageInfo {
        hasNextPage
        hasPreviousPage
    }
  }
}
`;

export const GET_MAINTENANCE_HISTORICAL_LAZY_LOADING = gql`
  query MaintenanceHistorical (
    $recosrdsToSkip: Int,
    $recosrdsToTake: Int,
    $orderBy: [MaintenanceHistoricalSortInput!],
    $filterBy: MaintenanceHistoricalFilterInput
  ) {
    maintenanceHistorical (
    where: $filterBy, 
    order: $orderBy, 
    skip: $recosrdsToSkip, 
    take: $recosrdsToTake
  ) {
    totalCount
    items {
      moldId
      id
      maintenanceDate
      state
      operatorName
      notes
      provider {
        id
        name
        reference
        translations {
            name
            languageId
        }
      }
    }
  }
}
`;

export const GET_ALL_MOLDS_TO_CSV = gql`
  query ExportMoldToCSV {
    exportMoldToCSV {
        exportedFilename
        downloadFilename
    }
  }
`;

export const GET_MOLD = gql`
  query Mold (
    $moldId: Long!
    $customerId: Long!
  ) {
  mold (
    id: $moldId,
    customerId: $customerId
  ) {
      serialNumber
      description
      notes
      reference
      manufacturerId
      providerId
      manufacturingDate
      startingDate
      lastMaintenanceId
      hits
      previousHits
      lastHit
      lastResettingId
      thresholdType
      thresholdYellow
      thresholdRed
      thresholdState
      thresholdDateYellow
      thresholdDateRed
      receiverId
      label
      state
      nextMaintenance
      equipmentId
      lineId
      partNumberId
      position
      mainImagePath
      mainImageGuid
      mainImageName
      strategy
      lastLocationId
      thresholdYellowDateReached
      thresholdRedDateReached
      moldTypeId
      moldClassId
      id
      customerId
      status
      createdById
      createdAt
      updatedById
      updatedAt
      deletedById
      deletedAt
    }
  }
`;