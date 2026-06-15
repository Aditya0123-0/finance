export function getUserDocumentPath(userId, documentId, fileName) {
  return `users/${userId}/documents/${documentId}/${fileName}`;
}
