import { UserController } from "../../src/user/user.controller";
import { UserService } from "../../src/user/user.service";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";

jest.mock("../../src/user/user.service");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

const mockRes = (): Response => {
  const res = {} as Partial<Response>;
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn().mockReturnThis();
  res.send = jest.fn().mockReturnThis();
  return res as Response;
};

describe("UserController", () => {
  afterEach(() => jest.clearAllMocks());

  it("should register a user", async () => {
    const req = {
      body: { name: "Jane", email: "jane@example.com", password: "plain" },
    } as Request;
    const res = mockRes();

    (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");
    (UserService.create as jest.Mock).mockResolvedValue([
      { userId: 1, name: "Jane", email: "jane@example.com" },
    ]);

    await UserController.register(req, res);
    expect(UserService.create).toHaveBeenCalledWith({
      name: "Jane",
      email: "jane@example.com",
      password: "hashedPassword",
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      userId: 1,
      name: "Jane",
      email: "jane@example.com",
    });
  });

  it("should login a user with valid credentials", async () => {
    const req = {
      body: { email: "jane@example.com", password: "plain" },
    } as Request;
    const res = mockRes();

    const user = {
      userId: 1,
      name: "Jane",
      email: "jane@example.com",
      password: "hashedPassword",
      role: "user",
    };

    (UserService.getByEmail as jest.Mock).mockResolvedValue(user);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue("mockToken");

    await UserController.login(req, res);
    expect(res.json).toHaveBeenCalledWith({ token: "mockToken" });
  });

  it("should return 404 for login if user not found", async () => {
    const req = { body: { email: "notfound@example.com", password: "test" } } as Request;
    const res = mockRes();

    (UserService.getByEmail as jest.Mock).mockResolvedValue(null);

    await UserController.login(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid credentials" });
  });

  it("should return 401 for login if password is invalid", async () => {
    const req = { body: { email: "jane@example.com", password: "wrong" } } as Request;
    const res = mockRes();

    (UserService.getByEmail as jest.Mock).mockResolvedValue({
      password: "hashedPassword",
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await UserController.login(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid credentials" });
  });

  it("should return all users", async () => {
    const res = mockRes();
    const users = [{ userId: 1, name: "Jane", email: "jane@example.com" }];
    (UserService.getAll as jest.Mock).mockResolvedValue(users);

    await UserController.getAll({} as Request, res);
    expect(res.json).toHaveBeenCalledWith(users);
  });

  it("should return user by ID", async () => {
    const req = { params: { id: "1" } } as unknown as Request;
    const res = mockRes();
    const user = { userId: 1, name: "Jane" };

    (UserService.getById as jest.Mock).mockResolvedValue(user);
    await UserController.getById(req, res);
    expect(res.json).toHaveBeenCalledWith(user);
  });

  it("should return 404 if user not found by ID", async () => {
    const req = { params: { id: "999" } } as unknown as Request;
    const res = mockRes();

    (UserService.getById as jest.Mock).mockResolvedValue(null);
    await UserController.getById(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
  });

  it("should update a user", async () => {
    const req = {
      params: { id: "1" },
      body: { name: "Jane Updated" },
    } as unknown as Request;
    const res = mockRes();

    (UserService.update as jest.Mock).mockResolvedValue([
      { userId: 1, name: "Jane Updated" },
    ]);

    await UserController.update(req, res);
    expect(res.json).toHaveBeenCalledWith({ userId: 1, name: "Jane Updated" });
  });

  it("should delete a user", async () => {
    const req = { params: { id: "1" } } as unknown as Request;
    const res = mockRes();

    await UserController.delete(req, res);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });
});
