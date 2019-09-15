import axios, { AxiosPromise } from 'axios';
import { DBPlanner } from 'types/planner';

//@ts-ignore
const PLANNER: string = process.env.REACT_APP_API_PLANNER;

export const getPlanner = (week: number): Promise<DBPlanner> =>
  axios.get(`${PLANNER}/week/${week}/compact`)
  .then(response => response.data)

export default {
  getPlanner
}
