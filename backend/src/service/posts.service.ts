import { Post, Request } from '@prisma/client'
import { CustomReturn } from '../types/CustomReturn'
import prisma from '../db'
import { logger } from '../utils/logger'


export const getAllPosts = async (): Promise<CustomReturn<Post[]>> => {
    try {
        let allPosts: Post[] = await prisma.post.findMany({
            include: {
                author: true
            }
        })
        return {
            error: false,
            data: allPosts
        }
    }
    catch (error) {
        return {
            error: true,
            data: "Some error occurred while fetching the posts"
        }
    }
}


export const getMyPosts = async (authorEmail: string): Promise<CustomReturn<Post[]>> => {
    try {
        let myPosts: Post[] = await prisma.post.findMany({
            where: {
                author: {
                    email: authorEmail
                }
            },
        })
        return {
            error: false,
            data: myPosts
        }
    } catch (error) {
        return {
            error: true,
            data: []
        }
    }
}

export const getPostDetails = async (postId: string): Promise<CustomReturn<Post>> => {
    if (!postId) return {
        error: true,
        data: null
    }

    try {
        let post: (Post & { requests: Request[] }) | null = await prisma.post.findUnique({
            where: {
                id: postId
            },
            include: {
                requests: {
                    include: {
                        sender: true
                    }
                }
            }
        })

        if (!post) return {
            error: true,
            data: "Post does not exist."
        }

        return {
            error: false,
            data: post
        }
    } catch (err: any) {
        logger.error(JSON.stringify({
            location: "getPostDetails",
            message: err.toString()
        }))
        return {
            error: true,
            data: null
        }
    }
}

export const createPost = async (post: {
    authorEmail: string,
    source: string,
    destination: string
    costInPoints: number,
    service: string
}): Promise<CustomReturn<Post>> => {
    if (!post.authorEmail) return {
        error: true,
        data: "Author email is required."
    }

    try {
        let user = await prisma.user.findUnique({
            where: {
                email: post.authorEmail
            }
        });

        if (!user) return {
            error: true,
            data: "User does not exist."
        }

        if (user?.karmaPoints < post.costInPoints)
            return {
                error: true,
                data: "Karma points not enough to create a post."
            }

        let createPost = await prisma.post.create({
            data: {
                source: post.source,
                destination: post.destination,
                costInPoints: post.costInPoints,
                service: post.service,
                author: {
                    connect: {
                        email: user.email
                    }
                }
            },
        })

        return {
            error: false,
            data: createPost
        };
    } catch (err: any) {
        logger.error(JSON.stringify({
            location: "createPost",
            message: err.toString()
        }));
        return {
            error: true,
            data: "Some error occurred while creating the post"
        }
    }
}


export const editPost = async(post: {
    requestId: string,
    authorEmail: string,
    source: string,
    destination: string
    costInPoints: number,
    status: string,
    service: string
}): Promise<CustomReturn<Post>> => {

    if (!post.authorEmail) return {
        error: true,
        data: "Author email is required."
    }

    try {
        let user = await prisma.user.findUnique({
            where: {
                email: post.authorEmail
            }
        });

        if (!user) return {
            error: true,
            data: "User does not exist."
        }

        if (user?.karmaPoints < post.costInPoints)
            return {
                error: true,
                data: "Karma points not enough to create a post."
            }

        if (post.status=="closed")
            return{
            error: true,
            data: "Post has already been closed."
        }

        let editPost= await prisma.post.update({
            where: { id: post.requestId },
            data: {
                source: post.source,
                destination: post.destination,
                costInPoints: post.costInPoints,
                service: post.service
            },
        })

        return {
            error: false,
            data: editPost
        };
    } catch (err: any) {
        logger.error(JSON.stringify({
            location: "editPost",
            message: err.toString()
        }));
        return {
            error: true,
            data: "Some error occurred while creating the post"
        }
    }
}

export const deletePost = async(post: {
    requestId: string,
    authorEmail: string,
    status: string,
    service: string
}): Promise<CustomReturn<Post>> => {
    if (!post.authorEmail) return {
        error: true,
        data: "Author email is required."
    }

    try {
        let user = await prisma.user.findUnique({
            where: {
                email: post.authorEmail
            }
        });

        if (!user) return {
            error: true,
            data: "User does not exist."
        }

        if (post.status=="closed")
            return{
            error: true,
            data: "Post has already been closed."
        }

        let editPost= await prisma.post.delete({
            where: { id: post.requestId },
        })

        return {
            error: false,
            data: editPost
        };
    } catch (err: any) {
        logger.error(JSON.stringify({
            location: "deletePost",
            message: err.toString()
        }));
        return {
            error: true,
            data: "Some error occurred while creating the post"
        }
    }
}