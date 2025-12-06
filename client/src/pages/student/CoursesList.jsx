import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/context";
import CourseCard from "../../components/student/CourseCard";
import { useParams } from "react-router-dom";
import SearchBar from "../../components/student/SearchBar";
import { assets } from "../../assets/assets";
import Footer from './../../components/student/Footer';

const CoursesList = () => {
  const { allCourses, navigate } = useContext(AppContext);
  const { input } = useParams();
  const [filteredCourse, setFilteredCourse] = useState([]);

  useEffect(() => {
    if (!allCourses || allCourses.length === 0) return;
    if (!input || input.trim() === "") {
      setFilteredCourse(allCourses);
      return;
    }
    const filtered = allCourses.filter((course) =>
      course.courseTitle.toLowerCase().includes(input.toLowerCase())
    );

    setFilteredCourse(filtered);
  }, [allCourses, input]);
  return (
    <>
    <div className="pt-16 py-16 md:px-40 px-8">
      <div className="flex flex-col space-y-7 lg:flex-row justify-between ">
        <div>
          <h1 className="text-3xl font-medium text-gray-800">Course List</h1>
          <p className="text-gray-500">
            <span
              className="text-blue-500 cursor-pointer"
              onClick={() => navigate("/")}
            >
              Home
            </span>{" "}
            / <span className="cursor-pointer" onClick={() => navigate('/course-list')}>Course List</span>
          </p>
        </div>
        <SearchBar data={input} />
      </div>
      {
        input && <div className="inline-flex items-center gap-3 border border-gray-100 px-3 py-2 rounded mt-5 lg:mt-0">
            <p>{input}</p>
            <img src={assets.cross_icon} alt="cross" className="cursor-pointer" onClick={()=> navigate('/course-list')} />
        </div>
      }
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 px-4 md:px-0 my-10 gap-4">
        {filteredCourse.map((course, index) => (
          <CourseCard key={index} course={course} />
        ))}
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default CoursesList;
