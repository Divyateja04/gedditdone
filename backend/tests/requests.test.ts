import { describe } from "@jest/globals";
import { prismaMock } from "./_mockdb";
import { createRequest, getMyRequests, acceptRequest, completeRequest } from "../src/service/requests.service";
import { Request } from ".prisma/client";
import { Post, User } from "@prisma/client";

const user: User = {
    id: "1",
    name: "ben",
    email: "ben@ben.com",
    phoneNumber: "1234567890",
    karmaPoints: 10,
    isPublic: false,
    role: "user"
}

const request: Request = {
    id: "1",
    postId: "1",
    senderEmail: "ben@ben.com",
    status: "open",
}

const acceptedRequest: Request = {
    id: "1",
    postId: "1",
    senderEmail: "ben@ben.com",
    status: "accepted",
}

const post: Post & {
    authorEmail: string
} = {
    id: "1",
    authorId: "1",
    authorEmail: "ben@ben.com",
    source: "source",
    destination: "destination",
    costInPoints: 10,
    service: "service",
    status: "open",
}

const closedPost: Post & {
    authorEmail: string
} = {
    id: "1",
    authorId: "1",
    authorEmail: "ben@ben.com",
    source: "source",
    destination: "destination",
    costInPoints: 10,
    service: "service",
    status: "closed",
}

describe("Retreive my requests", () => {
    it("should get all requests of a user", () => {
        prismaMock.request.findMany.mockResolvedValue([request]);

        expect(getMyRequests(request.senderEmail)).resolves.toEqual({
            error: false,
            data: [request]
        });
    })

    it("should return an empty array if user does not exist", () => {
        prismaMock.request.findMany.mockResolvedValue([]);

        expect(getMyRequests("")).resolves.toEqual({
            error: true,
            data: []
        });
    })

    it("should catch any error occurred", () => {
        prismaMock.request.findMany.mockRejectedValue(new Error("Some error occurred"));

        expect(getMyRequests(request.senderEmail)).resolves.toEqual({
            error: true,
            data: []
        });
    })
});

describe("Create a new request", () => {
    it("should throw an error if you are trying to request on your own post", () => {
        prismaMock.post.findFirst.mockResolvedValue(post);
        prismaMock.user.findFirst.mockResolvedValue(user);
        prismaMock.request.create.mockResolvedValue(request);

        expect(createRequest(post.id, request.senderEmail)).resolves.toEqual({
            error: true,
            data: 'You cannot on request your own post.'
        });
    })

    it("should throw an error if a request already exists", () => {
        prismaMock.request.findFirst.mockResolvedValue(request);

        expect(createRequest(post.id, request.senderEmail)).resolves.toEqual({
            error: true,
            data: "You have already sent a request for this post."
        });
    })

    it("should throw an error if the psot does not exist", () => {
        prismaMock.post.findFirst.mockResolvedValue(null);

        expect(createRequest(post.id, request.senderEmail)).resolves.toEqual({
            error: true,
            data: "Post does not exist."
        });
    })

    it("should throw an error if the user does not exist", () => {
        prismaMock.post.findFirst.mockResolvedValue(post);
        prismaMock.user.findFirst.mockResolvedValue(null);

        expect(createRequest(post.id, request.senderEmail)).resolves.toEqual({
            error: true,
            data: "User does not exist."
        });
    })

    it("should create a new request", () => {
        let newPost = post;
        newPost.authorId = "2";
        prismaMock.post.findFirst.mockResolvedValue(post);
        prismaMock.user.findFirst.mockResolvedValue(user);
        prismaMock.request.create.mockResolvedValue(request);

        expect(createRequest(post.id, request.senderEmail)).resolves.toEqual({
            error: false,
            data: request
        });
    })

    it("should catch any error occurred", () => {
        post.authorId = "2";

        prismaMock.post.findFirst.mockRejectedValue(new Error("Some error occurred"));

        expect(createRequest(post.id, request.senderEmail)).resolves.toEqual({
            error: true,
            data: "An error occurred while creating the request. Please try again later."
        });

        post.authorId = "1";
    })
});

describe("Accept a request", () => {
    it("should throw an error if request does not exist", () => {
        prismaMock.request.findFirst.mockResolvedValue(null);
        prismaMock.post.findFirst.mockResolvedValue(null);

        expect(acceptRequest(request.id)).resolves.toEqual({
            error: true,
            data: "Request does not exist."
        });
    })

    it("should throw an error if post does not exist", () => {
        prismaMock.request.findFirst.mockResolvedValue(request);
        prismaMock.post.findFirst.mockResolvedValue(null);

        expect(acceptRequest(request.id)).resolves.toEqual({
            error: true,
            data: "Post does not exist."
        });
    })

    it("should throw an error if post has already been closed", () => {
        prismaMock.request.findFirst.mockResolvedValue(request);
        prismaMock.post.findFirst.mockResolvedValue(closedPost);

        expect(acceptRequest(request.id)).resolves.toEqual({
            error: true,
            data: "Post is already closed."
        });
    })

    it("should accept a request", () => {
        prismaMock.request.findFirst.mockResolvedValue(request);
        prismaMock.post.findFirst.mockResolvedValue(post);

        request.status = "accepted";
        prismaMock.request.update.mockResolvedValue(request);

        expect(acceptRequest(request.id)).resolves.toEqual({
            error: false,
            data: request
        });
    })

    it("should catch any other errors", () => {
        prismaMock.request.findFirst.mockResolvedValue(request);
        prismaMock.post.findFirst.mockResolvedValue(post);
        prismaMock.request.update.mockRejectedValue(new Error("Some error"));

        expect(acceptRequest(request.id)).resolves.toEqual({
            error: true,
            data: "An error occurred while accepting the request. Please try again later."
        });
    })
})

describe("Complete a request", () => {
    it("should throw an error if request does not exist", () => {
        prismaMock.request.findFirst.mockResolvedValue(null);
        prismaMock.post.findFirst.mockResolvedValue(null);

        expect(completeRequest(request.id)).resolves.toEqual({
            error: true,
            data: "Request does not exist."
        });
    })

    it("should throw an error if post does not exist", () => {
        prismaMock.request.findFirst.mockResolvedValue(acceptedRequest);
        prismaMock.post.findFirst.mockResolvedValue(null);

        expect(completeRequest(request.id)).resolves.toEqual({
            error: true,
            data: "Post does not exist."
        });
    })

    it("should throw an error if request has not been accepted", () => {
        prismaMock.request.findFirst.mockResolvedValue(request);
        prismaMock.post.findFirst.mockResolvedValue(post);

        request.status = "open";
        prismaMock.request.update.mockResolvedValue(request);
        expect(completeRequest(request.id)).resolves.toEqual({
            error: true,
            data: "Request has not been accepted yet."
        });
    })

    it("should complete a request", () => {
        prismaMock.request.findFirst.mockResolvedValue(acceptedRequest);
        prismaMock.post.findFirst.mockResolvedValue(post);

        acceptedRequest.status = "accepted";
        prismaMock.request.update.mockResolvedValue(acceptedRequest);

        expect(completeRequest(acceptedRequest.id)).resolves.toEqual({
            error: false,
            data: acceptedRequest
        });
    })

    it("should catch any other errors", () => {
        prismaMock.request.findFirst.mockResolvedValue(acceptedRequest);
        prismaMock.post.findFirst.mockResolvedValue(post);
        prismaMock.request.update.mockRejectedValue(new Error("Some error"));

        expect(completeRequest(request.id)).resolves.toEqual({
            error: true,
            data: "An error occurred while completing the request. Please try again later."
        });
    })
})