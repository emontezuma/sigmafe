import { MoldsData } from '../molds/models/molds.models'
import { SettingsData } from '../shared/models/settings.models'
export const sampleMoldsData: MoldsData = {
    page: 1,
    pageSize: 10,
    moreData: false,
    molds: [
        {
            "id": "abgsc-173633/12345",
            "name": "PRENSA 1 ESTE TIITULO PASA A DOS LINEAS",
            "hits": 0,
            "limit": 20,    
            "mainImage": "assets/images/molds/ab01001-999abc2366731.png",
            "location": {
                "code": "jjdsss-88656ttdtd-00202",
                "description": "PRODUCCION",
                "locatedBy": "APEREZ",
                "locatedSince": "2023-06-01 22:04:21",
            },
            "leftDaysWarning": 320,
            "leftDaysAlarmed": 350,
            "status": {
                "code": "10",
                "description": "FUNCIONAMIENTO NORMAL",
            },
            "lastMaintenance": {
                "vendorName": "MOLDES DEL CENTRO S.A. DE C.V.",
                "date": "2022-09-01",
                "nextMaintenance": "2023-08-31",
            },
            "levelAlert": {
                "useGeneral": false,
                "warning": 0,
                "alarm": 0,
            }
        },
        {
            "id": "abgsc-173633/12345",
            "name": "MOLD RO PRESS 2112",
            "hits": 192,
            "limit": 200,  
            "mainImage": "assets/images/molds/logistica1.png",
            "location": {
                "code": "SAAA-8838745ttdtd-093t3",
                "description": "BAHIA 1",
                "locatedBy": "RROSALES",
                "locatedSince": "2023-02-16 22:04:21",
            },
            "leftDaysWarning": -310,
            "leftDaysAlarmed": 0,
            "status": {
                "code": "10",
                "description": "FUNCIONAMIENTO NORMAL",
            },
            "lastMaintenance": {
                "vendorName": "MOLDES DEL CENTRO S.A. DE C.V.",
                "date": "2022-09-01",
                "nextMaintenance": "2023-08-31",
            },
            "levelAlert": {
                "useGeneral": true,
                "warning": 75,
                "alarm": 95,
            }
        },    
        {
            "id": "abgsc-173633/12345",
            "name": "PRENSA 1",
            "hits": 0,
            "limit": 20,    
            "mainImage": "assets/images/molds/ab01001-999abc2366731.png",
            "location": {
                "code": "jjdsss-88656ttdtd-00202",
                "description": "PRODUCCION",
                "locatedBy": "APEREZ",
                "locatedSince": "2023-06-01 22:04:21",
            },
            "leftDaysWarning": 100,
            "leftDaysAlarmed": -5,
            "status": {
                "code": "10",
                "description": "FUNCIONAMIENTO NORMAL",
            },
            "lastMaintenance": {
                "vendorName": "MOLDES DEL CENTRO S.A. DE C.V.",
                "date": "2022-09-01",
                "nextMaintenance": "2023-08-31",
            },
            "levelAlert": {
                "useGeneral": false,
                "warning": 66,
                "alarm": 110,
            }
        },                
    ]
}

export const sampleSettings: SettingsData = {
    "waitingColor": "lightgray",
    "okColor": '#229954',
    "warningColor": "#F5B041",
    "alarmedColor": "#E74C3C",
    "levelAlert": {
        "useGeneral": null,
        "warning": 50,
        "alarm": 75,
    }
}