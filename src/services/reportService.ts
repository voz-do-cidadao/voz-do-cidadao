import api from './api';

interface UserRequest {
    name: string;
    email: string;
}

interface ReportAddressRequest {
    number: string;
    zipCode: string;
    street: string;
    complement: string;
    city: string;
    state: string;
    country: string;
}

interface Report {
    report: string;
    reportDescription: string
    reportCategory: string;
}

interface ImageDetail {
    id: string;
    url: string;
    contentType: string;
    filename: string;
    uploadedAt: string;
}

export interface ReportDetail {
    id: string;
    userRequest: UserRequest;
    reportAddressRequest: ReportAddressRequest;
    report: Report & { images?: ImageDetail[] };
}
export interface PublishReportData {
    userRequest: UserRequest;
    reportAddressRequest: ReportAddressRequest;
    report: Report;
}

export const publishReport = async (data: PublishReportData) => {
    const response = await api.post('/voz-do-povo/publish', data);
    return response.data;
};

export const getReportById = async (id: string): Promise<ReportDetail> => {
    const response = await api.get(`/voz-do-povo/${id}`);
    return response.data;
};

export const getReportsByEmail = async (email: string): Promise<ReportDetail[]> => {
    const response = await api.get(`/voz-do-povo/${email}/reports`);
    return response.data;
};

export const sendEmail = async (reportId: string): Promise<void> => {
    await api.post(`/voz-do-povo/${reportId}`);
}
