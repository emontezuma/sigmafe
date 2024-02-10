import { MoldsHitsQueryData } from '../molds/models/molds.models';
import { SettingsData } from '../shared/models/settings.models';
import { colorsReducer } from '../state/reducers/colors.reducer';
import {
  ChecklistQuestionStatus,
  ChecklistAnswerType,
  ChecklistView,
  ChecklistFillingData,
  ChecklistState,
  ChecklistStartingMode,
  variableValueStatus,
} from '../checklists/models/checklists.models';
import { ColorsData, Colors } from './models/colors.models';
import { ProfileData } from './models/profile.models';
import { RecordStatus } from './models/helpers.models';
import { ButtonActions } from './models/screen.models';

export const sampleMoldsHitsQueryData: MoldsHitsQueryData = {
  page: 1,
  pageSize: 10,
  moreData: false,
  totalRecords: 100,
  molds: [
    {
      id: 'abgsc-173633/12345',
      name: 'PRENSA 1 ESTE TIITULO PASA A DOS LINEAS',
      hits: 0,
      limit: 20,
      mainImage: 'assets/images/molds/ab01001-999abc2366731-elvis.png',
      location: {
        code: 'jjdsss-88656ttdtd-00202',
        description: 'PRODUCCION',
        locatedBy: 'APEREZ',
        locatedSince: '2023-06-01 22:04:21',
      },
      leftDaysWarning: 320,
      leftDaysAlarmed: 350,
      status: {
        code: '10',
        description: 'FUNCIONAMIENTO NORMAL',
      },
      lastMaintenance: {
        vendorName: 'MOLDES DEL CENTRO S.A. DE C.V.',
        date: '2022-09-01',
      },
      nextMaintenance: {
        strategy: 'hits',
        specificDate: '',
        hits: 300,
        days: 0,
        hours: 0,
        timeToLeft: 0,
        hitsToLeft: 190,
        alarmed: false,
      },
      levelAlert: {
        useGeneral: false,
        warning: 0,
        alarm: 0,
      },
      lastHit: {
        date: '2023-07-09 11:37:40',
        location: 'jjdsss-88656ttdtd-00202',
      },
      warned: false,
      alarmed: true,
    },
    {
      id: 'abgsc-173633/12345',
      name: 'MOLD RO PRESS 2112',
      hits: 192,
      limit: 200,
      mainImage: 'assets/images/molds/logistica1.png',
      location: {
        code: 'SAAA-8838745ttdtd-093t3',
        description: 'BAHIA 1',
        locatedBy: 'RROSALES',
        locatedSince: '2023-02-16 22:04:21',
      },
      leftDaysWarning: -310,
      leftDaysAlarmed: 0,
      status: {
        code: '10',
        description: 'FUNCIONAMIENTO NORMAL',
      },
      lastMaintenance: {
        vendorName: 'MOLDES DEL CENTRO S.A. DE C.V.',
        date: '2022-09-01',
      },
      nextMaintenance: {
        strategy: 'hits-or-days',
        specificDate: '',
        hits: 100,
        days: 30,
        hours: 0,
        timeToLeft: 12,
        hitsToLeft: 21,
        alarmed: true,
      },
      levelAlert: {
        useGeneral: true,
        warning: 75,
        alarm: 95,
      },
      lastHit: {
        date: '2023-06-09 10:42:21',
        location: 'jjdsss-88656ttdtd-00202',
      },
      warned: true,
      alarmed: false,
    },
    {
      id: 'abgsc-173633/12345',
      name: 'PRENSA 1',
      hits: 0,
      limit: 20,
      mainImage: 'assets/images/molds/ab01001-999abc2366731.png',
      location: {
        code: 'jjdsss-88656ttdtd-00202',
        description: 'PRODUCCION',
        locatedBy: 'APEREZ',
        locatedSince: '2023-06-01 22:04:21',
      },
      leftDaysWarning: 100,
      leftDaysAlarmed: -5,
      status: {
        code: '10',
        description: 'FUNCIONAMIENTO NORMAL',
      },
      lastMaintenance: {
        vendorName: 'MOLDES DEL CENTRO S.A. DE C.V.',
        date: '2022-09-01',
      },
      nextMaintenance: {
        strategy: 'specific-date',
        specificDate: '2023-12-31',
        hits: 0,
        days: 0,
        hours: 0,
        timeToLeft: 82,
        hitsToLeft: 0,
        alarmed: false,
      },
      levelAlert: {
        useGeneral: false,
        warning: 66,
        alarm: 110,
      },
      lastHit: {
        date: '',
        location: 'jjdsss-88656ttdtd-00202',
      },
      warned: false,
      alarmed: false,
    },
    {
      id: 'abgsc-173633/12345',
      name: 'PRENSA 1 ESTE TIITULO PASA A DOS LINEAS',
      hits: 0,
      limit: 20,
      mainImage: 'assets/images/molds/ab01001-999abc2366731.png',
      location: {
        code: 'jjdsss-88656ttdtd-00202',
        description: 'PRODUCCION',
        locatedBy: 'APEREZ',
        locatedSince: '2023-06-01 22:04:21',
      },
      leftDaysWarning: 320,
      leftDaysAlarmed: 350,
      status: {
        code: '10',
        description: 'FUNCIONAMIENTO NORMAL',
      },
      lastMaintenance: {
        vendorName: 'MOLDES DEL CENTRO S.A. DE C.V.',
        date: '2022-09-01',
      },
      nextMaintenance: {
        strategy: 'hits',
        specificDate: '',
        hits: 300,
        days: 0,
        hours: 0,
        timeToLeft: 0,
        hitsToLeft: 190,
        alarmed: false,
      },
      levelAlert: {
        useGeneral: false,
        warning: 0,
        alarm: 0,
      },
      lastHit: {
        date: '2023-07-09 11:37:40',
        location: 'jjdsss-88656ttdtd-00202',
      },
      warned: false,
      alarmed: true,
    },
    {
      id: 'abgsc-173633/12345',
      name: 'MOLD RO PRESS 2112',
      hits: 192,
      limit: 200,
      mainImage: 'assets/images/molds/logistica1.png',
      location: {
        code: 'SAAA-8838745ttdtd-093t3',
        description: 'BAHIA 1',
        locatedBy: 'RROSALES',
        locatedSince: '2023-02-16 22:04:21',
      },
      leftDaysWarning: -310,
      leftDaysAlarmed: 0,
      status: {
        code: '10',
        description: 'FUNCIONAMIENTO NORMAL',
      },
      lastMaintenance: {
        vendorName: 'MOLDES DEL CENTRO S.A. DE C.V.',
        date: '2022-09-01',
      },
      nextMaintenance: {
        strategy: 'hits-or-days',
        specificDate: '',
        hits: 100,
        days: 30,
        hours: 0,
        timeToLeft: 12,
        hitsToLeft: 21,
        alarmed: true,
      },
      levelAlert: {
        useGeneral: true,
        warning: 75,
        alarm: 95,
      },
      lastHit: {
        date: '2023-06-09 10:42:21',
        location: 'jjdsss-88656ttdtd-00202',
      },
      warned: true,
      alarmed: false,
    },
    {
      id: 'abgsc-173633/12345',
      name: 'PRENSA 1',
      hits: 0,
      limit: 20,
      mainImage: 'assets/images/molds/ab01001-999abc2366731.png',
      location: {
        code: 'jjdsss-88656ttdtd-00202',
        description: 'PRODUCCION',
        locatedBy: 'APEREZ',
        locatedSince: '2023-06-01 22:04:21',
      },
      leftDaysWarning: 100,
      leftDaysAlarmed: -5,
      status: {
        code: '10',
        description: 'FUNCIONAMIENTO NORMAL',
      },
      lastMaintenance: {
        vendorName: 'MOLDES DEL CENTRO S.A. DE C.V.',
        date: '2022-09-01',
      },
      nextMaintenance: {
        strategy: 'specific-date',
        specificDate: '2023-12-31',
        hits: 0,
        days: 0,
        hours: 0,
        timeToLeft: 82,
        hitsToLeft: 0,
        alarmed: false,
      },
      levelAlert: {
        useGeneral: false,
        warning: 66,
        alarm: 110,
      },
      lastHit: {
        date: '',
        location: 'jjdsss-88656ttdtd-00202',
      },
      warned: false,
      alarmed: false,
    },
    {
      id: 'abgsc-173633/12345',
      name: 'PRENSA 1 ESTE TIITULO PASA A DOS LINEAS',
      hits: 0,
      limit: 20,
      mainImage: 'assets/images/molds/ab01001-999abc2366731.png',
      location: {
        code: 'jjdsss-88656ttdtd-00202',
        description: 'PRODUCCION',
        locatedBy: 'APEREZ',
        locatedSince: '2023-06-01 22:04:21',
      },
      leftDaysWarning: 320,
      leftDaysAlarmed: 350,
      status: {
        code: '10',
        description: 'FUNCIONAMIENTO NORMAL',
      },
      lastMaintenance: {
        vendorName: 'MOLDES DEL CENTRO S.A. DE C.V.',
        date: '2022-09-01',
      },
      nextMaintenance: {
        strategy: 'hits',
        specificDate: '',
        hits: 300,
        days: 0,
        hours: 0,
        timeToLeft: 0,
        hitsToLeft: 190,
        alarmed: false,
      },
      levelAlert: {
        useGeneral: false,
        warning: 0,
        alarm: 0,
      },
      lastHit: {
        date: '2023-07-09 11:37:40',
        location: 'jjdsss-88656ttdtd-00202',
      },
      warned: false,
      alarmed: true,
    },
    {
      id: 'abgsc-173633/12345',
      name: 'MOLD RO PRESS 2112',
      hits: 192,
      limit: 200,
      mainImage: 'assets/images/molds/logistica1.png',
      location: {
        code: 'SAAA-8838745ttdtd-093t3',
        description: 'BAHIA 1',
        locatedBy: 'RROSALES',
        locatedSince: '2023-02-16 22:04:21',
      },
      leftDaysWarning: -310,
      leftDaysAlarmed: 0,
      status: {
        code: '10',
        description: 'FUNCIONAMIENTO NORMAL',
      },
      lastMaintenance: {
        vendorName: 'MOLDES DEL CENTRO S.A. DE C.V.',
        date: '2022-09-01',
      },
      nextMaintenance: {
        strategy: 'hits-or-days',
        specificDate: '',
        hits: 100,
        days: 30,
        hours: 0,
        timeToLeft: 12,
        hitsToLeft: 21,
        alarmed: true,
      },
      levelAlert: {
        useGeneral: true,
        warning: 75,
        alarm: 95,
      },
      lastHit: {
        date: '2023-06-09 10:42:21',
        location: 'jjdsss-88656ttdtd-00202',
      },
      warned: true,
      alarmed: false,
    },
    {
      id: 'abgsc-173633/12345',
      name: 'PRENSA 1',
      hits: 0,
      limit: 20,
      mainImage: 'assets/images/molds/ab01001-999abc2366731.png',
      location: {
        code: 'jjdsss-88656ttdtd-00202',
        description: 'PRODUCCION',
        locatedBy: 'APEREZ',
        locatedSince: '2023-06-01 22:04:21',
      },
      leftDaysWarning: 100,
      leftDaysAlarmed: -5,
      status: {
        code: '10',
        description: 'FUNCIONAMIENTO NORMAL',
      },
      lastMaintenance: {
        vendorName: 'MOLDES DEL CENTRO S.A. DE C.V.',
        date: '2022-09-01',
      },
      nextMaintenance: {
        strategy: 'specific-date',
        specificDate: '2023-12-31',
        hits: 0,
        days: 0,
        hours: 0,
        timeToLeft: 82,
        hitsToLeft: 0,
        alarmed: false,
      },
      levelAlert: {
        useGeneral: false,
        warning: 66,
        alarm: 110,
      },
      lastHit: {
        date: '',
        location: 'jjdsss-88656ttdtd-00202',
      },
      warned: false,
      alarmed: false,
    },
  ],
};

