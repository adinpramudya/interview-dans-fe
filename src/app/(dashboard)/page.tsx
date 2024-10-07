"use client";
import { Input } from "@nextui-org/input";
import { MdOutlineEventNote } from "react-icons/md";
import { IoMdGlobe } from "react-icons/io";
import { Checkbox } from "@nextui-org/checkbox";
import { Button } from "@nextui-org/button";
import { CiSearch } from "react-icons/ci";
import { Divider } from "@nextui-org/divider";
import { Pagination } from "@nextui-org/pagination"; // Import Pagination
import { useEffect, useState } from "react";
import JobList from "@/components/JobList";

export default function Home() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [search, setSearch] = useState(""); // State for job description search
  const [location, setLocation] = useState(""); // State for location
  const [fullTimeOnly, setFullTimeOnly] = useState(true); // State for full-time filter
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const [totalPages, setTotalPages] = useState(1); // State for total pages
  const jobsPerPage = 10; // Number of jobs per page

  // Function to fetch jobs with filter and pagination
  const fetchJob = async (page: number = 1) => {
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (location) params.append("location", location);
      params.append("full_time", fullTimeOnly.toString());
      params.append("page", page.toString());
      params.append("size", jobsPerPage.toString());

      const response = await fetch(`/api/jobs?${params.toString()}`);
      const result = await response.json();

      setJobs(result.data);
      setTotalPages(result.totalPages || 1);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchJob(currentPage);
  }, [currentPage]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchJob(1);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between gap-4">
        <Input
          type="text"
          className="w-50%]"
          label="Job Description"
          placeholder="Filter by title, benefits, companies, expertise"
          labelPlacement="outside"
          startContent={<MdOutlineEventNote />}
          value={search}
          onChange={(e) => setSearch(e.target.value)} // Update search value
        />
        <Input
          type="text"
          className="w-[50%]"
          label="Location"
          placeholder="Filter by city, state, zip code or country"
          labelPlacement="outside"
          startContent={<IoMdGlobe />}
          value={location}
          onChange={(e) => setLocation(e.target.value)} // Update location value
        />
        <Checkbox
          className="w-[50%] px-5 mt-3"
          isSelected={fullTimeOnly}
          onChange={(e) => setFullTimeOnly(e.target.checked)} // Use e.target.checked for boolean
        >
          <p className="text-sm">Full Time Only</p>
        </Checkbox>
        <Button
          color="primary"
          className="w-[30%] mt-5"
          startContent={<CiSearch className="w-5 h-5" />}
          onClick={handleSearch} // Trigger search on button click
        >
          Search
        </Button>
      </div>
      <div className="mt-5">
        <h1 className="font-bold text-2xl">Job List</h1>
        <Divider className="my-2" />
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <JobList
              company={job.company}
              location={job.location}
              title={job.title}
              createdAt={job.created_at}
              type={job.type}
              key={job.id}
              id={job.id}
            />
          ))
        ) : (
          <p>No jobs found.</p>
        )}
      </div>
      <div className="flex justify-center mt-4">
        <Pagination
          total={totalPages}
          initialPage={currentPage}
          onChange={(page) => {
            setCurrentPage(page);
            fetchJob(page);
          }}
        />
      </div>
    </div>
  );
}
