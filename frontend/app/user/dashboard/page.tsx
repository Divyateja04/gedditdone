"use client"
import { useEffect } from "react";
import { title } from "@/components/primitives";
import { Form, SubmitHandler, useForm, UseFormRegister } from "react-hook-form";
import { Input } from "@nextui-org/input";
import { useState } from "react";
import { Button } from "@nextui-org/button";
import axios from "axios";
import { siteConfig } from "@/config/site";
import { User, Post } from "@/types";
import { HttpCodes } from "@/types/HttpCodes";
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@nextui-org/table";
import { Chip } from "@nextui-org/chip";
import { Tabs, Tab } from "@nextui-org/tabs";
import { HandRaisedIcon, BanknotesIcon, CreditCardIcon } from '@heroicons/react/24/solid'

type UserProfile = {
  name: string;
  email: string;
  phoneNumber: string;
};

export default function UserProfile() {
  const { register, handleSubmit, formState: { errors }, control, setValue, watch } = useForm();

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [userPosts, setUserPosts] = useState<Post[]>([]);

  const fetchUserPosts = async () => {
    try {
      const response = await axios.get(
        siteConfig.server_url + "/post/my",
        {
          params: {},
          withCredentials: true,
        }
      );

      setUserPosts(response.data.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching user posts:", err);
      setError("Error fetching user posts.");
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await axios.get(
        siteConfig.server_url + "/user/get",
        {
          params: {},
          withCredentials: true,
        }
      );
      const userData = response.data.data;

      setValue("name", userData.name);
      setValue("phoneNumber", userData.phoneNumber);

      setMessage("User data loaded successfully.");
      setError(null);
    } catch (err) {
      console.error("Error fetching user data:", err);
      setMessage(null);
      setError("Error fetching user data.");
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchUserPosts();
  }, []);

  const onSubmit = async (data: User) => {
    try {
      const res = await axios.post(
        siteConfig.server_url + "/user/update",
        {
          name: data.name,
          phoneNumber: data.phoneNumber
        },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );


      if (res.status == HttpCodes.ACCEPTED) {
        setError(null)
        setMessage("User updated successfully.")
      } else {
        setError(res.data.error || "There was an error in updating profile.")
      }

      setMessage(res.data.message || "Profile updated successfully.");
      setError(null);
    } catch (err) {
      setMessage(null);
      setError("There was an error updating your profile.");
    }
  };

  return (
    <div>
      <h1 className={title()}>User Profile</h1>

      <p className="text-green-600 text-center text-lg">{message}</p>
      <p className="text-red-600 text-center text-lg">{error}</p>

      <Form
        className="flex flex-col gap-3 m-3 w-full mx-auto p-4 rounded-lg shadow-md"
        onSubmit={({ data }: any) => {
          onSubmit(data)
        }}
        onError={() => {
          setMessage(null)
          setError("There was an error updating your profile.")
        }}
        control={control}
      >
        <Input label="Name" variant="underlined" value={watch('name')} {...register("name", { required: true })} />
        <Input label="Phone Number" variant="underlined" value={watch("phoneNumber")} {...register("phoneNumber", { required: true, pattern: /^[0-9]+$/ })} />

        <div className="justify-around w-full flex">
          <Button type="submit" className="align-middle md:w-1/2 w-full" variant="bordered">
            Update Profile
          </Button>
        </div>
      </Form>

      <h1 className={title()}>Transactions</h1>
      <div className="p-2">
        <Tabs aria-label="Options" color="primary" variant="bordered">
          <Tab
            key="myposts"
            title={
              <div className="flex items-center space-x-2">
                <BanknotesIcon className="h-5 w-5" />
                <span>My Posts</span>
              </div>
            }
          >
            <Table aria-label="Example static collection table">
              <TableHeader>
                <TableColumn>Post content</TableColumn>
                <TableColumn>The guy who accepted it</TableColumn>
                <TableColumn>Points</TableColumn>
              </TableHeader>
              <TableBody>
                {userPosts.map((post, index) => (
                  <TableRow key={index}>
                    <TableCell>{post.source} to {post.destination}</TableCell>
                    <TableCell>{post.author ? <Chip color="success">post.author.name</Chip> : <Chip color="default">Not accepted</Chip>}</TableCell>
                    <TableCell>{post.costInPoints}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Tab>

          <Tab
            key="acceptedposts"
            title={
              <div className="flex items-center space-x-2">
                <HandRaisedIcon className="h-5 w-5" />
                <span>The Posts I accepted</span>
              </div>
            }
          >
            Wow so empty <CreditCardIcon className="h-5 w-5" />
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
