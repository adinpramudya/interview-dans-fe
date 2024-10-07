import axios from "axios";
import { getSession } from "next-auth/react";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}jobs`;

export class JobService {
  constructor() {}

  getAll = async () => {
    try {
      const session = await getSession();
      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error("Gagal mendapatkan data");
    }
  };
  update = async (id: string, job: any) => {
    try {
      const session = await getSession();
      const response = await axios.patch(`${API_URL}/${id}`, job, {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error("Gagal membuat data");
    }
  };
  findById = async (id: string) => {
    try {
      const session = await getSession();
      const response = await axios.get(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error("Gagal mendapatkan data");
    }
  };
  create = async (job: any) => {
    try {
      const session = await getSession();
      const response = await axios.post(API_URL, job, {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error("Gagal membuat data");
    }
  };
}
