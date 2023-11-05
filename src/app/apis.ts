import { EmailType, OperationType, UserType } from '../types';
import request from '../utils/request';

export interface GetEmailsParams {
    operation: OperationType;
    value: string;
    offset: number;
    limit: number;
}

export const getEmails = (params: GetEmailsParams) => {
    if (!params.value) {
        return Promise.reject('Api::getEmails param value should not be empty!');
    }
    const query = {
        operation: params.operation ?? 'receiver',
        value: params.value,
        offset: params.offset,
        limit: params.limit,
    };

    return request<any, { emails: EmailType[], total_count: number }>({
        url: 'emails',
        method: 'get',
        params: query,
    });
}

export interface LoginRequestParams {
    email: string;
    password: string;
}

export const login = (params: LoginRequestParams) => {
    return request<LoginRequestParams, { token: string }>({
        url: 'login',
        method: 'post',
        data: params,
    });
};

// alonlong@live.cn / administrator
export const getUserInfo = () => {
    return request<any, UserType>({
        url: 'user',
        method: 'get',
    });
};