export function isRegistrationComplete(store: any) {
  if (!store) return false;

  return (
    hasData(store.personalInfo) &&
    hasData(store.coBorrowerInfo) &&
    hasData(store.contactInfo) &&
    hasData(store.documentsInfo)
  );
}

function hasData(value: any) {
  return value && Object.keys(value).length > 0;
}
