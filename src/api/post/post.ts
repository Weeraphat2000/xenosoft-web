import axios from "../../util/axios";

export const getPosts = (query: string) => axios.get(`/post?${query}`);

export const createPost = (body: { title: string }) =>
  axios.post("/post", body);

export const deletePost = (id: string) => axios.delete(`/post/${id}`);

export const updatePost = (id: string, body: { title: string }) =>
  axios.patch(`/post/${id}`, body);
