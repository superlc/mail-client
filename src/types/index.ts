export interface AttachmentType {
    id: number;
    content_type: string;
    name: string;
    size: number;
}

export type OperationType = 'text' | 'domain' | 'receiver';

export interface EmailType {
    id: number;
    attachments: AttachmentType[],
    created_at: string;
    message_body: string;
    receiver: string;
    send_time: string;
    sender: string;
    subject: string;
    updated_at: string;
}

export type ProviderType = 'GOOG' | 'MSFT';
export interface UserType {
    id: number;
    admin: boolean;
    email: string;
    provider: string;
    scan: boolean;
}

export type SecureLevelType = 'TRASH' | 'DELETE';

export interface RuleType {
    id: number;
    email: string;
    operation: OperationType;
    secure_level: SecureLevelType;
    value: string;
    created_at: string;
}