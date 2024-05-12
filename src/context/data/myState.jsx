import React, { useState } from "react";
import MyContext from "./myContext";
import toast from "react-hot-toast";

const MyState = (props) => {
  const [loading, setLoading] = useState(false);
  const [allNotes, setAllNotes] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState("");

  const addNote = async () => {
    const res = await fetch(`${import.meta.env.HOST_URL}/api/notes/addnote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({ title, description, tag }),
    });

    const noteData = await res.json();
    getAllNotes();

    if (noteData.error) {
      toast.error(noteData.error);
    } else {
      toast.success(noteData.success);
    }

    setTitle("");
    setDescription("");
    setTag("");
  };

  const getAllNotes = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.HOST_URL}/api/notes/fetchallnotes`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token"),
          },
        }
      );

      const notesData = await res.json();
      console.log(notesData);
      setAllNotes(notesData);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const deleteNote = async (id) => {
    const res = await fetch(
      `${import.meta.env.HOST_URL}/api/notes/deletenote/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      }
    );
    const noteData = await res.json();
    getAllNotes();
    toast.success(noteData.success);
  };

  return (
    <MyContext.Provider
      value={{
        title,
        setTitle,
        description,
        tag,
        setTag,
        setDescription,
        allNotes,
        loading,
        getAllNotes,
        addNote,
        deleteNote,
      }}
    >
      {props.children}
    </MyContext.Provider>
  );
};
export default MyState;
