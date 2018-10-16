import conferenceCallErrors from 'ringcentral-integration/modules/ConferenceCall/conferenceCallErrors';

export default {
  [conferenceCallErrors.bringInFailed]: "No se han podido combinar las llamadas debido a errores inesperados. Inténtelo de nuevo más tarde.",
  [conferenceCallErrors.makeConferenceFailed]: "No se han podido combinar las llamadas debido a errores inesperados. Inténtelo de nuevo más tarde.",
  [conferenceCallErrors.terminateConferenceFailed]: "No se ha podido colgar la conferencia debido a errores inesperados. Inténtelo de nuevo más tarde.",
  [conferenceCallErrors.removeFromConferenceFailed]: "No se ha podido quitar al participante debido a errores inesperados. Inténtelo de nuevo más tarde."
};

// @key: @#@"[conferenceCallErrors.bringInFailed]"@#@ @source: @#@"Failed to merge the calls due to unexpected errors. Please try again later."@#@
// @key: @#@"[conferenceCallErrors.makeConferenceFailed]"@#@ @source: @#@"Failed to merge the calls due to unexpected errors. Please try again later."@#@
// @key: @#@"[conferenceCallErrors.terminateConferenceFailed]"@#@ @source: @#@"Failed to hangup the conference due to unexpected errors. Please try again later."@#@
// @key: @#@"[conferenceCallErrors.removeFromConferenceFailed]"@#@ @source: @#@"Failed to remove the participant due to unexpected errors. Please try again later."@#@
