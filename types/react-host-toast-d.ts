// import "react-hot-toast";
// import {ToastOptions } from "react-toastify";
// declare module "react-hot-toast"{
//   interface Mytoastobject {
//     Error: string;
//     message: String;
//     type: "success" | "error";
//   }
//   // Now override the main toast function
//   function toast(content: Mytoastobject, options?: ToastOptions): Id;
//   namespace toast {
//     function succes(content: Mytoastobject, options?: ToastOptions): Id;
//     function error(content: Mytoastobject, options?: ToastOptions): Id;
//     function info(content: Mytoastobject, options?: ToastOptions): Id;
//     function loading(content: Mytoastobject, options?: ToastOptions): Id;
//   }
// }

// import {ToastOptions } from "react-toastify";
// import "react-toastify"
// declare module "react-toastify"{
//   interface MyToastContent {
//     message: string;
//     description?: string;
//   }

//   // override the main toast function
//   function toast(
//     content: MyToastContent,
//     options?: ToastOptions
//   ): Id;

//   namespace toast {
//     function success(content: MyToastContent, options?: ToastOptions): Id;
//     function error(content: MyToastContent, options?: ToastOptions): Id;
//     function info(content: MyToastContent, options?: ToastOptions): Id;
//     function loading(content: MyToastContent, options?: ToastOptions): Id;
//   }
// }