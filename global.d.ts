declare namespace NodeJS {
    interface Global {
      mongoose: {
        conn: any | null;
        promise: Promise<any> | null;
      };
    }
  }
  
  declare const global: NodeJS.Global;
  