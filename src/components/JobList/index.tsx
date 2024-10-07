"use client";
import { FC } from "react";
import { Divider } from "@nextui-org/divider";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"; // Import plugin
import { useRouter } from "next/navigation";

// Extend dayjs with relativeTime plugin
dayjs.extend(relativeTime);

interface JobListProps {
  title: string;
  type: string;
  company: string;
  location: string;
  createdAt: string;
  id: string;
}

const JobList: FC<JobListProps> = ({
  title,
  id,
  type,
  company,
  location,
  createdAt,
}) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`job-detail/${id}`);
  };
  const relativeCreatedAt = dayjs(createdAt).fromNow();

  return (
    <div
      className="cursor-pointer hover:bg-gray-200 p-2 rounded"
      onClick={handleClick}
    >
      <div className="flex justify-between">
        <p className="font-bold text-base text-blue-700">{title}</p>
        <p className="text-sm">{location}</p>
      </div>
      <div className="flex justify-between">
        <div className="flex">
          <p className="font-light text-sm text-gray-400">
            {company}
            {" - "}
            <span className="font-bold text-sm text-green-600">{type}</span>
          </p>
        </div>
        <p className="text-sm">{relativeCreatedAt}</p>{" "}
      </div>
      <Divider className="my-2" />
    </div>
  );
};

export default JobList;
