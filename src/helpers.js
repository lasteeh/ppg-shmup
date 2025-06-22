export const copyTextToClipboard = (string) => {
  navigator.clipboard.writeText(string).catch((err) => {
    console.error("Copy failed", err);
  });
};
