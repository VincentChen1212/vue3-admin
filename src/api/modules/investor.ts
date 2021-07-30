import API from '@/utils/api';
import http from '@/api/http';

// 新增投資者
export const postInvestor = (data: object) => http.post(API.INVESTOR, data);

// 取得投資者列表
export const getInvestorList = () => http.get(API.INVESTOR);

// 取得單筆投資者
export const getInvestor = (id: string) => http.get(`${API.INVESTOR}/${id}`);

// 更新投資者
export const putInvestor = (serial: string, data: object) => http.put(`${API.INVESTOR}/${serial}`, data);

// 刪除投資者
export const deleteInvestor = (serial: string) => http.delete(`${API.INVESTOR}/${serial}`);
