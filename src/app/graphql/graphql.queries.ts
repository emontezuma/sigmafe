import { gql } from 'apollo-angular';

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
            mainImagePath
            mainImageName
            mainImageGuid
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
            mainImagePath
            mainImageGuid
            mainImageName    
        }      
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
      }  
    }
  }
`;

export const GET_SIGMATYPES_LAZY_LOADING = gql`
  query SigmaTypesPaginated (
    $recordsToSkip: Int,
    $recordsToTake: Int,
    $orderBy: [TranslatedManufacturerDtoSortInput!],
    $filterBy: TranslatedManufacturerDtoFilterInput
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


//partnumbers==============

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

export const GET_ALL_WORKGROUPS_TO_CSV = gql`
  query ExportWorkGroupToCSV {
    exportWorkGroupToCSV {
        exportedFilename
        downloadFilename
    }
  }
`;


export const GET_ALL_DEPARTMENTS_TO_CSV = gql`
  query ExportDepartmentToCSV {
    exportDepartmentToCSV {
        exportedFilename
        downloadFilename
    }
  }
`;

export const GET_ALL_LINES_TO_CSV = gql`
  query ExportLineToCSV {
    exportLineToCSV {
        exportedFilename
        downloadFilename
    }
  }
`;

export const GET_ALL_GENERICS_TO_CSV = gql`
  query ExportGenericToCSV {
    exportGenericToCSV {
        exportedFilename
        downloadFilename
    }
  }
`;

export const GET_ALL_SIGMATYPES_TO_CSV = gql`
  query ExportSigmaTypeToCSV {
    exportSigmaTypeToCSV {
        exportedFilename
        downloadFilename
    }
  }
`;

export const GET_ALL_MANUFACTURES_TO_CSV = gql`
  query ExportManufacturerToCSV {
    exportManufacturerToCSV {
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
        notifyYellowState
        notifyRedState
        notifyYellowRecipientId
        notifyRedRecipientId
        notifyYellowChannels
        notifyRedChannels
        notifyYellowSubject
        notifyYellowBody
        notifyRedSubject
        notifyRedBody
        entities
        generationMode
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
        notifyYellowRecipient {
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
        notifyRedRecipient {
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
        translatedName
        translatedReference
        translatedNotes
        friendlyStatus
      }
      translatedMoldClass {
        isTranslated
        translatedName
        translatedReference
        translatedNotes
        friendlyStatus
      } 
      translatedNotifyYellowRecipient { 
        isTranslated
        translatedName
        translatedReference
        translatedNotes
        translatedPrefix
        friendlyStatus
      }
      translatedNotifyRedRecipient { 
        isTranslated
        translatedName
        translatedReference
        translatedNotes
        translatedPrefix
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

export const INACTIVATE_PLANT = gql`
  mutation CreateOrUpdatePlant (
    $id: Long,
    $customerId: Long,
    $companyId: Long,
    $status: String
  ) {
  createOrUpdatePlant (
    inputs: {
      id: $id
      customerId: $customerId
      companyId: $companyId
      status: $status
    }) {
      id
      status
    } 
  }
`;

export const UPSERT_MOLD = gql`
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

    $notifyYellowState: String
    $notifyYellowChannels: String
    $notifyYellowSubject: String
    $notifyYellowBody: String
    $notifyYellowRecipientId: Long
    
    $notifyRedState: String
    $notifyRedChannels: String
    $notifyRedRecipientId: Long
    $notifyRedSubject: String
    $notifyRedBody: String
    $generationMode: String,
    $entities: String,
    
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
      notifyYellowState: $notifyYellowState
      notifyYellowChannels: $notifyYellowChannels
      notifyYellowSubject: $notifyYellowSubject
      notifyYellowBody: $notifyYellowBody
      notifyYellowRecipientId: $notifyYellowRecipientId
      
      notifyRedState: $notifyRedState
      notifyRedChannels: $notifyRedChannels
      notifyRedRecipientId: $notifyRedRecipientId
      notifyRedSubject: $notifyRedSubject
      notifyRedBody: $notifyRedBody
      generationMode: $generationMode
      entities: $entities
    
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

export const UPSERT_CATALOG_DETAILS = gql`
  mutation CreateOrUpdateCatalogDetail (
    $catalogDetails: [CatalogDetailDtoInput!]!
  ) {
  createOrUpdateCatalogDetail (
    inputs: $catalogDetails
  ) {
      customerId
      processId
      process
      detailTableName
      value      
    } 
  }
`;

export const UPSERT_MOLD_TRANSLATIONS = gql`
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

export const UPSERT_MAINTENANCE_HISTORY = gql`
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

export const GET_CHECKLIST_TEMPLATES = gql`
  query ChecklistTemplatesPaginated (
    $recordsToSkip: Int,
    $recordsToTake: Int,
    $orderBy: [TranslatedChecklistTemplateDtoSortInput!],
    $filterBy: TranslatedChecklistTemplateDtoFilterInput,
  ) {
  checklistTemplatesPaginated (
    skip: $recordsToSkip,
    take: $recordsToTake,
    order: $orderBy,
    where: $filterBy
  ) {
      items {
        friendlyStatus
        data {
          id
          name
          reference
          notes
          prefix
          mainImagePath
          mainImageGuid
          mainImageName      
          customerId
          lastGeneratedDate
          generationCount
          status
          templateType {
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

export const UPSERT_VARIABLE_TRANSLATIONS = gql`
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

export const UPSERT_CHECKLIST_TEMPLATE_TRANSLATIONS = gql`
  mutation CreateOrUpdateChecklistTemplateTranslationTable (
    $translations: [ChecklistTemplateTranslationTableDtoInput!]!    
  ) {
    createOrUpdateChecklistTemplateTranslationTable (
      inputs: $translations
    ) {
      id,
      checklistTemplateId,
      languageId      
    }
  }
`;

export const UPSERT_CHECKLIST_PLAN_TRANSLATIONS = gql`
  mutation CreateOrUpdateChecklistPlanTranslationTable (
    $translations: [ChecklistPlanTranslationTableDtoInput!]!    
  ) {
    createOrUpdateChecklistPlanTranslationTable (
      inputs: $translations
    ) {
      id,
      checklistPlanId,
      languageId      
    }
  }
`;

export const UPSERT_CHECKLIST_TEMPLATE = gql`
  mutation CreateOrUpdateChecklistTemplate (
    $alarmNotificationChannels: String,
    $alarmNotificationMessageBody: String,
    $alarmNotificationMessageSubject: String,
    $alarmNotificationMode: String,
    $alarmRecipientId: Long,
    $allowAlarm: String,
    $allowApprovalByGroup: String,
    $allowDiscard: String,
    $allowExpiring: String,
    $allowManualMode: String,
    $allowPartialSaving: String,
    $allowReassignment: String,
    $allowRejection: String,
    $allowRestarting: String,
    $initialState: String,
    $anticipationChannels: String,
    $anticipationMessageBody: String,
    $anticipationMessageSubject: String,
    $anticipationNotificationMode: String,
    $anticipationRecipientId: Long,
    $approvalNotificationMode: String,
    $approvalRecipientId: Long,
    $approvalRequestChannels: String,
    $approvalRequestMessageBody: String,
    $approvalRequestMessageSubject: String,
    $approverId: Long,    
    $cancelOpenChecklists: String,    
    $expiringChannels: String,
    $expiringMessageBody: String,
    $expiringMessageSubject: String,
    $expiringNotificationMode: String,
    $expiringRecipientId: Long,
    $generationChannels: String,    
    $generationMessageBody: String,
    $generationMessageSubject: String,
    $generationNotificationMode: String,
    $generationRecipientId: Long,
    $id: Long,
    $mainImageGuid: String,
    $mainImageName: String,
    $mainImagePath: String,
    $moldStates: String,
    $name: String,
    $notes: String,
    $notifyAnticipation: String,
    $notifyApproval: String,
    $notifyExpiring: String,
    $notifyGeneration: String,
    $notifyAlarm: String,
    $prefix: String,
    $reference: String,
    $requiresActivation: String,
    $requiresApproval: String,
    $status: String,
    $templateTypeId: Long,
    $timeToFill: Int,
    $customerId: Long,
    $molds: String,    
  ) {
  createOrUpdateChecklistTemplate (
    inputs: [{      
      alarmNotificationChannels: $alarmNotificationChannels
      alarmNotificationMessageBody: $alarmNotificationMessageBody
      alarmNotificationMessageSubject: $alarmNotificationMessageSubject
      alarmNotificationMode: $alarmNotificationMode
      alarmRecipientId: $alarmRecipientId
      allowAlarm: $allowAlarm
      allowApprovalByGroup: $allowApprovalByGroup
      allowDiscard: $allowDiscard
      allowExpiring: $allowExpiring
      allowManualMode: $allowManualMode
      allowPartialSaving: $allowPartialSaving
      allowReassignment: $allowReassignment
      allowRejection: $allowRejection
      allowRestarting: $allowRestarting
      initialState: $initialState
      anticipationChannels: $anticipationChannels
      anticipationMessageBody: $anticipationMessageBody
      anticipationMessageSubject: $anticipationMessageSubject
      anticipationNotificationMode: $anticipationNotificationMode
      anticipationRecipientId: $anticipationRecipientId
      approvalNotificationMode: $approvalNotificationMode
      approvalRecipientId: $approvalRecipientId
      approvalRequestChannels: $approvalRequestChannels
      approvalRequestMessageBody: $approvalRequestMessageBody
      approvalRequestMessageSubject: $approvalRequestMessageSubject
      approverId: $approverId
      cancelOpenChecklists: $cancelOpenChecklists
      expiringChannels: $expiringChannels
      expiringMessageBody: $expiringMessageBody
      expiringMessageSubject: $expiringMessageSubject
      expiringNotificationMode: $expiringNotificationMode
      expiringRecipientId: $expiringRecipientId
      generationChannels: $generationChannels
      generationMessageBody: $generationMessageBody
      generationMessageSubject: $generationMessageSubject
      generationNotificationMode: $generationNotificationMode
      generationRecipientId: $generationRecipientId
      id: $id
      mainImageGuid: $mainImageGuid
      mainImageName: $mainImageName
      mainImagePath: $mainImagePath
      moldStates: $moldStates
      name: $name
      notes: $notes
      notifyAnticipation: $notifyAnticipation
      notifyApproval: $notifyApproval
      notifyExpiring: $notifyExpiring
      notifyGeneration: $notifyGeneration
      prefix: $prefix
      reference: $reference
      requiresActivation: $requiresActivation
      requiresApproval: $requiresApproval
      status: $status
      templateTypeId: $templateTypeId
      timeToFill: $timeToFill
      customerId: $customerId
      notifyAlarm: $notifyAlarm    
      molds: $molds    
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

export const UPSERT_CHECKLIST_PLAN = gql`
  mutation CreateOrUpdateChecklistPlan (
    $customerId: Long,
    $id: Long,
    $name: String,
    $reference: String,
    $notes: String,
    $prefix: String,
    $templates: String,    
    $limit: Int,
    $anticipationTime: Long,
    $hours: String,
    $checklistPlanTypeId: Long,
    $frequency: String,
    $specificDate: DateTime,
    $timeZone: Long,    
    $status: String
  ) {
  createOrUpdateChecklistPlan (
    inputs: [{      
      customerId: $customerId,
      id: $id,
      name: $name,
      reference: $reference,
      notes: $notes,
      prefix: $prefix,
      templates: $templates,
      limit: $limit,
      anticipationTime: $anticipationTime,
      hours: $hours,
      checklistPlanTypeId: $checklistPlanTypeId,
      frequency: $frequency,
      specificDate: $specificDate,
      timeZone: $timeZone,      
      status: $status,    
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

export const UPSERT_VARIABLE = gql`
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
    $recipientId: Long,
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
      recipientId: $recipientId,
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

export const DELETE_CHECKLIST_TEMPLATE_TRANSLATIONS = gql`
  mutation DeleteChecklistTemplatesTranslationsTable (
    $ids: [IdToDeleteInput!]!,
    $customerId: Long!
  ) {
    deleteChecklistTemplatesTranslationsTable (      
      ids: $ids,
      customerId: $customerId
    ) 
  }
`;

export const DELETE_CHECKLIST_PLAN_TRANSLATIONS = gql`
  mutation DeleteChecklistPlansTranslationsTable (
    $ids: [IdToDeleteInput!]!,
    $customerId: Long!
  ) {
    deleteChecklistPlansTranslationsTable (      
      ids: $ids,
      customerId: $customerId
    ) 
  }
`;

export const DELETE_CHECKLIST_TEMPLATE_DETAILS = gql`
  mutation DeleteChecklistTemplateDetails (
    $ids: [IdToDeleteInput!]!,
    $customerId: Long!
  ) {
    deleteChecklistTemplateDetails (      
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

export const GET_RECIPIENTS_LAZY_LOADING = gql`
  query RecipientsPaginated (
    $recordsToSkip: Int,
    $recordsToTake: Int,
    $orderBy: [TranslatedRecipientDtoSortInput!],
    $filterBy: TranslatedRecipientDtoFilterInput
  ) {
    recipientsPaginated (
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

export const GET_VARIABLES_LAZY_LOADING = gql`
  query VariablessPaginated (
    $recordsToSkip: Int,
    $recordsToTake: Int,
    $orderBy: [TranslatedVariableDtoSortInput!],
    $filterBy: TranslatedVariableDtoFilterInput
  ) {
    variablesPaginated (
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

export const GET_APPROVERS_LAZY_LOADING = gql`
  query UsersPaginated (
    $recordsToSkip: Int,
    $recordsToTake: Int,
    $orderBy: [TranslatedUserDtoSortInput!],
    $filterBy: TranslatedUserDtoFilterInput
  ) {
    usersPaginated (
    where: $filterBy, 
    order: $orderBy, 
    skip: $recordsToSkip, 
    take: $recordsToTake
    ) {
      totalCount
      items {
        data {
            name
            reference
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
      recipientId
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
      byDefaultDateType
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
      recipient {
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

export const GET_CHECKLIST_TEMPLATE = gql`
  query oneChecklistTemplate ($checklistTemplateId: Long!) {
    oneChecklistTemplate (id: $checklistTemplateId) {      
      isTranslated
      translatedName
      translatedReference
      translatedNotes
      translatedPrefix
      translatedApprovalRequestMessageSubject
      translatedApprovalRequestMessageBody
      translatedAnticipationMessageSubject
      translatedAnticipationMessageBody
      translatedExpiringMessageSubject
      translatedExpiringMessageBody
      translatedGenerationMessageSubject
      translatedGenerationMessageBody
      translatedAlarmNotificationMessageSubject
      translatedAlarmNotificationMessageBody
      friendlyStatus
      friendlyType
      data {
          name
          reference
          notes
          prefix
          mainImagePath
          mainImageGuid
          mainImageName
          templateTypeId
          equipmentId
          allowDiscard
          allowRejection
          allowManualMode
          allowPartialSaving
          allowApprovalByGroup
          allowExpiring
          timeToFill
          notifyExpiring
          expiringNotificationMode
          expiringChannels
          expiringMessageSubject
          expiringMessageBody
          notifyApproval
          notifyAlarm
          approvalNotificationMode
          approvalRequestChannels
          approvalRequestMessageSubject
          approvalRequestMessageBody
          requiresApproval
          cancelOpenChecklists
          notifyAnticipation
          anticipationChannels
          anticipationMessageSubject
          anticipationMessageBody
          anticipationNotificationMode
          notifyGeneration
          generationChannels
          generationMessageSubject
          generationMessageBody
          generationNotificationMode
          generationMode
          molds
          moldStates
          approvalRepeatNotification
          approvalRepeatNotificationFrequency
          approvalRepeatNotificationLimit
          approverId
          allowReassignment
          requiresActivation
          allowRestarting
          initialState
          generationCount
          lastGeneratedDate
          anticipationRecipientId
          expiringRecipientId
          approvalRecipientId
          generationRecipientId
          alarmNotificationMode
          alarmNotificationChannels
          alarmNotificationMessageSubject
          alarmNotificationMessageBody
          alarmRecipientId
          allowAlarm
          id
          customerId
          status
          createdById
          createdAt
          updatedById
          updatedAt
          deletedById
          deletedAt
          templateType {
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
          translations {
              checklistTemplateId
              name
              reference
              notes
              prefix
              approvalRequestMessageSubject
              approvalRequestMessageBody
              anticipationMessageSubject
              anticipationMessageBody
              expiringMessageSubject
              expiringMessageBody
              generationMessageSubject
              generationMessageBody
              alarmNotificationMessageSubject
              alarmNotificationMessageBody
              languageId
              id                
          }
          alarmRecipient  {
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
          generationRecipient  {
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
          approvalRecipient  {
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
          expiringRecipient  {
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
          anticipationRecipient  {
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
          approver  {
              id
              status
              name
              reference                  
          }
          calendar  {
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
          
      }
    friendlyStatus    
  }
}
`;

export const GET_CHECKLIST = gql`
  query oneChecklist ($checklistId: Long!) {
    oneChecklist (id: $checklistId) {      
      isTranslated
      translatedName
      translatedReference
      translatedNotes
      translatedPrefix
      friendlyStatus
      friendlyState
      friendlyFrequency
      friendlyGenerationMode      
      data {
        id
        name
        reference
        notes
        prefix
        imagePath
        startDate
        timeToFill
        moldId
        checklistTemplateId
        mold {
          description
          reference
          notes
          lastChecklist {
            name
            reference
            completedDate
            assignedTo {
                name
                email
            }
            assignedToId
          }
        }
      }    
    }
  }
`;

export const GET_CHECKLIST_TEMPLATE_DETAILS = gql`
query ChecklistTemplateDetailsUnlimited (
  $orderBy: [TranslatedChecklistTemplateDetailDtoSortInput!],
  $filterBy: TranslatedChecklistTemplateDetailDtoFilterInput,
) {
    checklistTemplateDetailsUnlimited (
      order: $orderBy,
      where: $filterBy
    ) {
        friendlyVariableValueType
        checklistTemplateDetail {
          checklistTemplateId
          variableId
          minimum
          maximum
          required
          byDefault
          allowNoCapture
          allowComments
          showChart
          allowAlarm
          notifyAlarm
          recipientId
          line
          possibleValues        
          notes
          showNotes
          showLastValue
          showParameters
          useVariableSettings
          useVariableAttachments
          id
          customerId
          recipientId
          variableId
          customerId        
          status
          recipient {
            name
            reference
            notes
            prefix
            languageId
            id
            translations {
                recipientId
                name
                languageId
                id
                customerId
            }
          }
          variable {
            name          
            reference
            valueType
            notes
            prefix
            id
            status          
            translations {
                variableId
                name
                prefix
                languageId
                status
            }
            uom {
              name
              reference
              notes
              prefix
              id
              status          
              translations {                
                  name
                  prefix
                  languageId
                  status
              }
            }
            customerId
          }        
        }
        
      }
  }
`;

export const GET_CHECKLIST_DETAILS = gql`
query ChecklistLinesUnlimited (
  $orderBy: [TranslatedChecklistLineDtoSortInput!],
  $filterBy: TranslatedChecklistLineDtoFilterInput,
) {
    checklistLinesUnlimited (
      order: $orderBy,
      where: $filterBy
    ) {
        friendlyStatus
        friendlyState
        data {
            checklistId
            checklistTemplateDetailId
            line
            variableId
            equipmentId
            state
            value
            planned
            plannedDate
            alarmed
            alarmedDate
            answeredDate
            isAutonomous
            sensorId
            lastAnswer
            answersCount
            alarmsCount
            actionPlan
            actionPlanExists
            resetedById
            resetedDate
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
  }
`;

export const GET_CHECKLIST_TEMPLATE_TRANSLATIONS = gql`
  query ChecklistTemplatesTranslationsTable (
    $recordsToSkip: Int,
    $recordsToTake: Int,
    $orderBy: [ChecklistTemplateTranslationTableSortInput!],
    $filterBy: ChecklistTemplateTranslationTableFilterInput,
  ) {
    checklistTemplatesTranslationsTable(
    skip: $recordsToSkip,
    take: $recordsToTake,
    order: $orderBy,
    where: $filterBy
  ) {
    totalCount
    items {
        checklistTemplateId
        name
        reference
        notes
        approvalRequestMessageSubject
        approvalRequestMessageBody
        anticipationMessageSubject
        anticipationMessageBody
        expiringMessageSubject
        expiringMessageBody
        alarmNotificationMessageSubject
        alarmNotificationMessageBody
        generationMessageSubject
        generationMessageBody
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

export const GET_CHECKLIST_PLAN = gql`
  query OneChecklistPlan ($checklistPlanId: Long!) {
    oneChecklistPlan (id: $checklistPlanId) {      
      isTranslated
      translatedName
      translatedReference
      translatedNotes
      translatedPrefix
      friendlyStatus
      friendlyFrequency      
      data {
          name
          reference
          notes
          prefix
          templates
          equipments
          checklistPlanTypeId
          frequency          
          executionTimes
          hours
          timeZone
          lastGeneration
          checklistCount
          specificDate
          limit
          anticipationTime                    
          id
          customerId
          status
          createdById
          createdAt
          updatedById
          updatedAt
          deletedById
          deletedAt
          checklistPlanType {
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
          translations {
            checklistPlanId
            name
            reference
            notes
            prefix              
            languageId
            id                
          }
      }    
  }
}
`;

export const GET_CHECKLIST_PLAN_TRANSLATIONS = gql`
  query ChecklistPlansTranslationsTable (
    $recordsToSkip: Int,
    $recordsToTake: Int,
    $orderBy: [ChecklistPlanTranslationTableSortInput!],
    $filterBy: ChecklistPlanTranslationTableFilterInput,
  ) {
    checklistPlansTranslationsTable(
    skip: $recordsToSkip,
    take: $recordsToTake,
    order: $orderBy,
    where: $filterBy
  ) {
    totalCount
    items {
        checklistPlanId
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

export const INACTIVATE_CHECKLIST_TMEPLATE = gql`
  mutation CreateOrUpdateChecklistTemplate (
    $id: Long,
    $customerId: Long,
    $status: String
  ) {
  createOrUpdateChecklistTemplate (
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

export const INACTIVATE_CHECKLIST_PLAN = gql`
  mutation CreateOrUpdateChecklistPlan (
    $id: Long,
    $customerId: Long,
    $status: String
  ) {
  createOrUpdateChecklistPlan (
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

export const INACTIVATE_COMPANY = gql`
  mutation CreateOrUpdateCompany (
    $id: Long,
    $customerId: Long,
    $status: String
  ) {
  createOrUpdateCompany (
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


export const INACTIVATE_CUSTOMER = gql`
  mutation CreateOrUpdateCustomer (
    $id: Long,    
    $status: String
  ) {
  createOrUpdateCustomer (
    inputs: {
      id: $id      
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

export const GET_CATALOG_DETAILS_ACTION_PLANS_TO_GENERATE_LAZY_LOADING = gql`
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

export const GET_CATALOG_DETAILS_DEPARTMENTS_LAZY_LOADING = gql`
  query CatalogDetailDepartment (    
    $recordsToSkip: Int,
    $recordsToTake: Int,
    $filterBy: MultipleCatalogSelectionDtoFilterInput,
    $process: String,
    $processId: Long
  ) {
    catalogDetailDepartment (
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

export const GET_CATALOG_DETAILS_POSITIONS_LAZY_LOADING = gql`
  query CatalogDetailPosition (    
    $recordsToSkip: Int,
    $recordsToTake: Int,
    $filterBy: MultipleCatalogSelectionDtoFilterInput,
    $process: String,
    $processId: Long
  ) {
    catalogDetailPosition (
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

export const GET_CATALOG_DETAILS_WORKGROUPS_LAZY_LOADING = gql`
  query CatalogDetailWorkgroup (    
    $recordsToSkip: Int,
    $recordsToTake: Int,
    $filterBy: MultipleCatalogSelectionDtoFilterInput,
    $process: String,
    $processId: Long
  ) {
    catalogDetailWorkgroup (
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

export const GET_CATALOG_DETAILS_USERS_LAZY_LOADING = gql`
  query CatalogDetailUser (    
    $recordsToSkip: Int,
    $recordsToTake: Int,
    $filterBy: MultipleCatalogSelectionDtoFilterInput,
    $process: String,
    $processId: Long
  ) {
    catalogDetailUser (
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

export const GET_CUSTOMERS = gql`
  query CustomersPaginated (
    $recordsToSkip: Int,
    $recordsToTake: Int,
    $orderBy: [TranslatedCustomerDtoSortInput!],
    $filterBy: TranslatedCustomerDtoFilterInput,
  ) {
  customersPaginated (
    skip: $recordsToSkip,
    take: $recordsToTake,
    order: $orderBy,
    where: $filterBy
  ) {
      items {
        friendlyStatus
        data {
          name
          reference
          mainImagePath
          mainImageName
          mainImageGuid
          id         
          status
          updatedAt
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

export const GET_CUSTOMER = gql`
  query OneCustomer (
    $customerId: Long!,
  ) {
  oneCustomer (
    id: $customerId        
  ) {
    data {
      name
      reference
      notes
      prefix
      mainImagePath
      mainImageGuid
      mainImageName      
      id
      status
      createdById
      createdAt
      updatedById
      updatedAt
      deletedById
      deletedAt      
     
    }
    friendlyStatus
 
  }
}
`;

export const GET_CUSTOMER_TRANSLATIONS = gql`
  query CustomersTranslationsTable (
    $recordsToSkip: Int,
    $recordsToTake: Int,
    $orderBy: [CustomerTranslationTableSortInput!],
    $filterBy: CustomerTranslationTableFilterInput,
  ) {
    customersTranslationsTable(
    skip: $recordsToSkip,
    take: $recordsToTake,
    order: $orderBy,
    where: $filterBy
  ) {
    totalCount
    items {
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

export const UPSERT_CUSTOMER_TRANSLATIONS = gql`
  mutation CreateOrUpdateCustomerTranslationTable (
    $translations: [CustomerTranslationTableDtoInput!]!    
  ) {
    createOrUpdateCustomerTranslationTable (
      inputs: $translations
    ) {
      id,
      customerId,
      languageId      
    }
  }
`;

export const UPSERT_CUSTOMER = gql`
  mutation CreateOrUpdateCustomer (
    $id: Long,
    $status: String    
    $name: String,
    $reference: String,
    $notes: String,   
    $prefix: String,  
    $mainImageGuid: String,
    $mainImageName: String,
    $mainImagePath: String,          
  ) {
  createOrUpdateCustomer (
    inputs: [{
      id: $id      
      status: $status
      name: $name,
      reference: $reference,
      notes: $notes,
      prefix: $prefix,
      mainImageGuid: $mainImageGuid,
      mainImageName: $mainImageName,
      mainImagePath: $mainImagePath, 
    }]) {
      id
      createdAt
      updatedAt
      deletedAt
     
    } 
  }
`;

export const DELETE_CUSTOMER_TRANSLATIONS = gql`
  mutation DeleteCustomersTranslationsTable (
    $ids: [IdToDeleteInput!]!,
    $customerId: Long!,
  ) {
    deleteCustomersTranslationsTable (      
      ids: $ids,
      customerId: $customerId,
    ) 
  }
`;

//manufacturers================================================


export const GET_MANUFACTURER = gql`
  query OneManufacturer (
    $manufacturerId: Long!,
  ) {
  oneManufacturer (
    id: $manufacturerId        
  ) {
    data {
      name
      reference
      notes
      prefix
      mainImageGuid
      mainImageName
      mainImagePath     
      id
      customerId     
      status
      createdById
      createdAt
      updatedById
      updatedAt
      deletedById
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
    friendlyStatus
  }
}
`;

export const GET_MANUFACTURERS = gql`
  query ManufacturersPaginated (
    $recordsToSkip: Int,
    $recordsToTake: Int,
    $orderBy: [TranslatedManufacturerDtoSortInput!],
    $filterBy: TranslatedManufacturerDtoFilterInput,
  ) {
  manufacturersPaginated (
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
          mainImageGuid
          mainImageName
          id
          customerId
          reference
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

export const GET_MANUFACTURER_TRANSLATIONS = gql`
  query ManufacturersTranslationsTable (
    $recordsToSkip: Int,
    $recordsToTake: Int,
    $orderBy: [ManufacturerTranslationTableSortInput!],
    $filterBy: ManufacturerTranslationTableFilterInput,
  ) {
    manufacturersTranslationsTable(
    skip: $recordsToSkip,
    take: $recordsToTake,
    order: $orderBy,
    where: $filterBy
  ) {
    totalCount
    items {
        manufacturerId
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

export const UPSERT_MANUFACTURER_TRANSLATIONS = gql`
  mutation CreateOrUpdateManufacturerTranslationTable (
    $translations: [ManufacturerTranslationTableDtoInput!]!    
  ) {
    createOrUpdateManufacturerTranslationTable (
      inputs: $translations
    ) {
      id,
      manufacturerId,
      languageId      
    }
  }
`;

export const UPSERT_MANUFACTURER = gql`
  mutation CreateOrUpdateManufacturer (
    $customerId: Long,
  
    $id: Long,
    $status: String    
    $name: String,
     $prefix: String,
    $reference: String,
    $notes: String,
    $mainImageGuid: String,
    $mainImageName: String,
    $mainImagePath: String,    
  ) {
  createOrUpdateManufacturer (
    inputs: [{
      customerId: $customerId
     
      id: $id      
      status: $status
      name: $name,
      prefix: $prefix,
      reference: $reference,
      notes: $notes,
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

export const DELETE_MANUFACTURER_TRANSLATIONS = gql`
  mutation DeleteManufacturersTranslationsTable (
    $ids: [IdToDeleteInput!]!,
    $customerId: Long!
  
  ) {
    deleteManufacturersTranslationsTable (      
      ids: $ids,
      customerId: $customerId,
    
    ) 
  }
`;

export const INACTIVATE_MANUFACTURER = gql`
  mutation CreateOrUpdateManufacturer (
    $id: Long,
    $customerId: Long,
    $status: String
  ) {
  createOrUpdateManufacturer (
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

//plants===========================

export const GET_PLANT = gql`
  query OnePlant (
    $plantId: Long!,
  ) {
  onePlant (
    id: $plantId        
  ) {
    data {
      name
      reference
      notes
      prefix
      mainImagePath
      mainImageGuid
      mainImageName
      id
      customerId
      companyId 
      status
      createdById
      createdAt
      updatedById
      updatedAt
      deletedById
      deletedAt
      company {
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
  }
}
`;

export const GET_PLANTS = gql`
  query PlantsPaginated (
    $recordsToSkip: Int,
    $recordsToTake: Int,
    $orderBy: [TranslatedPlantDtoSortInput!],
    $filterBy: TranslatedPlantDtoFilterInput,
  ) {
  plantsPaginated (
    skip: $recordsToSkip,
    take: $recordsToTake,
    order: $orderBy,
    where: $filterBy
  ) {
      items {
        friendlyStatus
        data {
          name         
          reference 
          mainImagePath
          mainImageName
          mainImageGuid
          id
          customerId
          companyId
          company {
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

export const GET_PLANT_TRANSLATIONS = gql`
  query PlantsTranslationsTable (
    $recordsToSkip: Int,
    $recordsToTake: Int,
    $orderBy: [PlantTranslationTableSortInput!],
    $filterBy: PlantTranslationTableFilterInput,
  ) {
    plantsTranslationsTable(
    skip: $recordsToSkip,
    take: $recordsToTake,
    order: $orderBy,
    where: $filterBy
  ) {
    totalCount
    items {
        plantId
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


export const UPSERT_PLANT_TRANSLATIONS = gql`
  mutation CreateOrUpdatePlantTranslationTable (
    $translations: [PlantTranslationTableDtoInput!]!    
  ) {
    createOrUpdatePlantTranslationTable (
      inputs: $translations
    ) {
      id,
      plantId,      
      languageId      
    }
  }
`;

export const UPSERT_PLANT = gql`
  mutation CreateOrUpdatePlant (
    $customerId: Long,
    $companyId: Long,
    $id: Long,
    $status: String    
    $name: String,
    $prefix: String,
    $reference: String,
    $notes: String,
    $mainImageGuid: String,
    $mainImageName: String,
    $mainImagePath: String,    
  ) {
  createOrUpdatePlant (
    inputs: [{
      customerId: $customerId
      companyId: $companyId
      id: $id      
      status: $status
      name: $name,
      reference: $reference,
      prefix: $prefix,
      notes: $notes,
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

export const DELETE_PLANT_TRANSLATIONS = gql`
  mutation DeletePlantsTranslationsTable (
    $ids: [IdToDeleteInput!]!,
    $customerId: Long!
  ) {
    deletePlantsTranslationsTable (      
      ids: $ids,
      customerId: $customerId,
    ) 
  }
`;

//companies===========================
export const GET_COMPANY = gql`
  query OneCompany (
    $companyId: Long!,
  ) {
  oneCompany (
    id: $companyId        
  ) {
    data {
      name
      reference
      notes
      prefix
      mainImagePath
      mainImageGuid
      mainImageName
      id
      customerId     
      status
      createdById
      createdAt
      updatedById
      updatedAt
      deletedById
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
    friendlyStatus    
  }
}
`;

export const GET_COMPANIES = gql`
  query CompaniesPaginated (
    $recordsToSkip: Int,
    $recordsToTake: Int,
    $orderBy: [TranslatedCompanyDtoSortInput!],
    $filterBy: TranslatedCompanyDtoFilterInput,
  ) {
  companiesPaginated (
    skip: $recordsToSkip,
    take: $recordsToTake,
    order: $orderBy,
    where: $filterBy
  ) {
      items {
        friendlyStatus
        data {
          name
          reference
          mainImagePath
          mainImageName
          mainImageGuid
          id
          customerId       
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

export const GET_COMPANIES_LAZY_LOADING = gql`
  query CompaniesPaginated (
      $recordsToSkip: Int,
      $recordsToTake: Int,
      $orderBy: [TranslatedCompanyDtoSortInput!],
      $filterBy: TranslatedCompanyDtoFilterInput
  ) {
    companiesPaginated (
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


export const GET_COMPANY_TRANSLATIONS = gql`
  query CompaniesTranslationsTable (
    $recordsToSkip: Int,
    $recordsToTake: Int,
    $orderBy: [CompanyTranslationTableSortInput!],
    $filterBy: CompanyTranslationTableFilterInput,
  ) {
    companiesTranslationsTable(
    skip: $recordsToSkip,
    take: $recordsToTake,
    order: $orderBy,
    where: $filterBy
  ) {
    totalCount
    items {
        companyId
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


export const UPSERT_COMPANY_TRANSLATIONS = gql`
  mutation CreateOrUpdateCompanyTranslationTable (
    $translations: [CompanyTranslationTableDtoInput!]!    
  ) {
    createOrUpdateCompanyTranslationTable (
      inputs: $translations
    ) {
      id,
      companyId,
      languageId      
    }
  }
`;

export const UPSERT_COMPANY = gql`
  mutation CreateOrUpdateCompany (
    $customerId: Long,  
    $id: Long,
    $status: String    
    $name: String,
    $prefix: String,
    $reference: String,
    $notes: String,
    $mainImageGuid: String,
    $mainImageName: String,
    $mainImagePath: String,    
  ) {
  createOrUpdateCompany (
    inputs: [{
      customerId: $customerId     
      id: $id      
      status: $status
      name: $name,
      prefix: $prefix,
      reference: $reference,
      notes: $notes,
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

export const DELETE_COMPANY_TRANSLATIONS = gql`
  mutation DeleteCompaniesTranslationsTable (
    $ids: [IdToDeleteInput!]!,
    $customerId: Long!
  
  ) {
    deleteCompaniesTranslationsTable (      
      ids: $ids,
      customerId: $customerId,
    
    ) 
  }
`;

//providers===========================

export const GET_PROVIDER = gql`
  query OneProvider (
    $providerId: Long!,
  ) {
  oneProvider (
    id: $providerId        
  ) {
    data {
      name
      reference
      notes
      prefix
      mainImageGuid
      mainImageName
      mainImagePath     
      id
      customerId     
      status
      createdById
      createdAt
      updatedById
      updatedAt
      deletedById
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
    friendlyStatus
  }
}
`;

export const GET_PROVIDERS = gql`
  query ProvidersPaginated (
    $recordsToSkip: Int,
    $recordsToTake: Int,
    $orderBy: [TranslatedProviderDtoSortInput!],
    $filterBy: TranslatedProviderDtoFilterInput,
  ) {
  providersPaginated (
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
          mainImageGuid
          mainImageName
          id
          customerId
          reference
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

export const GET_PROVIDER_TRANSLATIONS = gql`
  query ProvidersTranslationsTable (
    $recordsToSkip: Int,
    $recordsToTake: Int,
    $orderBy: [ProviderTranslationTableSortInput!],
    $filterBy: ProviderTranslationTableFilterInput,
  ) {
    providersTranslationsTable(
    skip: $recordsToSkip,
    take: $recordsToTake,
    order: $orderBy,
    where: $filterBy
  ) {
    totalCount
    items {
        providerId
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

export const UPSERT_PROVIDER_TRANSLATIONS = gql`
  mutation CreateOrUpdateProviderTranslationTable (
    $translations: [ProviderTranslationTableDtoInput!]!    
  ) {
    createOrUpdateProviderTranslationTable (
      inputs: $translations
    ) {
      id,
      providerId,
      languageId      
    }
  }
`;

export const UPSERT_PROVIDER = gql`
  mutation CreateOrUpdateProvider (
    $customerId: Long,
  
    $id: Long,
    $status: String    
    $name: String,
     $prefix: String,
    $reference: String,
    $notes: String,
    $mainImageGuid: String,
    $mainImageName: String,
    $mainImagePath: String,    
  ) {
  createOrUpdateProvider (
    inputs: [{
      customerId: $customerId
     
      id: $id      
      status: $status
      name: $name,
      prefix: $prefix,
      reference: $reference,
      notes: $notes,
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

export const DELETE_PROVIDER_TRANSLATIONS = gql`
  mutation DeleteProvidersTranslationsTable (
    $ids: [IdToDeleteInput!]!,
    $customerId: Long!
  
  ) {
    deleteProvidersTranslationsTable (      
      ids: $ids,
      customerId: $customerId,
    
    ) 
  }
`;

export const INACTIVATE_PROVIDER = gql`
  mutation CreateOrUpdateProvider (
    $id: Long,
    $customerId: Long,
    $status: String
  ) {
  createOrUpdateProvider (
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

//equipments===========================

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

export const GET_EQUIPMENT = gql`
  query OneEquipment (
    $equipmentId: Long!,
  ) {
  oneEquipment (
    id: $equipmentId        
  ) {
    data {
      name
      reference
      notes
      prefix
      mainImagePath
      mainImageGuid
      mainImageName
      id
      customerId
     
      plantId     
      status
      createdById
      createdAt
      updatedById
      updatedAt
      deletedById
      deletedAt
      plant {
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
  }
}
`;

export const GET_EQUIPMENTS = gql`
  query EquipmentsPaginated (
    $recordsToSkip: Int,
    $recordsToTake: Int,
    $orderBy: [TranslatedEquipmentDtoSortInput!],
    $filterBy: TranslatedEquipmentDtoFilterInput,
  ) {
  equipmentsPaginated (
    skip: $recordsToSkip,
    take: $recordsToTake,
    order: $orderBy,
    where: $filterBy
  ) {
      items {
        friendlyStatus
        data {
          name
          reference
          mainImagePath
          mainImageName
          mainImageGuid
          id
          customerId
          plantId
          plant {
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

export const GET_EQUIPMENT_TRANSLATIONS = gql`
  query EquipmentsTranslationsTable (
    $recordsToSkip: Int,
    $recordsToTake: Int,
    $orderBy: [EquipmentTranslationTableSortInput!],
    $filterBy: EquipmentTranslationTableFilterInput,
  ) {
    equipmentsTranslationsTable(
    skip: $recordsToSkip,
    take: $recordsToTake,
    order: $orderBy,
    where: $filterBy
  ) {
    totalCount
    items {
        equipmentId
        name
        reference
        notes
        prefix
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


export const UPSERT_EQUIPMENT_TRANSLATIONS = gql`
  mutation CreateOrUpdateEquipmentTranslationTable (
    $translations: [EquipmentTranslationTableDtoInput!]!    
  ) {
    createOrUpdateEquipmentTranslationTable (
      inputs: $translations
    ) {
      id,
      equipmentId,
      languageId      
    }
  }
`;

export const UPSERT_EQUIPMENT = gql`
  mutation CreateOrUpdateEquipment (
    $customerId: Long,
    $plantId: Long,
   
    $id: Long,
    $status: String    
    $name: String,
    $prefix: String,
    $reference: String,
    $notes: String,
    $mainImageGuid: String,
    $mainImageName: String,
    $mainImagePath: String,    
  ) {
  createOrUpdateEquipment (
    inputs: [{
      customerId: $customerId
      plantId: $plantId 
      
      id: $id      
      status: $status
      name: $name,
      prefix: $prefix,
      reference: $reference,
      notes: $notes,
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

export const DELETE_EQUIPMENT_TRANSLATIONS = gql`
  mutation DeleteEquipmentsTranslationsTable (
    $ids: [IdToDeleteInput!]!,
    $customerId: Long!   
    $plantId: Long!
  ) {
    deleteEquipmentsTranslationsTable (      
      ids: $ids,
      customerId: $customerId,
      plantId: $plantId,
    ) 
  }
`;

export const INACTIVATE_EQUIPMENT = gql`
  mutation CreateOrUpdateEquipment (
    $id: Long,
    $customerId: Long,
    $plantId: Long,
    $status: String
  ) {
  createOrUpdateEquipment (
    inputs: {
      id: $id
      customerId: $customerId
      plantId: $plantId
      status: $status
    }) {
      id
      status
    } 
  }
`;



//attachments===========

export const SAVE_ATTACHMENTS = gql`
  mutation UpdateUploadedFiles (
    $processId: Long!,
    $process: String!,
    $files: [String!]!    
  ) {    
  updateUploadedFiles (    
      processId: $processId
      process: $process
      fileIds: $files    
    ) 
  }
`;

export const DUPLICATE_ATTACHMENTS = gql`
  mutation DuplicateAttachments (
    $process: String!,
    $files: [String!]!) {    
    duplicateAttachments (
      process: $process
      ids: $files
    ) {
        fileId
        path
        fileName
        fileType
      }
  }
`;

export const GET_ALL_ATTACHMENTS = gql`
query UploadedFiles (
    $processId: Long,
    $customerId: Long,
    $process: String
  ) {
  uploadedFiles(
      where: {
          and: [
              { processId: { eq: $processId } }
              { customerId: { eq: $customerId } }
              { process: { eq: $process } }
              { line: { neq: 0 } }
          ]
      }
      order: { line: ASC }
  ) {
      totalCount
      items {
        line
        fileId
        fileType
        fileName
        path
      }
    }
  }
`
  ;

  //=======uoms


export const GET_UOM = gql`
  query OneUom (
    $uomId: Long!,
  ) {
  oneUom (
    id: $uomId        
  ) {
    data {
      name
      reference
      notes
      prefix
      id
      customerId
      status
      createdById
      createdAt
      updatedById
      updatedAt
      deletedById
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
    friendlyStatus    
  }
}
`;

export const GET_UOMS = gql`
  query UomsPaginated (
    $recordsToSkip: Int,
    $recordsToTake: Int,
    $orderBy: [TranslatedUomDtoSortInput!],
    $filterBy: TranslatedUomDtoFilterInput,
  ) {
  uomsPaginated (
    skip: $recordsToSkip,
    take: $recordsToTake,
    order: $orderBy,
    where: $filterBy
  ) {
      items {
        friendlyStatus
        data {
          name
          reference
          id
          customerId
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

export const GET_UOM_TRANSLATIONS = gql`
  query UomsTranslationsTable (
    $recordsToSkip: Int,
    $recordsToTake: Int,
    $orderBy: [UomTranslationTableSortInput!],
    $filterBy: UomTranslationTableFilterInput,
  ) {
    uomsTranslationsTable(
    skip: $recordsToSkip,
    take: $recordsToTake,
    order: $orderBy,
    where: $filterBy
  ) {
    totalCount
    items {
        uomId
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

export const GET_RECIPIENT_TRANSLATIONS = gql`
  query RecipientsTranslationsTable (
    $recordsToSkip: Int,
    $recordsToTake: Int,
    $orderBy: [RecipientTranslationTableSortInput!],
    $filterBy: RecipientTranslationTableFilterInput,
  ) {
    recipientsTranslationsTable(
    skip: $recordsToSkip,
    take: $recordsToTake,
    order: $orderBy,
    where: $filterBy
  ) {
    totalCount
    items {
        recipientId
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

export const UPSERT_UOM_TRANSLATIONS = gql`
  mutation CreateOrUpdateUomTranslationTable (
    $translations: [UomTranslationTableDtoInput!]!    
  ) {
    createOrUpdateUomTranslationTable (
      inputs: $translations
    ) {
      id,
      uomId,
      languageId      
    }
  }
`;

export const UPSERT_UOM = gql`
  mutation CreateOrUpdateUom (
    $customerId: Long,
    $id: Long,
    $status: String    
    $name: String,
    $prefix: String,
    $reference: String,
    $notes: String,
        
  ) {
  createOrUpdateUom (
    inputs: [{
      customerId: $customerId
      id: $id      
      status: $status
      name: $name,
      prefix: $prefix,
      reference: $reference,
      notes: $notes,
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

export const DELETE_UOM_TRANSLATIONS = gql`
  mutation DeleteUomsTranslationsTable (
    $ids: [IdToDeleteInput!]!,
    $customerId: Long!
 
  ) {
    deleteUomsTranslationsTable (      
      ids: $ids,
      customerId: $customerId,
    ) 
  }
`;

export const INACTIVATE_UOM = gql`
  mutation CreateOrUpdateUom (
    $id: Long,
    $customerId: Long,
    $status: String
  ) {
  createOrUpdateUom (
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

export const GET_RECIPIENT = gql`
  query OneRecipient (
    $recipientId: Long!,
  ) {
  oneRecipient (
    id: $recipientId        
  ) {
    data {
      name
      reference
      notes
      prefix
      emails
      phones
      mmcalls
      smartWatchService1
      smartWatchService2
      smartWatchService3
      smartWatchService4
      smartWatchService5
      phoneServices
      languageId
      language {
        name
        reference
        id
        iso
      }
      id
      customerId
      status
      createdById
      createdAt
      updatedById
      updatedAt
      deletedById
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
    friendlyStatus    
  }
}
`;

export const GET_RECIPIENTS = gql`
  query RecipientsPaginated (
    $recordsToSkip: Int,
    $recordsToTake: Int,
    $orderBy: [TranslatedRecipientDtoSortInput!],
    $filterBy: TranslatedRecipientDtoFilterInput,
  ) {
  recipientsPaginated (
    skip: $recordsToSkip,
    take: $recordsToTake,
    order: $orderBy,
    where: $filterBy
  ) {
      items {
        friendlyStatus
        data {
          name
          reference
          id
          customerId
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

export const UPSERT_RECIPIENT_TRANSLATIONS = gql`
  mutation CreateOrUpdateRecipientTranslationTable (
    $translations: [RecipientTranslationTableDtoInput!]!    
  ) {
    createOrUpdateRecipientTranslationTable (
      inputs: $translations
    ) {
      id,
      recipientId,
      languageId      
    }
  }
`;

export const UPSERT_RECIPIENT = gql`
  mutation CreateOrUpdateRecipient (
    $customerId: Long,
    $id: Long,
    $status: String    
    $name: String,
    $prefix: String,
    $reference: String,
    $notes: String,
    $emails: String,
    $phones: String,
    $mmcalls: String,
    $smartWatchService1: String,
    $smartWatchService2: String,
    $smartWatchService3: String,
    $smartWatchService4: String,
    $smartWatchService5: String,
    $phoneServices: String,
    $languageId: Long
  ) {
  createOrUpdateRecipient (
    inputs: [{
      customerId: $customerId
      id: $id      
      status: $status
      name: $name
      prefix: $prefix
      reference: $reference
      notes: $notes
      emails: $emails
      phones: $phones
      mmcalls: $mmcalls
      smartWatchService1: $smartWatchService1
      smartWatchService2: $smartWatchService2
      smartWatchService3: $smartWatchService3
      smartWatchService4: $smartWatchService4
      smartWatchService5: $smartWatchService5
      phoneServices: $phoneServices
      languageId: $languageId
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

export const DELETE_RECIPIENT_TRANSLATIONS = gql`
  mutation DeleteRecipientsTranslationsTable (
    $ids: [IdToDeleteInput!]!,
    $customerId: Long!
 
  ) {
    deleteRecipientsTranslationsTable (      
      ids: $ids,
      customerId: $customerId,
    ) 
  }
`;

export const INACTIVATE_RECIPIENT = gql`
  mutation CreateOrUpdateRecipient (
    $id: Long,
    $customerId: Long,
    $status: String
  ) {
  createOrUpdateRecipient (
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

export const GET_POSITION = gql`
  query OnePosition (
    $positionId: Long!,
  ) {
  onePosition (
    id: $positionId        
  ) {
    data {
      name
      reference
      notes
      prefix
    
      id
      customerId
      recipientId
     
      plantId     
      status
      createdById
      createdAt
      updatedById
      updatedAt
      deletedById
      deletedAt
      plant {
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
      recipient {
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
  }
}
`;

export const GET_POSITIONS = gql`
  query PositionsPaginated (
    $recordsToSkip: Int,
    $recordsToTake: Int,
    $orderBy: [TranslatedPositionDtoSortInput!],
    $filterBy: TranslatedPositionDtoFilterInput,
  ) {
  positionsPaginated (
    skip: $recordsToSkip,
    take: $recordsToTake,
    order: $orderBy,
    where: $filterBy
  ) {
      items {
        friendlyStatus
        data {
          name
          reference
         
          id
          customerId
          plantId
          plant {
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
          recipient {
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
          recipientId
        
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

export const GET_POSITION_TRANSLATIONS = gql`
  query PositionsTranslationsTable (
    $recordsToSkip: Int,
    $recordsToTake: Int,
    $orderBy: [PositionTranslationTableSortInput!],
    $filterBy: PositionTranslationTableFilterInput,
  ) {
    positionsTranslationsTable(
    skip: $recordsToSkip,
    take: $recordsToTake,
    order: $orderBy,
    where: $filterBy
  ) {
    totalCount
    items {
        positionId
        name
        reference
        notes
        prefix
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

export const UPSERT_POSITION_TRANSLATIONS = gql`
  mutation CreateOrUpdatePositionTranslationTable (
    $translations: [PositionTranslationTableDtoInput!]!    
  ) {
    createOrUpdatePositionTranslationTable (
      inputs: $translations
    ) {
      id,
      positionId,
      languageId      
    }
  }
`;

export const UPSERT_POSITION = gql`
  mutation CreateOrUpdatePosition (
    $customerId: Long,
    $plantId: Long,
    $recipientId: Long,
   
    $id: Long,
    $status: String    
    $name: String,
    $prefix: String,
    $reference: String,
    $notes: String,
   
  ) {
  createOrUpdatePosition (
    inputs: [{
      customerId: $customerId
      plantId: $plantId 
      recipientId: $recipientId
    
      id: $id      
      status: $status
      name: $name,
      prefix: $prefix,
      reference: $reference,
      notes: $notes,
    
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

export const DELETE_POSITION_TRANSLATIONS = gql`
  mutation DeletePositionsTranslationsTable (
    $ids: [IdToDeleteInput!]!,
    $customerId: Long!   
    $plantId: Long!
  ) {
    deletePositionsTranslationsTable (      
      ids: $ids,
      customerId: $customerId,
      plantId: $plantId,
    ) 
  }
`;

export const INACTIVATE_POSITION = gql`
  mutation CreateOrUpdatePosition (
    $id: Long,
    $customerId: Long,
    $plantId: Long,
    $status: String
  ) {
  createOrUpdatePosition (
    inputs: {
      id: $id
      customerId: $customerId
      plantId: $plantId
      status: $status
    }) {
      id
      status
    } 
  }
`;


//partNumbers===========================

export const GET_PART_NUMBER = gql`
  query OnePartNumber (
    $partNumberId: Long!,
  ) {
  onePartNumber (
    id: $partNumberId        
  ) {
    data {
      name
      reference
      notes
      prefix
      dieId
      id
      customerId
     
      status
      createdById
      createdAt
      updatedById
      updatedAt
      deletedById
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
    friendlyStatus
  }
}
`;

export const GET_PART_NUMBERS = gql`
  query PartNumbersPaginated (
    $recordsToSkip: Int,
    $recordsToTake: Int,
    $orderBy: [TranslatedPartNumberDtoSortInput!],
    $filterBy: TranslatedPartNumberDtoFilterInput,
  ) {
  partNumbersPaginated (
    skip: $recordsToSkip,
    take: $recordsToTake,
    order: $orderBy,
    where: $filterBy
  ) {
      items {
        friendlyStatus
        data {
          name
       
          id
          customerId
          reference
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

export const GET_PART_NUMBER_TRANSLATIONS = gql`
  query PartNumbersTranslationsTable (
    $recordsToSkip: Int,
    $recordsToTake: Int,
    $orderBy: [PartNumberTranslationTableSortInput!],
    $filterBy: PartNumberTranslationTableFilterInput,
  ) {
    partNumbersTranslationsTable(
    skip: $recordsToSkip,
    take: $recordsToTake,
    order: $orderBy,
    where: $filterBy
  ) {
    totalCount
    items {
        partNumberId
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


export const UPSERT_PART_NUMBER_TRANSLATIONS = gql`
  mutation CreateOrUpdatePartNumberTranslationTable (
    $translations: [PartNumberTranslationTableDtoInput!]!    
  ) {
    createOrUpdatePartNumberTranslationTable (
      inputs: $translations
    ) {
      id,
      partNumberId,
      languageId      
    }
  }
`;

export const UPSERT_PART_NUMBER = gql`
  mutation CreateOrUpdatePartNumber (
    $customerId: Long,
  
    $id: Long,
    $status: String    
    $name: String,
    $reference: String,
    $notes: String,
    $dieId: Long,
   
  ) {
  createOrUpdatePartNumber (
    inputs: [{
      customerId: $customerId
      id: $id      
      status: $status
      name: $name
      reference: $reference
      notes: $notes
      dieId: $dieId
   
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

export const DELETE_PART_NUMBER_TRANSLATIONS = gql`
  mutation DeletePartNumbersTranslationsTable (
    $ids: [IdToDeleteInput!]!,
    $customerId: Long!
  
  ) {
    deletePartNumbersTranslationsTable (      
      ids: $ids,
      customerId: $customerId,
    
    ) 
  }
`;

export const INACTIVATE_PART_NUMBER = gql`
  mutation CreateOrUpdatePartNumber (
    $id: Long,
    $customerId: Long,
    $status: String
  ) {
  createOrUpdatePartNumber (
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

//lines===========================


export const GET_LINE = gql`
  query OneLine (
    $lineId: Long!,
  ) {
  oneLine (
    id: $lineId        
  ) {
    data {
      name
      reference
      notes
      prefix
      mainImagePath
      mainImageGuid
      mainImageName
      id
      customerId
     
      plantId     
      status
      createdById
      createdAt
      updatedById
      updatedAt
      deletedById
      deletedAt
      plant {
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
  }
}
`;

export const GET_LINES = gql`
  query LinesPaginated (
    $recordsToSkip: Int,
    $recordsToTake: Int,
    $orderBy: [TranslatedLineDtoSortInput!],
    $filterBy: TranslatedLineDtoFilterInput,
  ) {
  linesPaginated (
    skip: $recordsToSkip,
    take: $recordsToTake,
    order: $orderBy,
    where: $filterBy
  ) {
      items {
        friendlyStatus
        data {
          name
          reference
          mainImagePath
          mainImageName
          mainImageGuid
          id
          customerId
          plantId
          plant {
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

export const GET_LINE_TRANSLATIONS = gql`
  query LinesTranslationsTable (
    $recordsToSkip: Int,
    $recordsToTake: Int,
    $orderBy: [LineTranslationTableSortInput!],
    $filterBy: LineTranslationTableFilterInput,
  ) {
    linesTranslationsTable(
    skip: $recordsToSkip,
    take: $recordsToTake,
    order: $orderBy,
    where: $filterBy
  ) {
    totalCount
    items {
        lineId
        name
        reference
        notes
        prefix
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


export const UPSERT_LINE_TRANSLATIONS = gql`
  mutation CreateOrUpdateLineTranslationTable (
    $translations: [LineTranslationTableDtoInput!]!    
  ) {
    createOrUpdateLineTranslationTable (
      inputs: $translations
    ) {
      id,
      lineId,
      languageId      
    }
  }
`;

export const UPSERT_LINE = gql`
  mutation CreateOrUpdateLine (
    $customerId: Long,
    $plantId: Long,
   
    $id: Long,
    $status: String    
    $name: String,
    $prefix: String,
    $reference: String,
    $notes: String,
    $mainImageGuid: String,
    $mainImageName: String,
    $mainImagePath: String,    
  ) {
  createOrUpdateLine (
    inputs: [{
      customerId: $customerId
      plantId: $plantId 
      
      id: $id      
      status: $status
      name: $name,
      prefix: $prefix,
      reference: $reference,
      notes: $notes,
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

export const DELETE_LINE_TRANSLATIONS = gql`
  mutation DeleteLinesTranslationsTable (
    $ids: [IdToDeleteInput!]!,
    $customerId: Long!   
    $plantId: Long!
  ) {
    deleteLinesTranslationsTable (      
      ids: $ids,
      customerId: $customerId,
      plantId: $plantId,
    ) 
  }
`;

export const INACTIVATE_LINE = gql`
  mutation CreateOrUpdateLine (
    $id: Long,
    $customerId: Long,
    $plantId: Long,
    $status: String
  ) {
  createOrUpdateLine (
    inputs: {
      id: $id
      customerId: $customerId
      plantId: $plantId
      status: $status
    }) {
      id
      status
    } 
  }
`;


//=======generics


export const GET_GENERIC = gql`
  query OneGeneric (
    $genericId: Long!,
  ) {
  oneGeneric (
    id: $genericId        
  ) {
    data {
      name
      reference
      notes
      prefix
      id
      tableName
      customerId
      status
      createdById
      createdAt
      updatedById
      updatedAt
      deletedById
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
    friendlyStatus
    friendlyTableName  
  }
}
`;

export const GET_GENERICS = gql`
  query GenericsPaginated (
    $recordsToSkip: Int,
    $recordsToTake: Int,
    $orderBy: [TranslatedGenericDtoSortInput!],
    $filterBy: TranslatedGenericDtoFilterInput,
  ) {
  genericsPaginated (
    skip: $recordsToSkip,
    take: $recordsToTake,
    order: $orderBy,
    where: $filterBy
  ) {
      items {
        friendlyStatus  
        friendlyTableName      
        data {          
          name
          reference
          id
          customerId
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

export const GET_GENERIC_TRANSLATIONS = gql`
  query GenericsTranslationsTable (
    $recordsToSkip: Int,
    $recordsToTake: Int,
    $orderBy: [GenericTranslationTableSortInput!],
    $filterBy: GenericTranslationTableFilterInput,
  ) {
    genericsTranslationsTable(
    skip: $recordsToSkip,
    take: $recordsToTake,
    order: $orderBy,
    where: $filterBy
  ) {
    totalCount
    items {
        genericId
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


export const UPSERT_GENERIC_TRANSLATIONS = gql`
  mutation CreateOrUpdateGenericTranslationTable (
    $translations: [GenericTranslationTableDtoInput!]!    
  ) {
    createOrUpdateGenericTranslationTable (
      inputs: $translations
    ) {
      id,
      genericId,
      languageId      
    }
  }
`;

export const UPSERT_GENERIC = gql`
  mutation CreateOrUpdateGeneric (
    $customerId: Long,
    $id: Long,
    $status: String    
    $name: String,
    $prefix: String,
    $reference: String,
    $notes: String,
    $tableName: String,
  ) {
  createOrUpdateGeneric (
    inputs: [{
      customerId: $customerId
      id: $id      
      status: $status
      name: $name,
      prefix: $prefix,
      reference: $reference,
      notes: $notes,
      tableName: $tableName,
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

export const DELETE_GENERIC_TRANSLATIONS = gql`
  mutation DeleteGenericsTranslationsTable (
    $ids: [IdToDeleteInput!]!,
    $customerId: Long!
 
  ) {
    deleteGenericsTranslationsTable (      
      ids: $ids,
      customerId: $customerId,
    ) 
  }
`;

export const INACTIVATE_GENERIC = gql`
  mutation CreateOrUpdateGeneric (
    $id: Long,
    $customerId: Long,
    $status: String
  ) {
  createOrUpdateGeneric (
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

export const GET_WORKGROUP = gql`
  query OneWorkgroup (
    $workgroupId: Long!,
  ) {
  oneWorkgroup (
    id: $workgroupId        
  ) {
    data {
      name
      reference
      notes
      prefix
      mainImageGuid
      mainImageName
      mainImagePath     
      id
      customerId
      recipient {
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
      approver {
        id
        customerId
        name
        status        
      }
      status
      createdById
      createdAt
      updatedById
      updatedAt
      deletedById
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
    friendlyStatus
  }
}
`;

export const GET_WORKGROUPS = gql`
  query WorkgroupsPaginated (
    $recordsToSkip: Int,
    $recordsToTake: Int,
    $orderBy: [TranslatedWorkgroupDtoSortInput!],
    $filterBy: TranslatedWorkgroupDtoFilterInput,
  ) {
  workgroupsPaginated (
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
          reference
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

export const GET_WORKGROUP_TRANSLATIONS = gql`
  query WorkgroupsTranslationsTable (
    $recordsToSkip: Int,
    $recordsToTake: Int,
    $orderBy: [WorkgroupTranslationTableSortInput!],
    $filterBy: WorkgroupTranslationTableFilterInput,
  ) {
    workgroupsTranslationsTable(
    skip: $recordsToSkip,
    take: $recordsToTake,
    order: $orderBy,
    where: $filterBy
  ) {
    totalCount
    items {
        workgroupId
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

export const UPSERT_WORKGROUP_TRANSLATIONS = gql`
  mutation CreateOrUpdateWorkgroupTranslationTable (
    $translations: [WorkgroupTranslationTableDtoInput!]!    
  ) {
    createOrUpdateWorkgroupTranslationTable (
      inputs: $translations
    ) {
      id,
      workgroupId,
      languageId      
    }
  }
`;

export const UPSERT_WORKGROUP = gql`
  mutation CreateOrUpdateWorkgroup (
    $customerId: Long,
  
    $id: Long,
    $status: String    
    $name: String,
    $reference: String,
    $notes: String,
    $approverId: Long,
    $recipientId: Long,
    $mainImageGuid: String,
    $mainImageName: String,
    $mainImagePath: String,   
   
  ) {
  createOrUpdateWorkgroup (
    inputs: [{
      customerId: $customerId
     
      id: $id      
      status: $status
      name: $name,
      reference: $reference,
      notes: $notes,
      mainImageGuid: $mainImageGuid,
      mainImageName: $mainImageName,
      mainImagePath: $mainImagePath,
      approverId: $approverId,
      recipientId: $recipientId,
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


export const DELETE_WORKGROUP_TRANSLATIONS = gql`
  mutation DeleteWorkgroupsTranslationsTable (
    $ids: [IdToDeleteInput!]!,
    $customerId: Long!
  
  ) {
    deleteWorkgroupsTranslationsTable (      
      ids: $ids,
      customerId: $customerId,    
    ) 
  }
`;

export const INACTIVATE_WORKGROUP = gql`
  mutation CreateOrUpdateWorkgroup (
    $id: Long,
    $customerId: Long,    
    $status: String
  ) {
  createOrUpdateWorkgroup (
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


export const GET_PLANTS_LAZY_LOADING = gql`
  query PlantsPaginated (
      $recordsToSkip: Int,
      $recordsToTake: Int,
      $orderBy: [TranslatedPlantDtoSortInput!],
      $filterBy: TranslatedPlantDtoFilterInput
  ) {
    plantsPaginated (
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


export const GET_SHIFT = gql`
  query OneShift (
    $shiftId: Long!,
  ) {
  oneShift (
    id: $shiftId        
  ) {
    data {
      name
      reference
      notes
      prefix
     
      id
      customerId

      calendarId

      calendar {
          name
          id
          customerId
          status
          translations {
              languageId
              id
              name
          }
      }
     
      fromTime
      toTime
      twoDays
      isFirstSequence
      isLastSequence          
      moveToDate
      sequence

     
      status
      createdById
      createdAt
      updatedById
      updatedAt
      deletedById
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
    friendlyStatus    
  }
}
`;

export const GET_SHIFTS = gql`
  query ShiftsPaginated (
    $recordsToSkip: Int,
    $recordsToTake: Int,
    $orderBy: [TranslatedShiftDtoSortInput!],
    $filterBy: TranslatedShiftDtoFilterInput,
  ) {
  shiftsPaginated (
    skip: $recordsToSkip,
    take: $recordsToTake,
    order: $orderBy,
    where: $filterBy
  ) {
      items {
        friendlyStatus
        data {
          name
          reference  
          id
          customerId
          status

          calendarId

          calendar {
              name
              id
              customerId
              status
              translations {
                  languageId
                  id
                  name
              }
          }

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

export const GET_SHIFT_TRANSLATIONS = gql`
  query ShiftsTranslationsTable (
    $recordsToSkip: Int,
    $recordsToTake: Int,
    $orderBy: [ShiftTranslationTableSortInput!],
    $filterBy: ShiftTranslationTableFilterInput,
  ) {
    shiftsTranslationsTable(
    skip: $recordsToSkip,
    take: $recordsToTake,
    order: $orderBy,
    where: $filterBy
  ) {
    totalCount
    items {
        shiftId
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

export const UPSERT_SHIFT_TRANSLATIONS = gql`
  mutation CreateOrUpdateShiftTranslationTable (
    $translations: [ShiftTranslationTableDtoInput!]!    
  ) {
    createOrUpdateShiftTranslationTable (
      inputs: $translations
    ) {
      id,
      shiftId,
      languageId      
    }
  }
`;


export const UPSERT_SHIFT = gql`
  mutation CreateOrUpdateShift (
    $customerId: Long,

    $calendarId: Long,

    $twoDays: String!,
    $isFirstSequence: String!,
    $isLastSequence: String!,
    
    $fromTime: DateTime,
    $toTime: DateTime,
    $moveToDate: Int,
    $sequence: Int,

    $id: Long,
    $status: String    
    $name: String,
    $prefix: String,
    $reference: String,
    $notes: String,
  
  ) {
  createOrUpdateShift (
    inputs: [{
      customerId: $customerId
      calendarId: $calendarId
      twoDays: $twoDays
      isFirstSequence: $isFirstSequence
      isLastSequence: $isLastSequence  
      fromTime: $fromTime
      toTime: $toTime
      moveToDate: $moveToDate
      sequence: $sequence
      id: $id      
      status: $status
      name: $name,
      prefix: $prefix,
      reference: $reference,
      notes: $notes,
    
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

export const DELETE_SHIFT_TRANSLATIONS = gql`
  mutation DeleteShiftsTranslationsTable (
    $ids: [IdToDeleteInput!]!,
    $customerId: Long!
    $calendarId: Long!
  ) {
    deleteShiftsTranslationsTable (      
      ids: $ids,
      customerId: $customerId,
      calendarId: $calendarId,
    ) 
  }
`;


export const INACTIVATE_SHIFT = gql`
  mutation CreateOrUpdateShift (
    $id: Long,
    $customerId: Long,
    $calendarId: Long,
    $status: String
  ) {
  createOrUpdateShift (
    inputs: {
      id: $id
      customerId: $customerId
      calendarId: $calendarId
      status: $status
    }) {
      id
      status
    } 
  }
`;

//departments================================

export const GET_DEPARTMENT = gql`
  query OneDepartment (
    $departmentId: Long!,
  ) {
  oneDepartment (
    id: $departmentId        
  ) {
    data {
      name
      reference
      notes
      prefix
      mainImagePath
      mainImageGuid
      mainImageName
      id
      customerId
      recipientId
      approverId
      plantId     
      status
      createdById
      createdAt
      updatedById
      updatedAt
      deletedById
      deletedAt
      plant {
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
      recipient {
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
      approver {
        id
        customerId
        name
        status        
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
  }
}
`;

export const GET_DEPARTMENTS = gql`
  query DepartmentsPaginated (
    $recordsToSkip: Int,
    $recordsToTake: Int,
    $orderBy: [TranslatedDepartmentDtoSortInput!],
    $filterBy: TranslatedDepartmentDtoFilterInput,
  ) {
  departmentsPaginated (
    skip: $recordsToSkip,
    take: $recordsToTake,
    order: $orderBy,
    where: $filterBy
  ) {
      items {
        friendlyStatus
        data {
          name
          reference
          mainImagePath
          mainImageName
          mainImageGuid
          id
          customerId
          plantId
          plant {
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
          recipient {
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
          recipientId
          approverId
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

export const GET_DEPARTMENT_TRANSLATIONS = gql`
  query DepartmentsTranslationsTable (
    $recordsToSkip: Int,
    $recordsToTake: Int,
    $orderBy: [DepartmentTranslationTableSortInput!],
    $filterBy: DepartmentTranslationTableFilterInput,
  ) {
    departmentsTranslationsTable(
    skip: $recordsToSkip,
    take: $recordsToTake,
    order: $orderBy,
    where: $filterBy
  ) {
    totalCount
    items {
        departmentId
        name
        reference
        notes
        prefix
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

export const UPSERT_CHECKLIST_TEMPLATE_DETAILS = gql`
  mutation CreateOrUpdateChecklistTemplateDetail (  
    $checklistTemplateDetail: [ChecklistTemplateDetailDtoInput!]!
  ) {
  createOrUpdateChecklistTemplateDetail (
    inputs: $checklistTemplateDetail
  ) {    
      id
      line
    } 
  }
`;

export const UPSERT_DEPARTMENT_TRANSLATIONS = gql`
  mutation CreateOrUpdateDepartmentTranslationTable (
    $translations: [DepartmentTranslationTableDtoInput!]!    
  ) {
    createOrUpdateDepartmentTranslationTable (
      inputs: $translations
    ) {
      id,
      departmentId,
      languageId      
    }
  }
`;

export const UPSERT_DEPARTMENT = gql`
  mutation CreateOrUpdateDepartment (
    $customerId: Long,
    $plantId: Long,
    $recipientId: Long,
    $approverId: Long,   
    $id: Long,
    $status: String    
    $name: String,
    $prefix: String,
    $reference: String,
    $notes: String,
    $mainImageGuid: String,
    $mainImageName: String,
    $mainImagePath: String,    
  ) {
  createOrUpdateDepartment (
    inputs: [{
      customerId: $customerId
      plantId: $plantId 
      recipientId: $recipientId
      approverId: $approverId     
      id: $id      
      status: $status
      name: $name,
      prefix: $prefix,
      reference: $reference,
      notes: $notes,
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

export const DELETE_DEPARTMENT_TRANSLATIONS = gql`
  mutation DeleteDepartmentsTranslationsTable (
    $ids: [IdToDeleteInput!]!,
    $customerId: Long!   
    $plantId: Long!
  ) {
    deleteDepartmentsTranslationsTable (      
      ids: $ids,
      customerId: $customerId,
      plantId: $plantId,
    ) 
  }
`;

export const INACTIVATE_DEPARTMENT = gql`
  mutation CreateOrUpdateDepartment (
    $id: Long,
    $customerId: Long,
    $plantId: Long,
    $status: String
  ) {
  createOrUpdateDepartment (
    inputs: {
      id: $id
      customerId: $customerId
      plantId: $plantId
      status: $status
    }) {
      id
      status
    } 
  }
`;

export const GET_CHECKLIST_PLANS = gql`
  query ChecklistPlansPaginated (
    $recordsToSkip: Int,
    $recordsToTake: Int,
    $orderBy: [TranslatedChecklistPlanDtoSortInput!],
    $filterBy: TranslatedChecklistPlanDtoFilterInput,
  ) {
  checklistPlansPaginated (
    skip: $recordsToSkip,
    take: $recordsToTake,
    order: $orderBy,
    where: $filterBy
  ) {
      items {
        friendlyStatus
        friendlyFrequency        
        data {
          id
          name
          reference
          notes
          prefix
          customerId
          lastGeneration
          checklistCount
          status
          frequency          
          checklistPlanType {
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

// Sigma Types

export const GET_SIGMATYPE = gql`
  query OneSigmaType (
    $sigmaTypeId: Long!,
  ) {
  oneSigmaType (
    id: $sigmaTypeId        
  ) {
    data {
      name
      reference
      notes
      prefix
      id
      customerId     
      status
      createdById
      createdAt
      updatedById
      updatedAt
      deletedById
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
    friendlyStatus
  }
}
`;

export const GET_SIGMATYPES = gql`
  query SigmaTypesPaginated (
    $recordsToSkip: Int,
    $recordsToTake: Int,
    $orderBy: [TranslatedSigmaTypeDtoSortInput!],
    $filterBy: TranslatedSigmaTypeDtoFilterInput,
  ) {
  sigmaTypesPaginated (
    skip: $recordsToSkip,
    take: $recordsToTake,
    order: $orderBy,
    where: $filterBy
  ) {
      items {
        friendlyStatus
        data {
          name
          id
          customerId
          reference
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

export const GET_SIGMATYPE_TRANSLATIONS = gql`
  query SigmaTypesTranslationsTable (
    $recordsToSkip: Int,
    $recordsToTake: Int,
    $orderBy: [SigmaTypeTranslationTableSortInput!],
    $filterBy: SigmaTypeTranslationTableFilterInput,
  ) {
    sigmaTypesTranslationsTable(
    skip: $recordsToSkip,
    take: $recordsToTake,
    order: $orderBy,
    where: $filterBy
  ) {
    totalCount
    items {
        sigmaTypeId
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

export const UPSERT_SIGMATYPE_TRANSLATIONS = gql`
  mutation CreateOrUpdateSigmaTypeTranslationTable (
    $translations: [SigmaTypeTranslationTableDtoInput!]!    
  ) {
    createOrUpdateSigmaTypeTranslationTable (
      inputs: $translations
    ) {
      id,
      sigmaTypeId,
      languageId      
    }
  }
`;

export const UPSERT_SIGMATYPE = gql`
  mutation CreateOrUpdateSigmaType (
    $customerId: Long,
  
    $id: Long,
    $status: String    
    $name: String,
     $prefix: String,
    $reference: String,
    $notes: String,    
  ) {
  createOrUpdateSigmaType (
    inputs: [{
      customerId: $customerId
     
      id: $id      
      status: $status
      name: $name,
      prefix: $prefix,
      reference: $reference,
      notes: $notes,
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

export const DELETE_SIGMATYPE_TRANSLATIONS = gql`
  mutation DeleteSigmaTypesTranslationsTable (
    $ids: [IdToDeleteInput!]!,
    $customerId: Long!
  
  ) {
    deleteSigmaTypesTranslationsTable (      
      ids: $ids,
      customerId: $customerId,
    
    ) 
  }
`;

export const INACTIVATE_SIGMATYPE = gql`
  mutation CreateOrUpdateSigmaType (
    $id: Long,
    $customerId: Long,
    $status: String
  ) {
  createOrUpdateSigmaType (
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

//=========END
