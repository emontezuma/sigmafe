import { gql } from 'apollo-angular';

export const GET_LINES = gql`
  query Lines {
    lines {
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
`;

export const GET_MOLDS_HITS = gql`
query MoldsUnlimited {
  moldsUnlimited {
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
      partNumber {
        reference
      }        
      status      
  }
}
`;

export const GET_MOLDS = gql`
  query Molds(
    $recosrdsToSkip: Int,
    $recosrdsToTake: Int,
    $orderBy: [MoldSortInput!]
  ) {
    molds(skip: $recosrdsToSkip, take: $recosrdsToTake, order: $orderBy) {
      items {
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
        partNumber {
          name
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
  query Providers(
      $recosrdsToSkip: Int,
      $recosrdsToTake: Int,
      $orderBy: [ProviderSortInput!],
      $filterBy: ProviderFilterInput
    ) {
  providers(
    where: $filterBy, 
    order: $orderBy, 
    skip: $recosrdsToSkip, 
    take: $recosrdsToTake
  ) {
    totalCount
    items {
        name
        id
        translations {
            name
            languageId
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
  query Manufacturers(
    $recosrdsToSkip: Int,
    $recosrdsToTake: Int,
    $orderBy: [ManufacturerSortInput!],
    $filterBy: ManufacturerFilterInput
  ) {
  manufacturers(
    where: $filterBy, 
    order: $orderBy, 
    skip: $recosrdsToSkip, 
    take: $recosrdsToTake
  ) {
    totalCount
    items {
        name
        id
        translations {
            name
            languageId
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
  query Generics(
    $recosrdsToSkip: Int,
    $recosrdsToTake: Int,
    $orderBy: [GenericSortInput!],
    $filterBy: GenericFilterInput
  ) {
  generics(
    where: $filterBy, 
    order: $orderBy, 
    skip: $recosrdsToSkip, 
    take: $recosrdsToTake
  ) {
    totalCount
    items {
        name
        id
        translations {
            name
            languageId
        }
    }
    pageInfo {
        hasNextPage
        hasPreviousPage
    }
  }
}
`;
