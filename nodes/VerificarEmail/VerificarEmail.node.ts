import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';


export class VerificarEmail implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Verificar Email',
		name: 'verificarEmail',
		icon: 'file:gmail.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Verifica si existe un email',
		defaults: {
			name: 'Verificar Email',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'verificarEmailApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://api.emailable.com/v1/verify',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Direccion De Email',
				name: 'email', //nombre parametro
				type: 'string',
				placeholder: 'test@email.com',
				//noDataExpression: true,
				default: '',
				
//				routing: {   
//					request: {
//						qs: {
//							email: '={{$value}}',    esto sea hace ya en la parte de la peticion a la api
//						},
//					}
//				}
			},
			// Operations will go here 

		]
	};

	// eslint-disable-next-line @n8n/community-nodes/require-continue-on-fail
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData(); //obtener datos del nodo anterior
		const returnData: INodeExecutionData[] = []; //preparar array para guardar datos


		//Iterar sobre los datos que llegan
		for (let i:number = 0; i < items.length; i++) {
			const email = this.getNodeParameter('email', i) as string;  //obtener email
			const credentials = await this.getCredentials('verificarEmailApi');  //obtener credenciales (await es cuando es asincrono);
			const apikey = credentials?.apikey;  //obtener apikey
			
			//peticion GET a la api
			// eslint-disable-next-line @n8n/community-nodes/no-http-request-with-manual-auth
			const response = await this.helpers.httpRequest({
				method: 'GET',
				url: 'https://api.emailable.com/v1/verify',
				qs: {
					email: email,
					api_key: apikey
				},
				//se puede mandar la apikey por header si se desea
				headers: {
					Accept: 'application/json',  //decimos que esperamos un json
				},
				json: true, //para que se traduzca directamente el json
			});

			const results = Array.isArray(response) ? response : [response]; //verificar si es array y preparar para iterar
			
			for (const result of results){ //iterar sobre los resultados
				returnData.push({
					json: {
						email: result.email, //guardar el correo
						deliverable: result.state === 'deliverable', //verificar si es correcto
						disposable: result.disposable, //verificar si es disposable
						domain: result.domain, //verificar el dominio
						smtp: result.smtp, //verificar el smtp
						state: result.state, //verificar el estado
						score: result.score //guardar la puntuacion
					},
					pairedItem: {
						item: i
					}
				});
			}
			
		}

		return this.prepareOutputData(returnData)  //preparar datos para devolver
	}
}
