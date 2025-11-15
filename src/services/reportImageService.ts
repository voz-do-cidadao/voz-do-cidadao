import api from './api';

export const uploadReportImages = async (reportId: string, imageUris: string[]) => {
    const formData = new FormData();

    imageUris.forEach((imageUri, index) => {
        const file = {
            uri: imageUri,
            name: `report-image-${Date.now()}-${index}.jpg`,
            type: 'image/jpeg',
        } as any;
        formData.append(`image${index}`, file);
    });

    try {
        const response = await api.post(`/voz-do-povo/reportImage/${reportId}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        console.log(error)
        throw error;
    }
};

export const uploadReportImage = async (reportId: string, imageUri: string) => {
    const formData = new FormData();
    const file = {
        uri: imageUri,
        name: `report-image-${Date.now()}.jpg`,
        type: 'image/jpeg',
    } as any;

    formData.append('image', file);

    try {
        const response = await api.post(`/voz-do-povo/reportImage/${reportId}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        console.error(
            `Erro ao fazer upload da imagem ${imageUri}:`,
            error.response?.data || error.message
        );
        throw error;
    }
};

export const getReportImageUrl = (reportId: string, imageIndex: number) => {
    const fullUrl = `${api.defaults.baseURL}/voz-do-povo/reportImage/${reportId}/${imageIndex}`;
    return fullUrl;
};
