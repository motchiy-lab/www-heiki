declare module 'cloudflare:workers' {
  export const env: {
    DB: any;
    SESSION?: any;
    [key: string]: any;
  };
}
