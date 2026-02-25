type ApiResponse<T = unknown> = {
  status: number;
  data: T;
};

const res1: ApiResponse<string> = {
  status: 200,
  data: "Success",
};

res1.data.toUpperCase(); 

const res2: ApiResponse<number> = {
  status: 200,
  data: 55,
};

res2.data.toFixed();