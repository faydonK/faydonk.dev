let supported: boolean | undefined;

export const supportsWebGL = (): boolean => {
  if (supported === undefined) {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
      supported = !!gl;
      gl?.getExtension('WEBGL_lose_context')?.loseContext();
    } catch {
      supported = false;
    }
  }
  return supported;
};
