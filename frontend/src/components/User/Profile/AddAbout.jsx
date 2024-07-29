import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Textarea,
  Typography,
} from "@material-tailwind/react";
import axios from "axios";
import  BaseUrl  from "../../../utils/BaseUrls";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import axiosInstance from "../../../utils/axiosInstance";

export function AddAbout({ onClose }) {
  const [open, setOpen] = useState(true); 
  const [about, setBio] = useState('');

   const accessToken = useSelector((state) => state.auth.userAccessToken);
  const handleClose = () => {
    setOpen(false);
    onClose(); 
  };

  const handleSubmit = async () => {
    try {
      const decodedToken = jwtDecode(accessToken);
      const user_id = decodedToken.user_id;
      const response = await axiosInstance.patch(`/account/user/${user_id}/`, {
        about
      });
      toast.success(response.data.message);
      handleClose();
    } catch (error) {
      console.log(error);
    }

  }
  return (
    <>
      <Dialog open={open} size="md" handler={handleClose} >
        <div className="flex items-center justify-between">
          <DialogHeader className="flex flex-col items-start">
            <Typography className="mb-1" variant="h4">
              Add About Yourself
            </Typography>
          </DialogHeader>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="mr-3 h-5 w-5"
            onClick={handleClose}
          >
            <path
              fillRule="evenodd"
              d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <DialogBody>
          <Typography className="mb-10 -mt-7 " color="gray" variant="lead">
            Write the message and then click button.
          </Typography>
          <div className="grid gap-6">
            <Textarea label="Bio" onChange={(e) => setBio(e.target.value)}/>
          </div>
        </DialogBody>
        <DialogFooter className="space-x-2">
          <Button variant="text" color="gray" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="gradient" color="deep-purple" onClick={handleSubmit}>
            Save
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
