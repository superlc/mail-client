export interface AttachmentType {
    content_type: string;
    id: number;
    name: string;
    size: number;
}

export interface EmailType {
    attachments: AttachmentType[],
    created_at: string;
    message_body: string;
    receiver: string;
    send_time: string;
    sender: string;
    subject: string;
    updated_at: string;
} 
