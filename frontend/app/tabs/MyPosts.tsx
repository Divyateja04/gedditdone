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
import { HandRaisedIcon, BanknotesIcon, CreditCardIcon, EyeIcon } from '@heroicons/react/24/solid'

type UserProfile = {
    name: string;
    email: string;
    phoneNumber: string;
};

export default function MyPosts() {
    const [userPosts, setUserPosts] = useState<Post[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchUserPosts = async () => {
        setLoading(true);
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
        setLoading(false);
    };

    useEffect(() => {
        fetchUserPosts();
    }, []);

    return (
        <div>
            <div className="text-center"><h1 className={title()}>My Posts</h1></div>

            <p className="text-red-600 text-center text-lg p-2">{error}</p>

            {!loading ? <div className="p-2">
                <Table aria-label="Geddit Posts Table">
                    <TableHeader>
                        <TableColumn>Requirement</TableColumn>
                        <TableColumn>Service</TableColumn>
                        <TableColumn>Status</TableColumn>
                        <TableColumn>Points</TableColumn>
                        <TableColumn>View</TableColumn>
                    </TableHeader>
                    <TableBody>
                        {userPosts.map((post, index) => (
                            <TableRow key={index}>
                                <TableCell>{post.source} to {post.destination}</TableCell>
                                <TableCell>{post.service}</TableCell>
                                <TableCell><Chip color={
                                    post.status.toUpperCase() == "OPEN" ? "danger" : post.status.toUpperCase() == "COMPLETED" ? "success" : "warning"
                                }>{post.status.toUpperCase()}</Chip></TableCell>
                                <TableCell>{post.costInPoints}</TableCell>
                                <TableCell><a href={`/post/details/${post.id}`}><EyeIcon className="h-5 w-5" /></a></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div> :
                <p className="text-center text-xl m-2">
                    Loading...
                </p>}
        </div >
    );
}
