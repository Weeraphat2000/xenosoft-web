import { Box, Button, CircularProgress, Dialog } from "@mui/material";
import { useEffect, useState } from "react";
import * as Icon from "@mui/icons-material";
import { removeToken } from "../util/token";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { createPost, deletePost, getPosts, updatePost } from "../api/post/post";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../util/redux/redux";
import { toast } from "react-toastify";
import { like } from "../api/like/like";
import { setUser } from "../util/redux/user";
import { Post } from "../type/post";

// type Post = {
//   id: string;
//   title: string;
//   createdAt: string;
//   updatedAt: string;
//   userId: string;
//   Vote: {
//     id: string;
//     createdAt: string;
//     updatedAt: string;
//     postId: string;
//     userId: string;
//   }[];
//   _count: {
//     Vote: number;
//   };
//   User: {
//     id: string;
//     username: string;
//     isVote: boolean;
//   };
// };
// const mockData: Post[] = [
//   {
//     id: "cm1c2klnr000129gzexstrnzp",
//     title: "2",
//     createdAt: "2024-09-21T11:31:46.984Z",
//     updatedAt: "2024-09-21T13:44:52.962Z",
//     userId: "cm1c0ol3q0000i6ivfr7lld30",
//     Vote: [],
//     _count: {
//       Vote: 1,
//     },
//     User: {
//       id: "cm1c0ol3q0000i6ivfr7lld30",
//       username: "a",
//       isVote: false,
//     },
//   },
//   {
//     id: "cm1c2kx50000329gzh7mqi5yf",
//     title: "update",
//     createdAt: "2024-09-21T11:32:01.860Z",
//     updatedAt: "2024-09-21T14:05:33.178Z",
//     userId: "cm1c0ol3q0000i6ivfr7lld30",
//     Vote: [],
//     _count: {
//       Vote: 0,
//     },
//     User: {
//       id: "cm1c0ol3q0000i6ivfr7lld30",
//       username: "a",
//       isVote: false,
//     },
//   },
//   {
//     id: "cm1ccdqjy00012iu2kvcc3dgv",
//     title: "AASSSSS",
//     createdAt: "2024-09-21T16:06:22.892Z",
//     updatedAt: "2024-09-21T16:06:22.892Z",
//     userId: "cm1c2fa810000id23qjfuhh25",
//     Vote: [
//       {
//         id: "cm1coa1ly0001fjulp3wael65",
//         createdAt: "2024-09-21T21:39:25.991Z",
//         updatedAt: "2024-09-21T21:39:25.991Z",
//         postId: "cm1ccdqjy00012iu2kvcc3dgv",
//         userId: "cm1bzoa9u00007ayoqbgzdwa3",
//       },
//     ],
//     _count: {
//       Vote: 1,
//     },
//     User: {
//       id: "cm1c2fa810000id23qjfuhh25",
//       username: "aas",
//       isVote: false,
//     },
//   },
// ];

const sortPost = [
  { title: "Title", value: "orderBy=title:asc" },
  { title: "Username", value: "orderBy=username:asc" },
  { title: "Date", value: "orderBy=updatedAt:asc" },
];

const validationSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
});

