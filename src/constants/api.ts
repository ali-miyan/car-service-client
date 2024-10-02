export const baseOrderUrl = `${import.meta.env.VITE_ORDER_API_URL || 'http://localhost'}/api/order`;
export const baseUserUrl = `${import.meta.env.VITE_USER_API_URL || 'http://localhost'}/api/user`;
export const baseCompanyUrl = `${import.meta.env.VITE_COMPANY_API_URL || 'http://localhost'}/api/company`;
export const baseAdminUrl = `${import.meta.env.VITE_ADMIN_API_URL || 'http://localhost'}/api/admin`;
export const baseChatUrl = `${import.meta.env.VITE_CHAT_API_URL || 'http://localhost'}/api/chat`;

console.log('API URLs:', {
    baseOrderUrl,
    baseUserUrl,
    baseCompanyUrl,
    baseAdminUrl,
    baseChatUrl
})