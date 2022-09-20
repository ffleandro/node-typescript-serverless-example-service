import { Router } from 'express';
import fs from 'fs';

export const loadRouters = (folderName: string): Array<Router> => {
  return fs.readdirSync(folderName)
    .map(fileName => {
      const name = folderName + '/' + fileName; 
      if (fs.statSync(name).isDirectory()) {
        return loadRouters(name);
      } else if (name.includes('.router') && !name.includes('.unit')) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { router } = require(name);
        return [ <Router> router ];
      } else {
        return [];
      }
    })
    .flat();
};