export const sampleSettings: SettingsData = {
  waitingColor: '.lightgrey',
  okColor: '#229954',
  warningColor: '#F5B041',
  alarmedColor: '#E74C3C',
  levelAlert: {
    useGeneral: null,
    warning: 50,
    alarm: 75,
  },
  animate: false,
  timeOutFortDialog: 15,
};

export const sampleProfile: ProfileData = {
  animate: true,
  firstName: 'ADMINISTRADOR',
  lastName: 'DEL SISTEMA',
  userProfile: 'ADMIN',
  avatar: 'assets/images/bydefault/avatar.png',
  email: 'admin@admin.com',
  id: 'tetettee-ooeiiie-jjd73',
};

export const sampleColors: ColorsData = {
  id: 'hhsffss-kksksjs-llsls',
  default: 'S',
  name: 'S',
  customized: 'S',
  fixed: 'S',
  selected: 'S',
  status: {
    ok: Colors.green,
    warn: Colors.orange,
    alarm: '#E42217', // Colors.orangered,
    none: Colors.none,
  },
  page: {
    
    shadow: 'rgba(0, 0, 0, 0.05)',
    foreColor: Colors.carbon,
    buttonBorderColor: Colors.gray,
    buttonDisabledBorderColor: Colors.lightgrey,
    buttonDisabledFore: Colors.lightgrey,
    buttonDisabledBackgroundColor: Colors.none,
    buttonNormalBackgroundColor: Colors.lightgrey,
    buttonNormalFore: Colors.darkslateblue,
    buttonNormalBorderColor: Colors.gray, 
    cardBackgroundColor: Colors.white,
    cardForeColor: Colors.carbon,
    cardBorderColor: Colors.green,
    cardDisabledBackgoundColor: Colors.magenta,
    cardDisabledBorderColor: Colors.pink,
    cardDisabledForeColor: Colors.gray,
    tabBackgroundColor: Colors.gainsboro,
    tabBorderColor: Colors.silver,
    backgroundColor: Colors.white,    
    footerForeColor: undefined,
    footerBackground: undefined,
    palettePrimaryColor: Colors.dodgerblue,
    paletteWarnColor: Colors.orangered,
    paletteAccentColor: '#4ACF32',
    // border: Colors.silver,
    // disabled: Colors.silver,    
    none: Colors.none,
  },
};

