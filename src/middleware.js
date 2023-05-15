import HttpStatus from 'http-status-codes';
import { getStatusManager } from './getStatusManager.js';

// retrieves status list manager
export async function getCredentialStatusManager(req, res, next) {
  try {
    req.statusManager = await getStatusManager();
    next();
  } catch (error) {
    return res.send('Failed to retrieve credential status list manager');
  }
}

// verifies whether issuer has access to status repo
export async function verifyStatusRepoAccess(req, res, next) {
  const { headers } = req;

  // verify that access token was included in request
  if (!headers.authorization) {
    return res.status(HttpStatus.UNAUTHORIZED).send('No authorization header was provided.');
  }

  // verify that access token is of type "Bearer"
  const [scheme, token] = headers.authorization.split(' ');
  if (scheme !== 'Bearer') {
    return res.status(HttpStatus.UNAUTHORIZED).send('Access token must be of type "Bearer".');
  }

  // check if issuer has access to status repo
  const hasAccess = await req.statusManager.hasStatusAuthority(token);
  if (!hasAccess) {
    return res.status(HttpStatus.FORBIDDEN).send('You provided a token that is not authorized or may have expired.');
  }

  next();
}
