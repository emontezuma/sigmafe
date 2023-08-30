import { createReducer, on } from '@ngrx/store';
import * as checklistFillingActions from '../actions/checklists.actions';
import { ChecklistAlarms, ChecklistFillingItem, ChecklistFillingState, ChecklistQuestionStatus, ChecklistView } from '../../checklists/models/checklists.models';

export const initialState: ChecklistFillingState = {
  loading: false,
  checklistFillingData: {
    questions: 3,
    completed: 0,
    valueToPrint: 0,
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

    const checkForAlrmedQuestion = (answer: string, alarms: ChecklistAlarms[]): boolean => {
      return alarms.some((alarmedValues) => {
        const sign = alarmedValues.comparison || '==';
        console.log(`'${alarmedValues.value}'${sign}'${answer}'`);
        return eval(`'${alarmedValues.value}'${sign}'${answer}'`);
      });
    }

    const updatedQuestionnaire = state.checklistFillingData.items.map((stateItem) => {
       if(item.index === stateItem.index) {
        const alarmed =  state.checklistFillingData.canAlarm && state.checklistFillingData.equipment.canAlarm && item.canAlarm && checkForAlrmedQuestion(item.answer, item.alarms);
     
        // const alarmed = reviewAlarm(item.answer)
        return { ...item, alarmed };
      }
      return stateItem;            
    });

    // Calculate header statuses based on questions
    const newCompleted = updatedQuestionnaire.reduce((acc, item) => acc + (item.status === ChecklistQuestionStatus.COMPLETED ? 1 : 0), 0);
    const alarmedItems = updatedQuestionnaire.reduce((acc, item) => acc + (item.alarmed ? 1 : 0), 0);    
    const alarmed = alarmedItems > 0;
    const actionRequired = updatedQuestionnaire.some(item => item.actionRequired && item.status !== ChecklistQuestionStatus.CANCELLED);
    const updatedChecklistFillingData = { 
      ...state.checklistFillingData, 
      items: updatedQuestionnaire,
      completed: newCompleted,
      actionRequired,
      alarmedItems,
      alarmed,
    }; 
    return {
      ...state, 
      checklistFillingData: updatedChecklistFillingData,       
    }
  }),
);
  