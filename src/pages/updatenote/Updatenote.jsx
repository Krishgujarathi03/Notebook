import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

function Updatenote() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState("");

  const { id } = useParams();
  const navigate = useNavigate();

  const getNotesById = async () => {
    const res = await fetch(
      `${import.meta.env.HOST_URL}/api/notes/notes/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      }
    );
    const data = await res.json();
    setTitle(data?.title);
    setTag(data?.tag);
    setDescription(data?.description);
  };
  useEffect(() => {
    getNotesById();
  }, [id]);

  const updateNote = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.HOST_URL}/api/notes/updatenote/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token"),
          },
          body: JSON.stringify({ title, tag, description }),
        }
      );
      const noteData = await res.json();
      if (noteData.error) {
        toast.error(noteData.error);
      } else {
        toast.success(noteData.success);
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Layout>
      <div className=" lg:mx-[6em] mt-16 lg:mt-0 flex justify-center items-center h-screen">
        <div className=" bg-[#d2cbbf] lg:w-[60em] lg:h-[35em]  rounded-xl p-10   ">
          <div className="">
            {/* Top Heading  */}
            <div className=" mb-5">
              <h1 className="text-center text-black text-xl  font-bold">
                Update Note
              </h1>
            </div>

            {/* Input 1  */}
            <div>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                type="text"
                name="title"
                className="inputShadow
                                 mb-4 px-2 py-2 w-full rounded-lg text-black placeholder:text-black outline-none"
                placeholder="Title"
              />
            </div>

            {/* Input 2  */}
            <div>
              <input
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                type="text"
                name="tag"
                className="inputShadow
                                  mb-4 px-2 py-2 w-full rounded-lg text-black placeholder:text-black outline-none"
                placeholder="Tag"
              />
            </div>

            {/* TextArea 3  */}
            <div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                name=""
                id=""
                cols="30"
                rows="10"
                className="inputShadow
                                  mb-4 px-2 py-2 w-full rounded-lg text-black placeholder:text-black outline-none"
                placeholder="Description"
              ></textarea>
            </div>

            {/* Button  */}
            <div className=" flex justify-center mb-3">
              <button
                onClick={updateNote}
                className=" bg-[#000000] w-full text-white font-bold  px-2 
                                py-2.5 rounded-md"
              >
                Update Note
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Updatenote;
