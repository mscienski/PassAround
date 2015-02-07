module.exports = {
  metadata: {
    mastercontrol: {
      version: '11.0.0',
      wildcardVersion: '11.0.x', //optional, overrides version above in metadata descriptions
      enterprise: 'corporate'
    },

    solutionpackage: {
      name: 'SPSeed', //optional, overrides name in package.json
      description: 'MasterControl Solution Package', //optional, overrides description in package.json
      infocardType: 4, //4 is Form in MasterControl
      vaults: {
        abort: 'Aborted Forms',
        draft: 'SPSeed Inprocess',
        release: 'SPSeed Release',
        archive: 'SPSeed Archive'
      },
      lifecycle: {
        name: 'SPSeed Forms',
        complex: false //default to 3 step lifecycle, if true vaults and lifecycle need to be configured manually
      },
      numbering: [
        {
          value: 'SPSeed-' //Assumes it is of type "text"
        },
        {
          type: 'increment' ,
          value: '0001' ,
          incrementby: '1' 
        }
      ],
      route: {
        isInline: true,
        finalRejection: 'release',
        autosave: '-1',
        preventLaunch: false,
        inline: true,
        useStandardPDFDate: false,
        AutomationRoleID: '',
        owners: [
          'SP_SPSeed_Manager'
        ],
        roles: [
          'SP_SPSeed_QA',
          'SP_SPSeed_Approvers'
        ],
        steps: [
          {
            type: 'entry',
            name: 'Initiation',
            duration: '10',
            durationUnit: 'd',
            id: '1',
            approvers: 'all',
            pages: [1],
            readonlypages: [2],
            reload: false,
            doubleSignoff: false,
            includeInManifest: true,
            users: [
              {
                id: 'SP_SPSeed_Manager',
                type: 'Normal'
              }
            ],
            statuses: [
              {
                id: 'Data Approval',
                actions: []
              },
              {
                id: 'Data Rejection',
                actions: []
              },
              {
                id: 'Work in Process',
                actions: []
              }
            ]
          },
          {
            type: 'approval',
            name: 'Initial Approval',
            duration: '5',
            durationUnit: 'd',
            id: '2.1',
            approvers: 'one',
            pages: [],
            readonlypages: [1,2],
            reload: false,
            doubleSignoff: false,
            includeInManifest: true,
            users: [
              {
                id:'SP_SPSeed_Approvers',
                type: 'Modify'
              }
            ],
            statuses: [
              {
                id:'Data Approval',
                actions: ['Notify Initiator']
              },
              {
                id:'Data Rejection',
                actions: ['Choose Step']
              },
              {
                id:'Revisit',
                actions:[]
              }
            ],
            parallel: {
              name: 'Co-Approval',
              duration: '5',
              durationUnit: 'd',
              id: '2.2',
              approvers: 'one',
              users: [
                {
                  id: 'SP_SPSeed_QA',
                  type: 'Normal'
                }
              ]
            }
          },
          {
            type: 'approval',
            name: 'Release Approval',
            duration: '5',
            durationUnit: 'd',
            id: '3.1',
            approvers: 'one',
            pages: [],
            readonlypages: [1,2],
            reload: false,
            doubleSignoff: false,
            includeInManifest: true,
            users: [
              {
                id:'SP_SPSeed_Approvers',
                type:'Modify'
              }
            ],
            statuses: [
              {
                id:'Data Approval',
                actions: ['Notify Initiator']
              },
              {
                id:'Data Rejection',
                actions: ['Choose Step']
              },
              {
                id:'Revisit',
                actions:[]
              }
            ],
            escalation: {
              name: 'QA Escalation',
              escDays: '1',
              escHours: '0',
              id: '3.2',
              approvers: 'one',
              users: [
                {
                  id:'SP_SPSeed_QA',
                  type: 'Modify'
                }
              ]
            }
          },
          {
            type:'Notify',
            name: 'Originator Notification',
            id: '3',
            users: [
              {
                id:'Originator',
                type:'Normal'
              }
            ],
            statuses: [
              {
                id:'Notify',
                actions:[]
              }
            ]
          }
        ]
      }
    },

    formTemplate: {
      number: 'SP-FRM-0099',
      revision: '01',
      infocardType: 3, //3 is Form Template in MasterControl
      type: 'Quality',
      vaults: {
        draft: 'Form Template Draft',
        release: 'Form Template Release',
        archive: 'Form Template Archive'
      },
      lifecycle: {
        name: 'Form Templates',
        complex: false //default to 3 step lifecycle, if true vaults and lifecycle need to be configured manually
      },
      numbering: [
        {
           value: 'SP-FRM-' //Assumes it is of type "text"
        },
        {
          type: 'increment',
          value: '0001',
          incrementby: '1' 
        }
      ]
    },

    //List of roles, rights to be manually configured
    roles: [
      {
        id: 'SP_SPSeed_Approvers',
        vaults: ['SPSeed Inprocess','SPSeed Release']
      },
      {
        id: 'SP_SPSeed_ExtReqApprovers',
        vaults:['SPSeed Inprocess','SPSeed Release']
      },
      {
        id: 'SP_SPSeed_Manager',
        vaults:['Aborted Forms','SPSeed Inprocess','SPSeed Release','SPSeed Archive','Form Template Draft','Form Template Release','Form Template Archive']
      },
      {
        id:'SP_SPSeed_QA',
        vaults:['SPSeed Inprocess','SPSeed Release','SPSeed Archive']
      },
      {
        id:'SP_Subadmin',
        vaults:['Form Template Draft','Form Template Release','Form Template Archive']
      }
    ],

    mappings: {
      agent: [
        /*{
          name: 'Agent_SPSeed',
          fields: [
            {
              from: 'agent_name',
              to: 'hlpAnalyzerName'
            },
            {
              from: 'agent_number',
              to: 'txtOtherSource'
            }
          ]
        },
        {
          name: 'SPSeed_Agent',
          fields: [
            {
              from: 'hlpAnalyzerAgentSource',
              to: 'agent_name'
            }
          ]
        }*/
      ],
      event: [
        /*{
          name: 'SPSeed_Event',
          fields: [
            {
              from: 'txtWhat',
              to: 'event_what'
            }
          ]
        }*/
      ]
    }
  }
};