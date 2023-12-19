/**
 *
 */
export function snakeCaseToTitleCase(inputString: string) {
  // Split the input string by underscores
  const words = inputString.split("_");

  // Capitalize the first letter of each word and join them
  const titleCaseString = words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return titleCaseString;
}

/**
 *
 */
export function getRandomString(length: number) {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    result += charset.charAt(randomIndex);
  }

  return result;
}
