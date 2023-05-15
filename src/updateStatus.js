import { getStatusManager } from './getStatusManager.js';

/*
VC-API response codes
Response	Description	Body
200	Credential status successfully updated	
400	Bad Request	
404	Credential not found	
500	Internal Server Error
403 Forbidden
401 Unauthorized
*/

const updateStatus = async (credentialId, credentialStatus) => {
    try {
        const statusManager = await getStatusManager();
        await statusManager.updateStatus({
            credentialId,
            credentialStatus
        });
        return { code: 200, message: 'Credential status successfully updated' }
    } catch (e) {
        if (e instanceof CredentialNotFoundError) {
            return {code: 404, message: 'Credential Not Found'}
          }
        console.log(e)
        return { code: 400, message: 'Bad Request' }
    }
}

export default updateStatus;
