const errorHandler = (error, request, response, next) => {
  // At this point the full details of the error have been
  // logged, and now we just need to handle the response.
  // We want to return an error that is less verbose
  // and more easily understandable, referring to the logs
  // for more detail

  const code = error.code | 500;
  const message = `An error occurred in status-service-git: ${error.message || 'unknown error.'} See the logs for full details. If you are using docker compose, view the logs with 'docker compose logs', and just the status service logs with: 'docker compose logs status-service-git'`;
  const errorResponse = {code, message};
  response.header('Content-Type', 'application/json');
  return response.status(error.code).json(errorResponse);
};

export default errorHandler;
