export const getQueryParams = () => {
  const queryParams = new URLSearchParams(window.location.search);
  return {
    service: queryParams.get("service") || "",
    company: queryParams.get("company") || "",
    sort: queryParams.get("sort") || "",
    search: queryParams.get("search") || "",
    price: queryParams.get("price") || "",
    page: queryParams.get("page") || "",
  };
};
