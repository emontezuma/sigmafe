import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, delay, of } from 'rxjs';

import { sampleChecklistFillingData } from '../../shared/sample-data';
import { ChecklistFillingData } from '../models/checklists.models';
import { Apollo } from 'apollo-angular';
import { HttpClient } from '@angular/common/http';
import { SharedService } from 'src/app/shared/services';
import { GET_ALL_ATTACHMENTS, GET_CHECKLIST, GET_CHECKLIST_DETAILS } from 'src/app/graphql/graphql.queries';
import { environment } from 'src/environments/environment';
import { ChecklistLine } from 'src/app/shared/models';

@Injectable({
  providedIn: 'root'
})
export class ChecklistsService {

  // Variables ===============
  fakeChecklistFillingData: ChecklistFillingData = sampleChecklistFillingData;
  data$: BehaviorSubject<ChecklistFillingData> = new BehaviorSubject(sampleChecklistFillingData);


  constructor(
    private _apollo: Apollo,
    private _http: HttpClient,
    public _sharedService: SharedService,
  ) { }

  // Functions ================  
  getChecklistFillingData(): Observable<ChecklistFillingData> {
    return of(this.fakeChecklistFillingData).pipe(
      delay(1500)
    );
  }

  getChecklistDataGql$(parameters: any): Observable<any> {

    const checklistId = { checklistId: parameters.checklistId };

    const variablesForAttachments = {
      processId: parameters.checklistId,
      process: parameters.process,
      customerId: parameters.customerId,
    }

    const variablesForLines = {
      order: parameters.orderForDetails,
      ...(parameters.filterForLines) && { filterBy: parameters.filterForLines },      
    }

    return combineLatest([
      this._apollo.query({
        query: GET_CHECKLIST,
        variables: checklistId,
      }),

      this._apollo.query({
        query: GET_ALL_ATTACHMENTS,
        variables: variablesForAttachments,
      }),

      this._apollo.query({
        query: GET_CHECKLIST_DETAILS,
        variables: variablesForLines,
      }),

    ]);
  }

  mapOneChecklist(paramsData: any): ChecklistFillingData {
    const { oneChecklist } = paramsData?.checklistGqlData?.data;
    const { data } = oneChecklist;

    // const translations = paramsData?.checklistGqlTranslationsData?.data;
    const attachments = paramsData?.checklistGqlAttachments?.data?.uploadedFiles;
    const lines = paramsData?.checklistGqlLines?.data?.checklistLinesUnlimited;
    // const extension = data.mainImageName ? data.mainImageName.split('.').pop() : '';
    // const mainImage = `${environment.uploadFolders.completePathToFiles}/${data.mainImagePath}`;
    const mainImage = `${environment.uploadFolders.completePathToFiles}/${data.imagePath}`;
    const recordUrl = `${environment.catalogsUrl}/molds/edit/${data.moldId}`
    return {
      ...data,
      recordUrl,
      friendlyStatus: oneChecklist.friendlyStatus,
      friendlyFrequency: oneChecklist.friendlyFrequency,
      friendlyGenerationMode: oneChecklist.friendlyGenerationMode,
      friendlyState: oneChecklist.friendlyState,
      mainImage,
      // templateType: this.mapDetailTranslationsData(data.templateType),
      // alarmRecipient: this.mapDetailTranslationsData(data.alarmRecipient),
      // anticipationRecipient: this.mapDetailTranslationsData(data.anticipationRecipient),
      // approvalRecipient: this.mapDetailTranslationsData(data.approvalRecipient),
      // expiringRecipient: this.mapDetailTranslationsData(data.expiringRecipient),
      // generationRecipient: this.mapDetailTranslationsData(data.generationRecipient),
      // approver: this.mapApproverData(data.approver),
      // translations: this.mapTranslations(translations),
      attachments: this._sharedService.mapAttachments(attachments?.items),
      lines: this.mapChecklistLines(lines),
    }
  }

  mapChecklistLines(data: any): ChecklistLine[] {
    let order = 0;
    return data.map(line => {

      let name = '';
      let uomName = '';
      if (line.data?.checklistTemplateDetail?.variable) {
        name = line.data.checklistTemplateDetail.variable?.name;
        if (line.data.checklistTemplateDetail.variable?.translations?.length > 0 && line.data.checklistTemplateDetail.variable.translations.find((t) => t.languageId === 1)) { // TODO: tomar el lenguaje del profile
          name = line.data.checklistTemplateDetail.variable.translations.find((t) => t.languageId === 1).name;
        }
        if (line.data.checklistTemplateDetail.variable.uom) {
          uomName = line.data.checklistTemplateDetail.variable.uom?.['translatedName'] ?? line.data.checklistTemplateDetail.variable.uom?.name;
        }
      }
      return {
        ...line,
        order: order++,
        name,        
        id: line.data.id,        
        checklistTemplateDetailId: line.data.checklistTemplateDetailId,
        uomName,        
      }
    });
  }

  
  

  // End ======================
}
