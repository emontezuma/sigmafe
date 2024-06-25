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
      mainImageGuid
      mainImageName
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
    $recordsToSkip: Int,
    $recordsToTake: Int,
    $orderBy: [FriendlyMoldSortInput!],
    $filterBy: FriendlyMoldFilterInput,
  ) {
  moldsPaginated (
    skip: $recordsToSkip,
    take: $recordsToTake,
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
          mainImageName
          mainImageGuid
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
      $recordsToSkip: Int,
      $recordsToTake: Int,
      $orderBy: [HardcodedValueSortInput!],
      $filterBy: HardcodedValueFilterInput
    ) {
  hardcodedValues(
    where: $filterBy, 
    order: $orderBy, 
    skip: $recordsToSkip, 
    take: $recordsToTake
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
      $recordsToSkip: Int,
      $recordsToTake: Int,
      $orderBy: [TranslatedProviderDtoSortInput!],
      $filterBy: TranslatedProviderDtoFilterInput
  ) {
  providersPaginated (
    where: $filterBy, 
    order: $orderBy, 
    skip: $recordsToSkip, 
    take: $recordsToTake
  ) {
      totalCount
      items {
        translatedName
        translatedReference
        isTranslated        
        data {
            name
            id      
            status  
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
    $recordsToSkip: Int,
    $recordsToTake: Int,
    $orderBy: [TranslatedManufacturerDtoSortInput!],
    $filterBy: TranslatedManufacturerDtoFilterInput
  ) {
  manufacturersPaginated (
    where: $filterBy, 
    order: $orderBy, 
    skip: $recordsToSkip, 
    take: $recordsToTake
  ) {
      totalCount
      items {
        translatedName
        translatedReference
        isTranslated
        data {
            name
            id  
            status      
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
    $recordsToSkip: Int,
    $recordsToTake: Int,
    $orderBy: [TranslatedLineDtoSortInput!],
    $filterBy: TranslatedLineDtoFilterInput
  ) {
  linesPaginated (
    where: $filterBy, 
    order: $orderBy, 
    skip: $recordsToSkip, 
    take: $recordsToTake
  ) {
      totalCount
      items {
        translatedName
        translatedReference
        isTranslated
        data {
          status
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
    $recordsToSkip: Int,
    $recordsToTake: Int,
    $orderBy: [TranslatedEquipmentDtoSortInput!],
    $filterBy: TranslatedEquipmentDtoFilterInput
  ) {
  equipmentsPaginated (
    where: $filterBy, 
    order: $orderBy, 
    skip: $recordsToSkip, 
    take: $recordsToTake
  ) {
      totalCount
      items {
        translatedName
        translatedReference
        isTranslated
        data {
            status
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
    $recordsToSkip: Int,
    $recordsToTake: Int,
    $orderBy: [TranslatedPartNumberDtoSortInput!],
    $filterBy: TranslatedPartNumberDtoFilterInput
  ) {
  partNumbersPaginated (
    where: $filterBy, 
    order: $orderBy, 
    skip: $recordsToSkip, 
    take: $recordsToTake
  ) {
    totalCount
    items {
      translatedName
      translatedReference
      isTranslated
      data {
          name
          status
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
    $recordsToSkip: Int,
    $recordsToTake: Int,
    $orderBy: [TranslatedGenericDtoSortInput!],
    $filterBy: TranslatedGenericDtoFilterInput
  ) {
  genericsPaginated (
    where: $filterBy, 
    order: $orderBy, 
    skip: $recordsToSkip, 
    take: $recordsToTake
  ) {
    totalCount
    items {
        data {
          name
          tableName
          status
          id
        }        
        translatedTableName
        translatedName
        translatedReference
        friendlyStatus
        isTranslated
    }
    pageInfo {
        hasNextPage
        hasPreviousPage
    }
  }
}
`;

export const GET_MAINTENANCE_HISTORICAL_LAZY_LOADING = gql`
  query MaintenanceHistoricalsPaginated (
    $recordsToSkip: Int,
    $recordsToTake: Int,
    $orderBy: [TranslatedMaintenanceHistoricalDtoSortInput!],
    $filterBy: TranslatedMaintenanceHistoricalDtoFilterInput
  ) {
    maintenanceHistoricalsPaginated (
    where: $filterBy, 
    order: $orderBy, 
    skip: $recordsToSkip, 
    take: $recordsToTake
  ) {
    totalCount
    items {
        data {
          moldId
          id
          operatorName
          startDate
          finishedDate
          notes
          updateHitsCumulative
          hitsAfter
          dateBefore
          updateLastMaintenanceDate
          maintenanceDate
          state
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
        friendlyState
        isTranslated
    }
    pageInfo {
        hasNextPage
        hasPreviousPage
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
  query OneMold (
    $moldId: Long!,
  ) {
  oneMold (
    id: $moldId        
  ) {
      data {
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
        templatesYellow
        templatesRed
        createdById
        createdAt
        updatedById
        updatedAt
        deletedById
        deletedAt
        provider {
          id
          status
          name
          reference
          translations {
            name
            reference
            languageId
          }
        }
        manufacturer {
          id
          status
          name
          reference
          translations {
            name
            reference
            languageId
          }
        }
        line {
          id
          status
          name
          reference
          translations {
            name
            reference
            languageId
          }
        }
        partNumber {
          id
          status
          name
          reference
          translations {
            name
            reference
            languageId
          }
        }
        equipment {
          id
          status
          name
          reference
          translations {
            name
            reference
            languageId
          }        
        }
        moldType {
          id
          status
          name
          reference
          translations {
            name
            reference
            languageId
          }
        }
        moldClass {
          id
          status
          name
          reference
          translations {
            name
            reference
            languageId
          }
        }
        createdBy {
          name
        }
        updatedBy {
          name
        }
        deletedBy {
          name
        }
      }
      translatedCustomer {
        isTranslated
        translatedName
        translatedReference
        translatedNotes
        translatedPrefix
        friendlyStatus
      }
      translatedManufacturer {
        isTranslated
        translatedName
        translatedReference
        translatedNotes
        translatedPrefix
        friendlyState
        friendlyStatus
      }
      translatedProvider {
        isTranslated
        translatedName
        translatedReference
        translatedNotes
        translatedPrefix
        friendlyState
        friendlyStatus
      }
      translatedLastMaintenance {
        isTranslated
        translatedNotes
        friendlyState
        friendlyStatus
      }
      translatedLastResetting {
        isTranslated
        translatedNotes
        friendlyStatus
      }
      translatedReceiver {
        isTranslated
        translatedName
        translatedReference
        translatedNotes
        translatedPrefix
        translatedOthers01
        translatedOthers02
        friendlyStatus
      }
      translatedEquipment {
        isTranslated
        translatedName
        translatedReference
        translatedNotes
        translatedPrefix
        friendlyStatus
      }
      translatedLine {
        isTranslated
        translatedName
        translatedReference
        translatedNotes
        translatedPrefix
        friendlyStatus
      }
      translatedPartNumber {
        isTranslated
        translatedName
        translatedReference
        translatedNotes
        translatedPrefix
        friendlyStatus
      }
      translatedLocation {
        isTranslated
        translatedName
        translatedReference
        translatedNotes
        translatedPrefix
        friendlyState
        friendlyStatus
      }
      translatedMoldType {
        isTranslated
        translatedTableName
        translatedName
        translatedReference
        translatedNotes
        friendlyStatus
      }
      translatedMoldClass {
        isTranslated
        translatedTableName
        translatedName
        translatedReference
        translatedNotes
        friendlyStatus
      } 
    }
  }
`;

export const GET_MOLD_TRANSLATIONS = gql`
  query MoldsTranslationsTable (
    $recordsToSkip: Int,
    $recordsToTake: Int,
    $orderBy: [MoldTranslationTableSortInput!],
    $filterBy: MoldTranslationTableFilterInput,
  ) {
  moldsTranslationsTable(
    skip: $recordsToSkip,
    take: $recordsToTake,
    order: $orderBy,
    where: $filterBy
  ) {
    totalCount
    items {
        moldId
        description
        reference
        notes
        languageId
        id
        customerId
        status
        createdById
        createdAt
        updatedById
        updatedAt
        deletedById
        deletedAt
        language {
            name
            reference
            id
            iso
        }
        updatedBy {
          name
        }
    }
    pageInfo {
        hasNextPage
        hasPreviousPage
    }      
  }
}
`;

export const GET_LANGUAGES_LAZY_LOADING = gql`
  query Languages (
    $recordsToSkip: Int,
    $recordsToTake: Int,
    $orderBy: [LanguageSortInput!],
    $filterBy: LanguageFilterInput
  ) {
    languages (
      where: $filterBy, 
      order: $orderBy, 
      skip: $recordsToSkip, 
      take: $recordsToTake
    ) {
      totalCount
      items {        
        name
        mainImagePath
        id      
        status
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
      }  
    }
  }
`;

export const INACTIVATE_MOLD = gql`
  mutation CreateOrUpdateMold (
    $id: Long,
    $customerId: Long,
    $status: String
  ) {
  createOrUpdateMold (
    inputs: {
      id: $id
      customerId: $customerId
      status: $status
    }) {
      id
      status
    } 
  }
`;

export const UPDATE_MOLD = gql`
  mutation CreateOrUpdateMold (
    $customerId: Long,
    $id: Long,
    $status: String    
    $description: String,
    $serialNumber: String,
    $reference: String,
    $notes: String,
    $startingDate: DateTime,
    $moldTypeId: Long,
    $moldClassId: Long,
    $providerId: Long,
    $manufacturerId: Long,
    $manufacturingDate: DateTime,
    $mainImageGuid: String,
    $mainImageName: String,
    $mainImagePath: String,
    $state: String,
    $label: String,
    $partNumberId: Long,
    $position: Int,
    $lineId: Long,
    $equipmentId: Long,
    $thresholdType: String,
    $thresholdYellow: Long,
    $thresholdRed: Long,
    $thresholdDateYellow: Long,
    $thresholdDateRed: Long,        
    $templatesRed: String,        
    $templatesYellow: String
  ) {
  createOrUpdateMold (
    inputs: [{
      customerId: $customerId
      id: $id      
      status: $status
      description: $description,
      serialNumber: $serialNumber,
      reference: $reference,
      notes: $notes,
      startingDate: $startingDate,
      moldTypeId: $moldTypeId,
      moldClassId: $moldClassId,
      providerId: $providerId,
      manufacturerId: $manufacturerId,
      manufacturingDate: $manufacturingDate,
      mainImageGuid: $mainImageGuid,
      mainImageName: $mainImageName,
      mainImagePath: $mainImagePath,
      state: $state,
      label: $label,
      partNumberId: $partNumberId,
      position: $position,
      lineId: $lineId,
      equipmentId: $equipmentId,
      thresholdType: $thresholdType,
      thresholdYellow: $thresholdYellow
      thresholdRed: $thresholdRed
      thresholdDateYellow: $thresholdDateYellow
      thresholdDateRed: $thresholdDateRed
      templatesRed: $templatesRed        
      templatesYellow: $templatesYellow
    }]) {
      id
      createdAt
      updatedAt
      deletedAt
      createdBy {
        name
      }
      updatedBy {
        name
      }
      deletedBy {
        name
      }  
    } 
  }
`;

export const DELETE_MOLD_TRANSLATIONS = gql`
  mutation DeleteMoldsTranslationsTable (
    $ids: [IdToDeleteInput!]!,
    $customerId: Long!
  ) {
    deleteMoldsTranslationsTable (      
      ids: $ids,
      customerId: $customerId
    ) 
  }
`;

export const DELETE_CATALOG_DETAILS = gql`
  mutation DeleteCatalogsDetails (
    $ids: [IdToDeleteInput!]!,
    $customerId: Long!
  ) {
    deleteCatalogsDetails (      
      ids: $ids,
      customerId: $customerId
    ) 
  }
`;

export const CREATE_OR_UPDATE_CATALOG_DETAILS = gql`
  mutation CreateOrUpdateCatalogDetail ($catalogDetails: [CatalogDetailDtoInput!]!) {
  createOrUpdateCatalogDetail (inputs: $catalogDetails) {
      customerId
      processId
      process
      detailTableName
      value      
    } 
  }
`;

export const ADD_MOLD_TRANSLATIONS = gql`
  mutation CreateOrUpdateMoldTranslationTable (
    $translations: [MoldTranslationTableDtoInput!]!    
  ) {
    createOrUpdateMoldTranslationTable (
      inputs: $translations
    ) {
      id,
      moldId,
      languageId      
    }
  }
`;

export const ADD_MAINTENANCE_HISTORY = gql`
  mutation CreateOrUpdateMaintenanceHistorical (
    $id: Long,
    $customerId: Long,
    $moldId: Long,
    $providerId: Long,
    $state: String,
    $operatorName: String,
    $notes: String,
    $startDate: DateTime,
    $finishedDate: DateTime,
    $updateLastMaintenanceDate: String,
    $maintenanceDate: DateTime,
    $updateHitsCumulative: String,
    $hitsAfter: Long
  ) {
  createOrUpdateMaintenanceHistorical (
    inputs: {
      id: $id,
      moldId: $moldId,
      customerId: $customerId,
      providerId: $providerId,
      state: $state,
      operatorName: $operatorName,
      notes: $notes,
      updateHitsCumulative: $updateHitsCumulative,
      hitsAfter: $hitsAfter,
      startDate: $startDate,
      finishedDate: $finishedDate,
      updateLastMaintenanceDate: $updateLastMaintenanceDate,
      maintenanceDate: $maintenanceDate,
    }) {
      id
      status
    } 
  }
`;

export const DELETE_MAINTENANCE_HISTORY = gql`
  mutation deleteMaintenanceHistorical (
    $ids: [IdToDeleteInput!]!,
    $customerId: Long!
  ) {
    deleteMaintenanceHistorical (      
      ids: $ids,
      customerId: $customerId
    ) 
  }
`;

export const GET_VARIABLES = gql`
  query VariablesPaginated (
    $recordsToSkip: Int,
    $recordsToTake: Int,
    $orderBy: [TranslatedVariableDtoSortInput!],
    $filterBy: TranslatedVariableDtoFilterInput,
  ) {
  variablesPaginated (
    skip: $recordsToSkip,
    take: $recordsToTake,
    order: $orderBy,
    where: $filterBy
  ) {
      items {
        friendlyStatus
        data {
          name          
          mainImagePath
          mainImageName
          mainImageGuid
          id
          customerId
          status
          updatedAt
          uom {
            id
            customerId
            name
            status
            translations {
              name
              languageId
              id
            }
          }
          sigmaType {
            name
            id
            customerId
            status
            translations {
                name
                languageId
                id
            }
          }
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

export const ADD_VARIABLE_TRANSLATIONS = gql`
  mutation CreateOrUpdateVariableTranslationTable (
    $translations: [VariableTranslationTableDtoInput!]!    
  ) {
    createOrUpdateVariableTranslationTable (
      inputs: $translations
    ) {
      id,
      variableId,
      languageId      
    }
  }
`;

export const UPDATE_VARIABLE = gql`
  mutation CreateOrUpdateVariable (
    $customerId: Long,
    $id: Long,
    $status: String    
    $name: String,
    $reference: String,
    $notes: String,
    $valueType: String,
    $prefix: String,
    $required: String,
    $allowComments: String,
    $allowNoCapture: String,
    $allowAlarm: String,
    $resetValueMode: String,
    $notifyAlarm: String,    
    $accumulative: String,
    $showChart: String,
    $possibleValues: String,
    $minimum: String,
    $maximum: String,
    $showNotes: String,
    $automaticActionPlan: String,
    $actionPlansToGenerate: String,
    $byDefaultDateType: String,
    $byDefault: String,
    $uomId: Long,
    $sigmaTypeId: Long,
    $mainImageGuid: String,
    $mainImageName: String,
    $mainImagePath: String,    
  ) {
  createOrUpdateVariable (
    inputs: [{
      customerId: $customerId
      id: $id      
      status: $status
      name: $name,
      reference: $reference,
      notes: $notes,
      showNotes: $showNotes,
      prefix: $prefix,
      valueType: $valueType,
      minimum: $minimum,
      maximum: $maximum,
      required: $required,
      resetValueMode: $resetValueMode,
      allowComments: $allowComments,
      notifyAlarm: $notifyAlarm,      
      allowNoCapture: $allowNoCapture,
      automaticActionPlan: $automaticActionPlan,
      actionPlansToGenerate: $actionPlansToGenerate,
      possibleValues: $possibleValues,
      byDefaultDateType: $byDefaultDateType,
      byDefault: $byDefault,
      allowAlarm: $allowAlarm,
      showChart: $showChart,
      accumulative: $accumulative,
      uomId: $uomId,
      sigmaTypeId: $sigmaTypeId,
      mainImageGuid: $mainImageGuid,
      mainImageName: $mainImageName,
      mainImagePath: $mainImagePath,
    }]) {
      id
      createdAt
      updatedAt
      deletedAt
      createdBy {
        name
      }
      updatedBy {
        name
      }
      deletedBy {
        name
      }  
    } 
  }
`;

export const DELETE_VARIABLE_TRANSLATIONS = gql`
  mutation DeleteVariablesTranslationsTable (
    $ids: [IdToDeleteInput!]!,
    $customerId: Long!
  ) {
    deleteVariablesTranslationsTable (      
      ids: $ids,
      customerId: $customerId
    ) 
  }
`;

export const GET_UOMS_LAZY_LOADING = gql`
  query UomsPaginated (
      $recordsToSkip: Int,
      $recordsToTake: Int,
      $orderBy: [TranslatedUomDtoSortInput!],
      $filterBy: TranslatedUomDtoFilterInput
  ) {
    uomsPaginated (
    where: $filterBy, 
    order: $orderBy, 
    skip: $recordsToSkip, 
    take: $recordsToTake
  ) {
      totalCount
      items {
        translatedName
        translatedReference
        isTranslated        
        data {
            name
            id      
            status  
        }      
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
      }  
    }
  }
`;

export const GET_SENSORS_LAZY_LOADING = gql`
  query SensorsPaginated (
      $recordsToSkip: Int,
      $recordsToTake: Int,
      $orderBy: [TranslatedSensorDtoSortInput!],
      $filterBy: TranslatedSensorDtoFilterInput
  ) {
  sensorsPaginated (
    where: $filterBy, 
    order: $orderBy, 
    skip: $recordsToSkip, 
    take: $recordsToTake
  ) {
      totalCount
      items {
        translatedName
        translatedReference
        isTranslated        
        data {
            name
            id      
            status  
        }      
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
      }  
    }
  }
`;

export const GET_SIGMA_TYPES_LAZY_LOADING = gql`
  query SigmaTypesPaginated (
    $recordsToSkip: Int,
    $recordsToTake: Int,
    $orderBy: [TranslatedSigmaTypeDtoSortInput!],
    $filterBy: TranslatedSigmaTypeDtoFilterInput
  ) {
    sigmaTypesPaginated (
    where: $filterBy, 
    order: $orderBy, 
    skip: $recordsToSkip, 
    take: $recordsToTake
    ) {
      totalCount
      items {
        translatedName
        translatedReference
        isTranslated        
        data {
            name
            id      
            status  
        }      
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
      }  
    }
  }
`;

export const GET_VARIABLE = gql`
  query OneVariable (
    $variableId: Long!,
  ) {
  oneVariable (
    id: $variableId        
  ) {
    data {
      name
      reference
      notes
      prefix
      mainImagePath
      mainImageGuid
      mainImageName
      sigmaTypeId
      equipments
      uomId
      valueType
      showNotes
      applyRange
      minimum
      maximum
      required
      byDefault
      allowNoCapture
      allowComments
      sensorId
      showChart
      chartLogType
      logsCount
      lastValueRecorded
      lastValueDate
      lastValueChecklist
      lastValueById
      allowAlarm
      notifyAlarm
      alarmedReceiverId
      alarmedChannels
      alarmedMessageSubject
      alarmedMessageBody
      accumulative
      resetValueMode
      resetValue
      resetValueDate
      resetValueChecklistId
      automaticActionPlan
      actionPlansToGenerate
      resetValueById
      alarmed
      possibleValues
      id
      customerId
      status
      createdById
      createdAt
      updatedById
      updatedAt
      deletedById
      deletedAt
      uom {
        id
        status
        name
        reference
        translations {
          name
          reference
          languageId
        }
      }
      sigmaType {
        id
        status
        name
        reference
        translations {
          name
          reference
          languageId
        }
      }        
      createdBy {
        name
      }
      updatedBy {
        name
      }
      deletedBy {
        name
      }      
    }
    friendlyStatus
    friendlyResetValueMode
    friendlyValueType      
  }
}
`;

export const GET_VARIABLE_TRANSLATIONS = gql`
  query VariablesTranslationsTable (
    $recordsToSkip: Int,
    $recordsToTake: Int,
    $orderBy: [VariableTranslationTableSortInput!],
    $filterBy: VariableTranslationTableFilterInput,
  ) {
    variablesTranslationsTable(
    skip: $recordsToSkip,
    take: $recordsToTake,
    order: $orderBy,
    where: $filterBy
  ) {
    totalCount
    items {
        variableId
        name
        reference
        notes
        languageId
        id
        customerId
        status
        createdById
        createdAt
        updatedById
        updatedAt
        deletedById
        deletedAt
        language {
            name
            reference
            id
            iso
        }
        updatedBy {
          name
        }
    }
    pageInfo {
        hasNextPage
        hasPreviousPage
    }      
  }
}
`;

export const INACTIVATE_VARIABLE = gql`
  mutation CreateOrUpdateVariable (
    $id: Long,
    $customerId: Long,
    $status: String
  ) {
  createOrUpdateVariable (
    inputs: {
      id: $id
      customerId: $customerId
      status: $status
    }) {
      id
      status
    } 
  }
`;

export const GET_CATALOG_DETAILS_CHECKLIST_TEMPLATES_LAZY_LOADING = gql`
  query CatalogDetailChecklistTemplate (    
    $recordsToSkip: Int,
    $recordsToTake: Int,
    $filterBy: MultipleCatalogSelectionDtoFilterInput,
    $process: String,
    $processId: Long
  ) {
    catalogDetailChecklistTemplate (
    where: $filterBy, 
    skip: $recordsToSkip, 
    take: $recordsToTake,
    process: $process,
    processId: $processId
  ) {
      totalCount
      items {
        id
        catalogDetailId
        translatedName
        translatedReference
        isTranslated
        value
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
      }  
    }
  }
`;

export const GET_CATALOG_DETAILS_MOLDS_LAZY_LOADING = gql`
  query CatalogDetailMold (    
    $recordsToSkip: Int,
    $recordsToTake: Int,
    $filterBy: MultipleCatalogSelectionDtoFilterInput,
    $process: String,
    $processId: Long
  ) {
  catalogDetailMold (
    where: $filterBy, 
    skip: $recordsToSkip, 
    take: $recordsToTake,
    process: $process,
    processId: $processId
  ) {
      totalCount
      items {
        id
        catalogDetailId
        translatedName
        translatedReference
        isTranslated
        value
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
      }  
    }
  }
`;

export const GET_ACTION_PLANS_TO_GENERATE_LAZY_LOADING = gql`
  query CatalogDetailTemplateActionPlan (    
    $recordsToSkip: Int,
    $recordsToTake: Int,
    $filterBy: MultipleCatalogSelectionDtoFilterInput,
    $process: String,
    $processId: Long
  ) {
  catalogDetailTemplateActionPlan (
    where: $filterBy, 
    skip: $recordsToSkip, 
    take: $recordsToTake,
    process: $process,
    processId: $processId
  ) {
      totalCount
      items {
        id
        catalogDetailId
        translatedName
        translatedReference
        isTranslated
        value
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
      }  
    }
  }
`;
