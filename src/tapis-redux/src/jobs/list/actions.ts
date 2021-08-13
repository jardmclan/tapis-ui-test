import { apiCall } from '../../sagas/actions';
import * as ACTIONS from './actionTypes';
import { Jobs } from '@tapis/tapis-typescript';
import { JobsListCallback } from './types';
import {
  OnRequestCallback,
  OnSuccessCallback,
  OnFailureCallback
} from 'tapis-redux/src/sagas/types';
import { Config } from 'tapis-redux/src/types';


// Create a 'list' dispatch generator
export const list = (config: Config | undefined = undefined, onList: JobsListCallback = null, params: Jobs.GetJobListRequest = {}) => {
  const onRequest: OnRequestCallback = () => {
    return {
      type: ACTIONS.TAPIS_JOBS_LIST_REQUEST,
    }
  }

  const onSuccess: OnSuccessCallback<Jobs.RespGetJobList> = (result) => {
    return {
      type: ACTIONS.TAPIS_JOBS_LIST_SUCCESS,
      payload: {
        params,
        incoming: result.result
      }
    }
  }

  const onFailure: OnFailureCallback = (error) => {
    return {
      type: ACTIONS.TAPIS_JOBS_LIST_FAILURE,
      payload: {
        error,
        params
      }
    }
  }

  return apiCall<Jobs.RespGetJobList>({
    config,
    onApi: onList ?? undefined,
    onRequest,
    onSuccess,
    onFailure,
    module: Jobs,
    api: Jobs.JobsApi,
    func: Jobs.JobsApi.prototype.getJobList,
    args: [params]
  });
};
