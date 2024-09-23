export type Post = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  Vote: {
    id: string;
    createdAt: string;
    updatedAt: string;
    postId: string;
    userId: string;
  }[];
  _count: {
    Vote: number;
  };
  User: {
    id: string;
    username: string;
    isVote: boolean;
  };
};

export type UserPostCount = {
  [userId: string]: {
    username: string;
    count: number;
  };
};

export type ChartData = {
  username: string;
  count: number;
};
