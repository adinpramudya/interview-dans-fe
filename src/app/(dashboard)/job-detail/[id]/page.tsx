"use client";
import { FC, useEffect, useState } from "react";
import { Button } from "@nextui-org/button";
import { FaLongArrowAltLeft } from "react-icons/fa";
import { Divider } from "@nextui-org/divider";
import Link from "next/link";
import Image from "next/image";
import { JobService } from "@/app/services/job.service";

type paramsType = {
  id: string;
};

interface JobDetailPageProps {
  params: paramsType;
}

const JobDetailPage: FC<JobDetailPageProps> = ({ params }) => {
  const [job, setJob] = useState<any>(null);
  const jobService = new JobService();
  const fetchJob = async () => {
    try {
      const response = await jobService.findById(params.id);

      setJob(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchJob();
  }, [params.id]);

  return (
    <div className="p-10">
      <Link href={"/"}>
        <Button
          color="primary"
          variant="light"
          startContent={<FaLongArrowAltLeft />}
        >
          Back
        </Button>
      </Link>

      {job ? (
        <div>
          <div className="m-5">
            <p className="text-sm text-gray-600">
              {job.type} / {job.location}
            </p>
            <h1 className="font-bold text-2xl">{job.title}</h1>
          </div>
          <Divider className="my-2" />
          <div className="flex">
            <div
              className="w-[70%] text-justify mr-3"
              dangerouslySetInnerHTML={{
                __html: job.description ? job.description : "",
              }}
            />
            <div className="flex flex-col w-[35%] gap-10">
              <div className="w-full pb-4 ml-1 border-5 border-gray-300 ">
                <div className="flex justify-between p-4 w-full">
                  <p>{job.company}</p>
                  <p className="text-blue-700 text-sm font-bold rounded-md bg-blue-300 px-2">
                    1 Other Job
                  </p>
                </div>
                <Divider className="my-1" />
                <Image
                  className="p-2"
                  src="/images/bg.jpg"
                  alt="logo"
                  width={500}
                  height={30}
                />
                <a
                  className="p-2 text-blue-500 mb-5"
                  href={job.companyUrl ? job.companyUrl : ""}
                  target="_blank"
                >
                  {job.companyUrl ? job.companyUrl : ""}
                </a>
              </div>
              <div className="w-full max-h-[330px] ml-1 border-5 border-gray-300">
                <p className="font-bold p-2">How to apply</p>
                <Divider className="my-1" />
                <div
                  className="p-2 text-justify"
                  dangerouslySetInnerHTML={{
                    __html: job.howToApply ? job.howToApply : "",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default JobDetailPage;
