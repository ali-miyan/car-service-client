export interface CustomError extends Error {
    status?: number | string;
    data: {
      message: string;
      error: string;
    };
  }
  