function Home() {
  const [search, setSearch] = useState("");
  const [sorts, setSorts] = useState("orderBy=updatedAt:asc");
  const [openModalLogout, setOpenModalLogout] = useState(false);
  const [openModalPost, setOpenModalPost] = useState(false);
  const [select, setSelect] = useState("");
  const [loading, setLoading] = useState(true);
  const [mockData, setMockData] = useState<Post[]>([]);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.user);

  const handleSort = (desc: string, asc: string) => {
    if (sorts === desc) {
      setSorts(asc);
    } else {
      setSorts(desc);
    }
  };
  const handleLogout = () => {
    navigate("/login");
    removeToken();
    dispatch(setUser(null));
    toast.success("Logout success");
  };

  const methods = useForm({
    defaultValues: {
      title: "",
    },
    mode: "onBlur",
    resolver: yupResolver(validationSchema),
  });

  const { handleSubmit, register, formState } = methods;

  const submit = handleSubmit(async (data) => {
    try {
      const reuslt = await createPost(data);
      setMockData((prev) => [reuslt.data, ...prev]);
      setOpenModalPost(false);
      methods.reset();
      toast.success("Create post success");
    } catch (err) {
      console.error(err);
      toast.error("Create post failed");
    }
  });

  const handleUpdatePost = async (id: string) => {
    try {
      const reuslt = await updatePost(id, {
        title: methods.getValues("title"),
      });

      setMockData((prev) =>
        prev.map((post) =>
          post.id === id
            ? {
                ...post,
                title: reuslt.data.title,
              }
            : post
        )
      );
      setOpenModalUpdate(false);
      methods.reset();
      toast.success("Create post success");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Update post failed");
    }
  };

  const handleDeletePost = async (id: string) => {
    try {
      await deletePost(id);

      setMockData((prev) => prev.filter((post) => post.id !== id));
      setOpenModalPost(false);
      methods.reset();
      toast.success("Delete post success");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Delete post failed");
    }
  };

  const hanleLike = async (id: string) => {
    try {
      const reuslt = await like(id);

      setMockData((prv) =>
        prv.map((post) => (post.id === id ? reuslt.data.data : post))
      );

      toast.success(reuslt.data.message === "liked" ? "Like" : "Unlike");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Like failed");
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data } = await getPosts(
        `${sorts}${search ? `&search=${search}` : ""}${
          select ? `&select=${select}` : ""
        }`
      );

      setMockData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sorts, search, select]);

  return (
    <div>
      <Dialog
        open={openModalLogout}
        onClose={() => setOpenModalLogout(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Box className="p-4">
          <h1>Are you sure you want to logout?</h1>
          <div className="flex justify-center pt-3">
            <Button
              onClick={() => setOpenModalLogout(false)}
              style={{
                marginRight: 10,
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setOpenModalLogout(false);
                handleLogout();
              }}
              style={{
                backgroundColor: "red",
                color: "white",
              }}
            >
              Logout
            </Button>
          </div>
        </Box>
      </Dialog>

      <Dialog
        open={openModalPost}
        onClose={() => {
          setOpenModalPost(false);
          methods.reset();
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Box className="p-4">
          <h1>Create Post</h1>
          <form
            className="flex flex-col items-center justify-center"
            onSubmit={submit}
          >
            <input
              type="text"
              placeholder="Title"
              {...register("title")}
              className="border border-gray-300 p-2 m-2 rounded-md"
            />
            <p
              className="text-red-500"
              style={{ display: formState.errors.title ? "block" : "none" }}
            >
              {formState.errors.title?.message}
            </p>
            <div className="flex justify-center pt-3">
              <Button
                onClick={() => {
                  setOpenModalPost(false);
                  methods.reset();
                }}
                style={{
                  marginRight: 10,
                }}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                style={{
                  backgroundColor: "green",
                  color: "white",
                }}
              >
                Create
              </Button>
            </div>
          </form>
        </Box>
      </Dialog>

      <Dialog
        open={openModalUpdate}
        onClose={() => {
          setOpenModalUpdate(false);
          methods.reset();
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Box className="p-4">
          <h1>Update Post</h1>
          <form className="flex flex-col items-center justify-center">
            <input
              type="text"
              placeholder="Title"
              {...register("title")}
              className="border border-gray-300 p-2 m-2 rounded-md"
            />
            <p
              className="text-red-500"
              style={{ display: formState.errors.title ? "block" : "none" }}
            >
              {formState.errors.title?.message}
            </p>
            <div className="flex justify-center pt-3">
              <Button
                onClick={() => {
                  setOpenModalUpdate(false);
                  methods.reset();
                }}
                style={{
                  marginRight: 10,
                }}
              >
                Cancel
              </Button>

              <Button
                onClick={() => {
                  // setOpenModalUpdate(false);
                  if (selectedPost) {
                    handleUpdatePost(selectedPost.id);
                  }
                }}
                style={{
                  backgroundColor: "green",
                  color: "white",
                }}
              >
                Update
              </Button>
            </div>
          </form>
        </Box>
      </Dialog>

      <div
        className="flex items-center justify-between w-full"
        style={{
          flexWrap: "wrap",
          position: "sticky",
          top: 0,
          zIndex: 100,
          backgroundColor: "white",
        }}
      >
        <Button
          style={{
            backgroundColor: "green",
            color: "white",
            marginLeft: 10,
            width: 100,
          }}
          onClick={() => {
            setOpenModalPost(true);
          }}
        >
          Create
        </Button>
        <Box
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <input
            type="text"
            placeholder="Search (title, username)"
            className="border border-gray-300 p-2 m-2 rounded-md"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {sortPost.map((sort) => (
            <Button
              style={{
                marginInline: 1,
              }}
              variant="contained"
              key={sort.title}
              onClick={() => {
                handleSort(sort.value, sort.value.replace("asc", "desc"));
              }}
              endIcon={
                <Icon.ExpandMore
                  sx={{
                    transform:
                      sorts === sort.value ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.3s",
                  }}
                />
              }
            >
              {sort.title}
            </Button>
          ))}

          <select
            className="border border-gray-300 p-2 m-2 rounded-md"
            value={select}
            onChange={(e) => setSelect(e.target.value)}
          >
            <option value="">None</option>
            <option value="like">Like</option>
            <option value="me">Me</option>
          </select>
        </Box>
        <Button
          variant="contained"
          style={{
            backgroundColor: "red",
            color: "white",
            marginRight: 10,
            width: 100,
          }}
          onClick={() => {
            setOpenModalLogout(true);
          }}
        >
          Logout
        </Button>
      </div>
      <div
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          backgroundColor: "blue",
          color: "white",
          padding: 10,
          borderRadius: 10,
          cursor: "pointer",
        }}
        onClick={() => {
          navigate("/chart");
        }}
      >
        To Chart
      </div>
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <CircularProgress size="3rem" />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center w-[700px] m-auto ">
          {mockData.map((post) => (
            <div
              key={post.id}
              className="border border-gray-300 p-2 m-2 rounded-md w-full"
            >
              <div>
                <h1 className="text-4xl font-bold cursor-pointer text-center">
                  {post.title}
                </h1>
                {post.User.id === user?.id && (
                  <div className="flex justify-end">
                    <button
                      className="bg-red-500 text-white p-2 m-2 rounded-md"
                      onClick={() => {
                        handleDeletePost(post.id);
                      }}
                    >
                      <Icon.DeleteForever />
                    </button>
                    <button
                      className="bg-blue-500 text-white p-2 m-2 rounded-md"
                      onClick={() => {
                        setOpenModalUpdate(true);
                        setSelectedPost(post);
                        methods.setValue("title", post.title);
                      }}
                    >
                      <Icon.EditCalendar />
                    </button>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-500 cursor-pointer">
                username: {post.User.username}
              </p>
              <p className="text-sm text-gray-500">
                {/* Vote: {post._count.Vote} */}
                {post._count.Vote ? (
                  <Icon.Favorite className="text-red-500" />
                ) : (
                  <Icon.FavoriteBorder className="text-red-500" />
                )}
              </p>
              <button
                className={`${
                  (post.Vote.length > 0 ? false : post._count.Vote > 0)
                    ? "bg-blue-200"
                    : "bg-blue-500"
                } text-white p-2 m-2 rounded-md`}
                disabled={post.Vote.length > 0 ? false : post._count.Vote > 0}
                onClick={() => {
                  hanleLike(post.id);
                }}
              >
                Vote
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
