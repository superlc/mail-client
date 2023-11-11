import { EmailType, OperationType, UserType } from '../types';
import request, { baseUrl } from '../utils/request';

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

// get total user list
export const getUsers = () => {
    return request<any, { users: UserType[] }>({
        url: 'users',
        method: 'get',
        params: {
            offset: -1,
            limit: -1,
        },
    });
};

// get total domain list
export const getDomains = () => {
    return request<any, { domains: string[] }>({
        url: 'domains',
        method: 'get',
        params: {
            offset: -1,
            limit: -1,
        },
    });
};

export const getAttachment = (id: number) => {
    return request<any, any>({
        url: `attachment/${id}`,
        method: 'get',
        responseType: 'blob',
    });
};