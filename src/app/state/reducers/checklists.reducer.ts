import { createReducer, on } from '@ngrx/store';
import * as checklistFillingActions from '../actions/checklists.actions';
import { ChecklistFillingState, ChecklistQuestionStatus, ChecklistView } from '../../checklists/models/checklists.models';

export const initialState: ChecklistFillingState = {
  loading: false,
  checklistFillingData: {
    questions: 3,
    completed: 0,
    valueToPrint: 0,
    itemsAlarmedText: '',
    alarmed: true,
    viewType: ChecklistView.FLEXBOX,
    icon: 'assets/images/icons/faq.svg',
    items: [],
    equipment: {},
  }
}

export const checklistFillingReducer = createReducer(
  initialState,
  on(checklistFillingActions.loadChecklistFillingData, ( state ) => ({ ...state, loading: true })),
  
  on(checklistFillingActions.loadedChecklistFillingData, (state, { checklistFillingData } ) => ({ ...state, loading: false, checklistFillingData })),
  
  on(checklistFillingActions.updateChecklistQuestion, (state, { item }) => {   
    const updatedQuestionnaire = state.checklistFillingData.items.map((stateItem) => {
      if(item.index === stateItem.index) {
        // const alarmed = reviewAlarm(item.answer)
        return item;
      }
      return stateItem;            
    });
    // Calculate header statuses based on questions
    const newCompleted = updatedQuestionnaire
    .reduce((acc, item) => acc + (item.status === ChecklistQuestionStatus.COMPLETED || item.status === ChecklistQuestionStatus.CANCELLED ? 1 : 0), 0);
    const alarmed = updatedQuestionnaire.reduce((acc, item) => acc + (item.alarmed ? 1 : 0), 0);    
    const actionRequired = updatedQuestionnaire.some(item => item.actionRequired && item.status !== ChecklistQuestionStatus.CANCELLED);
    const updatedChecklistFillingData = { 
      ...state.checklistFillingData, 
      items: updatedQuestionnaire,
      completed: newCompleted,
      actionRequired,
    }; 
    return {
      ...state, 
      checklistFillingData: updatedChecklistFillingData,       
    }
  }),
);
  