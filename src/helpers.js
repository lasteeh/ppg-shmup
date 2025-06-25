export const copyTextToClipboard = async (string) => {
  if (!navigator.clipboard || !navigator.clipboard.writeText) {
    console.error("Clipboard API not supported.");
    return;
  }

  try {
    await navigator.clipboard.writeText(string);
  } catch (err) {
    console.error("Copy failed: ", err);
  }
};
