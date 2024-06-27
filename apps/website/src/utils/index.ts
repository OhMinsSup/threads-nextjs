export function scheduleMicrotask(callback: () => void): void {
  Promise.resolve()
    .then(callback)
    .catch((error) =>
      setTimeout(() => {
        throw error;
      }),
    );
}
