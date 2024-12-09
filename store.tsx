
import { configureStore } from "@reduxjs/toolkit";
import todoReducer from "./todo/toDoSlice";  // Đảm bảo todoSlice có sẵn và đúng đường dẫn

// Cấu hình Redux store
export const store = configureStore({
  reducer: {
    todos: todoReducer, // Sử dụng todoReducer để quản lý danh sách todo
  },
});

// Định nghĩa kiểu RootState
export type RootState = ReturnType<typeof store.getState>;  // RootState là kiểu của toàn bộ trạng thái trong Redux store

// Định nghĩa Dispatch
export type AppDispatch = typeof store.dispatch; // Định nghĩa Dispatch cho các actions
