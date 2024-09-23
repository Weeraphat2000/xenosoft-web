import axios from "../../util/axios";

export const like = (id: string) => axios.patch(`/like/${id}`);
