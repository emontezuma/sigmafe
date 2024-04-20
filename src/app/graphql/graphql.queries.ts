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
        customerId
        status
        createdById
        createdAt
        updatedById
        updatedAt
        deletedById
        deletedAt
        deletedBy {
          name
        }
        updatedBy {
          name
        }
        createdBy {
          name
        }
        customer {
          name
          id
          status
        }
        lastLocation {
          name
          state
          id
        }
        partNumber {
          name
          reference
          id
          status
        }
        line {
          name
          id
          status
        }
        equipment {
          name
          id
          status
        }
        provider {
          name
          id
          status
        }
        lastResetting {
          resettingDate
          user {
            name
            status
          }
          userId
        }
        lastMaintenance {
          maintenanceDate
          state
          providerId
          operatorName
          startDate
          finishedDate
          provider {
            name
            id
            status
          }
        }
        manufacturer {
          name
          state
          id
          status
        }
        receiver {
          name
          status
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
