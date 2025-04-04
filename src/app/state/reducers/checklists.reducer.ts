import { createReducer, on } from '@ngrx/store';
import * as checklistFillingActions from '../actions/checklists.actions';
import { ChecklistAlarms, ChecklistFillingItem, ChecklistFillingState, ChecklistQuestionStatus, ChecklistView } from '../../checklists/models/checklists.models';

export const initialState: ChecklistFillingState = {
  loading: false,
  checklistFillingData: {
    questions: 0,
    questionsCompleted: 0,
    valueToPrint: 0,
    alarmed: false,
    viewType: ChecklistView.FLEXBOX,
    icon: 'assets/images/icons/faq.svg',
    items: [],
    equipment: {},
  }
}

export const checklistFillingReducer = createReducer(
  initialState,
  on(checklistFillingActions.loadChecklistFillingData, ( state ) => ({ 
    ...state,
    loading: true 
  })),
  
  on(checklistFillingActions.loadedChecklistFillingData, (state, { checklistFillingData } ) => ({ 
    ...state,
    loading: false,
    checklistFillingData
  })),
  
  on(checklistFillingActions.updateChecklistQuestion, (state, { item } ) => {
    const checkForAlrmedQuestion = (answer: string, alarms: ChecklistAlarms[]): boolean => {
      return alarms.some((alarmedValues) => {
        const sign = alarmedValues.comparison || '==';
        return eval(`'${alarmedValues.value}'${sign}'${answer}'`);
      });
    }

    const updatedQuestionnaire = state.checklistFillingData.items.map((stateItem) => {
       if (item.index === stateItem.index) {
        const alarmed =  state.checklistFillingData.canAlarm && state.checklistFillingData.equipment.canAlarm && item.canAlarm && item.alarms && checkForAlrmedQuestion(item.answer, item.alarms);
        const actionRequired = item.attachmentRequired && !item.attachmentCompleted && item.status !== ChecklistQuestionStatus.CANCELLED;        
        const buttons = item.buttons.map((button) => {
          if (button.action === 'attachments') {
            return {
              ...button,
              alarmed: actionRequired,
            }            
          } else {
            return button;
          }
        })
        return { ...item, alarmed, actionRequired, buttons };
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
      questionsCompleted: newCompleted,
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
  