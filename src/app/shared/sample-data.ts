import { MoldsData } from '../molds/models/molds.models'
import { SettingsData } from '../shared/models/settings.models'
import { ProfileData } from './models/profile.module'
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
            },
            "nextMaintenance": {
                "strategy": "hits",
                "specificDate": "",
                "hits": 300,
                "days": 0,
                "hours": 0,
                "timeToLeft": 0,
                "hitsToLeft": 190,
                "alarmed": false,        
            },
            "levelAlert": {
                "useGeneral": false,
                "warning": 0,
                "alarm": 0,
            },
            "lastHit": {
                "date": "2023-07-09 11:37:40",
                "location": "jjdsss-88656ttdtd-00202",
            },
            "warned": false,
            "alarmed": true,
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
            },
            "nextMaintenance": {
                "strategy": "hits-or-days",
                "specificDate": "",
                "hits": 100,
                "days": 30,
                "hours": 0,
                "timeToLeft": 12,
                "hitsToLeft": 21, 
                "alarmed": true    
            },
            "levelAlert": {
                "useGeneral": true,
                "warning": 75,
                "alarm": 95,
            },
            "lastHit": {
                "date": "2023-06-09 10:42:21",
                "location": "jjdsss-88656ttdtd-00202",
            },
            "warned": true,
            "alarmed": false,
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
            },
            "nextMaintenance": {
                "strategy": "specific-date",
                "specificDate": "2023-12-31",
                "hits": 0,
                "days": 0,
                "hours": 0,
                "timeToLeft": 82,
                "hitsToLeft": 0,
                "alarmed": false,         
            },
            "levelAlert": {
                "useGeneral": false,
                "warning": 66,
                "alarm": 110,
            },
            "lastHit": {
                "date": "",
                "location": "jjdsss-88656ttdtd-00202",
            },
            "warned": false,
            "alarmed": false,
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

export const sampleProfile: ProfileData = {
    "animate": true,
    "fiestName": "ADMINISTRADOR",
    "lastName": "DEL SISTEMA",
    "userProfile": "ADMIN",
    "id": "tetettee-ooeiiie-jjd73",
}