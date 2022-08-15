import { ITarget } from "@uptime/lib/models";
import axios from "axios";

// const instance = axios.create({ baseURL: import.meta.env.API_ENDPOINT });
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_ENDPOINT,
});

const listTargets = async () =>
  instance
    .get<{ message: string; targets: ITarget[] }>("/api/targets")
    .then((result) => result.data);

const deleteTarget = async (id: string) =>
  instance
    .delete<{ message: string }>(`/api/targets/${id}`)
    .then((result) => result.data);

const createTarget = async (target: ITarget) =>
  instance
    .post<{ message: string; target: ITarget }>("/api/targets", target)
    .then((result) => result.data);

// TODO const getUptime = () => {};

export const api = { listTargets, deleteTarget, createTarget };
