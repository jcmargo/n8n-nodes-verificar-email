import {
    IAuthenticateGeneric,
    //ICredentialTestRequest,
    ICredentialType,
    INodeProperties,
    Icon
} from 'n8n-workflow';

// eslint-disable-next-line @n8n/community-nodes/credential-test-required
export class VerificarEmailApi implements ICredentialType {
    name = 'verificarEmailApi';
    displayName = 'Verificar Email API';
    testedBy = 'verificarEmail';
    icon: Icon = 'file:gmail.svg';
    // Uses the link to this tutorial as an example
    // Replace with your own docs links when building your own nodes
    documentationUrl = 'https://docs.n8n.io/integrations/creating-nodes/build/declarative-style-node/';
    properties: INodeProperties[] = [
        {
            displayName: 'API Key',
            name: 'apikey',
            typeOptions: { password: true },
            type: 'string',
            default: '',
        },
    ];
    authenticate: IAuthenticateGeneric = {
        type: 'generic',
        properties: {
            qs: {
                'api_key': '={{$credentials.apiKey}}'
            }
        },
    };
}