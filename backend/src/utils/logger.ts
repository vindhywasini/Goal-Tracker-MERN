import Log from '../models/Log';
export async function logErrorToDb(err: any){
  try{
    await Log.create({
      message: err.message || String(err),
      stack: err.stack,
      meta: err.meta || {}
    });
  }catch(e){
    console.error('Failed to write log to DB', e);
  }
}
