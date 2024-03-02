
let CONFIG;
const defaultPort = 4008;
const defaultConsoleLogLevel = 'silly';
const defaultLogLevel = 'silly';

export function setConfig() {
  CONFIG = parseConfig();
}

function getBooleanValue(value) {
  if (
    value === true ||
    value === 1 ||
    value === 'true' ||
    value === '1' ||
    value === 'yes' ||
    value === 'y'
  ) {
    return true;
  } else if (
    value === false ||
    value === 0 ||
    value === 'false' ||
    value === '0' ||
    value === 'no' ||
    value === 'n'
  ) {
    return false;
  }
  return true;
}

function getGeneralEnvs() {
  const env = process.env;
  return {
    port: env.PORT ? parseInt(env.PORT) : defaultPort,
    credStatusService: env.CRED_STATUS_SERVICE,
    credStatusDidSeed: env.CRED_STATUS_DID_SEED,
    consoleLogLevel: env.CONSOLE_LOG_LEVEL?.toLocaleLowerCase() || defaultConsoleLogLevel,
    logLevel: env.LOG_LEVEL?.toLocaleLowerCase() || defaultLogLevel,
    enableAccessLogging: getBooleanValue(env.ENABLE_ACCESS_LOGGING),
    errorLogFile: env.ERROR_LOG_FILE,
    allLogFile: env.ALL_LOG_FILE
  };
}

function getGitHubEnvs() {
  const env = process.env;
  return {
    credStatusAccessToken: env.CRED_STATUS_ACCESS_TOKEN,
    credStatusRepoName: env.CRED_STATUS_REPO_NAME,
    credStatusMetaRepoName: env.CRED_STATUS_META_REPO_NAME,
    credStatusOwnerAccountName: env.CRED_STATUS_REPO_OWNER
  };
}

function getGitLabEnvs() {
  const env = process.env;
  const gitHubEnvs = getGitHubEnvs();
  return {
    ...gitHubEnvs,
    credStatusRepoId: env.CRED_STATUS_REPO_ID,
    credStatusMetaRepoId: env.CRED_STATUS_META_REPO_ID
  };
}

function parseConfig() {
  const env = process.env
  let serviceSpecificEnvs;
  switch (env.CRED_STATUS_SERVICE) {
    case 'github':
      serviceSpecificEnvs = getGitHubEnvs();
      break;
    case 'gitlab':
      serviceSpecificEnvs = getGitLabEnvs();
      break;
    default:
      throw new Error('Encountered unsupported credential status service');
  }
  const generalEnvs = getGeneralEnvs();
  const config = Object.freeze({
    ...generalEnvs,
    ...serviceSpecificEnvs
  });
  return config;
}

export function getConfig() {
  if (!CONFIG) {
    setConfig();
  }
  return CONFIG;
}

export function resetConfig() {
  CONFIG = null;
}
