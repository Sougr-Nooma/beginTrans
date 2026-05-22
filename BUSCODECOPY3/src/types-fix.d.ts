declare module '*.css' {
  const classes: Record<string, string>;
  export default classes;
}

declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.svg' {
  const src: string;
  export default src;
}
