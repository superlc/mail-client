import { EmailType, GetRulesParams, OperationType, RuleType, SecureLevelType, UserType } from '../types';
import request, { baseUrl } from '../utils/request';
import { store } from './store';

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
export const getUsers = (offset = -1, limit = -1) => {
    return request<any, { users: UserType[], total_count: number }>({
        url: 'users',
        method: 'get',
        params: {
            offset,
            limit,
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

const downloadAjax = (url: string) => {
    const token = store.getState().token.token;
    const xhr = new XMLHttpRequest();
    xhr.open('get', url, true);
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.responseType = 'blob'
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = () => {
        console.log(xhr.readyState, xhr.status);
        if (xhr.readyState === 4 && xhr.status === 200) {
            const data = xhr.response;
            const blob = new Blob([data]);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            document.body.appendChild(a);
            // console.log(xhr?.getResponseHeader('content-disposition'), decodeURIComponent(xhr?.getResponseHeader('content-disposition') || ''));
            const fileName = decodeURIComponent(xhr?.getResponseHeader('content-disposition')?.split(';')[1].split('=')[1] || '');
            a.href = url;
            a.download = fileName as string;
            a.click();
            window.URL.revokeObjectURL(url);
        }
    };
    xhr.send();
};

export const downloadEmail = (id: number) => {
    return downloadAjax(`${baseUrl}/download/email/${id}`);
};

export const updateScan = (id: number, scan: boolean) => {
    return request<any, UserType>({
        url: 'user/scan',
        method: 'post',
        data: {
            id,
            scan,
        },
    });
};

export const getRules = (params: GetRulesParams) => {
    return request<GetRulesParams, { rules: RuleType[], total_count: number }>({
        url: 'rules',
        method: 'get',
        params: { ...params },
    });
}

interface CreateRuleParams {
    operation?: OperationType;
    secure_level?: SecureLevelType;
    users?: string[];
    value?: string;
}

export const createRule = (params: CreateRuleParams) => {
    return request({
        url: 'rule',
        method: 'post',
        data: params,
    });
};

export const deleteRule = (id: number) => {
    return request({
        url: `rule/${id}`,
        method: 'delete'
    });
};