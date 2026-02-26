/**
 * Test Case Codec — Encodes/decodes challenge test cases.
 *
 * Challenge objects store test cases as an encoded string (_tc) to
 * prevent answers from being immediately visible in the source.
 * At runtime, getTestCases(challenge) decodes them transparently.
 */

/**
 * Encode an array of test case objects into a compact string.
 * Used only at build/generation time.
 */
export function encodeTestCases(testCases) {
  return btoa(
    encodeURIComponent(JSON.stringify(testCases))
  );
}

/**
 * Decode the _tc field back into the original test case array.
 * Used at runtime by the CodingPortal.
 */
export function decodeTestCases(encoded) {
  try {
    return JSON.parse(decodeURIComponent(atob(encoded)));
  } catch {
    return [];
  }
}

/**
 * Transparent accessor — works whether challenge has raw testCases
 * or encoded _tc field.
 */
export function getTestCases(challenge) {
  if (challenge.testCases) return challenge.testCases;
  if (challenge._tc) return decodeTestCases(challenge._tc);
  return [];
}