export const sampleChecklistFillingData: ChecklistFillingData = {
  id: 'aaaddd-1923883-999deede',
  number: 'AB-12345653',
  status: RecordStatus.ACTIVE,
  state: ChecklistState.IN_PROGRESS,
  stateDescription: 'LISTO PARA SER LLENADO',
  project: {
    code: 'PR-010',
    description: 'MOVIMIENTO DE PLANTA',
  },
  class: {
    id: 'aaabb-assd73-0psoa1',
    code: 'AUT-PR',
    description: 'AUTOMÁTICO (SEMANAL)',
  },
  type: {
    id: 'aaabb-assd73-0psoa1',
    code: 'A-INTE',
    description: 'Auditorías internas',
  },
  priority: {
    id: 'aaabb-assd73-0psoa1',
    code: 'N01',
    description: 'NORMAL',
  },
  assignement: {
    name: 'Juan Carlos Pérez',
    department: 'IT',
    date: '2022/01/01 16:29:45',
    type: 'AUTOMATICA',
    plantName: 'TOYOTA CELAYA',
    countryName: 'MEXICO',
    companyName: 'TOYOTA',
  },
  planning: {
    name: 'SERRANO ALBERTA SAEZ',
    department: 'DIRECCIÓN DE FINANZAS',
    date: '2023-11-05 13:11:22',
  },
  description: 'Este checklist es de pruebas',
  extendedInfo:
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum error molestias maiores, officia vel quisquam esse inventore fuga sint voluptates voluptatem ab amet corrupti. Sed illo repudiandae at veniam fuga. Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum error molestias maiores, officia vel quisquam esse inventore fuga sint voluptates voluptatem ab amet corrupti. Sed illo repudiandae at veniam fuga. Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum error molestias maiores, officia vel quisquam esse inventore fuga sint voluptates voluptatem ab amet corrupti. Sed illo repudiandae at veniam fuga. Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum error molestias maiores, officia vel quisquam esse inventore fuga sint voluptates voluptatem ab amet corrupti. Sed illo repudiandae at veniam fuga. Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum error molestias maiores, officia vel quisquam esse inventore fuga sint voluptates voluptatem ab amet corrupti. Sed illo repudiandae at veniam fuga.',
  dueDateToStart: '2023/09/03 12:00:00',
  startDate: '2023/09/03 11:30:00',
  dueDateToFinish: '2023/09/08 21:30:00',
  questions: 3,
  completed: 0,
  cancelled: 0,
  warnedItems: 0,
  valueToPrint: 0,  
  secondsToAlert: 7200,
  alarmed: false,
  canAlarm: true,
  canExpire: true,
  startingMode: ChecklistStartingMode.ANYTIME,
  equipment: {
    id: 'abbdgd-999383-agaga',
    number: 'AB4334',
    description: 'MAQUINA PAPELERA AF-1465-23SF',
    lastChecklistDate: '2022/09/21 13:11:22',
    lastChecklistAuditor: 'Jose Gil A.',
    extendedInfo: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum error molestias maiores, officia vel quisquam esse inventore fuga sint voluptates voluptatem ab amet corrupti. Sed illo repudiandae at veniam fuga. Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum error molestias maiores, officia vel quisquam esse inventore fuga sint voluptates voluptatem ab amet corrupti. Sed illo repudiandae at veniam fuga. Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum error molestias maiores, officia vel quisquam esse inventore fuga sint voluptates voluptatem ab amet corrupti. Sed illo repudiandae at veniam fuga. Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum error molestias maiores, officia vel quisquam esse inventore fuga sint voluptates voluptatem ab amet corrupti. Sed illo repudiandae at veniam fuga. Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum error molestias maiores, officia vel quisquam esse inventore fuga sint voluptates voluptatem ab amet corrupti. Sed illo repudiandae at veniam fuga.',
    canAlarm: true,
  },
  viewType: ChecklistView.FLEXBOX,
  icon: 'assets/images/icons/faq.svg',
  items: [{
      id: 'aaa',
      index: 1,
      order: 1,
      text: '¿La tapa del motor está bien sellada?',
      extendedInfo:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum error molestias maiores, officia vel quisquam esse inventore fuga sint voluptates voluptatem ab amet corrupti. Sed illo repudiandae at veniam fuga. Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum error molestias maiores, officia vel quisquam esse inventore fuga sint voluptates voluptatem ab amet corrupti. Sed illo repudiandae at veniam fuga. Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum error molestias maiores, officia vel quisquam esse inventore fuga sint voluptates voluptatem ab amet corrupti. Sed illo repudiandae at veniam fuga. Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum error molestias maiores, officia vel quisquam esse inventore fuga sint voluptates voluptatem ab amet corrupti. Sed illo repudiandae at veniam fuga. Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum error molestias maiores, officia vel quisquam esse inventore fuga sint voluptates voluptatem ab amet corrupti. Sed illo repudiandae at veniam fuga.',
      answerType: ChecklistAnswerType.YES_NO,
      answerByDefault: 'y',
      answer: '',
      status: ChecklistQuestionStatus.READY,
      showExtendedInfo: true,
      showVisualSupport: true,
      completionDate: 'Y',
      startedDate: 'Y',
      alarmed: false,
      attachmentRequired: false,
      allowNotes: true,
      allowActionPlans: false,
      allowAttachments: true,
      allowVisualEvidence: false,
      icon: 'assets/images/icons/faq2.svg',
      helpers: [
        {
          index: 1,
          id: 'abcd',
          icon: 'assets/icons/video_file.svg',
        },{
          index: 2,
          id: 'xyz',
          icon: 'assets/icons/excel.svg',
        },
      ],
      buttons: [{
        type: 'button',
        tooltip: 'Reiniciar pregunta',
        icon: 'cancel',
        action: ButtonActions.RESET,
        disabled: false,
        alarmed: false,
      },{
        type: 'divider',
      },{
        type: 'button',
        tooltip: 'Información adicional...',
        icon: 'more_info',
        action: 'moreinfo',
        disabled: false,
        alarmed: false,
      },{
        type: 'button',
        tooltip: 'Ayuda visual...',
        icon: 'support',
        action: 'support',
        disabled: false,
        alarmed: false,
      },{
        type: 'button',
        tooltip: 'Adjuntos...',
        icon: 'attachment',
        action: 'attachments',
        disabled: false,
        alarmed: false,
      },{
        type: 'button',
        tooltip: 'Notas',
        icon: 'reload',
        action: 'notes',
        disabled: false,
        alarmed: false,
      },{
        type: 'button',
        tooltip: 'Plan de acción',
        icon: 'more_info',
        action: 'actionPlan',
        disabled: true,
        alarmed: false,
      },{
        type: 'button',
        tooltip: 'Tomar evidencia (imagen o video)...',
        icon: 'more_info',
        action: 'visualEvidence',
        disabled: true,
        alarmed: false,
      },],
      component: {
        id: 'aaa-bb-10010',
        number: 'SN:219982',
        description: 'BRAZO MECANICO',
        lastChecklistDate: '2022/09/21 13:11:22',
        lastChecklistAuditor: 'Jose Gil A.',
        extendedInfo: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum error molestias maiores, officia vel quisquam esse inventore fuga sint voluptates voluptatem ab amet corrupti. Sed illo repudiandae at veniam fuga. Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum error molestias maiores, officia vel quisquam esse inventore fuga sint voluptates voluptatem ab amet corrupti. Sed illo repudiandae at veniam fuga. Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum error molestias maiores, officia vel quisquam esse inventore fuga sint voluptates voluptatem ab amet corrupti. Sed illo repudiandae at veniam fuga. Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum error molestias maiores, officia vel quisquam esse inventore fuga sint voluptates voluptatem ab amet corrupti. Sed illo repudiandae at veniam fuga. Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum error molestias maiores, officia vel quisquam esse inventore fuga sint voluptates voluptatem ab amet corrupti. Sed illo repudiandae at veniam fuga.',
        canAlarm: true,
      },
      warned: false,
      previousValues: [{
        value: '100',
        date: '2023/02/23 19:30:00',
        status: variableValueStatus.WARNED,
      },{
        value: '130',
        date: '2023/02/22 19:30:00',
        status: variableValueStatus.WARNED,
      },{
        value: '190',
        date: '2023/02/22 19:30:00',
        status: variableValueStatus.REGULAR,
      }],
      showChart: true,
    },{
      id: 'bbb',
      index: 2,
      order: 2,
      text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum error molestias maiores, officia vel quisquam esse inventore fuga sint voluptates voluptatem ab amet corrupti. Sed illo repudiandae at veniam fuga. Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum error molestias maiores, officia vel quisquam esse inventore fuga sint voluptates voluptatem ab amet corrupti. Sed illo repudiandae at veniam fuga. Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum error molestias maiores, officia vel quisquam esse inventore fuga sint voluptates voluptatem ab amet corrupti. Sed illo repudiandae at veniam fuga. Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum error molestias maiores, officia vel quisquam esse inventore fuga sint voluptates voluptatem ab amet corrupti. Sed illo repudiandae at veniam fuga. Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum error molestias maiores, officia vel quisquam esse inventore fuga sint voluptates voluptatem ab amet corrupti. Sed illo repudiandae at veniam fuga.',
      answerType: ChecklistAnswerType.YES_NO,
      answerByDefault: undefined,
      answer: undefined,
      showExtendedInfo: false,
      status: ChecklistQuestionStatus.READY,
      icon: 'assets/images/icons/problems.svg',
      canAlarm: true,
      yesyNoAlarm: 'y',
      buttons: [{
        type: 'button',
        tooltip: 'Información adicional...',
        icon: 'more_info',
        action: 'moreinfo',
        disabled: false,
        alarmed: false,
      },{
        type: 'button',
        tooltip: 'Ayuda visual...',
        icon: 'support',
        action: 'support',
        disabled: false,
        alarmed: false,
      },{
        type: 'button',
        tooltip: 'Adjuntos...',
        icon: 'attachment',
        action: 'attachments',
        disabled: false,
        alarmed: false,
      },{
        type: 'button',
        tooltip: 'Notas',
        icon: 'reload',
        action: 'notes',
        disabled: false,
        alarmed: false,
      },{
        type: 'button',
        tooltip: 'Plan de acción',
        icon: 'more_info',
        action: 'actionPlan',
        disabled: true,
        alarmed: false,
      },{
        type: 'button',
        tooltip: 'Tomar evidencia (imagen o video)...',
        icon: 'more_info',
        action: 'visualEvidence',
        disabled: true,
        alarmed: false,
      },],
      showChart: true,
    },{
      id: 'bbb',
      index: 3,
      order: 3,
      text: '¿This is a question?',
      answerType: ChecklistAnswerType.YES_NO,
      answerByDefault: undefined,
      answer: undefined,
      showExtendedInfo: false,
      status: ChecklistQuestionStatus.READY,
      icon: '',
      canAlarm: true,
      required: true,
      alarms:[{
        value: 'y',
    }],
    buttons: [{
      type: 'button',
      tooltip: 'Información adicional...',
      icon: 'more_info',
      action: 'moreinfo',
      disabled: false,
      alarmed: false,
    },{
      type: 'button',
      tooltip: 'Ayuda visual...',
      icon: 'support',
      action: 'support',
      disabled: false,
      alarmed: false,
    },{
      type: 'button',
      tooltip: 'Adjuntos...',
      icon: 'attachment',
      action: 'attachments',
      disabled: false,
      alarmed: false,
    },{
      type: 'button',
      tooltip: 'Notas',
      icon: 'reload',
      action: 'notes',
      disabled: false,
      alarmed: false,
    },{
      type: 'button',
      tooltip: 'Plan de acción',
      icon: 'more_info',
      action: 'actionPlan',
      disabled: true,
      alarmed: false,
    },{
      type: 'button',
      tooltip: 'Tomar evidencia (imagen o video)...',
      icon: 'more_info',
      action: 'visualEvidence',
      disabled: true,
      alarmed: false,
    },],
    showChart: true,
  }],
};
